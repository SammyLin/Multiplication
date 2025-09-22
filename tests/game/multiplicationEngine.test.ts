import { describe, expect, it, vi, afterEach } from 'vitest'
import { createMission, evaluateAnswer } from '../../src/game/multiplicationEngine'

describe('multiplicationEngine', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a mission with consistent choices that include the answer', () => {
    const mission = createMission({ focusTable: 3 })
    expect(mission.choices).toContain(mission.answer)
    expect(new Set(mission.choices).size).toBe(mission.choices.length)
  })

  it('allows specifying a fixed multiplier for sequential missions', () => {
    const mission = createMission({ focusTable: 2, multiplier: 5 })
    expect(mission.multiplicand).toBe(2)
    expect(mission.multiplier).toBe(5)
    expect(mission.answer).toBe(10)
  })

  it('evaluates answers correctly', () => {
    const mission = createMission({ focusTable: 4, multiplier: 7 })
    expect(evaluateAnswer(mission, mission.answer)).toBe(true)
    expect(evaluateAnswer(mission, mission.answer + 1)).toBe(false)
  })
})
