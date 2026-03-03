'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">FitLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {profile?.full_name || 'Usuário'}</span>
              <button className="text-gray-500 hover:text-gray-700">Sair</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card Treinos */}
            <Link href="/treinos" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Treinos</dt>
                      <dd className="text-lg font-medium text-gray-900">Ver planos</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card Nutrição */}
            <Link href="/nutricao" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Nutrição</dt>
                      <dd className="text-lg font-medium text-gray-900">Ver plano</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card Progresso */}
            <Link href="/progresso" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Progresso</dt>
                      <dd className="text-lg font-medium text-gray-900">Ver evolução</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card Conexões */}
            <Link href="/conexoes" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292m0 0H8.646a4 4 0 010-5.292m3.354-6.354a4 4 0 100 5.292m0 0H15.354a4 4 0 000-5.292m-11.354 11.354L7.5 9m0 0L9 7.5m-1.5 1.5a4 4 0 110 5.292m0 0H8.646a4 4 0 010-5.292m1.5 6.792L7.5 15m1.5-1.5L9 16.5" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Conexões</dt>
                      <dd className="text-lg font-medium text-gray-900">Gerenciar</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}