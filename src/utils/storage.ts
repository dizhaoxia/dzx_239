import type { TestResult, WrongWord } from '@/types'

const STORAGE_KEY = 'typing_test_results'
const WRONG_WORDS_KEY = 'typing_wrong_words'

export function saveResults(results: TestResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
  } catch (error) {
    console.error('Failed to save results to localStorage:', error)
  }
}

export function loadResults(): TestResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to load results from localStorage:', error)
  }
  return []
}

export function clearResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear results from localStorage:', error)
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const tenths = Math.floor((seconds % 1) * 10)
  return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`
}

export function saveWrongWords(words: WrongWord[]): void {
  try {
    localStorage.setItem(WRONG_WORDS_KEY, JSON.stringify(words))
  } catch (error) {
    console.error('Failed to save wrong words to localStorage:', error)
  }
}

export function loadWrongWords(): WrongWord[] {
  try {
    const data = localStorage.getItem(WRONG_WORDS_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to load wrong words from localStorage:', error)
  }
  return []
}

export function clearWrongWords(): void {
  try {
    localStorage.removeItem(WRONG_WORDS_KEY)
  } catch (error) {
    console.error('Failed to clear wrong words from localStorage:', error)
  }
}
