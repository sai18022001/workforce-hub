import { useQuery } from '@apollo/client/react'
import { PENDING_TIMESHEETS_QUERY } from '../lib/graphql'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-500/20 text-slate-300',
  submitted: 'bg-amber-500/20 text-amber-300',
  approved: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
}

export default function Timesheets() {
  const { data, loading } = useQuery<any>(PENDING_TIMESHEETS_QUERY)

  if (loading) return <div className="text-slate-400">Loading timesheets...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Timesheets</h1>
        <p className="text-slate-400 mt-1">Pending approval</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Employee</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Project</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Date</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Hours</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.pendingTimesheets?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No pending timesheets.
                </td>
              </tr>
            ) : (
              data?.pendingTimesheets?.map((t: any) => (
                <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-white">{t.user?.firstName} {t.user?.lastName}</td>
                  <td className="px-6 py-4 text-slate-300">{t.project?.name}</td>
                  <td className="px-6 py-4 text-slate-300">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-300">{t.hoursWorked}h</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[t.status] ?? ''}`}>
                      {t.status}
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