import { MESSAGE_FREQUENCIES, NOTIFY_ROLES } from '@/shared/constants/state-admin'
import type {
  NudgeMessage,
  CreateNudgeMessageRequest,
  UpdateNudgeMessageRequest,
} from '../../types/nudge-message'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock nudge messages
const mockNudgeMessages: NudgeMessage[] = [
  {
    id: '1',
    title: 'Daily Water Quality Report',
    message:
      'Please submit your daily water quality report before 5 PM. Ensure all parameters are checked and recorded accurately.',
    targetRole: NOTIFY_ROLES.SECTION_OFFICER,
    frequency: MESSAGE_FREQUENCIES.DAILY,
    isActive: true,
    tenantId: 'tenant-1',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Weekly Infrastructure Inspection',
    message:
      'Reminder: Weekly infrastructure inspection is due. Please check all pumps, pipelines, and treatment facilities.',
    targetRole: NOTIFY_ROLES.ASSISTANT_EXECUTIVE_ENGINEER,
    frequency: MESSAGE_FREQUENCIES.WEEKLY,
    isActive: true,
    tenantId: 'tenant-1',
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: '3',
    title: 'Monthly Scheme Performance Review',
    message:
      'It is time for the monthly water supply scheme performance review. Please prepare your reports and submit them for approval.',
    targetRole: 'all',
    frequency: MESSAGE_FREQUENCIES.MONTHLY,
    isActive: true,
    tenantId: 'tenant-1',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
]

let messages = [...mockNudgeMessages]
let nextId = messages.length + 1

export const nudgeMessageMockService = {
  getNudgeMessages: async (tenantId: string): Promise<NudgeMessage[]> => {
    await delay(500)
    return messages.filter((m) => m.tenantId === tenantId)
  },

  createNudgeMessage: async (data: CreateNudgeMessageRequest): Promise<NudgeMessage> => {
    await delay(500)
    const newMessage: NudgeMessage = {
      id: (nextId++).toString(),
      title: data.title,
      message: data.message,
      targetRole: data.targetRole,
      frequency: data.frequency,
      isActive: data.isActive,
      tenantId: data.tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    messages.push(newMessage)
    return newMessage
  },

  updateNudgeMessage: async (data: UpdateNudgeMessageRequest): Promise<NudgeMessage> => {
    await delay(500)
    const index = messages.findIndex((m) => m.id === data.id)
    if (index === -1) {
      throw new Error('Nudge message not found')
    }
    const updatedMessage: NudgeMessage = {
      ...messages[index],
      title: data.title,
      message: data.message,
      targetRole: data.targetRole,
      frequency: data.frequency,
      isActive: data.isActive,
      updatedAt: new Date().toISOString(),
    }
    messages[index] = updatedMessage
    return updatedMessage
  },

  toggleNudgeMessageStatus: async (id: string, isActive: boolean): Promise<NudgeMessage> => {
    await delay(500)
    const index = messages.findIndex((m) => m.id === id)
    if (index === -1) {
      throw new Error('Nudge message not found')
    }
    messages[index] = {
      ...messages[index],
      isActive,
      updatedAt: new Date().toISOString(),
    }
    return messages[index]
  },

  deleteNudgeMessage: async (id: string): Promise<void> => {
    await delay(500)
    messages = messages.filter((m) => m.id !== id)
  },
}
