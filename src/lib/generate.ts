export function generateText(alphabet: string[], length: number): string {
  if (alphabet.length === 0) return ''

  const out: string[] = []
  let prev = ''
  let sameRun = 0

  while (out.length < length) {
    const ch = alphabet[Math.floor(Math.random() * alphabet.length)]
    if (ch === prev) {
      sameRun += 1
      if (sameRun >= 2) continue
    } else {
      sameRun = 0
    }
    prev = ch
    out.push(ch)
  }

  return out.join('')
}
