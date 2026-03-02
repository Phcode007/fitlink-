'use client'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSkip?: () => void
  isSubmitting?: boolean
  nextLabel?: string
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSkip,
  isSubmitting = false,
  nextLabel = 'Continuar',
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Voltar
          </button>
        )}
      </div>
      
      <div className="flex gap-3">
        {onSkip && currentStep < totalSteps && (
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            Pular por agora
          </button>
        )}
        
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span>Salvando...</span>
            </>
          ) : (
            currentStep === totalSteps ? 'Finalizar' : nextLabel
          )}
        </button>
      </div>
    </div>
  )
}