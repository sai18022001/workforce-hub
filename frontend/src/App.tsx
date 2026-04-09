import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import client from './lib/apollo'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Departments from './pages/Departments'
import Projects from './pages/Projects'
import Timesheets from './pages/Timesheets'

// ApolloProvider makes the Apollo client available to every component in the tree
// BrowserRouter enables client-side routing via React Router
// Routes/Route define which component renders at each URL path
export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes — AppLayout checks auth and renders Sidebar + Outlet */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/timesheets" element={<Timesheets />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}