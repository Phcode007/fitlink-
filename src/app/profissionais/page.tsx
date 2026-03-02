/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'todos' | 'personal' | 'nutricionista'>('todos')
  const supabase = createClient()
  const { user } = useAuth()

  useEffect(() => {
    fetchProfessionals()
  }, [filter])

  const fetchProfessionals = async () => {
    setLoading(true)
    
    let query = supabase
      .from('professionals')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('verification_status', 'verified')
      .eq('available_for_hire', true)

    if (filter !== 'todos') {
      query = query.eq('professional_type', filter)
    }

    const { data } = await query
    setProfessionals(data || [])
    setLoading(false)
  }

  const handleConnect = async (professionalId: string) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    const { error } = await supabase
      .from('professional_relationships')
      .insert([
        {
          user_id: user.id,
          professional_id: professionalId,
          relationship_type: professionals.find(p => p.id === professionalId)?.professional_type,
          status: 'pending',
        }
      ])

    if (!error) {
      alert('Solicitação enviada com sucesso!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Encontre Profissionais</h1>
          <p className="text-gray-600">Conecte-se com os melhores personais e nutricionistas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-md ${
              filter === 'todos' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-4 py-2 rounded-md ${
              filter === 'personal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Personais
          </button>
          <button
            onClick={() => setFilter('nutricionista')}
            className={`px-4 py-2 rounded-md ${
              filter === 'nutricionista' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Nutricionistas
          </button>
        </div>
      </div>

      {/* Lista de profissionais */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((prof) => (
              <div key={prof.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {prof.profile?.avatar_url ? (
                          <img src={prof.profile.avatar_url} alt="" className="h-12 w-12 rounded-full" />
                        ) : (
                          <span className="text-2xl">
                            {prof.professional_type === 'personal' ? '💪' : '🥗'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {prof.profile?.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {prof.professional_type === 'personal' 
                          ? `CREF: ${prof.cref}`
                          : `CRN: ${prof.crn}-${prof.crn_region}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">⭐</span>
                      <span>{prof.profile?.rating?.toFixed(1) || 'Novo'}</span>
                      <span className="mx-2">•</span>
                      <span>{prof.profile?.total_reviews || 0} avaliações</span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {prof.profile?.bio || 'Profissional disponível para atendimento.'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {prof.specialties?.slice(0, 3).map((spec: string) => (
                        <span key={spec} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        R$ {prof.hourly_rate || prof.monthly_rate || 'A combinar'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {prof.hourly_rate ? '/hora' : prof.monthly_rate ? '/mês' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => handleConnect(prof.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Conectar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}