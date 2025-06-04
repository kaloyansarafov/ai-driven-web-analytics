<template>
  <div class="relative flex flex-col items-center justify-center w-full h-full">
    <Doughnut :data="chartData" :options="chartOptions" class="w-full h-full" />
    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span class="text-2xl font-extrabold text-gray-900">{{ value }}<span v-if="showPercent">%</span></span>
    </div>
    <div v-if="label" class="mt-2 text-sm text-gray-500 font-medium text-center">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  value: { type: Number, required: true },
  color: { type: String, default: '#FACC15' },
  emptyColor: { type: String, default: '#E5E7EB' },
  label: { type: String, default: '' },
  showPercent: { type: Boolean, default: true },
  size: { type: [String, Number], default: 120 },
})

const chartData = computed(() => ({
  labels: [props.label, ''],
  datasets: [
    {
      data: [props.value, 100 - props.value],
      backgroundColor: [props.color, props.emptyColor],
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<style scoped>
.relative {
  width: 100%;
  max-width: 140px;
  min-width: 60px;
  height: auto;
  aspect-ratio: 1 / 1;
}
</style> 