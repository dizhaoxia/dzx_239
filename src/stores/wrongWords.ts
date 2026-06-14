import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { WrongWord } from '@/types'
import { loadWrongWords, saveWrongWords, clearWrongWords, formatDate } from '@/utils/storage'

export const useWrongWordsStore = defineStore('wrongWords', () => {
  const wrongWords = ref<WrongWord[]>(loadWrongWords())

  const topWrongWords = computed(() => {
    return [...wrongWords.value]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  })

  const totalWrongCount = computed(() => {
    return wrongWords.value.reduce((sum, w) => sum + w.count, 0)
  })

  function addWrongWord(word: string) {
    const trimmedWord = word.trim()
    if (!trimmedWord) return

    const existing = wrongWords.value.find(w => w.word === trimmedWord)
    if (existing) {
      existing.count++
      existing.lastWrongDate = formatDate(new Date())
    } else {
      wrongWords.value.push({
        word: trimmedWord,
        count: 1,
        lastWrongDate: formatDate(new Date())
      })
    }
  }

  function addWrongWords(words: string[]) {
    words.forEach(word => addWrongWord(word))
  }

  function removeWrongWord(word: string) {
    const index = wrongWords.value.findIndex(w => w.word === word)
    if (index !== -1) {
      wrongWords.value.splice(index, 1)
    }
  }

  function clearAll() {
    wrongWords.value = []
    clearWrongWords()
  }

  watch(
    wrongWords,
    (newWords) => {
      saveWrongWords(newWords)
    },
    { deep: true }
  )

  return {
    wrongWords,
    topWrongWords,
    totalWrongCount,
    addWrongWord,
    addWrongWords,
    removeWrongWord,
    clearAll
  }
})
