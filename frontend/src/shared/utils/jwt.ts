export interface DecodedJwt {
  sub?: string
  email?: string
  name?: string
  exp?: number
  realm_access?: {
    roles?: string[]
  }
  resource_access?: Record<string, { roles?: string[] }>
  [key: string]: unknown
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}
