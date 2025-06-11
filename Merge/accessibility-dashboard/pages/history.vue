<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Scan History</h2>
      <button
        @click="clearHistory"
        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        :disabled="historyStore.scanHistory.length === 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m5-16l-7-7m0 0L0 4m12-4v12"
          />
        </svg>
        Clear History
      </button>
    </div>

    <div v-if="historyStore.scanHistory.length === 0" class="text-center py-10">
      <p class="text-lg text-gray-500">
        No scan history yet. Run some scans to see them here.
      </p>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                URL
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tools
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Issues
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in historyStore.scanHistory" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ item.title || "Untitled" }}
                </div>
                <div class="text-sm text-gray-500">{{ item.url }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(item.timestamp) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-1">
                  <span
                    v-for="tool in item.toolsUsed"
                    :key="tool"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ tool.toUpperCase() }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                  >
                    {{ item.summary.errors }} errors
                  </span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {{ item.summary.warnings }} warnings
                  </span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ item.summary.notices }} notices
                  </span>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="repeatScan(item)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Repeat Scan
                </button>
                <button
                  @click="removeItem(item.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from "~/stores/historyStore";
import type { ScanHistoryItem } from "~/types";
import { useRouter } from "vue-router";

const historyStore = useHistoryStore();
const router = useRouter();

// Clear all history
function clearHistory() {
  if (
    confirm(
      "Are you sure you want to clear all scan history? This cannot be undone."
    )
  ) {
    historyStore.clearHistory();
  }
}

// Remove a single history item
function removeItem(id: string) {
  historyStore.removeScanFromHistory(id);
}

// Repeat a scan
function repeatScan(item: ScanHistoryItem) {
  // Navigate to dashboard with URL pre-filled
  router.push({
    path: "/",
    query: {
      url: item.url,
      tools: item.toolsUsed.join(","),
    },
  });
}

// Format dates
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (e) {
    return dateString;
  }
}
</script>
