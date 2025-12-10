export interface StateAdmin {
  id: string
  name: string
  email: string
  phone: string
  tenantId: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface StateAdminFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  tenantId: string
  password: string
  confirmPassword: string
}

export interface CreateStateAdminRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  tenantId: string
  password: string
}
