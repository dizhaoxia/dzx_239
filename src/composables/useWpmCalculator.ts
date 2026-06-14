import { computed, type Ref } from 'vue'

export function useWpmCalculator(
  correctChars: Ref<number>,
  elapsedTime: Ref<number>
) {
  const wpm = computed(() => {
    if (elapsedTime.value <= 0 || correctChars.value <= 0) return 0
    const minutes = elapsedTime.value / 60
    const words = correctChars.value / 5
    return Math.round(words / minutes)
  })

  return { wpm }
}
