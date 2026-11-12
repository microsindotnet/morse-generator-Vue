<script setup lang="ts">
import { CYRILLIC, DIGITS, LATIN, type MorseEntry } from '../lib/morse'

interface Group {
  title: string
  entries: [string, MorseEntry][]
}

const groups: Group[] = [
  { title: 'Латиница (LATIN)', entries: Object.entries(LATIN) },
  { title: 'Кириллица (CYRILLIC)', entries: Object.entries(CYRILLIC) },
  { title: 'Цифры (DIGITS)', entries: Object.entries(DIGITS) },
]

function renderCode(code: string): string {
  return code.replace(/\./g, '·').replace(/-/g, '−')
}
</script>

<template>
  <section class="tables">
    <h1>Символы и напевы кода Морзе</h1>

    <div v-for="group in groups" :key="group.title" class="tables-group">
      <h2>{{ group.title }}</h2>
      <table>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Код</th>
            <th>Напев</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[ch, entry] in group.entries" :key="ch">
            <td class="sym">{{ ch }}</td>
            <td class="code">{{ renderCode(entry.code) }}</td>
            <td class="chant">{{ entry.chant || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
