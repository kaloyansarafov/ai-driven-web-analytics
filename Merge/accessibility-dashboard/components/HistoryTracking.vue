<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="mb-6 flex flex-wrap justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          Scan History
        </h3>

        <div class="flex space-x-2">
          <button
            @click="clearHistory"
            class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            :disabled="!hasHistory"
          >
            Clear History
          </button>
          <button
            @click="exportHistory"
            class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="!hasHistory"
          >
            Export Data
          </button>
        </div>
      </div>

      <div
        v-if="!hasHistory"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <p>No scan history available yet.</p>
        <p class="mt-2 text-sm">Run scans to track improvements over time.</p>
      </div>

      <div v-else>
        <!-- History Table -->
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  URL
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Errors
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Warnings
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Notices
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Tools
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr
                v-for="(entry, index) in sortedHistoryEntries"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {{ formatDate(entry.date) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  <a
                    :href="entry.url"
                    target="_blank"
                    class="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {{ formatUrl(entry.url) }}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getCountClass(entry.errors, 'error')"
                  >
                    {{ entry.errors }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getCountClass(entry.warnings, 'warning')"
                  >
                    {{ entry.warnings }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getCountClass(entry.notices, 'notice')"
                  >
                    {{ entry.notices }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div class="flex justify-center space-x-1">
                    <span
                      v-for="tool in entry.tools"
                      :key="tool"
                      class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {{ tool }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    @click="rescan(entry.url)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Rescan
                  </button>
                  <button
                    @click="removeEntry(index)"
                    class="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Trends Chart -->
    <HistoricalGraph :historyData="chartData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import HistoricalGraph from "./HistoricalGraph.vue";
import { saveAs } from "file-saver";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["rescan"]);

// Sample data structure for demonstration
const historyEntries = ref([]);

// Calculate if there's any history data
const hasHistory = computed(() => historyEntries.value.length > 0);

// Sort history entries by date (newest first)
const sortedHistoryEntries = computed(() => {
  return [...historyEntries.value].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

// Format data for chart component
const chartData = computed(() => {
  return [...sortedHistoryEntries.value].reverse();
});

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format URL for display (truncated if needed)
function formatUrl(url) {
  try {
    // Remove protocol
    let formatted = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    // Remove trailing slash
    formatted = formatted.replace(/\/$/, "");
    // Limit length
    if (formatted.length > 30) {
      formatted = formatted.substring(0, 30) + "...";
    }
    return formatted;
  } catch (e) {
    return url;
  }
}

// Get appropriate color class based on count and type
function getCountClass(count, type) {
  const baseClasses = {
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    notice: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return baseClasses[type] || "";
}

// Trigger a rescan
function rescan(url) {
  emit("rescan", url);
}

// Remove an entry from history
function removeEntry(index) {
  if (confirm("Are you sure you want to delete this history entry?")) {
    const entries = [...historyEntries.value];
    entries.splice(index, 1);
    historyEntries.value = entries;
    saveHistory();
  }
}

// Clear all history
function clearHistory() {
  if (
    confirm(
      "Are you sure you want to clear all scan history? This action cannot be undone."
    )
  ) {
    historyEntries.value = [];
    localStorage.removeItem("scanHistory");
  }
}

// Export history data as CSV
function exportHistory() {
  if (!hasHistory.value) return;

  // Create CSV content
  let csvContent = "Date,URL,Errors,Warnings,Notices,Tools\n";

  historyEntries.value.forEach((entry) => {
    csvContent += `${entry.date},${entry.url},${entry.errors},${
      entry.warnings
    },${entry.notices},"${entry.tools.join(", ")}"\n`;
  });

  // Create a Blob and use FileSaver to download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(
    blob,
    `accessibility-history-${new Date().toISOString().split("T")[0]}.csv`
  );
}

// Save history to localStorage
function saveHistory() {
  localStorage.setItem("scanHistory", JSON.stringify(historyEntries.value));
}

// Load history from localStorage
function loadHistory() {
  try {
    const savedHistory = localStorage.getItem("scanHistory");
    if (savedHistory) {
      historyEntries.value = JSON.parse(savedHistory);
    } else {
      historyEntries.value = [];
    }
  } catch (error) {
    console.error("Error loading scan history:", error);
    historyEntries.value = [];
  }
}

// Initialize on mount
onMounted(() => {
  loadHistory();
});
</script>
