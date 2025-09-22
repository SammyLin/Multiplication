import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import App from '../../src/App'

describe('MultiplicationAdventure scene', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.32)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lets a learner answer practice questions using choices', async () => {
    render(<App />)

    // 小海豹是固定的吉祥物，不需要選擇
    expect(screen.getByText('小海豹')).toBeInTheDocument()
    expect(screen.getByText('選擇練習方式')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('mul-start-session'))

    expect(screen.queryByRole('slider')).toBeNull()

    const equationHeading = await screen.findByRole('heading', { level: 2 })
    const matches = equationHeading.textContent?.match(/(\d+) × (\d+)/)
    expect(matches).toBeTruthy()

    const multiplicand = Number(matches?.[1])
    const multiplier = Number(matches?.[2])
    const answer = multiplicand * multiplier

    await userEvent.click(screen.getByRole('button', { name: String(answer) }))

    expect(screen.getByText(/進度: 2/)).toBeInTheDocument()
  })

  it('supports challenge mode with keypad entry and sequential tables', async () => {
    render(<App />)

    await userEvent.click(screen.getByTestId('mul-mode-challenge'))
    await userEvent.click(screen.getByTestId('mul-pattern-sequential'))
    await userEvent.click(screen.getByTestId('mul-table-2'))
    await userEvent.click(screen.getByTestId('mul-start-session'))

    const equationHeading = await screen.findByRole('heading', { level: 2 })
    const matches = equationHeading.textContent?.match(/(\d+) × (\d+)/)
    expect(matches).toBeTruthy()

    const multiplicand = Number(matches?.[1])
    const multiplier = Number(matches?.[2])
    const answer = multiplicand * multiplier
    const digits = String(answer).split('')

    for (const digit of digits) {
      await userEvent.click(screen.getByTestId(`mul-keypad-${digit}`))
    }
    await userEvent.click(screen.getByTestId('mul-submit-answer'))

    expect(screen.getByText(/進度: 2/)).toBeInTheDocument()
  })

  it('shows a celebration when all answers are correct', async () => {
    render(<App />)

    await userEvent.click(screen.getByTestId('mul-mode-challenge'))
    await userEvent.click(screen.getByTestId('mul-pattern-sequential'))
    await userEvent.click(screen.getByTestId('mul-table-2'))
    await userEvent.click(screen.getByTestId('mul-start-session'))

    for (let index = 0; index < 9; index += 1) {
      const equationHeading = await screen.findByRole('heading', { level: 2 })
      const matches = equationHeading.textContent?.match(/(\d+) × (\d+)/)
      expect(matches).toBeTruthy()

      const multiplicand = Number(matches?.[1])
      const multiplier = Number(matches?.[2])
      const answer = multiplicand * multiplier
      const digits = String(answer).split('')

      for (const digit of digits) {
        await userEvent.click(screen.getByTestId(`mul-keypad-${digit}`))
      }
      await userEvent.click(screen.getByTestId('mul-submit-answer'))
    }

    expect(await screen.findByTestId('mul-perfect-celebration')).toBeInTheDocument()
    expect(screen.getByText(/總分 \d+ 分/)).toBeInTheDocument()
  })
})
