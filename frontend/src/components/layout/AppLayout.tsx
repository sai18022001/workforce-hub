import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../store/authStore'

// Outlet renders the current page's component
// If not authenticated, redirect to login — this protects all nested routes
export default function AppLayout() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex bg-slate-900 min-h-screen">
      <Sidebar />
      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}