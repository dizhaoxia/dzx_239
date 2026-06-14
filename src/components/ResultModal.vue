<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Trophy, Clock, Target, Zap, X, RotateCcw, Medal } from 'lucide-vue-next'

interface Props {
  visible: boolean
  wpm: number
  accuracy: number
  timeUsed: number
  passageTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'retry'): void
  (e: 'new-test'): void
}>()

const displayWpm = ref(0)
const displayAccuracy = ref(0)
const displayTime = ref(0)

function animateValue(target: number, setter: (val: number) => void, duration: number = 1000) {
  const start = 0
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(start + (target - start) * easeOut))
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      displayWpm.value = 0
      displayAccuracy.value = 0
      displayTime.value = 0
      setTimeout(() => {
        animateValue(props.wpm, (v) => (displayWpm.value = v))
        animateValue(props.accuracy, (v) => (displayAccuracy.value = v))
        animateValue(props.timeUsed, (v) => (displayTime.value = v), 1200)
      }, 200)
    }
  }
)

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const tenths = Math.floor((seconds % 1) * 10)
  return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`
}

function getWpmLevel(wpm: number): { label: string; color: string; emoji: string } {
  if (wpm >= 80) return { label: '打字大师', color: 'from-amber-400 to-orange-500', emoji: '🏆' }
  if (wpm >= 60) return { label: '速度很快', color: 'from-emerald-400 to-teal-500', emoji: '⚡' }
  if (wpm >= 40) return { label: '中等水平', color: 'from-blue-400 to-indigo-500', emoji: '👍' }
  if (wpm >= 20) return { label: '继续加油', color: 'from-sky-400 to-cyan-500', emoji: '💪' }
  return { label: '初学者', color: 'from-slate-400 to-slate-500', emoji: '🌱' }
}

const wpmLevel = ref(getWpmLevel(0))
watch(
  () => props.wpm,
  (newWpm) => {
    wpmLevel.value = getWpmLevel(newWpm)
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
          <button class="close-btn" @click="emit('close')">
            <X :size="20" />
          </button>

          <div class="trophy-icon">
            <Trophy :size="48" />
          </div>

          <h2 class="result-title">测试完成！</h2>
          <p class="passage-name">{{ passageTitle }}</p>

          <div class="wpm-display">
            <span class="wpm-number" :class="`bg-gradient-to-r ${wpmLevel.color}`">
              {{ displayWpm }}
            </span>
            <span class="wpm-label">WPM</span>
          </div>

          <div class="level-badge" :class="`bg-gradient-to-r ${wpmLevel.color}`">
            <span class="level-emoji">{{ wpmLevel.emoji }}</span>
            {{ wpmLevel.label }}
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <Clock :size="20" class="stat-icon time" />
              <div class="stat-text">
                <span class="stat-item-label">用时</span>
                <span class="stat-item-value">{{ formatTime(displayTime) }}</span>
              </div>
            </div>
            <div class="stat-item">
              <Target :size="20" class="stat-icon accuracy" />
              <div class="stat-text">
                <span class="stat-item-label">正确率</span>
                <span class="stat-item-value">{{ displayAccuracy }}%</span>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="action-btn retry" @click="emit('retry')">
              <RotateCcw :size="18" />
              再来一次
            </button>
            <button class="action-btn new" @click="emit('new-test')">
              <Medal :size="18" />
              新的挑战
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.modal-content {
  @apply relative w-full max-w-md p-8 rounded-3xl text-center;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  border: 1px solid rgba(129, 140, 248, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px -15px rgba(139, 92, 246, 0.3);
  animation: modalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalEnter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-btn {
  @apply absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white transition-colors;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.trophy-icon {
  @apply w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.1) 100%);
  color: #fbbf24;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.result-title {
  @apply text-2xl font-bold text-white mb-2;
}

.passage-name {
  @apply text-slate-400 mb-6;
}

.wpm-display {
  @apply flex flex-col items-center mb-4;
}

.wpm-number {
  @apply text-7xl font-bold mb-1;
  font-family: 'JetBrains Mono', monospace;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.wpm-label {
  @apply text-slate-400 text-sm tracking-widest;
}

.level-badge {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-sm mb-8;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.3);
}

.level-emoji {
  @apply text-lg;
}

.stats-grid {
  @apply grid grid-cols-2 gap-4 mb-8;
}

.stat-item {
  @apply flex items-center gap-3 p-4 rounded-xl;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  @apply flex-shrink-0;
}

.stat-icon.time {
  color: #60a5fa;
}

.stat-icon.accuracy {
  color: #34d399;
}

.stat-text {
  @apply flex flex-col items-start;
}

.stat-item-label {
  @apply text-xs text-slate-400;
}

.stat-item-value {
  @apply text-lg font-bold text-white;
  font-family: 'JetBrains Mono', monospace;
}

.action-buttons {
  @apply flex gap-4;
}

.action-btn {
  @apply flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.retry {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border: 1px solid rgba(139, 92, 246, 0.5);
  color: #a5b4fc;
}

.action-btn.retry:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%);
  box-shadow: 0 8px 30px -10px rgba(139, 92, 246, 0.4);
}

.action-btn.new {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #6ee7b7;
}

.action-btn.new:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.4) 100%);
  box-shadow: 0 8px 30px -10px rgba(16, 185, 129, 0.4);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}
</style>
