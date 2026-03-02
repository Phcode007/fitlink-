'use client'

interface Step {
  number: number
  title: string
  description: string
}

const steps: Step[] = [
  { number: 1, title: 'Dados Pessoais', description: 'Informações básicas' },
  { number: 2, title: 'Dados Físicos', description: 'Altura, peso, etc' },
  { number: 3, title: 'Objetivos', description: 'Metas e nível' },
  { number: 4, title: 'Equipamentos', description: 'O que você tem' },
  { number: 5, title: 'Restrições', description: 'Saúde e alimentação' },
  { number: 6, title: 'Revisão', description: 'Confirme seus dados' },
]

interface OnboardingProgressProps {
  currentStep: number
}

export default function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Barra de progresso */}
        <div className="relative">
          <div className="absolute top-5 w-full h-1 bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${currentStep > step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : currentStep === step.number
                        ? 'border-blue-600 bg-white text-blue-600'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}