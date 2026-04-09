import { create } from 'zustand'

// This is the shape of the user object we store globally
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  status: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  // Actions
  login: (token: string, user: User) => void
  logout: () => void
}

// create() from Zustand builds a global state store
// Any component can call useAuthStore() to read or update auth state
// No prop drilling, no Context boilerplate
const useAuthStore = create<AuthState>((set) => ({
  // Initialize from localStorage so auth survives page refresh
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token, user) => {
    // Persist to localStorage so refresh doesn't log user out
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))

export default useAuthStore