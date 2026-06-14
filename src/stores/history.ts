import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { TestResult } from '@/types'
import { loadResults, saveResults, clearResults, generateId, formatDate } from '@/utils/storage'

export const useHistoryStore = defineStore('history', () => {
  const results = ref<TestResult[]>(loadResults())

  const leaderboard = computed(() => {
    return [...results.value].sort((a, b) => {
      if (b.wpm !== a.wpm) {
        return b.wpm - a.wpm
      }
      return b.accuracy - a.accuracy
    }).slice(0, 10)
  })

  const recentResults = computed(() => {
    return [...results.value].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 10)
  })

  const recentResultsForChart = computed(() => {
    return [...results.value].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-7)
  })

  const averageWpm = computed(() => {
    if (results.value.length === 0) return 0
    const sum = results.value.reduce((acc, r) => acc + r.wpm, 0)
    return Math.round(sum / results.value.length)
  })

  const bestWpm = computed(() => {
    if (results.value.length === 0) return 0
    return Math.max(...results.value.map(r => r.wpm))
  })

  const totalTests = computed(() => results.value.length)

  function addResult(data: Omit<TestResult, 'id' | 'date'>) {
    const result: TestResult = {
      id: generateId(),
      date: formatDate(new Date()),
      ...data
    }
    results.value.unshift(result)
    return result
  }

  function removeResult(id: string) {
    const index = results.value.findIndex(r => r.id === id)
    if (index !== -1) {
      results.value.splice(index, 1)
    }
  }

  function clearAll() {
    results.value = []
    clearResults()
  }

  watch(
    results,
    (newResults) => {
      saveResults(newResults)
    },
    { deep: true }
  )

  return {
    results,
    leaderboard,
    recentResults,
    recentResultsForChart,
    averageWpm,
    bestWpm,
    totalTests,
    addResult,
    removeResult,
    clearAll
  }
})
