import { ref, onUnmounted, computed } from 'vue'

export function useTimer() {
  const startTime = ref<number>(0)
  const elapsedTime = ref<number>(0)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const pauseStartTime = ref<number>(0)
  const totalPausedTime = ref<number>(0)
  let animationFrameId: number | null = null

  const formattedTime = computed(() => {
    const totalSeconds = elapsedTime.value
    const mins = Math.floor(totalSeconds / 60)
    const secs = Math.floor(totalSeconds % 60)
    const tenths = Math.floor((totalSeconds % 1) * 10)
    return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`
  })

  function tick() {
    if (!isRunning.value || isPaused.value) return
    const now = performance.now()
    elapsedTime.value = (now - startTime.value - totalPausedTime.value) / 1000
    animationFrameId = requestAnimationFrame(tick)
  }

  function start() {
    if (isRunning.value) return
    startTime.value = performance.now()
    elapsedTime.value = 0
    totalPausedTime.value = 0
    isRunning.value = true
    isPaused.value = false
    animationFrameId = requestAnimationFrame(tick)
  }

  function pause() {
    if (!isRunning.value || isPaused.value) return
    isPaused.value = true
    pauseStartTime.value = performance.now()
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  function resume() {
    if (!isRunning.value || !isPaused.value) return
    const pauseEndTime = performance.now()
    totalPausedTime.value += pauseEndTime - pauseStartTime.value
    isPaused.value = false
    animationFrameId = requestAnimationFrame(tick)
  }

  function stop() {
    isRunning.value = false
    isPaused.value = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  function reset() {
    stop()
    startTime.value = 0
    elapsedTime.value = 0
    totalPausedTime.value = 0
    pauseStartTime.value = 0
  }

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    elapsedTime,
    isRunning,
    isPaused,
    formattedTime,
    start,
    pause,
    resume,
    stop,
    reset
  }
}
