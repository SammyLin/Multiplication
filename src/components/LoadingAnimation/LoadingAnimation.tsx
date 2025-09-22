interface LoadingAnimationProps {
  message?: string
  className?: string
}

const LoadingAnimation = ({ 
  message = "載入中...", 
  className = "" 
}: LoadingAnimationProps) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* 可愛的載入動畫 */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl animate-bounce-gentle">🌟</div>
        </div>
      </div>
      
      {/* 載入點點 */}
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      {/* 載入訊息 */}
      <p className="text-lg font-medium text-midnight animate-pulse">
        {message}
      </p>
      
      {/* 背景星星 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-sparkle"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              fontSize: `${0.8 + (i % 3) * 0.2}rem`
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingAnimation
