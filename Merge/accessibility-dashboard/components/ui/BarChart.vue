<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  color: { type: String, default: '#3B82F6' },
  label: { type: String, default: '' },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.values,
      backgroundColor: props.color,
      borderRadius: 12,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
      maxBarThickness: 24,
    },
  ],
}))

const chartOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    // datalabels: {
    //   anchor: 'end',
    //   align: 'end',
    //   color: '#374151',
    //   font: { weight: 'bold', size: 12 },
    //   formatter: Math.round,
    // },
  },
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6B7280', font: { size: 13, weight: 'bold' } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E5E7EB' },
      ticks: { color: '#6B7280', font: { size: 13, weight: 'bold' }, stepSize: 25 },
      max: Math.max(...props.values, 100),
    },
  },
}
</script>

<style scoped>
div {
  width: 100%;
  height: 140px;
  padding-bottom: 8px;
}
</style> 