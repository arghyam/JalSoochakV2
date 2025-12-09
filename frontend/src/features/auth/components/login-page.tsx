import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store'
import { AUTH_ROLES } from '@/shared/constants/auth'
import { ROUTES } from '@/shared/constants/routes'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    try {
      await login({ email, password })
      const { user } = useAuthStore.getState()
      if (!user) {
        navigate(ROUTES.DASHBOARD, { replace: true })
        return
      }

      if (user.role === AUTH_ROLES.SUPER_USER) {
        navigate(ROUTES.ADMIN, { replace: true })
      } else if (user.role === AUTH_ROLES.STATE_ADMIN) {
        navigate(ROUTES.STATE_ADMIN, { replace: true })
      } else {
        const from =
          (location.state as { from?: { pathname?: string } } | null | undefined)?.from?.pathname ||
          ROUTES.DASHBOARD
        navigate(from, { replace: true })
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.'
      setLocalError(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {(localError || error) && <p className="text-sm text-red-600">{localError || error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
