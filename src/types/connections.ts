export type ConnectionStatus = 'pending' | 'active' | 'inactive' | 'rejected' | 'completed'
export type ProfessionalType = 'personal' | 'nutricionista'

export interface Connection {
  id: string
  professional_id: string
  user_id: string
  relationship_type: ProfessionalType
  status: ConnectionStatus
  created_at: string
  accepted_at?: string | null
  
  professional?: {
    id: string
    professional_type: ProfessionalType
    cref?: string
    cref_state?: string
    crn?: string
    crn_region?: string
    specialties: string[]
    experience_years?: number
    hourly_rate?: number
    profile: {
      full_name: string
      avatar_url: string | null
      rating?: number
    }
  }
  
  user?: {
    full_name: string
    avatar_url: string | null
  }
}

export interface ConnectionActions {
  onAccept?: (id: string) => Promise<void>
  onReject?: (id: string) => Promise<void>
  onMessage?: (id: string) => void
}

export const statusColors: Record<ConnectionStatus, { bg: string; text: string }> = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800'
  },
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800'
  },
  completed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  }
}

export const statusLabels: Record<ConnectionStatus, string> = {
  pending: 'Pendente',
  active: 'Ativa',
  inactive: 'Inativa',
  rejected: 'Rejeitada',
  completed: 'Concluída'
}
