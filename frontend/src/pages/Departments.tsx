import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { DEPARTMENTS_QUERY, CREATE_DEPARTMENT_MUTATION } from '../lib/graphql'

export default function Departments() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })

  const { data, loading, refetch } = useQuery<any>(DEPARTMENTS_QUERY)
  const [createDepartment, { loading: creating }] = useMutation(CREATE_DEPARTMENT_MUTATION, {
    onCompleted: () => {
      setShowForm(false)
      setForm({ name: '', description: '' })
      refetch()
    },
  })

  if (loading) return <div className="text-slate-400">Loading departments...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Departments</h1>
          <p className="text-slate-400 mt-1">{data?.departments?.length ?? 0} departments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition"
        >
          + New Department
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold text-lg mb-4">Create Department</h2>
            <div className="space-y-4">
              <input
                placeholder="Department name"
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
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => createDepartment({ variables: { input: { name: form.name, description: form.description || undefined } } })}
                disabled={creating || !form.name}
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

      <div className="grid grid-cols-3 gap-6">
        {data?.departments?.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-500">
            No departments yet.
          </div>
        ) : (
          data?.departments?.map((d: any) => (
            <div key={d.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <span className="text-indigo-400 text-lg">🏢</span>
                </div>
                <h3 className="text-white font-semibold">{d.name}</h3>
              </div>
              {d.description && <p className="text-slate-400 text-sm mb-4">{d.description}</p>}
              <div className="flex gap-4 text-sm text-slate-400">
                <span>{d.users?.length ?? 0} members</span>
                <span>{d.projects?.length ?? 0} projects</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}