import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Passage } from '@/types'
import { getRandomPassage } from '@/data/passages'

export const useTypingStore = defineStore('typing', () => {
  const currentPassage = ref<Passage | null>(null)
  const userInput = ref('')
  const isStarted = ref(false)
  const isPaused = ref(false)
  const isCompleted = ref(false)

  const targetText = computed(() => currentPassage.value?.content || '')

  function selectRandomPassage() {
    currentPassage.value = getRandomPassage()
    resetTyping()
  }

  function startTyping() {
    if (!isStarted.value) {
      isStarted.value = true
      isPaused.value = false
    }
  }

  function pauseTyping() {
    if (isStarted.value && !isCompleted.value) {
      isPaused.value = true
    }
  }

  function resumeTyping() {
    if (isPaused.value) {
      isPaused.value = false
    }
  }

  function completeTyping() {
    isCompleted.value = true
  }

  function resetTyping() {
    userInput.value = ''
    isStarted.value = false
    isPaused.value = false
    isCompleted.value = false
  }

  function updateInput(value: string) {
    if (!isPaused.value && !isCompleted.value) {
      userInput.value = value
    }
  }

  return {
    currentPassage,
    userInput,
    isStarted,
    isPaused,
    isCompleted,
    targetText,
    selectRandomPassage,
    startTyping,
    pauseTyping,
    resumeTyping,
    completeTyping,
    resetTyping,
    updateInput
  }
})
