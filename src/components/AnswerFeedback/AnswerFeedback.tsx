import { useEffect, useState } from 'react'

interface AnswerFeedbackProps {
  show: boolean
  isCorrect: boolean
  position?: { x: number; y: number }
  onComplete?: () => void
}

const AnswerFeedback = ({ show, isCorrect, position, onComplete }: AnswerFeedbackProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!visible) return null

  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{
        left: position?.x ? `${position.x}px` : '50%',
        top: position?.y ? `${position.y}px` : '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {isCorrect ? (
        <div className="flex flex-col items-center animate-float-up">
          <div className="text-4xl animate-number-pop">✅</div>
          <div className="mt-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold animate-bounce-gentle">
            正確！
          </div>
          <div className="absolute -inset-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full animate-sparkle"
                style={{
                  left: `${Math.cos((i * 60 * Math.PI) / 180) * 30 + 50}%`,
                  top: `${Math.sin((i * 60 * Math.PI) / 180) * 30 + 50}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-shake-no">
          <div className="text-4xl animate-wiggle">❌</div>
          <div className="mt-2 px-3 py-1 bg-red-400 text-white rounded-full text-sm font-bold">
            再試試！
          </div>
          <div className="absolute -inset-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-300 rounded-full animate-sparkle"
                style={{
                  left: `${Math.cos((i * 90 * Math.PI) / 180) * 20 + 50}%`,
                  top: `${Math.sin((i * 90 * Math.PI) / 180) * 20 + 50}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnswerFeedback
