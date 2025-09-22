import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { useMultiplicationGame } from '../../src/hooks/useMultiplicationGame'

describe('useMultiplicationGame', () => {
  let mockedNow: number

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25)
    mockedNow = 0
    vi.spyOn(Date, 'now').mockImplementation(() => mockedNow)
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('starts a practice session with 9 questions and skips table 1', () => {
    const { result } = renderHook(() => useMultiplicationGame())

    act(() => {
      mockedNow = 1_000
      result.current.startSession()
    })

    expect(result.current.state.status).toBe('playing')
    expect(result.current.state.questions).toHaveLength(9)
    expect(result.current.state.questions.every((mission) => mission.multiplicand >= 2)).toBe(true)
    expect(result.current.progress.current).toBe(1)
  })

  it('creates sequential missions for a chosen table', () => {
    const { result } = renderHook(() => useMultiplicationGame())

    act(() => {
      result.current.updatePattern('sequential')
      result.current.updateFocusTable(3)
      result.current.startSession()
    })

    const multiplicands = result.current.state.questions.map((mission) => mission.multiplicand)
    const multipliers = result.current.state.questions.map((mission) => mission.multiplier)

    expect(new Set(multiplicands)).toEqual(new Set([3]))
    expect(multipliers).toHaveLength(9)
    expect(multipliers[0]).toBe(1)
    expect(multipliers.at(-1)).toBe(9)
  })

  it('tracks answers and marks perfect sessions for challenge mode', () => {
    const { result } = renderHook(() => useMultiplicationGame())

    act(() => {
      mockedNow = 1_000
      result.current.updateMode('challenge')
      result.current.updatePattern('sequential')
      result.current.updateFocusTable(2)
      result.current.startSession()
    })

    for (let index = 0; index < 9; index += 1) {
      const mission = result.current.state.questions[result.current.state.currentIndex]
      act(() => {
        mockedNow += 1_000
        result.current.submitAnswer(mission.answer)
      })
    }

    expect(result.current.state.status).toBe('finished')
    expect(result.current.perfect).toBe(true)
    expect(result.current.correctCount).toBe(9)
  })

  it('calculates time-aware scores and records leaderboard entries', async () => {
    const { result } = renderHook(() => useMultiplicationGame())

    act(() => {
      mockedNow = 5_000
      result.current.startSession()
    })

    for (let index = 0; index < 8; index += 1) {
      const mission = result.current.state.questions[result.current.state.currentIndex]
      act(() => {
        mockedNow += 2_000
        result.current.submitAnswer(mission.answer)
      })
    }

    const finalMission = result.current.state.questions[result.current.state.currentIndex]

    act(() => {
      mockedNow = 50_000
      result.current.submitAnswer(finalMission.answer)
    })

    expect(result.current.state.status).toBe('finished')
    expect(result.current.score).toBe(800)
    expect(result.current.completionTimeMs).toBe(45_000)

    await waitFor(() => expect(result.current.leaderboard).toHaveLength(1))

    const entry = result.current.leaderboard[0]
    expect(entry.score).toBe(800)
    expect(entry.durationMs).toBe(45_000)
    expect(entry.correctCount).toBe(9)
  })
})
