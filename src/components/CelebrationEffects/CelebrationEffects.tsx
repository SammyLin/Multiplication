import { useEffect, useState } from 'react'

interface CelebrationEffectsProps {
  show: boolean
  perfect?: boolean
  onComplete?: () => void
}

const CelebrationEffects = ({ show, perfect = false, onComplete }: CelebrationEffectsProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (show) {
      // 生成隨機粒子位置
      const newParticles = Array.from({ length: perfect ? 20 : 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      // 動畫完成後清理
      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, perfect, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 背景閃光效果 */}
      <div 
        className={`absolute inset-0 ${perfect ? 'bg-gradient-to-r from-yellow-200/30 via-pink-200/30 to-purple-200/30' : 'bg-gradient-to-r from-blue-200/20 to-green-200/20'} animate-pulse-glow`}
        style={{ animationDuration: '1s', animationIterationCount: '3' }}
      />
      
      {/* 粒子效果 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-celebration-burst"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {perfect ? (
            <div className="text-2xl">
              {['🌟', '✨', '🎉', '🎊', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ) : (
            <div className="text-xl">
              {['⭐', '✨', '🎈'][Math.floor(Math.random() * 3)]}
            </div>
          )}
        </div>
      ))}

      {/* 中央慶祝文字 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-bounce-gentle">
          {perfect ? (
            <div className="space-y-2">
              <div className="text-6xl animate-number-pop">🏆</div>
              <div className="text-2xl font-bold text-yellow-600 animate-pulse-glow">
                完美！
              </div>
              <div className="text-lg text-yellow-500">
                全部答對了！
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-5xl animate-number-pop">🎉</div>
              <div className="text-xl font-bold text-green-600 animate-pulse-glow">
                太棒了！
              </div>
              <div className="text-lg text-green-500">
                任務完成！
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 彩虹邊框效果（僅完美分數時顯示） */}
      {perfect && (
        <div className="absolute inset-4 border-4 rounded-3xl animate-rainbow-border pointer-events-none" />
      )}
    </div>
  )
}

export default CelebrationEffects
