import { DEFAULT_CHARSET, type CharsetKind } from '../types'

const KEY = 'morse-generator.settings'

export interface StoredSettings {
  charset: CharsetKind
  custom: string
}

const VALID_CHARSETS: CharsetKind[] = [
  'latin',
  'latinDigits',
  'cyrillic',
  'cyrillicDigits',
  'digits',
  'custom',
]

export function loadSettings(): StoredSettings {
  const fallback: StoredSettings = { charset: DEFAULT_CHARSET, custom: '' }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw) as Partial<StoredSettings>
    const charset =
      data.charset && VALID_CHARSETS.includes(data.charset) ? data.charset : fallback.charset
    const custom = typeof data.custom === 'string' ? data.custom : ''
    return { charset, custom }
  } catch {
    return fallback
  }
}

export function saveSettings(settings: StoredSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    /* storage unavailable: ignore */
  }
}
