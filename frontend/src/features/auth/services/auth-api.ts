import apiClient from '@/shared/lib/axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  tenantId?: string
  tenantName?: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload)
    return response.data
  },
  refresh: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/refresh')
    return response.data
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}
