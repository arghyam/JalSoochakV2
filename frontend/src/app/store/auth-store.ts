import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_ROLES, AUTH_STORAGE_KEY, type AuthRole } from '@/shared/constants/auth'
import type { AuthUser, LoginRequest } from '@/features/auth/services/auth-api'
import { authApi } from '@/features/auth/services/auth-api'
import { decodeJwt } from '@/shared/utils/jwt'

export interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  logout: () => void
  restoreFromToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (payload: LoginRequest) => {
        set({ loading: true, error: null })
        try {
          const { token, user } = await authApi.login(payload)
          set({
            token,
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
          })
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unable to login. Please try again.'
          set({ loading: false, error: message, token: null, user: null, isAuthenticated: false })
          throw error
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, error: null })
      },

      restoreFromToken: () => {
        const { token } = get()
        if (!token) return

        const decoded = decodeJwt(token)
        if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
          // Token invalid or expired
          set({ token: null, user: null, isAuthenticated: false })
          return
        }

        const roles: string[] =
          decoded.realm_access?.roles ||
          decoded.resource_access?.['jalsoochak']?.roles ||
          decoded.resource_access?.['account']?.roles ||
          []

        let role: AuthRole = AUTH_ROLES.BUSINESS_USER
        if (roles.includes(AUTH_ROLES.SUPER_USER)) {
          role = AUTH_ROLES.SUPER_USER
        } else if (roles.includes(AUTH_ROLES.STATE_ADMIN)) {
          role = AUTH_ROLES.STATE_ADMIN
        }

        const user: AuthUser = {
          id: decoded.sub || '',
          name: (decoded.name as string) || '',
          email: (decoded.email as string) || '',
          role,
        }

        set({ user, isAuthenticated: true })
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token }),
    }
  )
)
