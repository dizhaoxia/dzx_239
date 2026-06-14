<script setup lang="ts">
import { AlertTriangle, Flame, X } from 'lucide-vue-next'
import { useWrongWordsStore } from '@/stores/wrongWords'

const wrongWordsStore = useWrongWordsStore()

function getRankColor(rank: number): string {
  if (rank === 0) return 'text-rose-400'
  if (rank === 1) return 'text-orange-400'
  return 'text-amber-400'
}

function getRankBg(rank: number): string {
  if (rank === 0) return 'bg-rose-500/20'
  if (rank === 1) return 'bg-orange-500/20'
  return 'bg-amber-500/20'
}

function handleRemove(word: string) {
  wrongWordsStore.removeWrongWord(word)
}
</script>

<template>
  <div class="wrong-words-panel">
    <div class="list-header">
      <h3 class="list-title">
        <Flame :size="18" class="text-rose-400" />
        易错热词
      </h3>
      <span class="count-badge">Top 3</span>
    </div>

    <div v-if="wrongWordsStore.topWrongWords.length === 0" class="empty-state">
      <AlertTriangle :size="32" class="mx-auto mb-2 text-slate-600" />
      <p class="empty-text">暂无易错词记录</p>
      <p class="empty-hint">继续练习以追踪易错词汇</p>
    </div>

    <div v-else class="words-list">
      <div
        v-for="(item, index) in wrongWordsStore.topWrongWords"
        :key="item.word"
        class="word-item"
      >
        <div class="word-rank" :class="[getRankColor(index), getRankBg(index)]">
          {{ index + 1 }}
        </div>
        <div class="word-info">
          <div class="word-text">{{ item.word }}</div>
          <div class="word-meta">
            <span class="error-count">
              错误 {{ item.count }} 次
            </span>
          </div>
        </div>
        <button class="remove-btn" @click="handleRemove(item.word)">
          <X :size="14" />
        </button>
      </div>
    </div>

    <button
      v-if="wrongWordsStore.wrongWords.length > 0"
      class="clear-all-btn"
      @click="wrongWordsStore.clearAll()"
    >
      清空所有记录
    </button>
  </div>
</template>

<style scoped>
.wrong-words-panel {
  @apply rounded-2xl p-5;
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(49, 46, 129, 0.4) 100%);
  border: 1px solid rgba(244, 63, 94, 0.15);
}

.list-header {
  @apply flex items-center justify-between mb-4;
}

.list-title {
  @apply flex items-center gap-2 text-lg font-semibold text-white;
}

.count-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
}

.empty-state {
  @apply py-8 text-center;
}

.empty-text {
  @apply text-slate-400 mb-1;
}

.empty-hint {
  @apply text-slate-500 text-sm;
}

.words-list {
  @apply space-y-2;
}

.word-item {
  @apply flex items-center gap-3 p-3 rounded-xl transition-all duration-200;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
}

.word-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(244, 63, 94, 0.2);
}

.word-rank {
  @apply w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm;
}

.word-info {
  @apply flex-1 min-w-0;
}

.word-text {
  @apply text-sm font-medium text-white truncate;
  font-family: 'JetBrains Mono', monospace;
}

.word-meta {
  @apply flex items-center gap-2 mt-1;
}

.error-count {
  @apply text-xs text-rose-400;
}

.remove-btn {
  @apply p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors;
}

.remove-btn:hover {
  background: rgba(244, 63, 94, 0.2);
}

.clear-all-btn {
  @apply w-full mt-4 py-2 text-sm text-slate-400 hover:text-rose-400 transition-colors rounded-lg;
}

.clear-all-btn:hover {
  background: rgba(244, 63, 94, 0.1);
}
</style>
