let audioContext: AudioContext | null = null

const isAudioSupported = () =>
  typeof window !== 'undefined' &&
  (window.AudioContext || (window as unknown as { webkitAudioContext?: AudioContext }).webkitAudioContext)

const getContext = () => {
  if (!isAudioSupported()) return null
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new AudioCtx({ latencyHint: 'interactive' })
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume().catch(() => {
      // ignore resume errors, often caused by autoplay restrictions
    })
  }

  return audioContext
}

const stopNodeAfter = (node: AudioNode, seconds: number) => {
  const ctx = getContext()
  if (!ctx) return
  setTimeout(() => {
    try {
      node.disconnect()
    } catch (error) {
      // noop
    }
  }, seconds * 1000)
}

const playOscillators = (
  settings: Array<{ type: OscillatorType; frequency: number; detune?: number }>,
  duration = 0.6,
  options?: { attack?: number; release?: number; gain?: number },
) => {
  const ctx = getContext()
  if (!ctx) return

  const masterGain = ctx.createGain()
  const now = ctx.currentTime
  const attack = options?.attack ?? 0.01
  const release = options?.release ?? 0.2
  const gainValue = options?.gain ?? 0.25

  masterGain.gain.setValueAtTime(0.0001, now)
  masterGain.gain.exponentialRampToValueAtTime(gainValue, now + attack)
  masterGain.gain.setTargetAtTime(0.0001, now + attack + (duration - release), release)

  masterGain.connect(ctx.destination)

  settings.forEach((config) => {
    const osc = ctx.createOscillator()
    osc.type = config.type
    osc.frequency.setValueAtTime(config.frequency, now)
    if (config.detune) {
      osc.detune.setValueAtTime(config.detune, now)
    }
    osc.connect(masterGain)
    osc.start(now)
    osc.stop(now + duration)
    stopNodeAfter(osc, duration + release)
  })

  stopNodeAfter(masterGain, duration + 1)
}

export const playSuccessChime = () => {
  playOscillators(
    [
      { type: 'sine', frequency: 660 },
      { type: 'triangle', frequency: 880 },
    ],
    0.5,
    { gain: 0.2 },
  )
}

export const playSubtleMiss = () => {
  playOscillators(
    [
      { type: 'sawtooth', frequency: 320 },
      { type: 'triangle', frequency: 280 },
    ],
    0.4,
    { gain: 0.12 },
  )
}

export const playCelebrationFanfare = (perfect: boolean) => {
  if (perfect) {
    playOscillators(
      [
        { type: 'square', frequency: 523.25 },
        { type: 'square', frequency: 659.25 },
        { type: 'sine', frequency: 784 },
      ],
      1.2,
      { gain: 0.28, release: 0.4 },
    )
    setTimeout(() => {
      playOscillators(
        [
          { type: 'triangle', frequency: 880 },
          { type: 'sine', frequency: 1046.5 },
        ],
        0.8,
        { gain: 0.22 },
      )
    }, 420)
  } else {
    playOscillators(
      [
        { type: 'triangle', frequency: 523.25 },
        { type: 'sine', frequency: 659.25 },
      ],
      0.8,
      { gain: 0.2 },
    )
  }
}

export const triggerUserGestureAudio = async () => {
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch (error) {
      // ignore resume failure
    }
  }
}
