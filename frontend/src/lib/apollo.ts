import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || '/query',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError((error) => {
  const graphQLErrors = (error as any).graphQLErrors
  const networkError = (error as any).networkError
  if (graphQLErrors) {
    graphQLErrors.forEach((err: any) => {
      console.error(`[GraphQL error]: ${err.message}`)
      if (err.message.includes('unauthorized') || err.message.includes('token')) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client