<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { CHARSET_OPTIONS, alphabetFor } from '../lib/charset'
import { saveSettings } from '../lib/storage'
import { openMorseTables } from '../lib/tablesWindow'
import type { TestConfig } from '../types'

const props = defineProps<{ initial: TestConfig }>()
const emit = defineEmits<{ (e: 'start', config: TestConfig): void }>()

const form = reactive<TestConfig>({ ...props.initial })
const error = ref('')

const customAlphabet = computed(() => alphabetFor('custom', form.custom))

watch(
  () => [form.charset, form.custom] as const,
  ([charset, custom]) => saveSettings({ charset, custom }),
)

function start(): void {
  const speed = Math.min(200, Math.max(5, Math.round(form.speed) || 60))
  if (form.charset === 'custom' && customAlphabet.value.length === 0) {
    error.value = 'Введите хотя бы один поддерживаемый символ'
    return
  }
  error.value = ''
  emit('start', { speed, charset: form.charset, custom: form.custom })
}
</script>

<template>
  <section class="card">
    <h2>Начальные условия</h2>

    <label class="field">
      <span>Скорость передачи, знаков в минуту</span>
      <input v-model.number="form.speed" type="number" min="5" max="200" step="1" />
    </label>

    <label class="field">
      <span>Варианты символов</span>
      <select v-model="form.charset">
        <option v-for="opt in CHARSET_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>

    <label v-if="form.charset === 'custom'" class="field">
      <span>Свой набор символов</span>
      <input
        v-model="form.custom"
        type="text"
        placeholder="Например: АБВГД0123"
        autocomplete="off"
      />
      <small class="hint">
        Поддерживается {{ customAlphabet.length }} символ(ов). Неподдерживаемые символы игнорируются.
      </small>
    </label>

    <p v-if="error" class="error">{{ error }}</p>

    <div class="actions">
      <button class="primary" @click="start">Запуск теста</button>
      <button class="secondary" @click="openMorseTables">Показать символы и напевы</button>
    </div>
  </section>
</template>
