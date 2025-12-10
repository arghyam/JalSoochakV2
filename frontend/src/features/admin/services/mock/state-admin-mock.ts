import type { StateAdmin, CreateStateAdminRequest } from '../../types/state-admin'

const mockStateAdmins: StateAdmin[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@ap.gov.in',
    phone: '+919876543210',
    tenantId: 'andhra-pradesh',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Das',
    email: 'priya.das@assam.gov.in',
    phone: '+919876543211',
    tenantId: 'assam',
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

    const newAdmin: StateAdmin = {
      id: (stateAdmins.length + 1).toString(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      tenantId: data.tenantId,
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
