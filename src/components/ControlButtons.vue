<script setup lang="ts">
import { Shuffle, Pause, Play, RotateCcw } from 'lucide-vue-next'

interface Props {
  isStarted: boolean
  isPaused: boolean
  isCompleted: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'shuffle'): void
  (e: 'toggle-pause'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="control-buttons">
    <button class="control-btn shuffle" @click="emit('shuffle')" :disabled="isStarted && !isCompleted">
      <Shuffle :size="20" />
      <span>换一篇</span>
    </button>

    <button
      class="control-btn pause"
      @click="emit('toggle-pause')"
      :disabled="!isStarted || isCompleted"
    >
      <Pause v-if="!isPaused" :size="20" />
      <Play v-else :size="20" />
      <span>{{ isPaused ? '继续' : '暂停' }}</span>
    </button>

    <button class="control-btn reset" @click="emit('reset')">
      <RotateCcw :size="20" />
      <span>重置</span>
    </button>
  </div>
</template>

<style scoped>
.control-buttons {
  @apply flex flex-wrap gap-4 justify-center mt-6;
}

.control-btn {
  @apply flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300;
  @apply disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none;
  border: 1px solid transparent;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
}

.control-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.control-btn.shuffle {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-color: rgba(139, 92, 246, 0.3);
  color: #a5b4fc;
}

.control-btn.shuffle:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 8px 30px -10px rgba(139, 92, 246, 0.4);
}

.control-btn.pause {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
  border-color: rgba(245, 158, 11, 0.3);
  color: #fcd34d;
}

.control-btn.pause:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%);
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow: 0 8px 30px -10px rgba(245, 158, 11, 0.4);
}

.control-btn.reset {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(225, 29, 72, 0.2) 100%);
  border-color: rgba(244, 63, 94, 0.3);
  color: #fda4af;
}

.control-btn.reset:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.3) 0%, rgba(225, 29, 72, 0.3) 100%);
  border-color: rgba(244, 63, 94, 0.5);
  box-shadow: 0 8px 30px -10px rgba(244, 63, 94, 0.4);
}
</style>
