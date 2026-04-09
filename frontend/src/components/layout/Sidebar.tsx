import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

// NavLink automatically adds an "active" class when route matches
const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/users', icon: '👥', label: 'Users' },
  { to: '/departments', icon: '🏢', label: 'Departments' },
  { to: '/projects', icon: '📁', label: 'Projects' },
  { to: '/timesheets', icon: '⏱️', label: 'Timesheets' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-white font-bold text-lg">Workforce Hub</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}