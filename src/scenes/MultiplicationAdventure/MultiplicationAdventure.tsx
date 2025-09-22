import { useEffect, useMemo, useRef, useState } from 'react'
import MissionPanel from '../../components/MissionPanel/MissionPanel'
import CuteMascots, { type MascotProfile } from '../../components/CuteMascots/CuteMascots'
import { useMultiplicationGame } from '../../hooks/useMultiplicationGame'
import {
  playCelebrationFanfare,
  playSubtleMiss,
  playSuccessChime,
  triggerUserGestureAudio,
} from '../../utils/soundEffects'

const tableOptions = Array.from({ length: 8 }, (_, index) => index + 2)

type MascotDialog = MascotProfile & {
  greeting: string
  encourage: string
  celebrate: string
  celebratePerfect: string
}

const mascots: MascotDialog[] = [
  {
    id: 'owl',
    name: '星芒貓頭鷹',
    title: '星芒貓頭鷹',
    subtitle: '守護你的乘法旅程',
    gradient: 'from-[#ffd166] to-[#ff9f1c]',
    greeting: '呼呼～我是星芒貓頭鷹，今天一起展開閃亮的乘法任務吧！',
    encourage: '挑好模式後記得深呼吸，我會在天空給你勇氣提醒。',
    celebrate: '任務完成！星芒貓頭鷹替你啾啾叫，表示超棒。',
    celebratePerfect: '全對耶！星芒貓頭鷹送上金色羽毛為你鼓掌！',
    svg: (
      <svg viewBox="0 0 140 140" role="img" aria-label="星芒貓頭鷹">
        <defs>
          <linearGradient id="owlBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffda79" />
            <stop offset="100%" stopColor="#ff9f1c" />
          </linearGradient>
          <radialGradient id="owlBelly" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff8d6" />
            <stop offset="100%" stopColor="#ffd166" />
          </radialGradient>
        </defs>
        <rect width="140" height="140" rx="32" fill="#fff5e1" />
        <circle cx="70" cy="68" r="46" fill="url(#owlBody)" />
        <ellipse cx="48" cy="62" rx="12" ry="16" fill="#fff">
          <animate attributeName="ry" values="16;14;16" dur="3.2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="92" cy="62" rx="12" ry="16" fill="#fff">
          <animate attributeName="ry" values="16;14;16" dur="3.4s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="48" cy="62" r="7" fill="#31221b">
          <animate attributeName="cy" values="62;60;62" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="92" cy="62" r="7" fill="#31221b">
          <animate attributeName="cy" values="62;64;62" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <path d="M58 90 Q70 102 82 90" fill="#fdce74" stroke="#ed9f32" strokeWidth="4" strokeLinecap="round" />
        <circle cx="70" cy="86" r="20" fill="url(#owlBelly)" />
        <polygon points="70,44 58,68 82,68" fill="#f78c6c">
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1; 0 0" dur="1.8s" repeatCount="indefinite" />
        </polygon>
        <path d="M36 46 Q50 22 70 34" stroke="#f7a647" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="d" values="M36 46 Q50 22 70 34; M36 44 Q50 24 70 34; M36 46 Q50 22 70 34" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M104 46 Q90 22 70 34" stroke="#f7a647" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="d" values="M104 46 Q90 22 70 34; M104 44 Q90 24 70 34; M104 46 Q90 22 70 34" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="50" cy="40" r="6" fill="#ffe066">
          <animate attributeName="r" values="6;5;6" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="88" cy="36" r="6" fill="#ffe066">
          <animate attributeName="r" values="6;5;6" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
  },
  {
    id: 'fox',
    name: '泡泡狐狸',
    title: '泡泡狐狸',
    subtitle: '陪你一起闖關',
    gradient: 'from-[#8ecae6] to-[#219ebc]',
    greeting: '嘿嘿～泡泡狐狸來啦！我們用泡泡包住每一題的答案。',
    encourage: '遇到難題先輕敲泡泡，思考一下再回答，我會給你信心。',
    celebrate: '冒險完成！泡泡狐狸送上清脆的水泡掌聲。',
    celebratePerfect: '滿分泡泡爆開煙火～你是今天的乘法冠軍！',
    svg: (
      <svg viewBox="0 0 140 140" role="img" aria-label="泡泡狐狸">
        <defs>
          <linearGradient id="foxBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8ecae6" />
            <stop offset="100%" stopColor="#219ebc" />
          </linearGradient>
        </defs>
        <rect width="140" height="140" rx="32" fill="#e4f3fb" />
        <path d="M70 34 L38 60 Q50 110 70 116 Q90 110 102 60 Z" fill="url(#foxBody)" />
        <ellipse cx="70" cy="86" rx="24" ry="18" fill="#fff" opacity="0.85" />
        <ellipse cx="58" cy="66" rx="10" ry="12" fill="#fff">
          <animate attributeName="ry" values="12;10;12" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="82" cy="66" rx="10" ry="12" fill="#fff">
          <animate attributeName="ry" values="12;9;12" dur="3.2s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="58" cy="66" r="5" fill="#1b4456">
          <animate attributeName="cx" values="58;60;58" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="82" cy="66" r="5" fill="#1b4456">
          <animate attributeName="cx" values="82;80;82" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <path d="M70 78 Q74 84 70 88 Q66 84 70 78" fill="#ffb6b9">
          <animate attributeName="d" values="M70 78 Q74 84 70 88 Q66 84 70 78; M70 78 Q72 86 70 90 Q68 86 70 78; M70 78 Q74 84 70 88 Q66 84 70 78" dur="2.7s" repeatCount="indefinite" />
        </path>
        <path d="M46 54 L58 40" stroke="#219ebc" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="d" values="M46 54 L58 40; M46 52 L58 38; M46 54 L58 40" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M94 54 L82 40" stroke="#219ebc" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="d" values="M94 54 L82 40; M94 52 L82 38; M94 54 L82 40" dur="2.4s" repeatCount="indefinite" />
        </path>
        <g opacity="0.6">
          <circle cx="30" cy="104" r="8" fill="#fff">
            <animate attributeName="cy" values="104;100;104" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="36" cy="110" r="6" fill="#fff">
            <animate attributeName="cy" values="110;106;110" dur="3.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="110" cy="102" r="7" fill="#fff">
            <animate attributeName="cy" values="102;98;102" dur="3.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="104" cy="110" r="5" fill="#fff">
            <animate attributeName="cy" values="110;105;110" dur="3.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    ),
  },
  {
    id: 'otter',
    name: '音符水獺',
    title: '音符水獺',
    subtitle: '節奏記憶小幫手',
    gradient: 'from-[#90be6d] to-[#55a630]',
    greeting: '噗通～音符水獺在水面敲節奏，跟著節奏記答案吧！',
    encourage: '每答一題我就敲一下木琴，維持節奏就能記住乘法。',
    celebrate: '完成！音符水獺替你奏出快樂的勝利旋律。',
    celebratePerfect: '滿分大合奏！水獺樂團為你開啟慶祝演奏會。',
    svg: (
      <svg viewBox="0 0 140 140" role="img" aria-label="音符水獺">
        <defs>
          <linearGradient id="otterBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b8f2b4" />
            <stop offset="100%" stopColor="#55a630" />
          </linearGradient>
        </defs>
        <rect width="140" height="140" rx="32" fill="#eef9f0" />
        <path d="M70 28 Q90 36 98 62 Q104 90 90 110 Q74 130 50 110 Q36 90 42 62 Q50 36 70 28" fill="url(#otterBody)">
          <animate attributeName="d" values="M70 28 Q90 36 98 62 Q104 90 90 110 Q74 130 50 110 Q36 90 42 62 Q50 36 70 28; M70 28 Q88 36 96 62 Q102 90 88 110 Q74 128 52 110 Q38 92 44 62 Q50 36 70 28; M70 28 Q90 36 98 62 Q104 90 90 110 Q74 130 50 110 Q36 90 42 62 Q50 36 70 28" dur="4.6s" repeatCount="indefinite" />
        </path>
        <ellipse cx="54" cy="70" rx="9" ry="12" fill="#fff">
          <animate attributeName="ry" values="12;9;12" dur="3.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="86" cy="70" rx="9" ry="12" fill="#fff">
          <animate attributeName="ry" values="12;9;12" dur="3.9s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="54" cy="70" r="5" fill="#1f3c2f">
          <animate attributeName="cy" values="70;72;70" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="86" cy="70" r="5" fill="#1f3c2f">
          <animate attributeName="cy" values="70;68;70" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="70" cy="86" rx="14" ry="10" fill="#ffe0ac" />
        <path d="M60 94 Q70 100 80 94" stroke="#2f673f" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="d" values="M60 94 Q70 100 80 94; M60 92 Q70 102 80 92; M60 94 Q70 100 80 94" dur="3.4s" repeatCount="indefinite" />
        </path>
        <circle cx="48" cy="46" r="6" fill="#ffd166">
          <animate attributeName="r" values="6;4;6" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="92" cy="46" r="6" fill="#ffd166">
          <animate attributeName="r" values="6;4;6" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <path d="M100 40 Q118 32 118 20" stroke="#55a630" strokeWidth="8" strokeLinecap="round">
          <animate attributeName="d" values="M100 40 Q118 32 118 20; M100 38 Q118 30 118 20; M100 40 Q118 32 118 20" dur="3.6s" repeatCount="indefinite" />
        </path>
        <circle cx="118" cy="20" r="6" fill="#55a630">
          <animate attributeName="cy" values="20;18;20" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" cy="32" r="4" fill="#55a630">
          <animate attributeName="cy" values="32;30;32" dur="3.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
  },
]

const MultiplicationAdventure = () => {
  const {
    state,
    currentMission,
    progress,
    correctCount,
    perfect,
    answers,
    updateMode,
    updatePattern,
    updateFocusTable,
    startSession,
    submitAnswer,
    resetToMenu,
  } = useMultiplicationGame()

  const [selectedMascotId, setSelectedMascotId] = useState<string | null>(null)
  const answerCountRef = useRef(0)
  const previousStatusRef = useRef(state.status)

  const incorrectAnswers = answers.filter((attempt) => !attempt.isCorrect)
  const selectedMascot = useMemo(
    () => mascots.find((mascot) => mascot.id === selectedMascotId) ?? null,
    [selectedMascotId],
  )

  const handleSelectMascot = (id: string) => {
    setSelectedMascotId(id)
    void triggerUserGestureAudio()
  }

  const handleStartSession = () => {
    if (!selectedMascot) return
    void triggerUserGestureAudio()
    startSession()
  }

  const handleRetry = () => {
    if (!selectedMascot) return
    void triggerUserGestureAudio()
    startSession()
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
      }
      answerCountRef.current = answers.length
    }
  }, [answers, state.status])

  useEffect(() => {
    if (state.status === 'finished' && previousStatusRef.current !== 'finished') {
      playCelebrationFanfare(perfect)
    }
    previousStatusRef.current = state.status
  }, [state.status, perfect])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="text-center">
        <h1 className="text-3xl font-display text-midnight">九九小冒險</h1>
        <p className="text-sm text-midnight/75">一次 9 題，挑戰你的乘法英雄力！</p>
      </header>

      {state.status === 'setup' && (
        <section className="grid gap-6 rounded-hero bg-white/90 p-6 shadow-soft">
          <CuteMascots mascots={mascots} selectedId={selectedMascotId} onSelect={handleSelectMascot} />

          <div className="rounded-hero bg-sky/15 p-4 text-sm text-midnight">
            {selectedMascot ? (
              <div className="space-y-1">
                <p className="font-bold">{selectedMascot.greeting}</p>
                <p>{selectedMascot.encourage}</p>
              </div>
            ) : (
              <p className="text-midnight/70">請挑一位吉祥物夥伴，他們會陪你完成每一道乘法任務！</p>
            )}
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
                onClick={() => updateMode('practice')}
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
                onClick={() => updateMode('challenge')}
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
            className="rounded-2xl bg-gradient-to-r from-sunrise to-peach px-4 py-3 text-lg font-bold text-midnight shadow-pop disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleStartSession}
            data-testid="mul-start-session"
            disabled={!selectedMascot}
          >
            {selectedMascot ? `${selectedMascot.name}：準備好了，出發！` : '選好夥伴再出發'}
          </button>
        </section>
      )}

      {state.status === 'playing' && currentMission && (
        <div className="grid gap-4">
          <div className="grid items-center gap-2 rounded-hero bg-white/80 p-4 shadow-soft sm:flex sm:justify-between">
            <p className="text-lg font-semibold text-midnight">
              第 {progress.current} 題 / {progress.total}
            </p>
            <p className="text-sm font-semibold text-midnight/70">目前答對 {correctCount} 題</p>
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
            <p className="text-lg font-semibold text-midnight">
              得分 {correctCount} / {progress.total}
            </p>
            {selectedMascot ? (
              <p className="text-midnight/80">
                {perfect ? selectedMascot.celebratePerfect : selectedMascot.celebrate}
              </p>
            ) : perfect ? (
              <p className="text-midnight/80">滿分閃耀登場！太棒了！</p>
            ) : (
              <p className="text-midnight/80">繼續努力，離滿分更近一步！</p>
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
              className="rounded-xl bg-gradient-to-r from-sunrise to-peach px-4 py-2 font-bold text-midnight shadow-pop"
              onClick={handleRetry}
              data-testid="mul-retry"
              disabled={!selectedMascot}
            >
              {selectedMascot ? `${selectedMascot.name}：再闖 9 題！` : '再來 9 題'}
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
    </div>
  )
}

export default MultiplicationAdventure
