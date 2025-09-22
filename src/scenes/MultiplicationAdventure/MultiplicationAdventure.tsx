import { useEffect, useRef, useState } from 'react'
import MissionPanel from '../../components/MissionPanel/MissionPanel'
import { type MascotProfile } from '../../components/CuteMascots/CuteMascots'
import CelebrationEffects from '../../components/CelebrationEffects/CelebrationEffects'
import AnswerFeedback from '../../components/AnswerFeedback/AnswerFeedback'
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator'
import MascotCelebration from '../../components/MascotCelebration/MascotCelebration'
// import CuteButton from '../../components/CuteButton/CuteButton'
import SoundControl from '../../components/SoundControl/SoundControl'
import { useMultiplicationGame } from '../../hooks/useMultiplicationGame'
import {
  playCelebrationFanfare,
  playSubtleMiss,
  playSuccessChime,
  triggerUserGestureAudio,
  playButtonClick,

  backgroundMusic,
} from '../../utils/improvedSoundEffects'
import { soundManager } from '../../utils/soundManager'

const tableOptions = Array.from({ length: 8 }, (_, index) => index + 2)

const MultiplicationAdventure = () => {
  // 小海豹吉祥物資料
  const whiteSealMascot: MascotProfile = {
    id: 'white-seal',
    name: '小海豹',
    title: '乘法小夥伴',
    subtitle: '一起征服九九乘法表！',
    gradient: 'from-purple-400 to-pink-500',
    greeting: '嗨！我是小海豹，準備好和我一起挑戰乘法冒險了嗎？',
    encourage: '別擔心，小海豹相信你一定可以的！加油！',
    celebrate: '太棒了！小海豹為你感到超級驕傲！',
    celebratePerfect: '哇！完美表現！小海豹要為你戴上勝利的皇冠！',
    svg: (
      <img 
        src="/images/cute-white-leopard-mascot.png" 
        alt="小海豹" 
        className="w-20 h-20 object-contain animate-bounce-gentle"
      />
    ),
  }

  const {
    state,
    progress,
    correctCount,
    perfect,
    answers,
    currentMission,
    updateMode,
    updatePattern,
    updateFocusTable,
    startSession,
    submitAnswer,
    resetToMenu,
    score,
    completionTimeMs,
    leaderboard,
  } = useMultiplicationGame()

  // 固定使用小海豹作為唯一吉祥物
  const [showCelebration, setShowCelebration] = useState(false)
  const [showMascotCelebration, setShowMascotCelebration] = useState(false)
  const [answerFeedback, setAnswerFeedback] = useState<{
    show: boolean
    isCorrect: boolean
    position: { x: number; y: number } | null
  }>({ show: false, isCorrect: false, position: null })
  
  const answerCountRef = useRef(0)
  const previousStatusRef = useRef(state.status)

  const incorrectAnswers = answers.filter((attempt) => !attempt.isCorrect)

  const formatDuration = (duration?: number) => {
    if (duration === undefined) {
      return '—'
    }

    const totalSeconds = duration / 1000

    if (totalSeconds < 60) {
      const display = totalSeconds >= 10 ? Math.round(totalSeconds) : Number(totalSeconds.toFixed(1))
      return `${display} 秒`
    }

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)
    return `${minutes} 分 ${seconds.toString().padStart(2, '0')} 秒`
  }

  const formattedDuration = formatDuration(completionTimeMs)
  const displayedScore =
    score ?? Math.round((correctCount / Math.max(progress.total, 1)) * 1000)
  const latestEntryId =
    state.status === 'finished' && state.completedAt
      ? leaderboard.find((entry) => entry.createdAt === state.completedAt)?.id
      : undefined

  const handleStartSession = () => {
    soundManager.playSound(() => playButtonClick())
    void triggerUserGestureAudio()
    startSession()
    
    // 根據模式播放不同的背景音樂
    if (state.mode === 'practice') {
      soundManager.playMusic(() => backgroundMusic.playPracticeMusic())
    } else {
      soundManager.playMusic(() => backgroundMusic.playChallengeMusic())
    }
  }

  const handleRetry = () => {
    soundManager.playSound(() => playButtonClick())
    void triggerUserGestureAudio()
    startSession()
    
    // 根據模式播放不同的背景音樂
    if (state.mode === 'practice') {
      soundManager.playMusic(() => backgroundMusic.playPracticeMusic())
    } else {
      soundManager.playMusic(() => backgroundMusic.playChallengeMusic())
    }
  }

  useEffect(() => {
    if (state.status !== 'playing') {
      answerCountRef.current = answers.length
      return
    }

    if (answers.length > answerCountRef.current) {
      const latest = answers.at(-1)
      if (latest) {
        if (latest.isCorrect) {
          playSuccessChime()
        } else {
          playSubtleMiss()
        }
        
        // 顯示答題反饋動畫
        setAnswerFeedback({
          show: true,
          isCorrect: latest.isCorrect,
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        })
        
        // 清除反饋動畫
        setTimeout(() => {
          setAnswerFeedback(prev => ({ ...prev, show: false }))
        }, 1500)
      }
      answerCountRef.current = answers.length
    }
  }, [answers, state.status])

  useEffect(() => {
    if (state.status === 'finished' && previousStatusRef.current !== 'finished') {
      backgroundMusic.fadeOut(1) // 淡出背景音樂
      playCelebrationFanfare(perfect)
      
      // 顯示慶祝動畫
      setShowCelebration(true)
      
      // 延遲顯示吉祥物慶祝動畫
      setTimeout(() => {
        setShowMascotCelebration(true)
      }, 1000)
      
      // 5秒後自動隱藏慶祝動畫
      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
    }
    previousStatusRef.current = state.status
  }, [state.status, perfect])

  // 組件卸載時停止背景音樂
  useEffect(() => {
    return () => {
      backgroundMusic.stop()
    }
  }, [])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="text-center relative">
        <h1 className="text-3xl font-display text-midnight">小海豹九九乘法表挑戰遊戲</h1>
        <p className="text-sm text-midnight/75">一次 9 題，挑戰你的乘法英雄力！</p>
        
        {/* 音效控制 */}
        <div className="absolute top-0 right-0">
          <SoundControl />
        </div>
      </header>

      {state.status === 'setup' && (
        <section className="grid gap-6 rounded-hero bg-white/90 p-6 shadow-soft">
          {/* 小海豹歡迎區域 */}
          <div className="flex items-center gap-4 rounded-hero bg-gradient-to-r from-purple-100 to-pink-100 p-4">
            <div className="flex-shrink-0">
              {whiteSealMascot.svg}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-midnight">{whiteSealMascot.name}</h3>
              <p className="text-sm font-medium text-midnight/80">{whiteSealMascot.greeting}</p>
              <p className="text-sm text-midnight/70">{whiteSealMascot.encourage}</p>
            </div>
          </div>

          <div className="grid gap-3 text-left">
            <h2 className="text-xl font-display text-midnight">選擇練習方式</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className={`rounded-2xl border-2 px-4 py-5 text-left transition ${
                  state.mode === 'practice'
                    ? 'border-sunrise bg-sunrise/15'
                    : 'border-transparent bg-soft-gray'
                }`}
                onClick={() => {
                  playButtonClick()
                  updateMode('practice')
                }}
                data-testid="mul-mode-practice"
              >
                <p className="text-lg font-bold text-midnight">練習模式</p>
                <p className="text-sm text-midnight/70">四個選項中找出正確答案。</p>
              </button>
              <button
                type="button"
                className={`rounded-2xl border-2 px-4 py-5 text-left transition ${
                  state.mode === 'challenge'
                    ? 'border-lagoon bg-lagoon/15'
                    : 'border-transparent bg-soft-gray'
                }`}
                onClick={() => {
                  playButtonClick()
                  updateMode('challenge')
                }}
                data-testid="mul-mode-challenge"
              >
                <p className="text-lg font-bold text-midnight">挑戰模式</p>
                <p className="text-sm text-midnight/70">使用數字鍵盤打出答案。</p>
              </button>
            </div>

            <div
              className="grid gap-3 rounded-hero bg-cream/70 p-4 text-sm text-midnight shadow-soft sm:grid-cols-2"
              data-testid="mul-mode-instructions"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-leaf/30 text-2xl">
                  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
                    <rect x="8" y="14" width="48" height="36" rx="10" fill="#6ec07c" />
                    <circle cx="22" cy="32" r="7" fill="#fff" />
                    <circle cx="42" cy="32" r="7" fill="#fff" />
                    <circle cx="22" cy="32" r="3.5" fill="#2f4f2f" />
                    <circle cx="42" cy="32" r="3.5" fill="#2f4f2f" />
                    <path d="M24 43 Q32 48 40 43" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">練習模式</p>
                  <p className="text-midnight/70">點選 4 個選項中的正確答案，適合暖身與複習。</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative grid h-12 w-12 place-items-center rounded-full bg-sky/30 text-2xl">
                  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
                    <rect x="10" y="8" width="44" height="48" rx="6" fill="#5b9bd5" />
                    <rect x="18" y="18" width="28" height="6" rx="3" fill="#d9f1ff" />
                    <rect x="18" y="28" width="9" height="9" rx="2" fill="#d9f1ff" />
                    <rect x="28" y="28" width="9" height="9" rx="2" fill="#d9f1ff" />
                    <rect x="38" y="28" width="9" height="9" rx="2" fill="#d9f1ff" />
                    <rect x="18" y="38" width="9" height="9" rx="2" fill="#d9f1ff" />
                    <rect x="28" y="38" width="9" height="9" rx="2" fill="#d9f1ff" />
                    <rect x="38" y="38" width="9" height="9" rx="2" fill="#d9f1ff" />
                    <rect x="28" y="48" width="9" height="6" rx="3" fill="#d9f1ff" />
                  </svg>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sunrise text-xs font-bold text-white">
                    ⌨
                  </span>
                </div>
                <div>
                  <p className="font-semibold">挑戰模式</p>
                  <p className="text-midnight/70">用螢幕數字鍵或實體鍵盤輸入答案，鍛鍊速度與記憶。</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <h3 className="text-lg font-display text-midnight">出題方式</h3>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  state.pattern === 'random'
                    ? 'bg-lagoon text-white shadow-soft'
                    : 'bg-soft-gray text-midnight'
                }`}
                onClick={() => updatePattern('random')}
                data-testid="mul-pattern-random"
              >
                隨機出題
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  state.pattern === 'sequential'
                    ? 'bg-lagoon text-white shadow-soft'
                    : 'bg-soft-gray text-midnight'
                }`}
                onClick={() => updatePattern('sequential')}
                data-testid="mul-pattern-sequential"
              >
                依序挑戰
              </button>
            </div>
            {state.pattern === 'sequential' && (
              <div className="grid gap-2">
                <p className="text-sm font-semibold text-midnight">選擇想練習的乘法表</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {tableOptions.map((table) => (
                    <button
                      key={table}
                      type="button"
                      className={`rounded-xl px-3 py-2 text-lg font-bold transition ${
                        state.focusTable === table
                          ? 'bg-sunrise text-midnight shadow-soft'
                          : 'bg-soft-gray text-midnight'
                      }`}
                      onClick={() => updateFocusTable(table)}
                      data-testid={`mul-table-${table}`}
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="rounded-2xl bg-gradient-to-r from-sunrise to-peach px-4 py-3 text-lg font-bold text-midnight shadow-pop hover:shadow-soft transition-all"
            onClick={handleStartSession}
            data-testid="mul-start-session"
          >
            🚀 和{whiteSealMascot.name}一起出發！
          </button>
        </section>
      )}

      {state.status === 'playing' && currentMission && (
        <div className="grid gap-4">
          <div className="rounded-hero bg-white/80 p-4 shadow-soft">
            <ProgressIndicator 
              current={progress.current}
              total={progress.total}
              correctCount={correctCount}
            />
          </div>

          <MissionPanel mission={currentMission} mode={state.mode} onSubmit={submitAnswer} />

          {state.feedback && (
            <div
              className={`rounded-2xl p-4 text-center text-lg font-bold ${
                state.feedback.type === 'correct' ? 'bg-leaf/30 text-midnight' : 'bg-sky/30 text-midnight'
              }`}
              data-testid="mul-feedback-banner"
            >
              {state.feedback.message}
            </div>
          )}
        </div>
      )}

      {state.status === 'finished' && (
        <section className="relative grid gap-5 rounded-hero bg-white/90 p-6 text-center shadow-soft">
          {perfect && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              data-testid="mul-perfect-celebration"
            >
              <div className="animate-bounce text-6xl">🌟</div>
            </div>
          )}
          <div className={`space-y-2 ${perfect ? 'relative z-10' : ''}`}>
            <h2 className="text-2xl font-display text-midnight">完成啦！</h2>
            <p className="text-lg font-semibold text-midnight">總分 {displayedScore} 分</p>
            <p className="text-sm font-semibold text-midnight/80">
              正確 {correctCount} / {progress.total} 題 · 花了 {formattedDuration}
            </p>
            <p className="text-midnight/80">
              {perfect ? whiteSealMascot.celebratePerfect : whiteSealMascot.celebrate}
            </p>
          </div>

          <div className="rounded-2xl bg-cream/70 p-4 text-left text-sm text-midnight shadow-soft">
            <h3 className="text-base font-bold text-midnight">小海豹排行榜</h3>
            {leaderboard.length === 0 ? (
              <p className="mt-2 text-midnight/75">還沒有任何紀錄，快來搶下第一名！</p>
            ) : (
              <ol className="mt-3 space-y-2" data-testid="mul-leaderboard">
                {leaderboard.map((entry, index) => {
                  const isLatest = entry.id === latestEntryId
                  return (
                    <li
                      key={entry.id}
                      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2 ${
                        isLatest ? 'bg-sunrise/20 font-bold text-midnight' : 'bg-white/60'
                      }`}
                    >
                      <span>
                        第 {index + 1} 名 · {entry.score} 分
                      </span>
                      <span className="text-sm text-midnight/75">
                        正確 {entry.correctCount} / {entry.totalQuestions} 題 · {formatDuration(entry.durationMs)} ·
                        {entry.mode === 'practice' ? ' 練習模式' : ' 挑戰模式'}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>

          {incorrectAnswers.length > 0 && (
            <div className="rounded-2xl bg-soft-gray p-4 text-left text-sm text-midnight">
              <p className="mb-2 font-semibold">可以再複習：</p>
              <ul className="list-disc pl-5">
                {incorrectAnswers.map((attempt) => (
                  <li key={attempt.mission.id}>
                    {attempt.mission.multiplicand} × {attempt.mission.multiplier} = {attempt.mission.answer}，你回答 {attempt.suppliedAnswer}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-sunrise to-peach px-4 py-2 font-bold text-midnight shadow-pop hover:shadow-soft transition-all"
              onClick={handleRetry}
              data-testid="mul-retry"
            >
              🔄 和{whiteSealMascot.name}再闖 9 題！
            </button>
            <button
              type="button"
              className="rounded-xl bg-soft-gray px-4 py-2 font-bold text-midnight"
              onClick={resetToMenu}
              data-testid="mul-back-menu"
            >
              回到選單
            </button>
          </div>
        </section>
      )}

      {/* 動畫效果組件 */}
      <CelebrationEffects 
        show={showCelebration} 
        perfect={perfect}
        onComplete={() => setShowCelebration(false)}
      />
      
      <AnswerFeedback
        show={answerFeedback.show}
        isCorrect={answerFeedback.isCorrect}
        position={answerFeedback.position || undefined}
        onComplete={() => setAnswerFeedback(prev => ({ ...prev, show: false }))}
      />
      
      {/* 吉祥物慶祝動畫 */}
      <MascotCelebration
        show={showMascotCelebration}
        mascot={whiteSealMascot}
        perfect={perfect}
        onComplete={() => setShowMascotCelebration(false)}
      />
    </div>
  )
}

export default MultiplicationAdventure
