import { useState, useEffect } from 'react'
import { backgroundMusic } from '../../utils/improvedSoundEffects'

interface SoundControlProps {
  className?: string
}

const SoundControl = ({ className = "" }: SoundControlProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)

  // 從 localStorage 讀取設定
  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('multiplication-sound-enabled')
    const savedMusicSetting = localStorage.getItem('multiplication-music-enabled')
    
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting))
    }
    if (savedMusicSetting !== null) {
      setMusicEnabled(JSON.parse(savedMusicSetting))
    }
  }, [])

  // 保存設定到 localStorage
  useEffect(() => {
    localStorage.setItem('multiplication-sound-enabled', JSON.stringify(soundEnabled))
  }, [soundEnabled])

  useEffect(() => {
    localStorage.setItem('multiplication-music-enabled', JSON.stringify(musicEnabled))
    
    // 如果音樂被關閉，停止背景音樂
    if (!musicEnabled) {
      backgroundMusic.stop()
    }
  }, [musicEnabled])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled)
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* 音效控制 */}
      <button
        type="button"
        onClick={toggleSound}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          soundEnabled 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={soundEnabled ? '關閉音效' : '開啟音效'}
      >
        <span className="text-lg">
          {soundEnabled ? '🔊' : '🔇'}
        </span>
        <span className="text-sm font-medium hidden sm:inline">
          音效
        </span>
      </button>

      {/* 音樂控制 */}
      <button
        type="button"
        onClick={toggleMusic}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          musicEnabled 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
        title={musicEnabled ? '關閉背景音樂' : '開啟背景音樂'}
      >
        <span className="text-lg">
          {musicEnabled ? '🎵' : '🎵'}
        </span>
        <span className="text-sm font-medium hidden sm:inline">
          音樂
        </span>
      </button>

      {/* 音量指示器 */}
      <div className="hidden md:flex items-center space-x-1">
        <span className="text-xs text-gray-500">音量</span>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-3 rounded-full transition-colors duration-200 ${
                (soundEnabled || musicEnabled) 
                  ? 'bg-green-400 animate-pulse' 
                  : 'bg-gray-300'
              }`}
              style={{ 
                animationDelay: `${i * 0.1}s`,
                height: `${8 + i * 2}px`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 導出設定狀態供其他組件使用
export const useSoundSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)

  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('multiplication-sound-enabled')
    const savedMusicSetting = localStorage.getItem('multiplication-music-enabled')
    
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting))
    }
    if (savedMusicSetting !== null) {
      setMusicEnabled(JSON.parse(savedMusicSetting))
    }
  }, [])

  return { soundEnabled, musicEnabled }
}

export default SoundControl
