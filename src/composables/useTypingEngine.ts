import { ref, computed } from 'vue'
import type { CharState } from '@/types'

export function useTypingEngine(targetText: () => string, userInput: () => string) {
  const charStates = computed<CharState[]>(() => {
    const target = targetText()
    const input = userInput()
    const states: CharState[] = []
    const inputLength = input.length

    for (let i = 0; i < target.length; i++) {
      const char = target[i]
      let status: CharState['status'] = 'pending'

      if (i < inputLength) {
        status = input[i] === char ? 'correct' : 'incorrect'
      } else if (i === inputLength) {
        status = 'current'
      }

      states.push({ char, status })
    }

    return states
  })

  const correctChars = computed(() => {
    const input = userInput()
    const target = targetText()
    let correct = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) {
        correct++
      }
    }
    return correct
  })

  const incorrectChars = computed(() => {
    const input = userInput()
    const target = targetText()
    let incorrect = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== target[i]) {
        incorrect++
      }
    }
    return incorrect
  })

  const totalTyped = computed(() => userInput().length)

  const accuracy = computed(() => {
    const typed = totalTyped.value
    if (typed === 0) return 100
    return Math.round((correctChars.value / typed) * 100)
  })

  const progress = computed(() => {
    const target = targetText()
    const input = userInput()
    if (target.length === 0) return 0
    return Math.round((input.length / target.length) * 100)
  })

  const isCompleted = computed(() => {
    return userInput().length >= targetText().length
  })

  const wrongWords = computed(() => {
    const target = targetText()
    const input = userInput()
    if (input.length === 0) return []

    const words: string[] = []
    let currentWordStart = 0
    let hasErrorInWord = false
    let currentWord = ''

    for (let i = 0; i < input.length; i++) {
      const targetChar = target[i]
      const inputChar = input[i]

      if (targetChar === ' ' || targetChar === undefined) {
        if (hasErrorInWord && currentWord.trim()) {
          words.push(currentWord.trim())
        }
        currentWordStart = i + 1
        hasErrorInWord = false
        currentWord = ''
      } else {
        if (inputChar !== targetChar) {
          hasErrorInWord = true
        }
        currentWord += targetChar
      }
    }

    if (input.length >= target.length) {
      if (hasErrorInWord && currentWord.trim()) {
        words.push(currentWord.trim())
      }
    }

    return words
  })

  return {
    charStates,
    correctChars,
    incorrectChars,
    totalTyped,
    accuracy,
    progress,
    isCompleted,
    wrongWords
  }
}
