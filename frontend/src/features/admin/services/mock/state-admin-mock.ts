import type { StateAdmin, CreateStateAdminRequest } from '../../types/state-admin'

const mockStateAdmins: StateAdmin[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@ap.gov.in',
    phone: '+919876543210',
    tenantId: '1',
    tenantName: 'Andhra Pradesh',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Das',
    email: 'priya.das@assam.gov.in',
    phone: '+919876543211',
    tenantId: '3',
    tenantName: 'Assam',
    status: 'active',
    createdAt: '2024-01-16T00:00:00Z',
  },
]

let stateAdmins = [...mockStateAdmins]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const stateAdminMockService = {
  getStateAdmins: async (): Promise<StateAdmin[]> => {
    await delay(300)
    return [...stateAdmins]
  },

  getStateAdminById: async (id: string): Promise<StateAdmin | null> => {
    await delay(200)
    return stateAdmins.find((admin) => admin.id === id) || null
  },

  createStateAdmin: async (data: CreateStateAdminRequest): Promise<StateAdmin> => {
    await delay(500)

    // Find tenant name from tenantId (in real app, this would be a join)
    // For now, we'll use a placeholder
    const tenantName = 'Unknown Tenant'

    const newAdmin: StateAdmin = {
      id: (stateAdmins.length + 1).toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      tenantId: data.tenantId,
      tenantName,
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    stateAdmins.push(newAdmin)
    return newAdmin
  },

  // Reset for testing purposes
  resetStateAdmins: () => {
    stateAdmins = [...mockStateAdmins]
  },
}
