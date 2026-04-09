import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { PROJECTS_QUERY, CREATE_PROJECT_MUTATION, DELETE_PROJECT_MUTATION, DEPARTMENTS_QUERY } from '../lib/graphql'

const STATUS_COLORS: Record<string, string> = {
  planning: 'bg-slate-500/20 text-slate-300',
  active: 'bg-emerald-500/20 text-emerald-300',
  on_hold: 'bg-amber-500/20 text-amber-300',
  completed: 'bg-indigo-500/20 text-indigo-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

export default function Projects() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', departmentId: '' })

  const { data, loading, refetch } = useQuery<any>(PROJECTS_QUERY)
  const { data: deptData } = useQuery<any>(DEPARTMENTS_QUERY)

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT_MUTATION, {
    onCompleted: () => {
      setShowForm(false)
      setForm({ name: '', description: '', departmentId: '' })
      refetch() // re-fetch projects list after creating
    },
  })

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => refetch(),
  })

  const handleCreate = () => {
    if (!form.name || !form.departmentId) return
    createProject({ variables: { input: form } })
  }

  if (loading) return <div className="text-slate-400">Loading projects...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">{data?.projects?.length ?? 0} total projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition"
        >
          + New Project
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold text-lg mb-4">Create Project</h2>
            <div className="space-y-4">
              <input
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select department</option>
                {deptData?.departments?.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl text-sm font-medium transition"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Name</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Department</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Team Size</th>
              <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.projects?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No projects yet. Create your first one.
                </td>
              </tr>
            ) : (
              data?.projects?.map((p: any) => (
                <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{p.name}</p>
                    {p.description && <p className="text-slate-400 text-sm">{p.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{p.department?.name ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] ?? ''}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{p.assignments?.length ?? 0} members</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteProject({ variables: { id: p.id } })}
                      className="text-red-400 hover:text-red-300 text-sm transition"
                    >
                      Delete
                    </button>
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