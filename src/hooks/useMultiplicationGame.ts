import { useMemo, useReducer } from 'react'
import type { Mission } from '../game/gameTypes'
import { createMission, evaluateAnswer } from '../game/multiplicationEngine'

const QUESTION_COUNT = 9

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
        return {
          ...state,
          status: 'finished',
          answers,
          feedback,
          showCelebration: perfect,
          currentIndex: QUESTION_COUNT - 1,
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
      }
    default:
      return state
  }
}

export const useMultiplicationGame = () => {
  const [state, dispatch] = useReducer(sessionReducer, initialState)

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
    updateMode: (mode: SessionMode) => dispatch({ type: 'UPDATE_MODE', mode }),
    updatePattern: (pattern: QuestionPattern) => dispatch({ type: 'UPDATE_PATTERN', pattern }),
    updateFocusTable: (table: number) => dispatch({ type: 'UPDATE_FOCUS_TABLE', table }),
    startSession: () => dispatch({ type: 'START_SESSION' }),
    submitAnswer: (answer: number) => dispatch({ type: 'SUBMIT_ANSWER', answer }),
    resetToMenu: () => dispatch({ type: 'RESET_TO_MENU' }),
  }
}
