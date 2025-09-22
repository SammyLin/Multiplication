import type { AttemptRecord, GameInsights, GameProgress } from './gameTypes'

export const buildInsights = (
  timeline: AttemptRecord[],
  progress: GameProgress,
  startedAt: number,
): GameInsights => {
  const tableBuckets = new Map<number, { correct: number; total: number }>()

  timeline.forEach((attempt) => {
    const bucket = tableBuckets.get(attempt.multiplicand) ?? { correct: 0, total: 0 }
    bucket.total += 1
    if (attempt.isCorrect) {
      bucket.correct += 1
    }
    tableBuckets.set(attempt.multiplicand, bucket)
  })

  let lowestAccuracyTable = 1
  let lowestAccuracy = 1

  const focusTables = Array.from(tableBuckets.entries()).map(([table, record]) => {
    const accuracy = record.total === 0 ? 0 : record.correct / record.total
    if (accuracy < lowestAccuracy) {
      lowestAccuracy = accuracy
      lowestAccuracyTable = table
    }

    return {
      table,
      accuracy: Math.round(accuracy * 100) / 100,
    }
  })

  const elapsed = Math.max(Date.now() - startedAt, 1)
  const minutes = Math.round((elapsed / 60000) * 10) / 10

  return {
    accuracy:
      progress.answered === 0 ? 0 : Math.round((progress.correct / progress.answered) * 100) / 100,
    timeSpentMinutes: minutes,
    focusTables,
    nextRecommendedTable: lowestAccuracyTable,
    recentWeakSpot: lowestAccuracy < 0.7 ? lowestAccuracyTable : undefined,
  }
}
