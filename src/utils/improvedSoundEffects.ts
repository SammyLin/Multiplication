let audioContext: AudioContext | null = null

const isAudioSupported = () =>
  typeof window !== 'undefined' &&
  (window.AudioContext || (window as unknown as { webkitAudioContext?: AudioContext }).webkitAudioContext)

const getContext = () => {
  if (!isAudioSupported()) return null
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new AudioCtx({ latencyHint: 'interactive' })
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume().catch(() => {
      // ignore resume errors, often caused by autoplay restrictions
    })
  }

  return audioContext
}

// 創建更悅耳的音符序列
const createMelodyNote = (
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.3,
  waveType: OscillatorType = 'sine'
) => {
  const ctx = getContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.type = waveType
  oscillator.frequency.setValueAtTime(frequency, startTime)
  
  // 更柔和的音量包絡
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

// 創建和弦音效
const createChord = (frequencies: number[], startTime: number, duration: number, volume: number = 0.2) => {
  frequencies.forEach(freq => {
    createMelodyNote(freq, startTime, duration, volume / frequencies.length, 'sine')
  })
}

// 成功音效 - 愉快的上升音階
export const playSuccessChime = () => {
  const ctx = getContext()
  if (!ctx) return
  
  const now = ctx.currentTime
  const notes = [523.25, 659.25, 783.99] // C5, E5, G5 - 大三和弦
  
  notes.forEach((freq, index) => {
    createMelodyNote(freq, now + index * 0.1, 0.4, 0.25, 'sine')
  })
}

// 錯誤音效 - 溫和的提示音，不會讓孩子沮喪
export const playSubtleMiss = () => {
  const ctx = getContext()
  if (!ctx) return
  
  const now = ctx.currentTime
  // 使用較低的音調，更溫和
  createMelodyNote(349.23, now, 0.3, 0.15, 'sine') // F4
  createMelodyNote(293.66, now + 0.15, 0.3, 0.15, 'sine') // D4
}

// 慶祝音效 - 歡快的旋律
export const playCelebrationFanfare = (perfect: boolean) => {
  const ctx = getContext()
  if (!ctx) return
  
  const now = ctx.currentTime
  
  if (perfect) {
    // 完美分數 - 更豐富的慶祝音樂
    const melody = [
      { freq: 523.25, time: 0, duration: 0.3 },    // C5
      { freq: 659.25, time: 0.2, duration: 0.3 },  // E5
      { freq: 783.99, time: 0.4, duration: 0.3 },  // G5
      { freq: 1046.5, time: 0.6, duration: 0.5 },  // C6
    ]
    
    melody.forEach(note => {
      createMelodyNote(note.freq, now + note.time, note.duration, 0.3, 'sine')
    })
    
    // 添加和弦背景
    setTimeout(() => {
      createChord([523.25, 659.25, 783.99], now + 0.8, 0.8, 0.2) // C大三和弦
    }, 800)
    
  } else {
    // 一般完成 - 簡單愉快的音效
    const melody = [
      { freq: 523.25, time: 0, duration: 0.25 },   // C5
      { freq: 659.25, time: 0.15, duration: 0.25 }, // E5
      { freq: 783.99, time: 0.3, duration: 0.4 },   // G5
    ]
    
    melody.forEach(note => {
      createMelodyNote(note.freq, now + note.time, note.duration, 0.25, 'sine')
    })
  }
}

// 按鈕點擊音效
export const playButtonClick = () => {
  const ctx = getContext()
  if (!ctx) return
  
  const now = ctx.currentTime
  createMelodyNote(880, now, 0.1, 0.2, 'sine') // A5 短促清脆
}

// 選擇音效
export const playSelectSound = () => {
  const ctx = getContext()
  if (!ctx) return
  
  const now = ctx.currentTime
  createMelodyNote(1174.66, now, 0.15, 0.2, 'sine') // D6
}

// 背景音樂類
class BackgroundMusic {
  private ctx: AudioContext | null = null
  private isPlaying = false
  private currentGain: GainNode | null = null
  private musicLoop: number | null = null

  constructor() {
    this.ctx = getContext()
  }

  // 播放輕鬆的背景音樂
  playPracticeMusic() {
    if (!this.ctx || this.isPlaying) return
    
    this.isPlaying = true
    this.currentGain = this.ctx.createGain()
    this.currentGain.gain.setValueAtTime(0.1, this.ctx.currentTime) // 很低的音量
    this.currentGain.connect(this.ctx.destination)
    
    const playMelodyLoop = () => {
      if (!this.isPlaying || !this.ctx || !this.currentGain) return
      
      const now = this.ctx.currentTime
      const melody = [
        523.25, 587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33 // C-D-E-F-G-F-E-D
      ]
      
      melody.forEach((freq, index) => {
        const oscillator = this.ctx!.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq, now + index * 0.5)
        oscillator.connect(this.currentGain!)
        oscillator.start(now + index * 0.5)
        oscillator.stop(now + index * 0.5 + 0.4)
      })
      
      // 每8秒重複一次
      this.musicLoop = window.setTimeout(playMelodyLoop, 8000)
    }
    
    playMelodyLoop()
  }

  // 播放挑戰模式音樂 - 稍微快一點的節奏
  playChallengeMusic() {
    if (!this.ctx || this.isPlaying) return
    
    this.isPlaying = true
    this.currentGain = this.ctx.createGain()
    this.currentGain.gain.setValueAtTime(0.08, this.ctx.currentTime)
    this.currentGain.connect(this.ctx.destination)
    
    const playRhythmLoop = () => {
      if (!this.isPlaying || !this.ctx || !this.currentGain) return
      
      const now = this.ctx.currentTime
      const pattern = [
        { freq: 440, time: 0, duration: 0.2 },     // A4
        { freq: 523.25, time: 0.4, duration: 0.2 }, // C5
        { freq: 659.25, time: 0.8, duration: 0.2 }, // E5
        { freq: 523.25, time: 1.2, duration: 0.2 }, // C5
      ]
      
      pattern.forEach(note => {
        const oscillator = this.ctx!.createOscillator()
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(note.freq, now + note.time)
        oscillator.connect(this.currentGain!)
        oscillator.start(now + note.time)
        oscillator.stop(now + note.time + note.duration)
      })
      
      // 每2秒重複一次
      this.musicLoop = window.setTimeout(playRhythmLoop, 2000)
    }
    
    playRhythmLoop()
  }

  stop() {
    this.isPlaying = false
    if (this.musicLoop) {
      clearTimeout(this.musicLoop)
      this.musicLoop = null
    }
    if (this.currentGain) {
      this.currentGain.disconnect()
      this.currentGain = null
    }
  }

  fadeOut(duration: number = 1) {
    if (!this.currentGain || !this.ctx) return
    
    const now = this.ctx.currentTime
    this.currentGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    
    setTimeout(() => {
      this.stop()
    }, duration * 1000)
  }
}

// 全域背景音樂實例
export const backgroundMusic = new BackgroundMusic()

export const triggerUserGestureAudio = async () => {
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch (error) {
      // ignore resume failure
    }
  }
}

// 音效函數已在上面單獨導出，不需要重複導出
