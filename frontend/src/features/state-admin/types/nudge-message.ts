import type { MessageFrequency, NotifyRole } from '@/shared/constants/state-admin'

export interface NudgeMessage {
  id: string
  title: string
  message: string
  targetRole?: NotifyRole | 'all'
  frequency: MessageFrequency
  isActive: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateNudgeMessageRequest {
  tenantId: string
  title: string
  message: string
  targetRole?: NotifyRole | 'all'
  frequency: MessageFrequency
  isActive: boolean
}

export interface UpdateNudgeMessageRequest {
  id: string
  tenantId: string
  title: string
  message: string
  targetRole?: NotifyRole | 'all'
  frequency: MessageFrequency
  isActive: boolean
}

export interface NudgeMessageFormData {
  title: string
  message: string
  targetRole?: NotifyRole | 'all'
  frequency: MessageFrequency
  isActive: boolean
}
