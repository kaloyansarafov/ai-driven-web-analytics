<template>
  <div class="flex flex-col min-h-screen">
    <TheHeaderBar />
    <main class="flex-grow container mx-auto p-4">
      <div v-if="store.isLoading" class="text-center py-10">
        <p class="text-lg text-gray-600">Scanning {{ store.targetUrl }}...</p>
        <!-- Optional: Add a spinner component later -->
      </div>
      <div
        v-else-if="store.error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{{ store.error }}</span>
      </div>
      <div v-else-if="store.scanResult" class="mt-6 space-y-6">
        <h2 class="text-2xl font-semibold mb-4">
          Scan Results for:
          <span class="font-normal text-blue-700">{{
            store.scanResult.statistics.pageurl
          }}</span>
        </h2>

        <!-- Summary Panel -->
        <SummaryPanel :result="store.scanResult" />

        <!-- Grid for other components -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Issue Explorer -->
          <IssueExplorer :categories="store.scanResult.categories" />

          <!-- Recommendations Panel -->
          <RecommendationsPanel :categories="store.scanResult.categories" />
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Keyboard Simulator (Placeholder)
          </h3>
          <p class="text-gray-600">
            Interactive keyboard navigation simulation will appear here.
          </p>
        </div>
        <!-- Keyboard Simulator -->
        <KeyboardSimulator />
      </div>
      <div v-else class="text-center py-10 text-gray-500">
        Enter a URL and API Key above and click 'Scan' to begin analysis.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import TheHeaderBar from "../components/TheHeaderBar.vue";
import SummaryPanel from "../components/SummaryPanel.vue";
import IssueExplorer from "../components/IssueExplorer.vue";
import RecommendationsPanel from "../components/RecommendationsPanel.vue";
import KeyboardSimulator from "../components/KeyboardSimulator.vue";
import { useScanStore } from "../stores/scanStore";

const store = useScanStore();

// Watch for URL changes to potentially clear results or trigger actions (optional)
// import { watch } from 'vue'
// watch(() => store.targetUrl, (newUrl, oldUrl) => {
//   if (newUrl !== oldUrl) {
//     // Optionally clear results when URL changes before a new scan
//     // store.scanResult = null;
//     // store.error = null;
//   }
// })
</script>

<style scoped>
/* Scoped styles for DashboardView */
</style>
