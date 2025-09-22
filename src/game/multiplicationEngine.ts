import { createId } from './id'
import type { Mission } from './gameTypes'

const PROMPTS = [
  '幫忙解救被困的小數字朋友！',
  '用你的乘法魔法打開閃耀寶箱。',
  '拯救卡在彩虹橋上的星星隊員。',
  '幫助音符精靈完成歡樂演奏。',
]

const NARRATIVE_HOOKS = [
  '數字王國的河流結冰了，你的答案能融化冰面。',
  '閃閃獎章被鎖住了，只有正確乘法才有鑰匙。',
  '友善的太空狐狸需要燃料飛行，給它正確的能量！',
  '智慧貓頭鷹正在出題考驗你，展示你的超級腦力。',
]

const REWARD_HINTS = [
  '再對 2 題，就能得到泡泡貼紙！',
  '維持連續答對，閃耀星星就會出現。',
  '磨練這一列，限時披風等你拿。',
  '贏得家族排行榜上的愛心讚。',
]

const MIN_TABLE = 2
const MAX_TABLE = 9

const pickFrom = <T,>(items: T[]): T => {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

const createChoices = (answer: number): number[] => {
  const choices = new Set<number>([answer])
  let attempts = 0

  while (choices.size < 4 && attempts < 24) {
    const variance = Math.floor(Math.random() * 5) + 1
    const direction = Math.random() > 0.5 ? 1 : -1
    const value = Math.max(1, answer + variance * direction)
    choices.add(value)
    attempts += 1
  }

  if (choices.size < 4) {
    let offset = 1
    while (choices.size < 4) {
      choices.add(Math.max(1, answer - offset))
      if (choices.size < 4) {
        choices.add(answer + offset)
      }
      offset += 1
    }
  }

  return Array.from(choices)
    .slice(0, 4)
    .sort((a, b) => a - b)
}

export const createMission = (options?: {
  focusTable?: number
  ensureDifferentFrom?: Mission
  multiplierBias?: number
  multiplier?: number
}): Mission => {
  const multiplicand =
    options?.focusTable ?? Math.floor(Math.random() * (MAX_TABLE - MIN_TABLE + 1)) + MIN_TABLE
  let multiplier = options?.multiplier ?? (Math.floor(Math.random() * MAX_TABLE) + 1)

  if (options?.multiplierBias && options.multiplier === undefined && Math.random() > 0.4) {
    multiplier = options.multiplierBias
  }

  if (options?.ensureDifferentFrom && options.multiplier === undefined) {
    const { multiplicand: prevMultiplicand, multiplier: prevMultiplier } = options.ensureDifferentFrom
    if (prevMultiplicand === multiplicand && prevMultiplier === multiplier) {
      multiplier = multiplier === MAX_TABLE ? multiplier - 1 : multiplier + 1
    }
  }

  const answer = multiplicand * multiplier

  return {
    id: createId('mission'),
    multiplicand,
    multiplier,
    answer,
    prompt: pickFrom(PROMPTS),
    narrativeHook: pickFrom(NARRATIVE_HOOKS),
    choices: createChoices(answer),
    focusTable: multiplicand,
    rewardHint: pickFrom(REWARD_HINTS),
  }
}

export const evaluateAnswer = (mission: Mission, suppliedAnswer: number) =>
  suppliedAnswer === mission.answer

export const scheduleReviewMission = (
  mission: Mission,
  delay: number,
): Mission => ({
  ...mission,
  id: createId('review'),
  narrativeHook: `再複習一次 ${mission.multiplicand} x ${mission.multiplier}，你的記憶力會超強！`,
  rewardHint: `完成複習卡可以得到額外練功點。再過 ${delay} 題再遇見它！`,
})
