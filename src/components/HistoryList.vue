<script setup lang="ts">
import { Clock, Zap, Target, Trash2, Calendar } from 'lucide-vue-next'
import { useHistoryStore } from '@/stores/history'

const historyStore = useHistoryStore()

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function handleRemove(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    historyStore.removeResult(id)
  }
}
</script>

<template>
  <div class="history-list">
    <div class="list-header">
      <h3 class="list-title">
        <Calendar :size="18" />
        历史记录
      </h3>
      <span class="count-badge">{{ historyStore.recentResults.length }}</span>
    </div>

    <div v-if="historyStore.recentResults.length === 0" class="empty-state">
      <p class="empty-text">暂无测试记录</p>
      <p class="empty-hint">完成一次打字测试后记录将显示在这里</p>
    </div>

    <div v-else class="list-container">
      <div
        v-for="result in historyStore.recentResults"
        :key="result.id"
        class="history-item"
      >
        <div class="item-main">
          <div class="item-wpm">
            <Zap :size="14" class="text-emerald-400" />
            <span class="wpm-value">{{ result.wpm }}</span>
          </div>
          <div class="item-details">
            <div class="item-title">{{ result.passageTitle }}</div>
            <div class="item-meta">
              <span class="meta-item">
                <Target :size="12" />
                {{ result.accuracy }}%
              </span>
              <span class="meta-item">
                <Clock :size="12" />
                {{ formatTime(result.timeUsed) }}
              </span>
            </div>
          </div>
        </div>
        <div class="item-right">
          <span class="item-date">{{ result.date }}</span>
          <button class="delete-btn" @click="handleRemove(result.id)">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <button
      v-if="historyStore.recentResults.length > 0"
      class="clear-all-btn"
      @click="historyStore.clearAll()"
    >
      清空所有记录
    </button>
  </div>
</template>

<style scoped>
.history-list {
  @apply rounded-2xl p-5;
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(49, 46, 129, 0.4) 100%);
  border: 1px solid rgba(129, 140, 248, 0.15);
}

.list-header {
  @apply flex items-center justify-between mb-4;
}

.list-title {
  @apply flex items-center gap-2 text-lg font-semibold text-white;
}

.count-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
}

.empty-state {
  @apply py-8 text-center;
}

.empty-text {
  @apply text-slate-400 mb-2;
}

.empty-hint {
  @apply text-slate-500 text-sm;
}

.list-container {
  @apply space-y-2 max-h-80 overflow-y-auto;
}

.list-container::-webkit-scrollbar {
  width: 4px;
}

.list-container::-webkit-scrollbar-track {
  background: transparent;
}

.list-container::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.3);
  border-radius: 2px;
}

.history-item {
  @apply flex items-center justify-between p-3 rounded-xl transition-all duration-200;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(129, 140, 248, 0.2);
}

.item-main {
  @apply flex items-center gap-3 flex-1 min-w-0;
}

.item-wpm {
  @apply flex items-center gap-1 flex-shrink-0;
}

.wpm-value {
  @apply text-xl font-bold text-emerald-400;
  font-family: 'JetBrains Mono', monospace;
}

.item-details {
  @apply flex-1 min-w-0;
}

.item-title {
  @apply text-sm text-white truncate;
}

.item-meta {
  @apply flex items-center gap-3 mt-1;
}

.meta-item {
  @apply flex items-center gap-1 text-xs text-slate-400;
}

.item-right {
  @apply flex items-center gap-2 flex-shrink-0;
}

.item-date {
  @apply text-xs text-slate-500;
}

.delete-btn {
  @apply p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors;
}

.delete-btn:hover {
  background: rgba(244, 63, 94, 0.2);
}

.clear-all-btn {
  @apply w-full mt-4 py-2 text-sm text-slate-400 hover:text-rose-400 transition-colors rounded-lg;
}

.clear-all-btn:hover {
  background: rgba(244, 63, 94, 0.1);
}
</style>
