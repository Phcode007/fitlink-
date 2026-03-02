export type FitnessLevel = 'iniciante' | 'intermediario' | 'avancado'
export type MainGoal = 'perder_peso' | 'ganhar_massa' | 'definir' | 'saude' | 'condicionamento'
export type WorkoutLocation = 'casa' | 'academia' | 'ambos'
export type Gender = 'masculino' | 'feminino' | 'outro'

export interface OnboardingData {
  // Dados pessoais
  full_name: string
  birth_date: string
  gender: Gender
  
  // Dados físicos
  height_cm: number
  weight_kg: number
  
  // Objetivos
  fitness_level: FitnessLevel
  main_goal: MainGoal
  workout_location: WorkoutLocation
  
  // Equipamentos disponíveis (para treino em casa)
  available_equipment: string[]
  
  // Restrições
  medical_restrictions?: string
  injuries?: string
  
  // Preferências alimentares
  dietary_restrictions?: string[]
  food_allergies?: string[]
  meals_per_day?: number
}

export const EQUIPMENT_OPTIONS = [
  { id: 'halteres', label: 'Halteres' },
  { id: 'barra', label: 'Barra' },
  { id: 'anilhas', label: 'Anilhas' },
  { id: 'banco', label: 'Banco' },
  { id: 'elasticos', label: 'Elásticos' },
  { id: 'corda', label: 'Corda' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'bola', label: 'Bola suíça' },
  { id: 'tapete', label: 'Tapete de yoga' },
  { id: 'nenhum', label: 'Nenhum equipamento' },
]

export const DIETARY_RESTRICTIONS = [
  { id: 'vegetariano', label: 'Vegetariano' },
  { id: 'vegano', label: 'Vegano' },
  { id: 'sem_gluten', label: 'Sem glúten' },
  { id: 'sem_lactose', label: 'Sem lactose' },
  { id: 'low_carb', label: 'Low carb' },
  { id: 'mediterraneo', label: 'Mediterrâneo' },
]