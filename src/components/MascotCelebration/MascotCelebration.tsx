import { useEffect, useState } from 'react'
import { type MascotProfile } from '../CuteMascots/CuteMascots'

interface MascotCelebrationProps {
  show: boolean
  mascot: MascotProfile | null
  perfect?: boolean
  onComplete?: () => void
}

const MascotCelebration = ({ show, mascot, perfect = false, onComplete }: MascotCelebrationProps) => {
  const [animationPhase, setAnimationPhase] = useState<'entrance' | 'celebration' | 'exit'>('entrance')

  useEffect(() => {
    if (show && mascot) {
      // 動畫序列：入場 -> 慶祝 -> 退場
      setAnimationPhase('entrance')
      
      const timer1 = setTimeout(() => {
        setAnimationPhase('celebration')
      }, 500)

      const timer2 = setTimeout(() => {
        setAnimationPhase('exit')
      }, 3000)

      const timer3 = setTimeout(() => {
        onComplete?.()
      }, 4000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [show, mascot, onComplete])

  if (!show || !mascot) return null

  const celebrationMessage = perfect ? mascot.celebratePerfect : mascot.celebrate

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 背景光暈效果 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          animationPhase === 'celebration' ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${mascot.gradient.replace('from-', '').replace('to-', '').split(' ')[0]}20, transparent 70%)`
        }}
      />

      {/* 吉祥物動畫 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`transform transition-all duration-1000 ${
            animationPhase === 'entrance' 
              ? 'scale-0 rotate-180 opacity-0 translate-y-20' 
              : animationPhase === 'celebration'
              ? 'scale-110 rotate-0 opacity-100 translate-y-0'
              : 'scale-75 rotate-12 opacity-0 -translate-y-10'
          }`}
        >
          {/* 吉祥物圖片 */}
          <div className="relative">
            <div className={`w-32 h-32 ${animationPhase === 'celebration' ? 'animate-bounce-gentle' : ''}`}>
              {mascot.svg}
            </div>
            
            {/* 慶祝特效 */}
            {animationPhase === 'celebration' && (
              <>
                {/* 旋轉的星星 */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 text-yellow-400 animate-spin-slow"
                    style={{
                      left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 60}%`,
                      top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 60}%`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    ⭐
                  </div>
                ))}
                
                {/* 漂浮的愛心 */}
                {perfect && [...Array(6)].map((_, i) => (
                  <div
                    key={`heart-${i}`}
                    className="absolute w-3 h-3 text-pink-400 animate-float-up"
                    style={{
                      left: `${30 + Math.random() * 40}%`,
                      top: `${30 + Math.random() * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    💖
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 吉祥物對話泡泡 */}
      <div className="absolute inset-x-4 bottom-20 flex justify-center">
        <div 
          className={`max-w-md transform transition-all duration-1000 ${
            animationPhase === 'celebration' 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-75 opacity-0 translate-y-4'
          }`}
        >
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border-2 border-white/50">
            {/* 對話泡泡尾巴 */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-l-2 border-t-2 border-white/50" />
            
            {/* 吉祥物名稱 */}
            <div className="text-center mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${mascot.gradient}`}>
                {mascot.name}
              </span>
            </div>
            
            {/* 慶祝訊息 */}
            <p className="text-center text-gray-800 font-medium leading-relaxed">
              {celebrationMessage}
            </p>
            
            {/* 裝飾元素 */}
            <div className="flex justify-center mt-3 space-x-2">
              {perfect ? (
                <>
                  <span className="text-yellow-500 animate-bounce" style={{ animationDelay: '0s' }}>🏆</span>
                  <span className="text-yellow-500 animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
                  <span className="text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</span>
                </>
              ) : (
                <>
                  <span className="text-green-500 animate-bounce" style={{ animationDelay: '0s' }}>🎈</span>
                  <span className="text-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
                  <span className="text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MascotCelebration
