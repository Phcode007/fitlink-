// src/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            FitLink 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos você aos melhores profissionais de saúde e fitness. 
            Personais trainers e nutricionistas para alcançar seus objetivos.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register/select-type" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Começar Agora
            </Link>
            <Link 
              href="/profissionais" 
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50"
            >
              Encontrar Profissionais
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}