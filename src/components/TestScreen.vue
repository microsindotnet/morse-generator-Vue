<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MorsePlayer } from '../lib/player'
import { generateText } from '../lib/generate'
import { alphabetFor } from '../lib/charset'
import { charsToLines } from '../lib/format'
import { TEXT_LENGTH, type TestConfig, type TestResult } from '../types'

const props = defineProps<{ config: TestConfig; audioContext: AudioContext }>()
const emit = defineEmits<{ (e: 'finish', result: TestResult): void }>()

const transmitted = ref('')
const typed = ref('')
const percent = ref(0)
const sentCount = ref(0)
let player: MorsePlayer | null = null

const lines = computed(() => {
  const count = Math.max(sentCount.value, typed.value.length)
  const chars: string[] = []
  for (let i = 0; i < count; i += 1) {
    chars.push(typed.value[i] ?? '.')
  }
  return charsToLines(chars)
})

onMounted(() => {
  const alphabet = alphabetFor(props.config.charset, props.config.custom)
  const text = generateText(alphabet, TEXT_LENGTH)
  if (text.length === 0) {
    emit('finish', { transmitted: '', received: '', symbols: 0, errors: 0 })
    return
  }
  transmitted.value = text
  player = new MorsePlayer(props.audioContext, text, props.config.speed, {
    onProgress: (sent, total) => {
      sentCount.value = sent
      percent.value = Math.round((sent / total) * 100)
    },
    onFinish: () => complete(),
  })
  window.addEventListener('keydown', onKey)
  player.start()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  player?.stop()
})

function onKey(e: KeyboardEvent): void {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (e.key === 'Escape') {
    e.preventDefault()
    abort()
    return
  }
  if (e.key.length === 1 && /[\p{L}\p{N}]/u.test(e.key)) {
    if (typed.value.length < TEXT_LENGTH) {
      e.preventDefault()
      typed.value += e.key
    }
  }
}

function computeResult(symbols: number): TestResult {
  const tx = transmitted.value.slice(0, symbols)
  const rx = typed.value
  let errors = 0
  for (let i = 0; i < symbols; i += 1) {
    const r = rx[i] ?? ''
    if (r.toUpperCase() !== tx[i].toUpperCase()) errors += 1
  }
  return { transmitted: tx, received: rx, symbols, errors }
}

function complete(): void {
  player?.stop()
  emit('finish', computeResult(transmitted.value.length))
}

function abort(): void {
  player?.stop()
  emit('finish', computeResult(sentCount.value))
}
</script>

<template>
  <section class="test">
    <div class="test-hint">
      Принимайте символы на слух и вводите их с клавиатуры. <kbd>Esc</kbd> — прервать тест.
    </div>

    <div class="morse-screen" aria-live="polite">
      <div v-for="(line, li) in lines" :key="li" class="morse-line">
        <span v-for="(group, gi) in line" :key="gi" class="morse-group">{{ group }}</span>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: percent + '%' }" />
      <span class="progress-text">Прогресс: {{ percent }}%</span>
    </div>
  </section>
</template>
