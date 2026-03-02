export type UserType = 'usuario' | 'personal' | 'nutricionista' | 'admin'
export type RelationshipStatus = 'pending' | 'active' | 'inactive' | 'rejected' | 'completed'
export type ConsultaType = 'online' | 'presencial' | 'ambos'

export interface Professional {
  id: string
  user_id: string
  professional_type: 'personal' | 'nutricionista'
  
  // Registros
  cref?: string
  cref_state?: string
  crn?: string
  crn_region?: string
  
  // Formação
  education: string[]
  institution?: string
  graduation_year?: number
  
  // Especialidades
  specialties: string[]
  certifications: string[]
  
  // Experiência
  experience_years?: number
  experience_description?: string
  
  // Abordagem
  approach_description?: string
  philosophy?: string
  
  // Atendimento
  consultation_modality: ConsultaType
  accepts_online: boolean
  accepts_in_person: boolean
  service_areas: string[]
  
  // Valores
  available_for_hire: boolean
  hourly_rate?: number
  monthly_rate?: number
  quarterly_rate?: number
  
  // Contato
  professional_email?: string
  professional_phone?: string
  website?: string
  
  // Redes sociais
  instagram?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  
  // Verificação
  verification_status: 'pending' | 'verified' | 'rejected'
  verified: boolean
  
  created_at: string
  updated_at: string
}

export interface ProfessionalRelationship {
  id: string
  user_id: string
  professional_id: string
  relationship_type: 'personal' | 'nutricionista'
  status: RelationshipStatus
  
  requested_at: string
  accepted_at?: string
  started_at?: string
  ended_at?: string
  
  plan_type?: string
  contract_value?: number
  payment_frequency?: string
  
  client_goals?: string[]
  client_notes?: string
  
  permissions: {
    can_view_workouts: boolean
    can_view_meals: boolean
    can_view_progress: boolean
    can_edit_workouts: boolean
    can_edit_meals: boolean
    can_message_direct: boolean
  }
  
  // Avaliações
  rating?: number
  review?: string
  review_date?: string
  
  created_at: string
  updated_at: string
}

// Opções para selects
export const PROFESSIONAL_SPECIALTIES = {
  personal: [
    { id: 'emagrecimento', label: 'Emagrecimento' },
    { id: 'hipertrofia', label: 'Hipertrofia' },
    { id: 'funcional', label: 'Treinamento Funcional' },
    { id: 'crossfit', label: 'CrossFit' },
    { id: 'pilates', label: 'Pilates' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'idosos', label: 'Treino para Idosos' },
    { id: 'gestantes', label: 'Gestantes' },
    { id: 'reabilitacao', label: 'Reabilitação' },
    { id: 'performance', label: 'Performance Esportiva' },
  ],
  nutricionista: [
    { id: 'emagrecimento', label: 'Emagrecimento' },
    { id: 'esportiva', label: 'Nutrição Esportiva' },
    { id: 'funcional', label: 'Nutrição Funcional' },
    { id: 'comportamental', label: 'Comportamental' },
    { id: 'vegetariano', label: 'Vegetariano/Vegano' },
    { id: 'intolerancias', label: 'Intolerâncias Alimentares' },
    { id: 'infantil', label: 'Nutrição Infantil' },
    { id: 'gestantes', label: 'Gestantes' },
    { id: 'idosos', label: 'Nutrição para Idosos' },
    { id: 'clinica', label: 'Nutrição Clínica' },
  ]
}

export const CONSULTATION_MODALITIES = [
  { id: 'online', label: 'Online' },
  { id: 'presencial', label: 'Presencial' },
  { id: 'ambos', label: 'Online e Presencial' },
]

export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

// Regiões do CRN
export const CRN_REGIONS = [
  { value: '1', label: 'CRN-1 (DF, GO, MT, MS, TO)' },
  { value: '2', label: 'CRN-2 (RS)' },
  { value: '3', label: 'CRN-3 (SP)' },
  { value: '4', label: 'CRN-4 (RJ, ES)' },
  { value: '5', label: 'CRN-5 (BA, SE)' },
  { value: '6', label: 'CRN-6 (AL, PE, PB)' },
  { value: '7', label: 'CRN-7 (CE, MA, PI)' },
  { value: '8', label: 'CRN-8 (PR)' },
  { value: '9', label: 'CRN-9 (SC)' },
  { value: '10', label: 'CRN-10 (RN, PA, AM, AP, RO, RR, AC)' },
]