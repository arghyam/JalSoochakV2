import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  ToggleTenantStatusRequest,
} from '../../types/tenant'

// Mock data for all 36 Indian States and Union Territories
const mockTenants: Tenant[] = [
  // States
  {
    id: '1',
    name: 'Andhra Pradesh',
    code: 'AP',
    status: 'active',
    stateAdminName: 'Rajesh Kumar',
    adminCount: 3,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Arunachal Pradesh',
    code: 'AR',
    status: 'active',
    stateAdminName: 'Tania Sharma',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Assam',
    code: 'AS',
    status: 'active',
    stateAdminName: 'Priya Das',
    adminCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Bihar',
    code: 'BR',
    status: 'active',
    stateAdminName: 'Amit Singh',
    adminCount: 4,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '5',
    name: 'Chhattisgarh',
    code: 'CG',
    status: 'active',
    stateAdminName: 'Sunita Verma',
    adminCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '6',
    name: 'Goa',
    code: 'GA',
    status: 'active',
    stateAdminName: "Michael D'Souza",
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '7',
    name: 'Gujarat',
    code: 'GJ',
    status: 'active',
    stateAdminName: 'Neha Patel',
    adminCount: 5,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '8',
    name: 'Haryana',
    code: 'HR',
    status: 'active',
    stateAdminName: 'Vikram Singh',
    adminCount: 3,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '9',
    name: 'Himachal Pradesh',
    code: 'HP',
    status: 'active',
    stateAdminName: 'Anita Sharma',
    adminCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '10',
    name: 'Jharkhand',
    code: 'JH',
    status: 'inactive',
    adminCount: 0,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '11',
    name: 'Karnataka',
    code: 'KA',
    status: 'active',
    stateAdminName: 'Ramesh Rao',
    adminCount: 6,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '12',
    name: 'Kerala',
    code: 'KL',
    status: 'active',
    stateAdminName: 'Sanjay Menon',
    adminCount: 4,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '13',
    name: 'Madhya Pradesh',
    code: 'MP',
    status: 'active',
    stateAdminName: 'Kavita Sharma',
    adminCount: 5,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '14',
    name: 'Maharashtra',
    code: 'MH',
    status: 'active',
    stateAdminName: 'Suresh Patil',
    adminCount: 8,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '15',
    name: 'Manipur',
    code: 'MN',
    status: 'active',
    stateAdminName: 'Mary Kom',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '16',
    name: 'Meghalaya',
    code: 'ML',
    status: 'active',
    stateAdminName: 'David Lyngdoh',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '17',
    name: 'Mizoram',
    code: 'MZ',
    status: 'inactive',
    adminCount: 0,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '18',
    name: 'Nagaland',
    code: 'NL',
    status: 'active',
    stateAdminName: 'John Khieya',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '19',
    name: 'Odisha',
    code: 'OR',
    status: 'active',
    stateAdminName: 'Bijay Mohanty',
    adminCount: 3,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '20',
    name: 'Punjab',
    code: 'PB',
    status: 'active',
    stateAdminName: 'Harpreet Singh',
    adminCount: 4,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '21',
    name: 'Rajasthan',
    code: 'RJ',
    status: 'active',
    stateAdminName: 'Priyanka Rathore',
    adminCount: 5,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '22',
    name: 'Sikkim',
    code: 'SK',
    status: 'active',
    stateAdminName: 'Tshering Bhutia',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '23',
    name: 'Tamil Nadu',
    code: 'TN',
    status: 'active',
    stateAdminName: 'Karthik Kumar',
    adminCount: 7,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '24',
    name: 'Telangana',
    code: 'TG',
    status: 'active',
    stateAdminName: 'Lakshmi Reddy',
    adminCount: 4,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '25',
    name: 'Tripura',
    code: 'TR',
    status: 'active',
    stateAdminName: 'Debashish Roy',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '26',
    name: 'Uttar Pradesh',
    code: 'UP',
    status: 'active',
    stateAdminName: 'Ashok Kumar',
    adminCount: 10,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '27',
    name: 'Uttarakhand',
    code: 'UK',
    status: 'active',
    stateAdminName: 'Meera Negi',
    adminCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '28',
    name: 'West Bengal',
    code: 'WB',
    status: 'active',
    stateAdminName: 'Sourav Chatterjee',
    adminCount: 6,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },

  // Union Territories
  {
    id: '29',
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    status: 'active',
    stateAdminName: 'Ravi Kumar',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '30',
    name: 'Chandigarh',
    code: 'CH',
    status: 'active',
    stateAdminName: 'Simran Kaur',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '31',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DH',
    status: 'active',
    stateAdminName: 'Ramesh Patel',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '32',
    name: 'Delhi',
    code: 'DL',
    status: 'active',
    stateAdminName: 'Vikas Sharma',
    adminCount: 5,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '33',
    name: 'Jammu and Kashmir',
    code: 'JK',
    status: 'active',
    stateAdminName: 'Aamir Khan',
    adminCount: 3,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '34',
    name: 'Ladakh',
    code: 'LA',
    status: 'inactive',
    adminCount: 0,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '35',
    name: 'Lakshadweep',
    code: 'LD',
    status: 'active',
    stateAdminName: 'Mohammed Ali',
    adminCount: 1,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '36',
    name: 'Puducherry',
    code: 'PY',
    status: 'active',
    stateAdminName: 'Bharathi Kumar',
    adminCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
]

let tenants = [...mockTenants]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const tenantMockService = {
  getTenants: async (): Promise<Tenant[]> => {
    await delay(300)
    return [...tenants]
  },

  getTenantById: async (id: string): Promise<Tenant | null> => {
    await delay(200)
    return tenants.find((t) => t.id === id) || null
  },

  createTenant: async (data: CreateTenantRequest): Promise<Tenant> => {
    await delay(500)
    const newTenant: Tenant = {
      id: (tenants.length + 1).toString(),
      ...data,
      adminCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tenants.push(newTenant)
    return newTenant
  },

  updateTenant: async (data: UpdateTenantRequest): Promise<Tenant> => {
    await delay(500)
    const index = tenants.findIndex((t) => t.id === data.id)
    if (index === -1) {
      throw new Error('Tenant not found')
    }
    const updatedTenant: Tenant = {
      ...tenants[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    tenants[index] = updatedTenant
    return updatedTenant
  },

  toggleTenantStatus: async (data: ToggleTenantStatusRequest): Promise<Tenant> => {
    await delay(300)
    const index = tenants.findIndex((t) => t.id === data.id)
    if (index === -1) {
      throw new Error('Tenant not found')
    }
    const updatedTenant: Tenant = {
      ...tenants[index],
      status: data.status,
      updatedAt: new Date().toISOString(),
    }
    tenants[index] = updatedTenant
    return updatedTenant
  },

  deleteTenant: async (id: string): Promise<void> => {
    await delay(400)
    const index = tenants.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error('Tenant not found')
    }
    tenants = tenants.filter((t) => t.id !== id)
  },

  // Reset for testing purposes
  resetTenants: () => {
    tenants = [...mockTenants]
  },
}
