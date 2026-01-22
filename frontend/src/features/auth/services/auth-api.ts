import apiClient from '@/shared/lib/axios'
import { extractUserFromJWT } from '@/shared/utils/jwt'

export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  personType: string
  tenantId: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  id_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  person_type: string
  tenant_id: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  phoneNumber: string
  tenantId: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

// Hardcoded credentials for testing (temporary - remove when backend is fixed)
const HARDCODED_USERS: Record<string, { password: string; user: AuthUser }> = {
  '4564564566': {
    password: 'sdsdsd',
    user: {
      id: 'super-admin-001',
      name: 'John Doe',
      email: 'johndoe@jalsoochak.com',
      role: 'super_admin',
      phoneNumber: '4564564566',
      tenantId: '',
    },
  },
  '9876543210': {
    password: 'sdsdsd',
    user: {
      id: 'state-admin-001',
      name: 'Jane Doe',
      email: 'janedoe@jalsoochak.com',
      role: 'state_admin',
      phoneNumber: '9876543210',
      tenantId: 'Telangana',
    },
  },
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    // Check hardcoded credentials first (temporary - remove when backend is fixed)
    const hardcodedUser = HARDCODED_USERS[payload.phoneNumber]
    if (hardcodedUser && hardcodedUser.password === payload.password) {
      return {
        user: hardcodedUser.user,
        accessToken: `mock-access-token-${hardcodedUser.user.role}-${Date.now()}`,
        refreshToken: `mock-refresh-token-${hardcodedUser.user.role}-${Date.now()}`,
      }
    }

    // Fallback to real API call
    const response = await apiClient.post<TokenResponse>('/api/v2/auth/login', {
      username: payload.phoneNumber,
      password: payload.password,
    })
    const { access_token, refresh_token, id_token, person_type, tenant_id } = response.data

    const userFromToken = extractUserFromJWT(id_token)
    if (!userFromToken) {
      throw new Error('Failed to extract user information')
    }

    const user: AuthUser = {
      ...userFromToken,
      role: person_type || '',
      tenantId: tenant_id || '',
    }

    return {
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<Partial<TokenResponse>>('/api/v2/auth/refresh', {
      refreshToken,
    })
    const { access_token, refresh_token, id_token, person_type, tenant_id } = response.data

    if (!access_token || !refresh_token || !id_token) {
      throw new Error('Invalid token response')
    }

    const userFromToken = extractUserFromJWT(id_token)
    if (!userFromToken) {
      throw new Error('Failed to extract user information')
    }

    const user: AuthUser = {
      ...userFromToken,
      role: person_type || '',
      tenantId: tenant_id || '',
    }

    return {
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
    }
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/v2/auth/logout', {
      refreshToken,
    })
  },

  register: async (payload: RegisterRequest): Promise<void> => {
    await apiClient.post('/api/v2/auth/register', payload)
  },
}
