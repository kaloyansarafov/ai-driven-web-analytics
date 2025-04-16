<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
      Scan Summary
    </h3>

    <div v-if="!result" class="text-gray-500">Loading summary...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Stats Section -->
      <div>
        <h4 class="font-medium mb-3 text-gray-700">Key Metrics</h4>
        <ul class="space-y-2 text-sm">
          <li class="flex justify-between">
            <span>Errors:</span>
            <span class="font-semibold text-red-600">{{
              result.statistics.error
            }}</span>
          </li>
          <li class="flex justify-between">
            <span>Contrast Errors:</span>
            <span class="font-semibold text-orange-600">{{
              result.statistics.contrast
            }}</span>
          </li>
          <li class="flex justify-between">
            <span>Alerts:</span>
            <span class="font-semibold text-yellow-600">{{
              result.statistics.alert
            }}</span>
          </li>
          <li class="flex justify-between">
            <span>Features:</span>
            <span class="font-semibold text-green-600">{{
              result.statistics.feature
            }}</span>
          </li>
          <li class="flex justify-between">
            <span>Structural Elements:</span>
            <span class="font-semibold text-blue-600">{{
              result.statistics.structure
            }}</span>
          </li>
          <li class="flex justify-between">
            <span>ARIA:</span>
            <span class="font-semibold text-purple-600">{{
              result.statistics.aria
            }}</span>
          </li>
          <li class="flex justify-between pt-2 border-t mt-2">
            <span>Total Elements:</span>
            <span class="font-semibold">{{
              result.statistics.totalelements
            }}</span>
          </li>
          <li class="flex justify-between">
            <span>Scan Time:</span>
            <span class="font-semibold"
              >{{ result.statistics.time.toFixed(2) }}s</span
            >
          </li>
          <li class="flex justify-between text-blue-700 font-bold">
            <span>Keyboard Access Issues*:</span>
            <span class="font-semibold">{{
              result.statistics.totalkeyboardaccessissues ?? "N/A"
            }}</span>
          </li>
        </ul>
        <p class="text-xs text-gray-500 mt-2">
          *Total keyboard access issues may overlap with other categories.
        </p>
        <a
          :href="result.statistics.waveurl"
          target="_blank"
          class="text-sm text-blue-600 hover:underline mt-3 inline-block"
          >View Full WAVE Report &rarr;</a
        >
      </div>

      <!-- Chart Section -->
      <div class="h-64 md:h-auto">
        <h4 class="font-medium mb-3 text-gray-700">Issue Distribution</h4>
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        <div v-else class="text-gray-500 text-center pt-10">
          Chart data unavailable.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { PropType } from "vue";
import type { WaveApiResponse } from "../types";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors // Register the Colors plugin
);

const props = defineProps({
  result: {
    type: Object as PropType<WaveApiResponse | null>,
    required: true,
  },
});

const chartData = computed(() => {
  if (!props.result) return null;

  const stats = props.result.statistics;
  // Map categories to data points for the chart
  return {
    labels: ["Errors", "Contrast", "Alerts", "Features", "Structure", "ARIA"],
    datasets: [
      {
        label: "Issue Count",
        data: [
          stats.error,
          stats.contrast,
          stats.alert,
          stats.feature,
          stats.structure,
          stats.aria,
        ],
        // Let Chart.js Colors plugin handle colors automatically
        // backgroundColor: [
        //   'rgba(239, 68, 68, 0.6)', // Red
        //   'rgba(249, 115, 22, 0.6)', // Orange
        //   'rgba(234, 179, 8, 0.6)', // Yellow
        //   'rgba(34, 197, 94, 0.6)', // Green
        //   'rgba(59, 130, 246, 0.6)', // Blue
        //   'rgba(168, 85, 247, 0.6)', // Purple
        // ],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Hide legend as labels are clear
    },
    title: {
      display: false, // Already have a title above the chart
      // text: 'Issue Distribution by Category',
    },
    colors: {
      // Enable the Colors plugin
      enabled: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Ensure only whole numbers are shown on the y-axis
        precision: 0,
      },
    },
  },
});
</script>

<style scoped>
/* Scoped styles for SummaryPanel */
</style>
