<script setup lang="ts">
import { Clock, Zap, Target, BarChart3 } from 'lucide-vue-next'

interface Props {
  time: string
  wpm: number
  accuracy: number
  progress: number
}

defineProps<Props>()
</script>

<template>
  <div class="stats-panel">
    <div class="stat-card">
      <div class="stat-icon timer">
        <Clock :size="24" />
      </div>
      <div class="stat-info">
        <span class="stat-label">用时</span>
        <span class="stat-value time-value">{{ time }}</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon wpm">
        <Zap :size="24" />
      </div>
      <div class="stat-info">
        <span class="stat-label">WPM</span>
        <span class="stat-value wpm-value">{{ wpm }}</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon accuracy">
        <Target :size="24" />
      </div>
      <div class="stat-info">
        <span class="stat-label">正确率</span>
        <span class="stat-value accuracy-value">{{ accuracy }}%</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon progress">
        <BarChart3 :size="24" />
      </div>
      <div class="stat-info">
        <span class="stat-label">进度</span>
        <span class="stat-value progress-value">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8;
}

.stat-card {
  @apply flex items-center gap-4 p-4 rounded-xl;
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(49, 46, 129, 0.5) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(129, 140, 248, 0.15);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 8px 30px -10px rgba(139, 92, 246, 0.3);
}

.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center;
  transition: all 0.3s ease;
}

.stat-icon.timer {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%);
  color: #60a5fa;
}

.stat-icon.wpm {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%);
  color: #34d399;
}

.stat-icon.accuracy {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.1) 100%);
  color: #fbbf24;
}

.stat-icon.progress {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 100%);
  color: #c084fc;
}

.stat-info {
  @apply flex flex-col;
}

.stat-label {
  @apply text-xs text-slate-400 mb-1;
}

.stat-value {
  @apply text-2xl font-bold;
  font-family: 'JetBrains Mono', monospace;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.time-value {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.wpm-value {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.accuracy-value {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-value {
  background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
