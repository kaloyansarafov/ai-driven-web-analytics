<template>
  <div class="min-h-screen bg-white dark:bg-gray-800 p-6 shadow-md">
    <ScanForm @run-scan="runScan" />

    <div v-if="isLoading" class="my-8 text-center py-10">
      <p class="text-lg text-gray-600 dark:text-gray-300">Scanning {{ targetUrl }}...</p>
      <div
        class="mt-4 w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="my-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800/40 text-red-700 dark:text-red-400 px-4 py-3 rounded relative"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>

    <div v-else-if="unifiedResults.issues.length > 0" class="my-8">
      <ResultsViewer 
        :results="unifiedResults" 
        :active-tools="activeTools"
        :analyzed-url="targetUrl"
      />
    </div>

    <div v-else-if="scanCompleted" class="my-8 text-center py-10">
      <p class="text-xl text-green-600 dark:text-green-400">Analysis Complete!</p>
      <NuxtLink
        :to="`/combined-dashboard?url=${encodeURIComponent(targetUrl)}`"
        class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        View Combined Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useWaveApi } from "~/composables/useWaveApi";
import { usePa11yApi } from "~/composables/usePa11yApi";
import { useUnifiedResults } from "~/composables/useUnifiedResults";
import { useHistoryStore } from "~/stores/historyStore";
import type { UnifiedScanResults } from "~/types";

// State
const targetUrl = ref("");
const waveApiKey = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const scanCompleted = ref(false);
const activeTools = ref<string[]>([]);

// API composables
const waveApi = useWaveApi();
const pa11yApi = usePa11yApi();
const {
  unifiedResults,
  processWaveResults,
  processPa11yResults,
  resetResults,
} = useUnifiedResults();
const historyStore = useHistoryStore();

// Run the scan with selected tools
async function runScan(formData: {
  url: string;
  waveApiKey: string;
  tools: string[];
}) {
  targetUrl.value = formData.url;
  waveApiKey.value = formData.waveApiKey;
  activeTools.value = formData.tools;

  // Reset state
  isLoading.value = true;
  error.value = null;
  scanCompleted.value = false;
  resetResults();

  try {
    // Run selected tools in parallel
    const promises = [];

    if (activeTools.value.includes("wave") && waveApiKey.value) {
      promises.push(runWaveScan());
    }

    if (activeTools.value.includes("pa11y")) {
      promises.push(runPa11yScan());
    }

    // Wait for all scans to complete
    await Promise.all(promises);

    // Add to history if we have results
    if (unifiedResults.value.issues.length > 0) {
      // Add URL to the results
      unifiedResults.value.url = targetUrl.value;
      historyStore.addScanToHistory(unifiedResults.value, activeTools.value);

      // Also update any matching bookmark
      historyStore.updateBookmarkLastScanned(targetUrl.value);
    }

    scanCompleted.value = true;
  } catch (err: any) {
    error.value = err.message || "An error occurred during scanning";
  } finally {
    isLoading.value = false;
  }
}

// Run WAVE scan
async function runWaveScan() {
  try {
    await waveApi.fetchData(waveApiKey.value, targetUrl.value);

    if (waveApi.error.value) {
      throw new Error(`WAVE API Error: ${waveApi.error.value.message}`);
    }

    if (waveApi.result.value) {
      processWaveResults(waveApi.result.value);
    }
  } catch (err: any) {
    throw new Error(`WAVE scan failed: ${err.message}`);
  }
}

// Run Pa11y scan
async function runPa11yScan() {
  try {
    await pa11yApi.runTest(targetUrl.value);

    if (pa11yApi.error.value) {
      throw new Error(`Pa11y API Error: ${pa11yApi.error.value.message}`);
    }

    if (pa11yApi.result.value) {
      processPa11yResults(pa11yApi.result.value);
    }
  } catch (err: any) {
    throw new Error(`Pa11y scan failed: ${err.message}`);
  }
}
</script>
