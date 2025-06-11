<template>
  <div class="my-4">
    <svg
      v-if="total > 0"
      :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
      width="100%"
      height="100"
      aria-labelledby="chartTitle chartDesc"
      role="img"
    >
      <title id="chartTitle">Issue Severity Distribution</title>
      <desc id="chartDesc">
        A bar chart showing the number of accessibility errors, warnings, and
        notices. Errors: {{ errors }}, Warnings: {{ warnings }}, Notices:
        {{ notices }}.
      </desc>

      <g :transform="`translate(0, ${padding.top})`">
        <!-- Bars -->
        <rect
          :x="padding.left"
          :y="getYPosition(errors)"
          :width="barWidth"
          :height="getBarHeight(errors)"
          class="fill-red-500 dark:fill-red-600"
          rx="2"
        />
        <rect
          :x="padding.left + barWidth + barGap"
          :y="getYPosition(warnings)"
          :width="barWidth"
          :height="getBarHeight(warnings)"
          class="fill-yellow-500 dark:fill-yellow-600"
          rx="2"
        />
        <rect
          :x="padding.left + (barWidth + barGap) * 2"
          :y="getYPosition(notices)"
          :width="barWidth"
          :height="getBarHeight(notices)"
          class="fill-blue-500 dark:fill-blue-600"
          rx="2"
        />

        <!-- Labels (Counts on top) -->
        <text
          :x="padding.left + barWidth / 2"
          :y="getYPosition(errors) - 5"
          text-anchor="middle"
          class="text-xs font-medium fill-gray-700 dark:fill-gray-300"
        >
          {{ errors }}
        </text>
        <text
          :x="padding.left + barWidth + barGap + barWidth / 2"
          :y="getYPosition(warnings) - 5"
          text-anchor="middle"
          class="text-xs font-medium fill-gray-700 dark:fill-gray-300"
        >
          {{ warnings }}
        </text>
        <text
          :x="padding.left + (barWidth + barGap) * 2 + barWidth / 2"
          :y="getYPosition(notices) - 5"
          text-anchor="middle"
          class="text-xs font-medium fill-gray-700 dark:fill-gray-300"
        >
          {{ notices }}
        </text>

        <!-- Axis Labels (Severity below) -->
        <text
          :x="padding.left + barWidth / 2"
          :y="chartHeight - padding.bottom - 5"
          text-anchor="middle"
          class="text-xs fill-gray-500 dark:fill-gray-400"
        >
          Errors
        </text>
        <text
          :x="padding.left + barWidth + barGap + barWidth / 2"
          :y="chartHeight - padding.bottom - 5"
          text-anchor="middle"
          class="text-xs fill-gray-500 dark:fill-gray-400"
        >
          Warnings
        </text>
        <text
          :x="padding.left + (barWidth + barGap) * 2 + barWidth / 2"
          :y="chartHeight - padding.bottom - 5"
          text-anchor="middle"
          class="text-xs fill-gray-500 dark:fill-gray-400"
        >
          Notices
        </text>

        <!-- Optional: Y-axis line if needed -->
        <!-- <line :x1="padding.left" :y1="0" :x2="padding.left" :y2="chartHeight - padding.top - padding.bottom" stroke="currentColor" class="text-gray-300 dark:text-gray-600" stroke-width="1"/> -->
      </g>
    </svg>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-4">
      No issues to display in chart.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  errors: number;
  warnings: number;
  notices: number;
}>();

const chartWidth = 300;
const chartHeight = 100; // Includes padding
const padding = { top: 20, right: 10, bottom: 20, left: 10 }; // Padding for labels
const barGap = 15;

const total = computed(() => props.errors + props.warnings + props.notices);
const maxValue = computed(() =>
  Math.max(props.errors, props.warnings, props.notices, 1)
); // Use 1 if all are 0 to avoid division by zero

const availableWidth = chartWidth - padding.left - padding.right;
const barWidth = computed(() => (availableWidth - barGap * 2) / 3);
const availableHeight = chartHeight - padding.top - padding.bottom;

const scaleY = computed(() => availableHeight / maxValue.value);

function getBarHeight(value: number): number {
  return value * scaleY.value;
}

function getYPosition(value: number): number {
  // Y position is from the top, so subtract height from bottom edge
  return availableHeight - getBarHeight(value);
}
</script>

<style scoped>
/* Add any specific styles if needed, though Tailwind classes are used */
</style>
