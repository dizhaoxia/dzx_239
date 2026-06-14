<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { TrendingUp } from 'lucide-vue-next'
import { useHistoryStore } from '@/stores/history'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const historyStore = useHistoryStore()

const chartData = computed(() => {
  const recentResults = historyStore.recentResultsForChart

  const labels = recentResults.map((_, index) => `#${index + 1}`)
  const wpmData = recentResults.map(r => r.wpm)
  const accuracyData = recentResults.map(r => r.accuracy)

  return {
    labels,
    datasets: [
      {
        label: 'WPM',
        data: wpmData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#10b981',
        pointHoverBackgroundColor: '#34d399',
        pointHoverBorderColor: '#34d399',
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y'
      },
      {
        label: '正确率 %',
        data: accuracyData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#6366f1',
        pointHoverBackgroundColor: '#818cf8',
        pointHoverBorderColor: '#818cf8',
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#94a3b8',
        usePointStyle: true,
        padding: 20,
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(30, 27, 75, 0.95)',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(129, 140, 248, 0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 10
        }
      }
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      min: 0,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#10b981',
        font: {
          size: 10
        }
      },
      title: {
        display: true,
        text: 'WPM',
        color: '#10b981',
        font: {
          size: 11
        }
      }
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      min: 0,
      max: 100,
      grid: {
        drawOnChartArea: false
      },
      ticks: {
        color: '#6366f1',
        font: {
          size: 10
        }
      },
      title: {
        display: true,
        text: '正确率 %',
        color: '#6366f1',
        font: {
          size: 11
        }
      }
    }
  }
}

const hasData = computed(() => historyStore.results.length >= 2)
</script>

<template>
  <div class="trend-chart">
    <div class="list-header">
      <h3 class="list-title">
        <TrendingUp :size="18" class="text-emerald-400" />
        成绩趋势
      </h3>
    </div>

    <div v-if="!hasData" class="empty-state">
      <TrendingUp :size="32" class="mx-auto mb-2 text-slate-600" />
      <p class="empty-text">需要至少 2 条记录</p>
      <p class="empty-hint">完成更多测试以查看趋势</p>
    </div>

    <div v-else class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.trend-chart {
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

.empty-state {
  @apply py-8 text-center;
}

.empty-text {
  @apply text-slate-400 mb-1;
}

.empty-hint {
  @apply text-slate-500 text-sm;
}

.chart-container {
  @apply h-64;
}
</style>
