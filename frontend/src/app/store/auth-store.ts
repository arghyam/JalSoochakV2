import { create } from 'zustand'
import type { AuthUser, LoginRequest } from '@/features/auth/services/auth-api'
import { authApi } from '@/features/auth/services/auth-api'

export interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  logout: () => void
  bootstrap: () => Promise<void>
  sessionExpired: boolean
  setSessionExpired: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionExpired: false,

  login: async (payload: LoginRequest) => {
    set({ loading: true, error: null, sessionExpired: false })
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
      const message = error instanceof Error ? error.message : 'Unable to login. Please try again.'
      set({
        loading: false,
        error: message,
        token: null,
        user: null,
        isAuthenticated: false,
      })
      throw error
    }
  },

  logout: () => {
    void authApi.logout().catch(() => undefined)
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
      sessionExpired: false,
    })
  },

  bootstrap: async () => {
    try {
      const { token, user } = await authApi.refresh()
      set({
        token,
        user,
        isAuthenticated: true,
        sessionExpired: false,
        error: null,
      })
    } catch {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      })
    }
  },

  setSessionExpired: () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      sessionExpired: true,
      error: 'Session expired. Please log in again.',
    })
  },
}))
