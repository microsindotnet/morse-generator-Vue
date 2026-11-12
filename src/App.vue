<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SettingsScreen from './components/SettingsScreen.vue'
import TestScreen from './components/TestScreen.vue'
import ResultScreen from './components/ResultScreen.vue'
import MorseTables from './components/MorseTables.vue'
import { DEFAULT_SPEED, type TestConfig, type TestResult } from './types'
import { loadSettings } from './lib/storage'

type Screen = 'settings' | 'test' | 'result'

const stored = loadSettings()
const screen = ref<Screen>('settings')
const config = ref<TestConfig>({ speed: DEFAULT_SPEED, charset: stored.charset, custom: stored.custom })
const result = ref<TestResult | null>(null)
const showTables = ref(window.location.hash === '#tables')
let audioContext: AudioContext | null = null

watch(
  showTables,
  (tables) => {
    document.title = tables ? 'Код Морзе' : 'Экзамен по приёму кода Морзе'
  },
  { immediate: true },
)

function syncHash(): void {
  showTables.value = window.location.hash === '#tables'
}

onMounted(() => window.addEventListener('hashchange', syncHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', syncHash))

function onStart(cfg: TestConfig): void {
  config.value = cfg
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  audioContext = new Ctor()
  screen.value = 'test'
}

function onFinish(res: TestResult): void {
  result.value = res
  screen.value = 'result'
  audioContext?.close()
  audioContext = null
}

function onRestart(): void {
  screen.value = 'settings'
  result.value = null
}
</script>

<template>
  <main class="app">
    <MorseTables v-if="showTables" />
    <template v-else>
      <h1>Экзамен по приёму кода Морзе</h1>
      <SettingsScreen v-if="screen === 'settings'" :initial="config" @start="onStart" />
      <TestScreen v-else-if="screen === 'test'" :config="config" :audio-context="audioContext!" @finish="onFinish" />
      <ResultScreen v-else-if="result" :result="result" @restart="onRestart" />
    </template>
  </main>
</template>
