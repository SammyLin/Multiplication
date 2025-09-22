// 音效管理器，支持設定控制
class SoundManager {
  private static instance: SoundManager
  
  private constructor() {}
  
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }
  
  private isSoundEnabled(): boolean {
    const setting = localStorage.getItem('multiplication-sound-enabled')
    return setting === null ? true : JSON.parse(setting)
  }
  
  private isMusicEnabled(): boolean {
    const setting = localStorage.getItem('multiplication-music-enabled')
    return setting === null ? true : JSON.parse(setting)
  }
  
  playSound(soundFunction: () => void): void {
    if (this.isSoundEnabled()) {
      soundFunction()
    }
  }
  
  playMusic(musicFunction: () => void): void {
    if (this.isMusicEnabled()) {
      musicFunction()
    }
  }
  
  stopMusic(stopFunction: () => void): void {
    stopFunction()
  }
}

export const soundManager = SoundManager.getInstance()
