import { CYRILLIC, DIGITS, LATIN, encodeChar } from './morse'
import type { CharsetKind } from '../types'

export interface CharsetOption {
  value: CharsetKind
  label: string
}

export const CHARSET_OPTIONS: CharsetOption[] = [
  { value: 'latin', label: 'Латиница' },
  { value: 'latinDigits', label: 'Латиница + цифры' },
  { value: 'cyrillic', label: 'Кириллица' },
  { value: 'cyrillicDigits', label: 'Кириллица + цифры' },
  { value: 'digits', label: 'Цифры' },
  { value: 'custom', label: 'Свой набор символов' },
]

export function alphabetFor(kind: CharsetKind, custom: string): string[] {
  const latin = Object.keys(LATIN)
  const cyrillic = Object.keys(CYRILLIC)
  const digits = Object.keys(DIGITS)

  switch (kind) {
    case 'latin':
      return latin
    case 'latinDigits':
      return [...latin, ...digits]
    case 'cyrillic':
      return cyrillic
    case 'cyrillicDigits':
      return [...cyrillic, ...digits]
    case 'digits':
      return digits
    case 'custom': {
      const set = new Set<string>()
      for (const ch of custom) {
        if (/\s/.test(ch)) continue
        const upper = ch.toUpperCase()
        if (encodeChar(upper)) set.add(upper)
      }
      return [...set]
    }
  }
}
