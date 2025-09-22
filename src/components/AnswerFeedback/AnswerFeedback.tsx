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
          <img 
            src="/images/cute-correct-icon.png" 
            alt="正確！" 
            className="w-16 h-16 animate-number-pop"
          />
          <div className="mt-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-sm font-bold animate-bounce-gentle shadow-lg">
            太棒了！正確！
          </div>
          <div className="absolute -inset-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-sparkle"
                style={{
                  left: `${Math.cos((i * 45 * Math.PI) / 180) * 40 + 50}%`,
                  top: `${Math.sin((i * 45 * Math.PI) / 180) * 40 + 50}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-shake-no">
          <img 
            src="/images/cute-wrong-icon.png" 
            alt="再試試！" 
            className="w-16 h-16 animate-wiggle"
          />
          <div className="mt-2 px-4 py-2 bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-full text-sm font-bold shadow-lg">
            沒關係，再試一次！
          </div>
          <div className="absolute -inset-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-pink-300 rounded-full animate-sparkle opacity-70"
                style={{
                  left: `${Math.cos((i * 60 * Math.PI) / 180) * 25 + 50}%`,
                  top: `${Math.sin((i * 60 * Math.PI) / 180) * 25 + 50}%`,
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
