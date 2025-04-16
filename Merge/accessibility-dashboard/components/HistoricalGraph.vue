<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Accessibility Trends
      </h3>

      <!-- Controls -->
      <div class="flex flex-wrap gap-4 mb-4">
        <!-- Chart Type -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Chart Type</label
          >
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              @click="chartType = 'line'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-l-md focus:z-10 focus:outline-none',
                chartType === 'line'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
              ]"
            >
              Line
            </button>
            <button
              @click="chartType = 'bar'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-r-md focus:z-10 focus:outline-none',
                chartType === 'bar'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
              ]"
            >
              Bar
            </button>
          </div>
        </div>

        <!-- Time Range -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Time Range</label
          >
          <select
            v-model="timeRange"
            class="rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>
        </div>

        <!-- Metrics -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Metrics</label
          >
          <select
            v-model="metricType"
            class="rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Issues</option>
            <option value="errors">Errors Only</option>
            <option value="warnings">Warnings Only</option>
            <option value="notices">Notices Only</option>
          </select>
        </div>
      </div>
    </div>

    <!-- No Data Message -->
    <div
      v-if="!historyData || historyData.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">
        No historical data available. Run scans to build trend data.
      </p>
    </div>

    <!-- Chart Container -->
    <div v-else class="h-80">
      <component
        :is="chartType === 'line' ? Line : Bar"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { saveAs } from "file-saver";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const props = defineProps({
  historyData: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const chartCanvas = ref(null);
const chart = ref(null);
const showErrors = ref(true);
const showWarnings = ref(true);
const showNotices = ref(true);
const isZoomed = ref(false);

// Chart states
const chartType = ref("line"); // 'line' or 'bar'
const metricType = ref("all"); // 'all', 'errors', 'warnings', or 'notices'
const timeRange = ref("all"); // 'all', 'month', 'week'

// Dark mode detection
const isDarkMode = ref(false);

// Update dark mode state
function updateDarkMode() {
  isDarkMode.value = document.documentElement.classList.contains("dark");
}

// Format URL for display
function formatUrl(url) {
  try {
    // Remove protocol
    let formatted = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    // Remove trailing slash
    formatted = formatted.replace(/\/$/, "");
    // Limit length
    if (formatted.length > 25) {
      formatted = formatted.substring(0, 25) + "...";
    }
    return formatted;
  } catch (e) {
    return url;
  }
}

// Filter data based on time range
const filteredData = computed(() => {
  if (!props.historyData || props.historyData.length === 0) {
    return [];
  }

  // Sort by date (oldest first to show trend over time)
  const sortedData = [...props.historyData].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  if (timeRange.value === "all") {
    return sortedData;
  }

  const now = new Date();
  let cutoffDate;

  if (timeRange.value === "month") {
    cutoffDate = new Date(now);
    cutoffDate.setMonth(now.getMonth() - 1);
  } else if (timeRange.value === "week") {
    cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - 7);
  }

  return sortedData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate;
  });
});

// Prepare chart data
const chartData = computed(() => {
  if (filteredData.value.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // Format dates for labels
  const labels = filteredData.value.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  });

  // Create dataset based on selected metric
  let datasets = [];

  if (metricType.value === "all" || metricType.value === "errors") {
    datasets.push({
      label: "Errors",
      data: filteredData.value.map((item) => item.errors),
      backgroundColor: "rgba(239, 68, 68, 0.5)",
      borderColor: "rgb(239, 68, 68)",
      borderWidth: 2,
      tension: 0.1,
    });
  }

  if (metricType.value === "all" || metricType.value === "warnings") {
    datasets.push({
      label: "Warnings",
      data: filteredData.value.map((item) => item.warnings),
      backgroundColor: "rgba(234, 179, 8, 0.5)",
      borderColor: "rgb(234, 179, 8)",
      borderWidth: 2,
      tension: 0.1,
    });
  }

  if (metricType.value === "all" || metricType.value === "notices") {
    datasets.push({
      label: "Notices",
      data: filteredData.value.map((item) => item.notices),
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgb(59, 130, 246)",
      borderWidth: 2,
      tension: 0.1,
    });
  }

  return {
    labels,
    datasets,
  };
});

// Chart options for formatting
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode.value ? "#fff" : "#666",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex;
            const entryDate = new Date(filteredData.value[dataIndex].date);
            return entryDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          },
          label: (context) => {
            const value = context.raw;
            const label = context.dataset.label;
            return `${label}: ${value}`;
          },
          afterLabel: (context) => {
            const dataIndex = context.dataIndex;
            const entry = filteredData.value[dataIndex];
            return `URL: ${formatUrl(entry.url)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode.value ? "#ccc" : "#666",
        },
        grid: {
          color: isDarkMode.value
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: isDarkMode.value ? "#ccc" : "#666",
        },
        grid: {
          color: isDarkMode.value
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };
});

// Initialize chart
const initChart = () => {
  if (chart.value) {
    chart.value.destroy();
  }

  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext("2d");

  chart.value = new Chart(ctx, {
    type: "line",
    data: chartData.value,
    options: chartOptions.value,
  });
};

// Reset zoom to original view
const resetZoom = () => {
  if (chart.value) {
    chart.value.resetZoom();
    isZoomed.value = false;
  }
};

// Export chart as PNG image
const exportGraph = () => {
  if (!chartCanvas.value) return;

  const url = chartCanvas.value.toDataURL("image/png");
  const now = new Date();
  const filename = `accessibility-trends-${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}.png`;

  // Use FileSaver or create download link
  try {
    saveAs(url, filename);
  } catch (e) {
    // Fallback if FileSaver doesn't work
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Watch for changes to re-render chart
watch([showErrors, showWarnings, showNotices], () => {
  if (chart.value) {
    chart.value.data = chartData.value;
    chart.value.update();
  }
});

// Watch for dark mode changes
watch(
  () => document.documentElement.classList.contains("dark"),
  () => {
    updateDarkMode();
  }
);

// Initialize on mount
onMounted(() => {
  // Set initial dark mode
  updateDarkMode();

  // Set up observer to detect dark mode changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        updateDarkMode();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  initChart();
});
</script>
