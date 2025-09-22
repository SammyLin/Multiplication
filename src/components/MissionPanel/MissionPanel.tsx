import { useEffect, useState } from 'react'
import type { Mission } from '../../game/gameTypes'
import { playButtonClick } from '../../utils/improvedSoundEffects'

export type MissionPanelMode = 'practice' | 'challenge'

type MissionPanelProps = {
  mission: Mission
  mode: MissionPanelMode
  onSubmit: (answer: number) => void
}

const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const

const MissionPanel = ({ mission, mode, onSubmit }: MissionPanelProps) => {
  const [typedAnswer, setTypedAnswer] = useState('')

  useEffect(() => {
    setTypedAnswer('')
  }, [mission.id])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (mode !== 'challenge') return

      if (event.key === 'Enter') {
        event.preventDefault()
        submitTypedAnswer()
        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()
        setTypedAnswer((previous) => previous.slice(0, -1))
        return
      }

      if (NUMBER_KEYS.includes(event.key as (typeof NUMBER_KEYS)[number])) {
        event.preventDefault()
        appendDigit(event.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, typedAnswer])

  const appendDigit = (digit: string) => {
    setTypedAnswer((previous) => {
      if (previous.length >= 3) return previous
      if (previous === '0') return digit
      return `${previous}${digit}`
    })
  }

  const submitTypedAnswer = () => {
    if (!typedAnswer) return
    const value = Number(typedAnswer)
    if (Number.isNaN(value)) return
    onSubmit(value)
  }

  const handleChoiceSelect = (choice: number) => {
    playButtonClick()
    onSubmit(choice)
  }

  const keypadKeys = [
    { label: '1', type: 'digit' },
    { label: '2', type: 'digit' },
    { label: '3', type: 'digit' },
    { label: '4', type: 'digit' },
    { label: '5', type: 'digit' },
    { label: '6', type: 'digit' },
    { label: '7', type: 'digit' },
    { label: '8', type: 'digit' },
    { label: '9', type: 'digit' },
    { label: '清除', type: 'clear' },
    { label: '0', type: 'digit' },
    { label: '刪除', type: 'backspace' },
  ] as const

  return (
    <section className="grid gap-6 rounded-hero bg-white/95 p-6 shadow-soft md:p-8">
      <div className="grid gap-2 text-center">
        <p className="mx-auto inline-flex items-center justify-center rounded-badge bg-sunrise px-3 py-1 text-sm font-bold text-white">
          {mission.prompt}
        </p>
        <h2 className="text-3xl font-display text-midnight">
          {mission.multiplicand} × {mission.multiplier} = ?
        </h2>
        <p className="text-sm text-midnight/80">{mission.narrativeHook}</p>
      </div>

      {mode === 'practice' ? (
        <div className="grid gap-3">
          <h3 className="text-lg font-display text-midnight">選擇正確答案</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {mission.choices.map((choice) => (
              <button
                key={`choice-${choice}`}
                type="button"
                className="rounded-xl bg-leaf px-4 py-3 text-lg font-bold text-midnight shadow-[0_10px_20px_rgba(144,190,109,0.35)] transition-transform duration-150 ease-snappy active:translate-y-0.5"
                onClick={() => handleChoiceSelect(choice)}
                data-testid={`mul-choice-${choice}`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <h3 className="text-lg font-display text-midnight">輸入你的答案</h3>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <input
                value={typedAnswer}
                readOnly
                className="flex-1 rounded-xl border-4 border-sky/60 px-3 py-2 text-2xl font-display text-midnight"
                data-testid="mul-typed-answer"
              />
              <button
                type="button"
                className="rounded-xl bg-gradient-to-br from-sunrise to-peach px-4 py-2 font-bold text-midnight shadow-pop disabled:opacity-60"
                onClick={submitTypedAnswer}
                disabled={!typedAnswer}
                data-testid="mul-submit-answer"
              >
                確定
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {keypadKeys.map((key) => (
                <button
                  key={key.label}
                  type="button"
                  className="rounded-xl bg-soft-gray px-4 py-3 text-xl font-bold text-midnight shadow-soft"
                  data-testid={`mul-keypad-${key.label}`}
                  onClick={() => {
                    playButtonClick()
                    if (key.type === 'digit') {
                      appendDigit(key.label)
                    } else if (key.type === 'clear') {
                      setTypedAnswer('')
                    } else {
                      setTypedAnswer((previous) => previous.slice(0, -1))
                    }
                  }}
                >
                  {key.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="rounded-xl bg-peach/40 px-3 py-2 text-sm font-semibold text-midnight">
        <span aria-hidden="true">🎁</span> {mission.rewardHint}
      </p>
    </section>
  )
}

export default MissionPanel
