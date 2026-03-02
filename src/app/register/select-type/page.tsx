'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SelectUserType() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bem-vindo ao FitLink
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Escolha como você quer usar a plataforma
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usuário */}
            <div 
              onClick={() => router.push('/register?type=usuario')}
              className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition cursor-pointer text-center"
            >
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-900">Usuário</h3>
              <p className="mt-2 text-sm text-gray-500">
                Quero encontrar profissionais para me ajudar a alcançar meus objetivos
              </p>
              <ul className="mt-4 text-xs text-gray-400 text-left space-y-1">
                <li>✓ Acesso a treinos personalizados</li>
                <li>✓ Planos nutricionais</li>
                <li>✓ Conexão com profissionais</li>
                <li>✓ Acompanhamento de progresso</li>
              </ul>
            </div>

            {/* Personal Trainer */}
            <div 
              onClick={() => router.push('/register/professional?type=personal')}
              className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition cursor-pointer text-center"
            >
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-lg font-medium text-gray-900">Personal Trainer</h3>
              <p className="mt-2 text-sm text-gray-500">
                Quero oferecer meus serviços e gerenciar meus alunos
              </p>
              <ul className="mt-4 text-xs text-gray-400 text-left space-y-1">
                <li>✓ Perfil profissional verificado</li>
                <li>✓ Gestão de alunos</li>
                <li>✓ Criação de treinos</li>
                <li>✓ Acompanhamento de progresso</li>
              </ul>
            </div>

            {/* Nutricionista */}
            <div 
              onClick={() => router.push('/register/professional?type=nutricionista')}
              className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition cursor-pointer text-center"
            >
              <div className="text-5xl mb-4">🥗</div>
              <h3 className="text-lg font-medium text-gray-900">Nutricionista</h3>
              <p className="mt-2 text-sm text-gray-500">
                Quero oferecer consultoria nutricional e acompanhar meus clientes
              </p>
              <ul className="mt-4 text-xs text-gray-400 text-left space-y-1">
                <li>✓ Perfil profissional verificado</li>
                <li>✓ Gestão de pacientes</li>
                <li>✓ Planos alimentares</li>
                <li>✓ Acompanhamento nutricional</li>
              </ul>
            </div>
          </div>

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