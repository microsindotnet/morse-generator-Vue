import { GROUP_SIZE, GROUPS_PER_LINE } from '../types'

export interface OutChar {
  ch: string
  error: boolean
}

export function toGroups<T>(chars: T[], size = GROUP_SIZE): T[][] {
  const groups: T[][] = []
  for (let i = 0; i < chars.length; i += size) {
    groups.push(chars.slice(i, i + size))
  }
  return groups
}

export function toLines<G>(groups: G[], perLine = GROUPS_PER_LINE): G[][] {
  const lines: G[][] = []
  for (let i = 0; i < groups.length; i += perLine) {
    lines.push(groups.slice(i, i + perLine))
  }
  return lines
}

export function charsToLines(chars: string[]): string[][] {
  const groups = toGroups(chars).map((g) => g.join(''))
  return toLines(groups)
}

export function textToLines(text: string): string[][] {
  return charsToLines(text.split(''))
}

export function receivedToLines(
  transmitted: string,
  received: string,
  symbols: number,
): OutChar[][][] {
  const chars: OutChar[] = []
  for (let i = 0; i < symbols; i += 1) {
    const r = received[i] ?? ''
    const error = r.toUpperCase() !== transmitted[i].toUpperCase()
    chars.push({ ch: r || '.', error })
  }
  return toLines(toGroups(chars))
}
