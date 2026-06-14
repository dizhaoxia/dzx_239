<script setup lang="ts">
import { Trophy, Zap, Target, Medal } from 'lucide-vue-next'
import { useHistoryStore } from '@/stores/history'

const historyStore = useHistoryStore()

function getMedalColor(rank: number): string {
  if (rank === 1) return 'text-amber-400'
  if (rank === 2) return 'text-slate-300'
  if (rank === 3) return 'text-amber-600'
  return 'text-slate-500'
}

function getMedalBg(rank: number): string {
  if (rank === 1) return 'bg-amber-400/20'
  if (rank === 2) return 'bg-slate-300/20'
  if (rank === 3) return 'bg-amber-600/20'
  return 'bg-slate-500/10'
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}
</script>

<template>
  <div class="leaderboard">
    <div class="list-header">
      <h3 class="list-title">
        <Trophy :size="18" class="text-amber-400" />
        排行榜
      </h3>
      <span class="count-badge">Top {{ Math.min(historyStore.leaderboard.length, 10) }}</span>
    </div>

    <div v-if="historyStore.leaderboard.length === 0" class="empty-state">
      <Medal :size="32" class="mx-auto mb-2 text-slate-600" />
      <p class="empty-text">暂无排行数据</p>
    </div>

    <div v-else class="ranking-list">
      <div
        v-for="(result, index) in historyStore.leaderboard"
        :key="result.id"
        class="ranking-item"
        :class="{ 'top-three': index < 3 }"
      >
        <div class="rank-badge" :class="[getMedalColor(index + 1), getMedalBg(index + 1)]">
          <span v-if="index < 3" class="medal-emoji">
            {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
          </span>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>

        <div class="ranking-info">
          <div class="ranking-title">{{ result.passageTitle }}</div>
          <div class="ranking-meta">
            <span class="meta-item">
              <Target :size="12" />
              {{ result.accuracy }}%
            </span>
            <span class="meta-item date-item">
              {{ result.date }}
            </span>
          </div>
        </div>

        <div class="ranking-wpm">
          <Zap :size="14" class="text-emerald-400" />
          <span class="wpm-number">{{ result.wpm }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard {
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
  background: rgba(251, 191, 36, 0.2);
  color: #fcd34d;
}

.empty-state {
  @apply py-8 text-center;
}

.empty-text {
  @apply text-slate-400 text-sm;
}

.ranking-list {
  @apply space-y-2;
}

.ranking-item {
  @apply flex items-center gap-3 p-3 rounded-xl transition-all duration-200;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
}

.ranking-item.top-three {
  background: rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.1);
}

.ranking-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.rank-badge {
  @apply w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm;
}

.medal-emoji {
  @apply text-base;
}

.rank-number {
  @apply text-slate-400;
}

.ranking-info {
  @apply flex-1 min-w-0;
}

.ranking-title {
  @apply text-sm text-white truncate;
}

.ranking-meta {
  @apply flex items-center gap-3 mt-1;
}

.meta-item {
  @apply flex items-center gap-1 text-xs text-slate-400;
}

.date-item {
  @apply text-slate-500;
}

.ranking-wpm {
  @apply flex items-center gap-1 flex-shrink-0;
}

.wpm-number {
  @apply text-lg font-bold text-emerald-400;
  font-family: 'JetBrains Mono', monospace;
}
</style>
