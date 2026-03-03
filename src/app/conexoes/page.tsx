/* eslint-disable @typescript-eslint/no-unused-expressions */
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import Image from 'next/image'
import { Connection, ConnectionStatus, statusColors, statusLabels } from '@/types/connections'

type FilterType = 'todas' | 'ativas' | 'pendentes'

export default function ConexoesPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('todas')
  const [isProfessional, setIsProfessional] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const { user, profile } = useAuth()

  const checkIfProfessional = useCallback(async () => {
    if (!user) return

    const { data } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    setIsProfessional(!!data)
  }, [user, supabase])

  const fetchConnections = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      if (isProfessional) {
        // Para profissionais: buscar relações onde ele é o profissional
        const { data: professionalData } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!professionalData) {
          setLoading(false)
          return
        }

        let query = supabase
          .from('professional_relationships')
          .select(`
            *,
            user:profiles(
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('professional_id', professionalData.id)

        if (filter !== 'todas') {
          const status: ConnectionStatus = filter === 'pendentes' ? 'pending' : 'active'
          query = query.eq('status', status)
        }

        const { data, error: queryError } = await query

        if (queryError) {
          setError('Erro ao buscar conexões')
          console.error(queryError)
        } else {
          setConnections(data || [])
        }
      } else {
        // Para usuários comuns: buscar relações onde ele é o usuário
        let query = supabase
          .from('professional_relationships')
          .select(`
            *,
            professional:professionals(
              id,
              professional_type,
              cref,
              cref_state,
              crn,
              crn_region,
              specialties,
              experience_years,
              hourly_rate,
              profile:profiles(
                id,
                full_name,
                avatar_url,
                rating
              )
            )
          `)
          .eq('user_id', user.id)

        if (filter !== 'todas') {
          const status: ConnectionStatus = filter === 'pendentes' ? 'pending' : 'active'
          query = query.eq('status', status)
        }

        const { data, error: queryError } = await query

        if (queryError) {
          setError('Erro ao buscar conexões')
          console.error(queryError)
        } else {
          setConnections(data || [])
        }
      }
    } catch (err) {
      setError('Erro ao buscar conexões')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user, supabase, isProfessional, filter])

  useEffect(() => {
    if (user && profile) {
      checkIfProfessional()
      fetchConnections()
    }
  }, [user, profile, checkIfProfessional, fetchConnections])

  const handleAccept = async (connectionId: string) => {
    setActionLoading(connectionId)
    try {
      const { error } = await supabase
        .from('professional_relationships')
        .update({
          status: 'active',
          accepted_at: new Date().toISOString()
        })
        .eq('id', connectionId)

      if (error) {
        setError('Erro ao aceitar solicitação')
        console.error(error)
      } else {
        await fetchConnections()
      }
    } catch (err) {
      setError('Erro ao aceitar solicitação')
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (connectionId: string) => {
    setActionLoading(connectionId)
    try {
      const { error } = await supabase
        .from('professional_relationships')
        .update({
          status: 'rejected'
        })
        .eq('id', connectionId)

      if (error) {
        setError('Erro ao rejeitar solicitação')
        console.error(error)
      } else {
        await fetchConnections()
      }
    } catch (err) {
      setError('Erro ao rejeitar solicitação')
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadgeColors = (status: ConnectionStatus) => {
    return statusColors[status]
  }

  const getStatusLabel = (status: ConnectionStatus) => {
    return statusLabels[status]
  }

  const getProfessionalIcon = (type: string) => {
    return type === 'personal' ? '💪' : '🥗'
  }

  const filteredConnections = connections.filter(conn => {
    if (filter === 'todas') return true
    if (filter === 'ativas') return conn.status === 'active'
    if (filter === 'pendentes') return conn.status === 'pending'
    return true
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Conexões</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Você precisa estar autenticado para ver suas conexões.</p>
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isProfessional ? 'Meus Clientes' : 'Minhas Conexões'}
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            {isProfessional 
              ? 'Gerencie suas solicitações de clientes e conexões ativas' 
              : 'Acompanhe suas conexões com profissionais'
            }
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 flex-wrap">
          {(['todas', 'ativas', 'pendentes'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-4">
              {isProfessional ? '👥' : '🤝'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isProfessional
                ? filter === 'pendentes'
                  ? 'Nenhuma solicitação pendente'
                  : 'Nenhum cliente nesta categoria'
                : filter === 'pendentes'
                  ? 'Nenhuma solicitação pendente'
                  : 'Nenhuma conexão ativa'
            }
            </h3>
            <p className="text-gray-600 mb-6">
              {isProfessional
                ? 'Quando clientes se conectarem, você verá aqui'
                : 'Comece buscando profissionais para se conectar'
              }
            </p>
            {!isProfessional && (
              <Link
                href="/profissionais"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              >
                Buscar Profissionais
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => {
              const isRelatedToProfessional = isProfessional
              const contactInfo = isRelatedToProfessional
                ? connection.user
                : connection.professional?.profile

              const statusColor = getStatusBadgeColors(connection.status)
              const statusLabel = getStatusLabel(connection.status)

              return (
                <div
                  key={connection.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {contactInfo?.avatar_url ? (
                              <Image
                                src={contactInfo.avatar_url}
                                alt={contactInfo?.full_name || 'Avatar'}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">
                                {isRelatedToProfessional
                                  ? '👤'
                                  : getProfessionalIcon(
                                    connection.professional?.professional_type || 'personal'
                                  )}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {contactInfo?.full_name || 'Sem nome'}
                          </h3>
                          {!isRelatedToProfessional && connection.professional?.professional_type && (
                            <p className="text-sm text-gray-500">
                              {connection.professional.professional_type === 'personal'
                                ? 'Personal Trainer'
                                : 'Nutricionista'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Informações Profissionais */}
                    {!isRelatedToProfessional && connection.professional && (
                      <div className="mb-4 pb-4 border-b border-gray-200 space-y-2">
                        {connection.professional.cref && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">CREF:</span> {connection.professional.cref}
                          </p>
                        )}
                        {connection.professional.crn && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">CRN:</span> {connection.professional.crn}-
                            {connection.professional.crn_region}
                          </p>
                        )}
                        {connection.professional.experience_years && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Experiência:</span>{' '}
                            {connection.professional.experience_years} anos
                          </p>
                        )}
                        {connection.professional.specialties &&
                          connection.professional.specialties.length > 0 && (
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Especialidades:</span>{' '}
                              {connection.professional.specialties.join(', ')}
                            </p>
                          )}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                      >
                        {statusLabel}
                      </span>
                      {connection.created_at && (
                        <span className="text-xs text-gray-500">
                          {new Date(connection.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      {isProfessional && connection.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAccept(connection.id)}
                            disabled={actionLoading === connection.id}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {actionLoading === connection.id ? 'Processando...' : 'Aceitar'}
                          </button>
                          <button
                            onClick={() => handleReject(connection.id)}
                            disabled={actionLoading === connection.id}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {actionLoading === connection.id ? 'Processando...' : 'Rejeitar'}
                          </button>
                        </>
                      )}

                      {connection.status === 'active' && (
                        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition">
                          💬 Mensagens
                        </button>
                      )}

                      {!isProfessional && connection.status === 'pending' && (
                        <div className="flex-1">
                          <button
                            disabled
                            className="w-full px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium cursor-default opacity-75"
                          >
                            ⏳ Aguardando resposta
                          </button>
                        </div>
                      )}

                      {connection.status === 'rejected' && (
                        <button
                          disabled
                          className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium cursor-default"
                        >
                          ✗ Rejeitado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
