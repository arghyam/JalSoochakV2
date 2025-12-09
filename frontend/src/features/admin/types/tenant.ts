export interface Tenant {
  id: string
  name: string
  code: string
  status: 'active' | 'inactive'
  stateAdminName?: string
  adminCount: number
  country: string
  defaultLanguages: string[]
  defaultConfig: {
    defaultWaterNorm: number
  }
  createdAt: string
  updatedAt: string
}

export interface TenantFormData {
  name: string
  code: string
  status: 'active' | 'inactive'
  country: string
  defaultLanguages: string[]
  defaultWaterNorm: number
}

export interface CreateTenantRequest {
  name: string
  code: string
  status: 'active' | 'inactive'
  country: string
  defaultLanguages: string[]
  defaultConfig: {
    defaultWaterNorm: number
  }
}

export interface UpdateTenantRequest extends Omit<TenantFormData, 'defaultWaterNorm'> {
  id: string
  defaultConfig: {
    defaultWaterNorm: number
  }
}

export interface ToggleTenantStatusRequest {
  id: string
  status: 'active' | 'inactive'
}
