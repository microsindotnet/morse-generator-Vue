import { encodeChar } from './morse'

export interface PlayerCallbacks {
  onProgress?: (sent: number, total: number) => void
  onFinish?: () => void
}

const GROUP_SIZE = 5
const INTER_GAP = 3
const GROUP_GAP = 7

export class MorsePlayer {
  private readonly ctx: AudioContext
  private readonly text: string
  private readonly unit: number
  private readonly cb: PlayerCallbacks
  private readonly lookahead = 0.2
  private readonly tickMs = 25

  private scheduled = 0
  private played = 0
  private startTimes: number[] = []
  private nextTime = 0
  private timer: number | null = null
  private finished = false

  constructor(ctx: AudioContext, text: string, speedCpm: number, cb: PlayerCallbacks = {}) {
    this.ctx = ctx
    this.text = text
    this.unit = 6000 / speedCpm / 1000
    this.cb = cb
  }

  start(): void {
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    this.scheduled = 0
    this.played = 0
    this.startTimes = []
    this.finished = false
    this.nextTime = this.ctx.currentTime + 0.25
    this.tick()
    this.timer = window.setInterval(() => this.tick(), this.tickMs)
  }

  stop(): void {
    this.stopTimer()
    this.finished = true
  }

  private tick(): void {
    const now = this.ctx.currentTime
    const horizon = now + this.lookahead
    while (this.scheduled < this.text.length && this.nextTime < horizon) {
      this.startTimes.push(this.nextTime)
      this.scheduleChar(this.text[this.scheduled], this.scheduled)
      this.scheduled += 1
    }

    let advanced = false
    while (this.played < this.startTimes.length && this.startTimes[this.played] <= now) {
      this.played += 1
      advanced = true
    }
    if (advanced) {
      this.cb.onProgress?.(this.played, this.text.length)
    }

    if (this.scheduled >= this.text.length && now >= this.nextTime) {
      this.stopTimer()
      if (!this.finished) {
        this.finished = true
        this.cb.onFinish?.()
      }
    }
  }

  private scheduleChar(ch: string, i: number): void {
    const code = encodeChar(ch)
    const u = this.unit
    const start = this.nextTime
    let t = start
    for (const el of code) {
      const dur = (el === '-' ? 3 : 1) * u
      this.tone(t, dur)
      t += dur + u
    }
    const charEnd = t - u
    const gapUnits = (i + 1) % GROUP_SIZE === 0 ? GROUP_GAP : INTER_GAP
    this.nextTime = charEnd + gapUnits * u
  }

  private tone(start: number, dur: number): void {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 1000
    osc.connect(gain)
    gain.connect(ctx.destination)

    const ramp = Math.min(0.006, dur / 3)
    const peak = 0.25
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(peak, start + ramp)
    gain.gain.setValueAtTime(peak, start + dur - ramp)
    gain.gain.linearRampToValueAtTime(0, start + dur)

    osc.start(start)
    osc.stop(start + dur + 0.02)
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
