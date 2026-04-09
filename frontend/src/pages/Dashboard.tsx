import { useQuery } from '@apollo/client/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DASHBOARD_STATS_QUERY, PROJECTS_QUERY } from '../lib/graphql'

// Stat card component — reusable within this file
function StatCard({ label, value, icon, color }: {
  label: string
  value: number | string
  icon: string
  color: string
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <span className={`text-2xl`}>{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { data: statsData, loading: statsLoading } = useQuery<any>(DASHBOARD_STATS_QUERY)
  const { data: projectsData } = useQuery<any>(PROJECTS_QUERY)

  // Build chart data from projects — count by status
  const statusCounts = projectsData?.projects?.reduce((acc: Record<string, number>, p: any) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {}) || {}

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.replace('_', ' '),
    count,
  }))

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    )
  }

  const stats = statsData?.dashboardStats

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your workforce</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon="👥" color="text-indigo-400" />
        <StatCard label="Total Projects" value={stats?.totalProjects ?? 0} icon="📁" color="text-emerald-400" />
        <StatCard label="Active Projects" value={stats?.activeProjects ?? 0} icon="🚀" color="text-amber-400" />
        <StatCard label="Hours Logged" value={(stats?.totalHoursLogged ?? 0).toFixed(1)} icon="⏱️" color="text-rose-400" />
      </div>

      {/* Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-6">Projects by Status</h2>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-500">
            No project data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}