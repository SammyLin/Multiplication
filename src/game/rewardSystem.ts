import { createId } from './id'
import type { GameProgress, Reward, RewardRarity } from './gameTypes'

const REWARD_POOL: Array<Omit<Reward, 'id'>> = [
  { name: '陽光徽章', description: '完成新的乘法列獲得的閃亮徽章。', icon: '🌞', rarity: 'common' },
  { name: '彩虹貼紙', description: '保持 3 題連續答對的紀念貼紙。', icon: '🌈', rarity: 'common' },
  { name: '星際披風', description: '超越最佳連勝的限定披風。', icon: '🦸', rarity: 'rare' },
  { name: '音符吉祥物', description: '用節奏答題贏下的音符寵物。', icon: '🎵', rarity: 'rare' },
  { name: '寶箱鑰匙', description: '打開神秘箱的特殊鑰匙。', icon: '🗝️', rarity: 'epic' },
  { name: '泡泡護盾', description: '在 5 題內零失誤才能獲得的泡泡護盾。', icon: '🫧', rarity: 'epic' },
]

const chooseReward = (rarity: RewardRarity): Reward => {
  const candidates = REWARD_POOL.filter((reward) => reward.rarity === rarity)
  const randomReward = candidates[Math.floor(Math.random() * candidates.length)]

  return {
    id: createId('reward'),
    ...randomReward,
  }
}

export const awardForProgress = (progress: GameProgress): Reward | undefined => {
  if (progress.streak > 0 && progress.streak % 5 === 0) {
    return chooseReward('rare')
  }

  if (progress.bestStreak > 0 && progress.stars > 0 && progress.bestStreak === progress.streak) {
    return chooseReward('epic')
  }

  if (progress.answered > 0 && progress.answered % 4 === 0) {
    return chooseReward('common')
  }

  return undefined
}

export const gainStarsFromStreak = (streak: number, currentStars: number): number => {
  if (streak > 0 && streak % 3 === 0) {
    return currentStars + 1
  }

  return currentStars
}

export const rewardForDailyChallenge = (): Reward =>
  chooseReward(Math.random() > 0.5 ? 'epic' : 'rare')
