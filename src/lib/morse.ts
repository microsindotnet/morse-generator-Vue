export interface MorseEntry {
  code: string
  chant: string
}

export const LATIN: Record<string, MorseEntry> = {
  A: { code: '.-',    chant: 'ай-даа' },
  B: { code: '-...',  chant: 'баа-ки-те-кут' },
  C: { code: '-.-.',  chant: 'цаап-ли-наа-ши' },
  D: { code: '-..',   chant: 'доо-ми-ки' },
  E: { code: '.',     chant: 'есть' },
  F: { code: '..-.',  chant: 'фи-ли-мо-он-чик' },
  G: { code: '--.',   chant: 'гаа-раа-жик' },
  H: { code: '....',  chant: 'хо-лос-тя-ки' },
  I: { code: '..',    chant: 'и-ди' },
  J: { code: '.---',  chant: 'и-крат-коо-ее' },
  K: { code: '-.-',   chant: 'кто-ку-даа' },
  L: { code: '.-..',  chant: 'лу-наа-ти-ки' },
  M: { code: '--',    chant: 'маа-маа' },
  N: { code: '-.',    chant: 'ноо-мер' },
  O: { code: '---',   chant: 'оо-коо-ло' },
  P: { code: '.--.',  chant: 'пи-лаа-поо-ёт' },
  Q: { code: '--.-',  chant: 'щаа-ваам-не-шаа' },
  R: { code: '.-.',   chant: 'ре-шаа-ет' },
  S: { code: '...',   chant: 'са-мо-лет' },
  T: { code: '-',     chant: 'таак' },
  U: { code: '..-',   chant: 'у-нес-лоо' },
  V: { code: '...-',  chant: 'я-бук-ва-жее' },
  W: { code: '.--',   chant: 'ви-даа-лаа' },
  X: { code: '-..-',  chant: 'тоо-мяг-кий-знаак' },
  Y: { code: '-.--',  chant: 'ы-не-на-доо' },
  Z: { code: '--..',  chant: 'заа-каа-ти-ки' },
}

export const CYRILLIC: Record<string, MorseEntry> = {
  А: { code: '.-',    chant: 'ай-даа' },
  Б: { code: '-...',  chant: 'баа-ки-те-кут' },
  В: { code: '.--',   chant: 'ви-даа-лаа' },
  Г: { code: '--.',   chant: 'гаа-раа-жик' },
  Д: { code: '-..',   chant: 'доо-ми-ки' },
  Е: { code: '.',     chant: 'есть' },
  Ж: { code: '...-',  chant: 'я-бук-ва-жее' },
  З: { code: '--..',  chant: 'заа-каа-ти-ки' },
  И: { code: '..',    chant: 'и-ди' },
  Й: { code: '.---',  chant: 'и-крат-коо-ее' },
  К: { code: '-.-',   chant: 'кто-ку-даа' },
  Л: { code: '.-..',  chant: 'лу-наа-ти-ки' },
  М: { code: '--',    chant: 'маа-маа' },
  Н: { code: '-.',    chant: 'ноо-мер' },
  О: { code: '---',   chant: 'оо-коо-ло' },
  П: { code: '.--.',  chant: 'пи-лаа-поо-ёт' },
  Р: { code: '.-.',   chant: 'ре-шаа-ет' },
  С: { code: '...',   chant: 'са-мо-лет' },
  Т: { code: '-',     chant: 'таак' },
  У: { code: '..-',   chant: 'у-нес-лоо' },
  Ф: { code: '..-.',  chant: 'фи-ли-моон-чик' },
  Х: { code: '....',  chant: 'хо-лос-тя-ки' },
  Ц: { code: '-.-.',  chant: 'цаап-ли-наа-ши' },
  Ч: { code: '---.',  chant: 'чее-лоо-вее-чек' },
  Ш: { code: '----',  chant: 'шаа-роо-ваа-раа' },
  Щ: { code: '--.-',  chant: 'щаа-ваам-не-шаа' },
  //Ъ: { code: '--.--', chant: 'твё-ёр-дый-знаак' },
  Ы: { code: '-.--',  chant: 'ы-не-на-доо' },
  Ь: { code: '-..-',  chant: 'тоо-мяг-кий-знаак' },
  Э: { code: '..-..', chant: 'э-ле-роон-чи-ки' },
  Ю: { code: '..--',  chant: 'ю-ли-аа-наа' },
  Я: { code: '.-.-',  chant: 'я-маал-я-маал' },
}

export const DIGITS: Record<string, MorseEntry> = {
  0: { code: '-----', chant: 'ноль-тоо-оо-коо-лоо' },
  1: { code: '.----', chant: 'и-тооль-коо-оод-наа' },
  2: { code: '..---', chant: 'две-не-хоо-роо-шоо' },
  3: { code: '...--', chant: 'люб-лю-сол-даа-таа' },
  4: { code: '....-', chant: 'чет-ве-ри-те-каа' },
  5: { code: '.....', chant: 'пе-тя-пе-ту-шок' },
  6: { code: '-....', chant: 'поо-шес-ти-бе-ри' },
  7: { code: '--...', chant: 'даай-даай-се-ме-ри' },
  8: { code: '---..', chant: 'моо-лоо-коо-ки-пит' },
  9: { code: '----.', chant: 'воо-доо-проо-воод-чик' },
}

const TABLE: Record<string, MorseEntry> = { ...LATIN, ...CYRILLIC, ...DIGITS }

export function encodeChar(ch: string): string {
  return TABLE[ch.toUpperCase()]?.code ?? ''
}

export function chantOf(ch: string): string {
  return TABLE[ch.toUpperCase()]?.chant ?? ''
}
