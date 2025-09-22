interface ProgressIndicatorProps {
  current: number
  total: number
  correctCount: number
}

const ProgressIndicator = ({ current, total, correctCount }: ProgressIndicatorProps) => {
  const progressPercentage = (current / total) * 100
  const accuracyPercentage = current > 0 ? (correctCount / current) * 100 : 0

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* 主進度條 */}
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-midnight">
            進度: {current}/{total}
          </span>
          <span className="text-sm font-medium text-midnight">
            正確率: {Math.round(accuracyPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="progress-bar h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 星星進度指示器 */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: total }, (_, index) => {
          const questionNumber = index + 1
          const isAnswered = questionNumber <= current
          const isCorrect = questionNumber <= correctCount
          
          return (
            <div
              key={index}
              className={`relative transition-all duration-300 ${
                isAnswered ? 'animate-bounce-gentle' : ''
              }`}
            >
              {isAnswered ? (
                isCorrect ? (
                  <div className="text-2xl animate-sparkle">⭐</div>
                ) : (
                  <div className="text-2xl opacity-50">💫</div>
                )
              ) : (
                <div className="text-2xl opacity-30">☆</div>
              )}
              
              {/* 題號 */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-midnight/70">
                {questionNumber}
              </div>
            </div>
          )
        })}
      </div>

      {/* 鼓勵訊息 */}
      <div className="text-center">
        {current === 0 && (
          <p className="text-sm text-midnight/70 animate-pulse">
            準備好了嗎？開始挑戰吧！ 🚀
          </p>
        )}
        {current > 0 && current < total && (
          <p className="text-sm text-midnight/70">
            {accuracyPercentage >= 80 ? (
              <span className="text-green-600 font-medium animate-pulse-glow">
                表現很棒！繼續加油！ 🌟
              </span>
            ) : accuracyPercentage >= 60 ? (
              <span className="text-blue-600 font-medium">
                不錯哦！再仔細一點！ 💪
              </span>
            ) : (
              <span className="text-orange-600 font-medium">
                慢慢來，你可以的！ 🤗
              </span>
            )}
          </p>
        )}
        {current === total && (
          <p className="text-sm font-bold animate-bounce-gentle">
            {accuracyPercentage === 100 ? (
              <span className="text-yellow-600">完美！你是乘法高手！ 🏆</span>
            ) : accuracyPercentage >= 80 ? (
              <span className="text-green-600">太棒了！完成挑戰！ 🎉</span>
            ) : (
              <span className="text-blue-600">完成了！下次會更好！ 👏</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProgressIndicator
