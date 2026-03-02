/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { BRAZILIAN_STATES, CRN_REGIONS, PROFESSIONAL_SPECIALTIES } from '@/types/professionals'

export default function ProfessionalRegisterPage() {
  const searchParams = useSearchParams()
  const professionalType = searchParams.get('type') || 'personal'
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dados da conta
  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  })

  // Dados profissionais
  const [professionalData, setProfessionalData] = useState({
    // Registro específico
    cref: '',
    cref_state: '',
    crn: '',
    crn_region: '',
    
    // Formação
    education: [] as string[],
    institution: '',
    graduation_year: new Date().getFullYear(),
    
    // Especialidades
    specialties: [] as string[],
    certifications: [] as string[],
    
    // Experiência
    experience_years: 0,
    experience_description: '',
    
    // Atendimento
    consultation_modality: 'ambos',
    accepts_online: true,
    accepts_in_person: true,
    service_areas: [] as string[],
    city: '',
    state: '',
    
    // Valores
    hourly_rate: '',
    monthly_rate: '',
    
    // Bio
    bio: '',
    approach_description: '',
    
    // Redes sociais
    instagram: '',
    linkedin: '',
  })

  const handleCreateAccount = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Criar perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: accountData.email,
              full_name: accountData.full_name,
              phone: accountData.phone,
              user_type: professionalType,
              city: professionalData.city,
              state: professionalData.state,
              bio: professionalData.bio,
              verification_status: 'pending',
            },
          ])

        if (profileError) throw profileError

        // 3. Criar dados profissionais
        const professionalInsert: any = {
          user_id: authData.user.id,
          professional_type: professionalType,
          education: professionalData.education,
          institution: professionalData.institution,
          graduation_year: professionalData.graduation_year,
          specialties: professionalData.specialties,
          certifications: professionalData.certifications,
          experience_years: professionalData.experience_years,
          experience_description: professionalData.experience_description,
          consultation_modality: professionalData.consultation_modality,
          accepts_online: professionalData.accepts_online,
          accepts_in_person: professionalData.accepts_in_person,
          service_areas: professionalData.service_areas,
          hourly_rate: professionalData.hourly_rate ? Number(professionalData.hourly_rate) : null,
          monthly_rate: professionalData.monthly_rate ? Number(professionalData.monthly_rate) : null,
          instagram: professionalData.instagram,
          linkedin: professionalData.linkedin,
          verification_status: 'pending',
        }

        // Adicionar campos específicos por tipo
        if (professionalType === 'personal') {
          professionalInsert.cref = professionalData.cref
          professionalInsert.cref_state = professionalData.cref_state
        } else {
          professionalInsert.crn = professionalData.crn
          professionalInsert.crn_region = professionalData.crn_region
        }

        const { error: professionalError } = await supabase
          .from('professionals')
          .insert([professionalInsert])

        if (professionalError) throw professionalError

        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Dados da Conta</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
        <input
          type="text"
          value={accountData.full_name}
          onChange={(e) => setAccountData({ ...accountData, full_name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email profissional</label>
        <input
          type="email"
          value={accountData.email}
          onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          value={accountData.password}
          onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          minLength={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
        <input
          type="tel"
          value={accountData.phone}
          onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="(11) 99999-9999"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Registro Profissional</h3>
      
      {professionalType === 'personal' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">CREF</label>
            <input
              type="text"
              value={professionalData.cref}
              onChange={(e) => setProfessionalData({ ...professionalData, cref: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ex: 123456-G/SP"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Formato: NÚMERO-G/UF (Ex: 123456-G/SP)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado do CREF</label>
            <select
              value={professionalData.cref_state}
              onChange={(e) => setProfessionalData({ ...professionalData, cref_state: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Selecione o estado</option>
              {BRAZILIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>{state.label}</option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">CRN</label>
            <input
              type="text"
              value={professionalData.crn}
              onChange={(e) => setProfessionalData({ ...professionalData, crn: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ex: 123456"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Região do CRN</label>
            <select
              value={professionalData.crn_region}
              onChange={(e) => setProfessionalData({ ...professionalData, crn_region: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Selecione a região</option>
              {CRN_REGIONS.map(region => (
                <option key={region.value} value={region.value}>{region.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <h3 className="text-lg font-medium text-gray-900 pt-4">Formação Acadêmica</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Instituição de Ensino</label>
        <input
          type="text"
          value={professionalData.institution}
          onChange={(e) => setProfessionalData({ ...professionalData, institution: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ano de Graduação</label>
        <input
          type="number"
          value={professionalData.graduation_year}
          onChange={(e) => setProfessionalData({ ...professionalData, graduation_year: Number(e.target.value) })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          min="1980"
          max={new Date().getFullYear()}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Anos de experiência</label>
        <input
          type="number"
          value={professionalData.experience_years}
          onChange={(e) => setProfessionalData({ ...professionalData, experience_years: Number(e.target.value) })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          min="0"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Especialidades e Atendimento</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Especialidades</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PROFESSIONAL_SPECIALTIES[professionalType as keyof typeof PROFESSIONAL_SPECIALTIES]?.map(spec => (
            <label key={spec.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={spec.id}
                checked={professionalData.specialties.includes(spec.id)}
                onChange={(e) => {
                  const newSpecialties = e.target.checked
                    ? [...professionalData.specialties, spec.id]
                    : professionalData.specialties.filter(s => s !== spec.id)
                  setProfessionalData({ ...professionalData, specialties: newSpecialties })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{spec.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Modalidade de Atendimento</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="modality"
              value="online"
              checked={professionalData.consultation_modality === 'online'}
              onChange={(e) => setProfessionalData({ 
                ...professionalData, 
                consultation_modality: e.target.value,
                accepts_online: true,
                accepts_in_person: false
              })}
              className="border-gray-300"
            />
            <span>Apenas Online</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="modality"
              value="presencial"
              checked={professionalData.consultation_modality === 'presencial'}
              onChange={(e) => setProfessionalData({ 
                ...professionalData, 
                consultation_modality: e.target.value,
                accepts_online: false,
                accepts_in_person: true
              })}
              className="border-gray-300"
            />
            <span>Apenas Presencial</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="modality"
              value="ambos"
              checked={professionalData.consultation_modality === 'ambos'}
              onChange={(e) => setProfessionalData({ 
                ...professionalData, 
                consultation_modality: e.target.value,
                accepts_online: true,
                accepts_in_person: true
              })}
              className="border-gray-300"
            />
            <span>Online e Presencial</span>
          </label>
        </div>
      </div>

      {professionalData.accepts_in_person && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Cidade/Estado de atendimento</label>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <input
              type="text"
              value={professionalData.city}
              onChange={(e) => setProfessionalData({ ...professionalData, city: e.target.value })}
              className="border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Cidade"
            />
            <select
              value={professionalData.state}
              onChange={(e) => setProfessionalData({ ...professionalData, state: e.target.value })}
              className="border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">UF</option>
              {BRAZILIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>{state.value}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição da experiência</label>
        <textarea
          value={professionalData.experience_description}
          onChange={(e) => setProfessionalData({ ...professionalData, experience_description: e.target.value })}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Conte um pouco sobre sua experiência profissional..."
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Valores e Redes Sociais</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Valor por hora (R$)</label>
        <input
          type="number"
          value={professionalData.hourly_rate}
          onChange={(e) => setProfessionalData({ ...professionalData, hourly_rate: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="0,00"
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Valor mensal (R$)</label>
        <input
          type="number"
          value={professionalData.monthly_rate}
          onChange={(e) => setProfessionalData({ ...professionalData, monthly_rate: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="0,00"
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instagram</label>
        <input
          type="text"
          value={professionalData.instagram}
          onChange={(e) => setProfessionalData({ ...professionalData, instagram: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="@seu_perfil"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
        <input
          type="text"
          value={professionalData.linkedin}
          onChange={(e) => setProfessionalData({ ...professionalData, linkedin: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="URL do seu LinkedIn"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio profissional</label>
        <textarea
          value={professionalData.bio}
          onChange={(e) => setProfessionalData({ ...professionalData, bio: e.target.value })}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Fale sobre sua abordagem, filosofia de trabalho..."
        />
      </div>
    </div>
  )

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4]
  const totalSteps = steps.length

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progresso */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    num <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="relative mt-2 h-2 bg-gray-200 rounded">
              <div
                className="absolute h-2 bg-blue-600 rounded transition-all duration-300"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conta</span>
              <span>Registro</span>
              <span>Especialidades</span>
              <span>Valores</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault()
            if (step < totalSteps) {
              setStep(step + 1)
            } else {
              handleCreateAccount()
            }
          }}>
            {steps[step - 1]()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                  step === 1 ? 'ml-auto' : ''
                }`}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : step === totalSteps ? (
                  'Finalizar cadastro'
                ) : (
                  'Continuar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}