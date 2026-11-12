export type CharsetKind =
  | 'latin'
  | 'latinDigits'
  | 'cyrillic'
  | 'cyrillicDigits'
  | 'digits'
  | 'custom'

export interface TestConfig {
  speed: number
  charset: CharsetKind
  custom: string
}

export interface TestResult {
  transmitted: string
  received: string
  symbols: number
  errors: number
}

export const TEXT_LENGTH = 250
export const MAX_ERRORS = 3
export const GROUP_SIZE = 5
export const GROUPS_PER_LINE = 5
export const DEFAULT_SPEED = 60
export const DEFAULT_CHARSET: CharsetKind = 'latinDigits'
