<script setup lang="ts">
import { computed } from 'vue'
import { receivedToLines, textToLines } from '../lib/format'
import { openMorseTables } from '../lib/tablesWindow'
import { MAX_ERRORS, TEXT_LENGTH, type TestResult } from '../types'

const props = defineProps<{ result: TestResult }>()
defineEmits<{ (e: 'restart'): void }>()

const transmittedLines = computed(() => textToLines(props.result.transmitted))
const receivedLines = computed(() =>
  receivedToLines(props.result.transmitted, props.result.received, props.result.symbols),
)

const status = computed(() => {
  const { symbols, received, errors } = props.result
  const transmittedAll = symbols >= TEXT_LENGTH
  const receivedAll = received.length >= TEXT_LENGTH

  if (transmittedAll && receivedAll && errors === 0) {
    return { cls: 'ok', text: 'Тест пройден без ошибок' }
  }
  if (transmittedAll && errors <= MAX_ERRORS) {
    return { cls: 'warn', text: `Тест пройден, ошибок: ${errors}` }
  }
  return { cls: 'fail', text: `Тест не пройден, ошибок: ${errors}` }
})
</script>

<template>
  <section class="result">
    <div class="stats">
      <div>Символов: {{ result.symbols }}</div>
      <div>Ошибок:&nbsp;&nbsp; {{ result.errors }}</div>
    </div>

    <p class="verdict" :class="status.cls">{{ status.text }}</p>

    <div class="text-block">
      <div class="text-title">Переданный текст</div>
      <div v-for="(line, li) in transmittedLines" :key="li" class="morse-line">
        <span v-for="(group, gi) in line" :key="gi" class="morse-group">{{ group }}</span>
      </div>
    </div>

    <template v-if="status.cls !== 'ok'">
      <hr class="divider" />

      <div class="text-block">
        <div class="text-title">Принятый текст</div>
        <div v-for="(line, li) in receivedLines" :key="li" class="morse-line">
          <span v-for="(group, gi) in line" :key="gi" class="morse-group">
            <span v-for="(c, ci) in group" :key="ci" :class="{ 'char-error': c.error }">{{ c.ch }}</span>
          </span>
        </div>
      </div>
    </template>

    <div class="actions">
      <button class="primary" @click="$emit('restart')">Пройти ещё раз</button>
      <button class="secondary" @click="openMorseTables">Показать символы и напевы</button>
    </div>
  </section>
</template>
