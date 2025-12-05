import { useAuthStore } from '@/app/store'
import { useWaterNorms } from '../hooks/use-water-norms'
import { useEscalationRules } from '../hooks/use-escalation-rules'
import { useNudgeMessages } from '../hooks/use-nudge-messages'

export function StateAdminDashboard() {
  const user = useAuthStore((state) => state.user)
  const tenantId = user?.tenantId || ''
  const tenantName = user?.tenantName || 'Your State'

  const { data: waterNorms } = useWaterNorms(tenantId)
  const { data: escalationRules } = useEscalationRules(tenantId)
  const { data: nudgeMessages } = useNudgeMessages(tenantId)

  const handleSyncStaffUsers = () => {
    // TODO: Implement staff user sync functionality
    console.log('Sync Staff Users clicked')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome to {tenantName} State Admin Dashboard</p>
      </div>

      {/* Sync Button */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
        <p className="mt-1 text-sm text-gray-600">
          Synchronize staff users with the central database
        </p>
        <button
          onClick={handleSyncStaffUsers}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Sync Staff Users
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Water Norms</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {waterNorms?.norms.length || 0} Categories
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Escalation Rules</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {escalationRules?.rules.length || 0} Rules
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Nudge Messages</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {nudgeMessages?.filter((m) => m.isActive).length || 0} Active
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
