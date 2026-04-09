import { useQuery } from '@apollo/client/react'
import { USERS_QUERY } from '../lib/graphql'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-300',
  inactive: 'bg-slate-500/20 text-slate-300',
  on_leave: 'bg-amber-500/20 text-amber-300',
}

export default function Users() {
  const { data, loading } = useQuery<any>(USERS_QUERY)

  if (loading) return <div className="text-slate-400">Loading users...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 mt-1">{data?.users?.length ?? 0} total members</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Name</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Email</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Role</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Department</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No users yet. Register the first user via GraphQL Playground.
                </td>
              </tr>
            ) : (
              data?.users?.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <span className="text-white font-medium">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{u.email}</td>
                  <td className="px-6 py-4 text-slate-300">{u.role?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-300">{u.department?.name ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[u.status] ?? ''}`}>
                      {u.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}