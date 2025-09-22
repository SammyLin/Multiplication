import { useEffect, useMemo, useReducer, useState } from 'react'
import type { Mission } from '../game/gameTypes'
import { createMission, evaluateAnswer } from '../game/multiplicationEngine'

const QUESTION_COUNT = 9
const LEADERBOARD_STORAGE_KEY = 'multiplication-leaderboard'
const LEADERBOARD_LIMIT = 5
const TARGET_TIME_PER_QUESTION_SECONDS = 4
const MIN_SPEED_MULTIPLIER = 0.6
const MAX_SPEED_MULTIPLIER = 1.6

export type LeaderboardEntry = {
  id: string
  score: number
  correctCount: number
  totalQuestions: number
  durationMs: number
  mode: SessionMode
  createdAt: number
}

export type SessionMode = 'practice' | 'challenge'
export type QuestionPattern = 'random' | 'sequential'
export type SessionStatus = 'setup' | 'playing' | 'finished'

type AttemptRecord = {
  mission: Mission
  suppliedAnswer: number
  isCorrect: boolean
}

type Feedback = {
  type: 'correct' | 'incorrect'
  message: string
}

type SessionState = {
  status: SessionStatus
  mode: SessionMode
  pattern: QuestionPattern
  focusTable: number
  questions: Mission[]
  currentIndex: number
  answers: AttemptRecord[]
  feedback?: Feedback
  showCelebration: boolean
  sessionStartMs: number | null
  completionTimeMs?: number
  completedAt?: number
  score?: number
}

type SessionAction =
  | { type: 'UPDATE_MODE'; mode: SessionMode }
  | { type: 'UPDATE_PATTERN'; pattern: QuestionPattern }
  | { type: 'UPDATE_FOCUS_TABLE'; table: number }
  | { type: 'START_SESSION' }
  | { type: 'SUBMIT_ANSWER'; answer: number }
  | { type: 'RESET_TO_MENU' }

const initialState: SessionState = {
  status: 'setup',
  mode: 'practice',
  pattern: 'random',
  focusTable: 2,
  questions: [],
  currentIndex: 0,
  answers: [],
  feedback: undefined,
  showCelebration: false,
  sessionStartMs: null,
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const calculateScore = (correctCount: number, totalQuestions: number, durationMs?: number) => {
  if (totalQuestions <= 0) {
    return 0
  }

  const accuracyRatio = correctCount / totalQuestions
  const baseScore = Math.round(accuracyRatio * 1000)

  if (durationMs === undefined) {
    return baseScore
  }

  const durationSeconds = durationMs / 1000
  if (durationSeconds <= 0) {
    return Math.round(baseScore * MAX_SPEED_MULTIPLIER)
  }

  const targetTimeSeconds = totalQuestions * TARGET_TIME_PER_QUESTION_SECONDS
  const speedMultiplier = clamp(targetTimeSeconds / durationSeconds, MIN_SPEED_MULTIPLIER, MAX_SPEED_MULTIPLIER)
  return Math.round(baseScore * speedMultiplier)
}

const generateEntryId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const loadLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((item): item is LeaderboardEntry => {
        if (typeof item !== 'object' || item === null) {
          return false
        }
        const candidate = item as LeaderboardEntry
        return (
          typeof candidate.id === 'string' &&
          typeof candidate.score === 'number' &&
          typeof candidate.correctCount === 'number' &&
          typeof candidate.totalQuestions === 'number' &&
          typeof candidate.durationMs === 'number' &&
          typeof candidate.mode === 'string' &&
          typeof candidate.createdAt === 'number'
        )
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score
        }
        if (a.durationMs !== b.durationMs) {
          return a.durationMs - b.durationMs
        }
        return a.createdAt - b.createdAt
      })
      .slice(0, LEADERBOARD_LIMIT)
  } catch (error) {
    console.warn('無法載入排行榜資料', error)
    return []
  }
}

const sortLeaderboard = (a: LeaderboardEntry, b: LeaderboardEntry) => {
  if (b.score !== a.score) {
    return b.score - a.score
  }
  if (a.durationMs !== b.durationMs) {
    return a.durationMs - b.durationMs
  }
  return a.createdAt - b.createdAt
}

const buildSequentialMissions = (focusTable: number): Mission[] => {
  const multipliers = Array.from({ length: QUESTION_COUNT }, (_, index) => index + 1)

  return multipliers.map((multiplier) =>
    createMission({ focusTable, multiplier, ensureDifferentFrom: undefined }),
  )
}

const buildRandomMissions = (): Mission[] => {
  const missions: Mission[] = []
  for (let index = 0; index < QUESTION_COUNT; index += 1) {
    const previous = missions[missions.length - 1]
    missions.push(createMission({ ensureDifferentFrom: previous }))
  }
  return missions
}

const buildQuestionSet = (pattern: QuestionPattern, focusTable: number): Mission[] =>
  pattern === 'sequential' ? buildSequentialMissions(focusTable) : buildRandomMissions()

const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case 'UPDATE_MODE':
      return {
        ...state,
        mode: action.mode,
        // 若切換回練習模式，預設使用隨機出題
        pattern: action.mode === 'practice' ? 'random' : state.pattern,
      }
    case 'UPDATE_PATTERN':
      return {
        ...state,
        pattern: action.pattern,
      }
    case 'UPDATE_FOCUS_TABLE':
      return {
        ...state,
        focusTable: action.table,
      }
    case 'START_SESSION': {
      const questions = buildQuestionSet(state.pattern, state.focusTable).slice(0, QUESTION_COUNT)
      return {
        ...state,
        status: 'playing',
        questions,
        currentIndex: 0,
        answers: [],
        feedback: undefined,
        showCelebration: false,
        sessionStartMs: Date.now(),
        completionTimeMs: undefined,
        completedAt: undefined,
        score: undefined,
      }
    }
    case 'SUBMIT_ANSWER': {
      if (state.status !== 'playing') {
        return state
      }

      const mission = state.questions[state.currentIndex]
      const isCorrect = evaluateAnswer(mission, action.answer)
      const attempt: AttemptRecord = {
        mission,
        suppliedAnswer: action.answer,
        isCorrect,
      }
      const answers = [...state.answers, attempt]
      const nextIndex = state.currentIndex + 1
      const feedback: Feedback = isCorrect
        ? { type: 'correct', message: '太棒了！答對囉！' }
        : {
            type: 'incorrect',
            message: `可惜了！正確答案是 ${mission.answer}`,
          }

      if (nextIndex >= QUESTION_COUNT) {
        const perfect = answers.every((answer) => answer.isCorrect) && answers.length === QUESTION_COUNT
        const completedAt = Date.now()
        const completionTimeMs = state.sessionStartMs !== null ? completedAt - state.sessionStartMs : undefined
        const correctCount = answers.filter((answer) => answer.isCorrect).length
        const score = calculateScore(correctCount, QUESTION_COUNT, completionTimeMs)
        return {
          ...state,
          status: 'finished',
          answers,
          feedback,
          showCelebration: perfect,
          currentIndex: QUESTION_COUNT - 1,
          completionTimeMs,
          completedAt,
          score,
        }
      }

      return {
        ...state,
        currentIndex: nextIndex,
        answers,
        feedback,
      }
    }
    case 'RESET_TO_MENU':
      return {
        ...state,
        status: 'setup',
        questions: [],
        currentIndex: 0,
        answers: [],
        feedback: undefined,
        showCelebration: false,
        sessionStartMs: null,
        completionTimeMs: undefined,
        completedAt: undefined,
        score: undefined,
      }
    default:
      return state
  }
}

export const useMultiplicationGame = () => {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard())

  useEffect(() => {
    if (
      state.status !== 'finished' ||
      state.score === undefined ||
      state.completionTimeMs === undefined ||
      state.completedAt === undefined
    ) {
      return
    }

    const correctAnswers = state.answers.filter((attempt) => attempt.isCorrect).length

    setLeaderboard((previous) => {
      if (previous.some((entry) => entry.createdAt === state.completedAt)) {
        return previous
      }

      const entry: LeaderboardEntry = {
        id: generateEntryId(),
        score: state.score ?? 0,
        correctCount: correctAnswers,
        totalQuestions: QUESTION_COUNT,
        durationMs: state.completionTimeMs ?? 0,
        mode: state.mode,
        createdAt: state.completedAt,
      }

      const updated = [...previous, entry].sort(sortLeaderboard).slice(0, LEADERBOARD_LIMIT)

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated))
        } catch (error) {
          console.warn('無法儲存排行榜資料', error)
        }
      }

      return updated
    })
  }, [state])

  const currentMission = useMemo(() => {
    if (state.status !== 'playing') {
      return undefined
    }
    return state.questions[state.currentIndex]
  }, [state.status, state.questions, state.currentIndex])

  const correctCount = useMemo(
    () => state.answers.filter((attempt) => attempt.isCorrect).length,
    [state.answers],
  )

  const progress = useMemo(() => {
    if (state.status !== 'playing') {
      return { current: 0, total: QUESTION_COUNT }
    }

    return {
      current: state.currentIndex + 1,
      total: QUESTION_COUNT,
    }
  }, [state.status, state.currentIndex])

  const perfect = state.showCelebration

  const answers = state.answers

  return {
    state,
    currentMission,
    progress,
    correctCount,
    perfect,
    answers,
    score: state.score,
    completionTimeMs: state.completionTimeMs,
    leaderboard,
    updateMode: (mode: SessionMode) => dispatch({ type: 'UPDATE_MODE', mode }),
    updatePattern: (pattern: QuestionPattern) => dispatch({ type: 'UPDATE_PATTERN', pattern }),
    updateFocusTable: (table: number) => dispatch({ type: 'UPDATE_FOCUS_TABLE', table }),
    startSession: () => dispatch({ type: 'START_SESSION' }),
    submitAnswer: (answer: number) => dispatch({ type: 'SUBMIT_ANSWER', answer }),
    resetToMenu: () => dispatch({ type: 'RESET_TO_MENU' }),
  }
}
