<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useTypingStore } from '@/stores/typing'
import { useTypingEngine } from '@/composables/useTypingEngine'

const emit = defineEmits<{
  (e: 'input-start'): void
  (e: 'complete'): void
}>()

const typingStore = useTypingStore()
const inputRef = ref<HTMLInputElement | null>(null)

const { charStates, correctChars, incorrectChars, totalTyped, accuracy, progress, isCompleted } =
  useTypingEngine(
    () => typingStore.targetText,
    () => typingStore.userInput
  )

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (!typingStore.isStarted && value.length > 0) {
    emit('input-start')
  }

  typingStore.updateInput(value)

  if (isCompleted.value) {
    emit('complete')
  }
}

const focusInput = () => {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

defineExpose({ focusInput, correctChars, accuracy, progress })
</script>

<template>
  <div class="typing-area" @click="focusInput">
    <div class="passage-display" :class="{ 'paused': typingStore.isPaused }">
      <span
        v-for="(charState, index) in charStates"
        :key="index"
        class="char"
        :class="[
          charState.status,
          { 'shake': charState.status === 'incorrect' && index === totalTyped - 1 }
        ]"
      >
        {{ charState.char === ' ' ? '\u00A0' : charState.char }}
      </span>
    </div>

    <div class="input-wrapper">
      <input
        ref="inputRef"
        type="text"
        :value="typingStore.userInput"
        @input="handleInput"
        :disabled="typingStore.isPaused || typingStore.isCompleted"
        class="typing-input"
        :class="{ 'paused': typingStore.isPaused }"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="点击这里开始输入..."
      />
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<style scoped>
.typing-area {
  @apply w-full cursor-text;
}

.passage-display {
  @apply p-6 rounded-2xl mb-6 leading-relaxed text-xl;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(49, 46, 129, 0.6) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.2);
  transition: all 0.3s ease;
}

.passage-display.paused {
  @apply opacity-50;
}

.char {
  @apply transition-all duration-75 inline-block;
}

.char.pending {
  @apply text-slate-400;
}

.char.correct {
  @apply text-emerald-400;
  animation: correctPop 0.15s ease;
}

.char.incorrect {
  @apply text-rose-500 bg-rose-500/20 rounded;
}

.char.current {
  @apply text-amber-400;
  border-bottom: 2px solid #f59e0b;
  animation: blink 1s infinite;
}

.char.shake {
  animation: shake 0.3s ease;
}

@keyframes correctPop {
  0% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes blink {
  0%, 50% { border-color: #f59e0b; }
  51%, 100% { border-color: transparent; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.input-wrapper {
  @apply relative;
}

.typing-input {
  @apply w-full px-6 py-4 text-lg bg-transparent outline-none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7) 1;
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.typing-input:focus {
  box-shadow: 0 4px 20px -5px rgba(139, 92, 246, 0.4);
}

.typing-input.paused {
  @apply opacity-50 cursor-not-allowed;
}

.typing-input::placeholder {
  @apply text-slate-500;
}

.progress-bar {
  @apply h-2 mt-4 rounded-full overflow-hidden;
  background: rgba(100, 116, 139, 0.2);
}

.progress-fill {
  @apply h-full rounded-full transition-all duration-200;
  background: linear-gradient(90deg, #10b981, #059669);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}
</style>
