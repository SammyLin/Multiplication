import MissionPanel from '../../components/MissionPanel/MissionPanel'
import { useMultiplicationGame } from '../../hooks/useMultiplicationGame'

const tableOptions = Array.from({ length: 8 }, (_, index) => index + 2)

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

  const incorrectAnswers = answers.filter((attempt) => !attempt.isCorrect)

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="text-center">
        <h1 className="text-3xl font-display text-midnight">九九小冒險</h1>
        <p className="text-sm text-midnight/75">一次 9 題，挑戰你的乘法英雄力！</p>
      </header>

      {state.status === 'setup' && (
        <section className="grid gap-6 rounded-hero bg-white/90 p-6 shadow-soft">
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
            className="rounded-2xl bg-gradient-to-r from-sunrise to-peach px-4 py-3 text-lg font-bold text-midnight shadow-pop"
            onClick={startSession}
            data-testid="mul-start-session"
          >
            開始 9 題冒險
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
            {perfect ? (
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
              onClick={startSession}
              data-testid="mul-retry"
            >
              再來 9 題
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
