export interface Tenant {
  id: string
  name: string
  code: string
  status: 'active' | 'inactive'
  stateAdminName?: string
  adminCount: number
  createdAt: string
  updatedAt: string
}

export interface TenantFormData {
  name: string
  code: string
  status: 'active' | 'inactive'
}

export interface CreateTenantRequest {
  name: string
  code: string
  status: 'active' | 'inactive'
}

export interface UpdateTenantRequest extends TenantFormData {
  id: string
}

export interface ToggleTenantStatusRequest {
  id: string
  status: 'active' | 'inactive'
}
