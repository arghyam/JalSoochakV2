export interface StateAdmin {
  id: string
  name: string
  email: string
  phone: string
  tenantId: string
  tenantName: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface StateAdminFormData {
  name: string
  email: string
  phone: string
  tenantId: string
  password: string
  confirmPassword: string
}

export interface CreateStateAdminRequest {
  name: string
  email: string
  phone: string
  tenantId: string
  password: string
}
