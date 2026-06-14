<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Keyboard, Zap, Trophy, Target, BarChart3, Menu, X } from 'lucide-vue-next'
import { useTypingStore } from '@/stores/typing'
import { useHistoryStore } from '@/stores/history'
import { useWrongWordsStore } from '@/stores/wrongWords'
import { useTimer } from '@/composables/useTimer'
import { useWpmCalculator } from '@/composables/useWpmCalculator'
import { useTypingEngine } from '@/composables/useTypingEngine'
import TypingArea from '@/components/TypingArea.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import ControlButtons from '@/components/ControlButtons.vue'
import ResultModal from '@/components/ResultModal.vue'
import HistoryList from '@/components/HistoryList.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import TrendChart from '@/components/TrendChart.vue'
import WrongWordsPanel from '@/components/WrongWordsPanel.vue'

const typingStore = useTypingStore()
const historyStore = useHistoryStore()
const wrongWordsStore = useWrongWordsStore()
const typingAreaRef = ref<InstanceType<typeof TypingArea> | null>(null)

const { elapsedTime, formattedTime, start, pause, resume, stop, reset } = useTimer()

const { correctChars, accuracy, progress, isCompleted, wrongWords } = useTypingEngine(
  () => typingStore.targetText,
  () => typingStore.userInput
)

const { wpm } = useWpmCalculator(correctChars, elapsedTime)

const showResult = ref(false)
const finalResult = ref({
  wpm: 0,
  accuracy: 0,
  timeUsed: 0
})

const sidebarOpen = ref(true)

function handleInputStart() {
  typingStore.startTyping()
  start()
}

function handleComplete() {
  stop()
  typingStore.completeTyping()

  finalResult.value = {
    wpm: wpm.value,
    accuracy: accuracy.value,
    timeUsed: elapsedTime.value
  }

  if (typingStore.currentPassage) {
    historyStore.addResult({
      wpm: wpm.value,
      accuracy: accuracy.value,
      timeUsed: elapsedTime.value,
      passageId: typingStore.currentPassage.id,
      passageTitle: typingStore.currentPassage.title
    })
  }

  if (wrongWords.value.length > 0) {
    wrongWordsStore.addWrongWords(wrongWords.value)
  }

  showResult.value = true
}



function handleShuffle() {
  typingStore.selectRandomPassage()
  reset()
  showResult.value = false
  setTimeout(() => {
    typingAreaRef.value?.focusInput()
  }, 100)
}

function handleTogglePause() {
  if (typingStore.isPaused) {
    typingStore.resumeTyping()
    resume()
  } else {
    typingStore.pauseTyping()
    pause()
  }
}

function handleReset() {
  typingStore.resetTyping()
  reset()
  showResult.value = false
  setTimeout(() => {
    typingAreaRef.value?.focusInput()
  }, 100)
}

function handleRetry() {
  showResult.value = false
  typingStore.resetTyping()
  reset()
  setTimeout(() => {
    typingAreaRef.value?.focusInput()
  }, 100)
}

function handleNewTest() {
  handleShuffle()
}

onMounted(() => {
  typingStore.selectRandomPassage()
  setTimeout(() => {
    typingAreaRef.value?.focusInput()
  }, 300)
})
</script>

<template>
  <div class="min-h-screen flex">
    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-6 py-4 flex items-center justify-between border-b border-indigo-500/20">
        <div class="flex items-center gap-3">
          <button
            class="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            @click="sidebarOpen = !sidebarOpen"
          >
            <Menu v-if="!sidebarOpen" :size="24" />
            <X v-else :size="24" />
          </button>
          <div class="logo-icon">
            <Keyboard :size="28" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">打字速度测试器</h1>
            <p class="text-xs text-slate-400">Type Master</p>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-6">
          <div class="stat-mini">
            <Zap :size="16" class="text-emerald-400" />
            <span>最佳: <strong class="text-emerald-400">{{ historyStore.bestWpm }}</strong></span>
          </div>
          <div class="stat-mini">
            <Target :size="16" class="text-blue-400" />
            <span>平均: <strong class="text-blue-400">{{ historyStore.averageWpm }}</strong></span>
          </div>
          <div class="stat-mini">
            <Trophy :size="16" class="text-amber-400" />
            <span>总测试: <strong class="text-amber-400">{{ historyStore.totalTests }}</strong></span>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6 lg:p-8 overflow-auto">
        <div class="max-w-4xl mx-auto">
          <div v-if="typingStore.currentPassage" class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="typingStore.currentPassage.language === 'en' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'"
                >
                  {{ typingStore.currentPassage.language === 'en' ? 'English' : '中文' }}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300">
                  难度 {{ typingStore.currentPassage.difficulty }}
                </span>
              </div>
              <h2 class="text-lg font-semibold text-slate-200">
                {{ typingStore.currentPassage.title }}
              </h2>
            </div>
          </div>

          <StatsPanel
            :time="formattedTime"
            :wpm="wpm"
            :accuracy="accuracy"
            :progress="progress"
          />

          <TypingArea
            ref="typingAreaRef"
            @input-start="handleInputStart"
            @complete="handleComplete"
          />

          <ControlButtons
            :is-started="typingStore.isStarted"
            :is-paused="typingStore.isPaused"
            :is-completed="typingStore.isCompleted"
            @shuffle="handleShuffle"
            @toggle-pause="handleTogglePause"
            @reset="handleReset"
          />

          <div class="md:hidden mt-8 space-y-6">
            <WrongWordsPanel />
            <Leaderboard />
            <TrendChart />
            <HistoryList />
          </div>
        </div>
      </main>
    </div>

    <aside
      class="hidden lg:block w-80 xl:w-96 border-l border-indigo-500/20 overflow-y-auto"
      :class="{ 'hidden': !sidebarOpen, 'fixed inset-y-0 right-0 z-40 bg-primary-950/95 backdrop-blur-xl': sidebarOpen }"
    >
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between lg:hidden">
          <h3 class="font-semibold text-white">统计数据</h3>
          <button
            class="p-2 rounded-lg hover:bg-white/10 transition-colors"
            @click="sidebarOpen = false"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="stat-card-mini">
            <Trophy :size="18" class="text-amber-400" />
            <span class="stat-value-mini text-amber-400">{{ historyStore.bestWpm }}</span>
            <span class="stat-label-mini">最佳</span>
          </div>
          <div class="stat-card-mini">
            <BarChart3 :size="18" class="text-blue-400" />
            <span class="stat-value-mini text-blue-400">{{ historyStore.averageWpm }}</span>
            <span class="stat-label-mini">平均</span>
          </div>
          <div class="stat-card-mini">
            <Zap :size="18" class="text-emerald-400" />
            <span class="stat-value-mini text-emerald-400">{{ historyStore.totalTests }}</span>
            <span class="stat-label-mini">总数</span>
          </div>
        </div>

        <WrongWordsPanel />
        <Leaderboard />
        <TrendChart />
        <HistoryList />
      </div>
    </aside>

    <ResultModal
      :visible="showResult"
      :wpm="finalResult.wpm"
      :accuracy="finalResult.accuracy"
      :time-used="finalResult.timeUsed"
      :passage-title="typingStore.currentPassage?.title || ''"
      @close="showResult = false"
      @retry="handleRetry"
      @new-test="handleNewTest"
    />
  </div>
</template>

<style scoped>
.logo-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  color: #a5b4fc;
  box-shadow: 0 4px 20px -5px rgba(139, 92, 246, 0.3);
}

.stat-mini {
  @apply flex items-center gap-2 text-sm text-slate-400;
}

.stat-card-mini {
  @apply flex flex-col items-center justify-center p-4 rounded-xl gap-1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-value-mini {
  @apply text-xl font-bold;
  font-family: 'JetBrains Mono', monospace;
}

.stat-label-mini {
  @apply text-xs text-slate-500;
}
</style>
