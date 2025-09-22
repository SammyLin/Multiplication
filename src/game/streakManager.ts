import type { GameProgress } from './gameTypes'

export const updateProgressOnCorrect = (progress: GameProgress, focusTable: number) => {
  const unlocked = new Set(progress.unlockedTables)
  unlocked.add(focusTable)

  return {
    ...progress,
    answered: progress.answered + 1,
    correct: progress.correct + 1,
    streak: progress.streak + 1,
    bestStreak: Math.max(progress.bestStreak, progress.streak + 1),
    unlockedTables: Array.from(unlocked).sort((a, b) => a - b),
  }
}

export const updateProgressOnMiss = (progress: GameProgress) => ({
  ...progress,
  answered: progress.answered + 1,
  incorrect: progress.incorrect + 1,
  streak: 0,
})
