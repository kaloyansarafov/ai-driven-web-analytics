<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <!-- Header -->
    <div class="max-w-4xl mx-auto mb-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Web Accessibility & SEO Analyzer
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Comprehensive analysis using WAVE and Pa11y tools with multi-page crawling support
        </p>
      </div>
    </div>

    <!-- Scan Form -->
    <div class="max-w-4xl mx-auto mb-8">
      <ScanForm @run-scan="runScan" />
    </div>

    <!-- Loading State with Multi-Page Info -->
    <div v-if="isLoading" class="max-w-4xl mx-auto my-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ isMultiPageScan ? 'Multi-Page Analysis in Progress' : 'Analyzing Website' }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ isMultiPageScan ? `Scanning up to ${maxPagesToScan} pages on ${targetUrl}` : `Scanning ${targetUrl}` }}
        </p>
        
        <!-- Multi-page progress indicator -->
        <div v-if="isMultiPageScan" class="max-w-md mx-auto">
          <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Pages scanned</span>
            <span>{{ scannedPages }}/{{ maxPagesToScan }}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(scannedPages / maxPagesToScan) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          This may take a few minutes depending on the number of pages...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="max-w-4xl mx-auto my-8"
    >
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-red-800 dark:text-red-200">Analysis Error</h3>
            <p class="text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Results State -->
    <div v-else-if="unifiedResults.issues.length > 0" class="max-w-4xl mx-auto my-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analysis Complete!</h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ isMultiPageScan ? `Successfully analyzed ${scannedPages} pages` : 'Single page analysis completed' }}
          </p>
        </div>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ unifiedResults.statistics.total }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Total Issues</div>
          </div>
          <div class="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ unifiedResults.statistics.errors }}</div>
            <div class="text-sm text-red-600 dark:text-red-400">Errors</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ unifiedResults.statistics.warnings }}</div>
            <div class="text-sm text-yellow-600 dark:text-yellow-400">Warnings</div>
          </div>
          <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ unifiedResults.statistics.notices }}</div>
            <div class="text-sm text-blue-600 dark:text-blue-400">Notices</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            :to="`/combined-dashboard?url=${encodeURIComponent(targetUrl)}`"
            class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Detailed Dashboard
          </NuxtLink>
          
          <button
            @click="showDetailedResults = !showDetailedResults"
            class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ showDetailedResults ? 'Hide' : 'Show' }} Detailed Results
          </button>
        </div>

        <!-- Detailed Results -->
        <div v-if="showDetailedResults" class="mt-8">
          <ResultsViewer 
            :results="unifiedResults" 
            :active-tools="activeTools"
            :analyzed-url="targetUrl"
          />
        </div>
      </div>
    </div>

    <!-- Scan Completed State -->
    <div v-else-if="scanCompleted" class="max-w-4xl mx-auto my-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analysis Complete!</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ isMultiPageScan ? `Successfully analyzed ${scannedPages} pages` : 'Single page analysis completed' }}
        </p>
        <NuxtLink
          :to="`/combined-dashboard?url=${encodeURIComponent(targetUrl)}`"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Combined Dashboard
        </NuxtLink>
      </div>
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
import axios from "axios";

// State
const targetUrl = ref("");
const waveApiKey = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const scanCompleted = ref(false);
const activeTools = ref<string[]>([]);
const isMultiPageScan = ref(false);
const maxPagesToScan = ref(0);
const scannedPages = ref(0);
const showDetailedResults = ref(false);

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
  crawl?: boolean;
  maxPages?: number;
}) {
  targetUrl.value = formData.url;
  waveApiKey.value = formData.waveApiKey;
  activeTools.value = formData.tools;

  // Reset state
  isLoading.value = true;
  error.value = null;
  scanCompleted.value = false;
  showDetailedResults.value = false;
  resetResults();

  // Set multi-page scanning state
  isMultiPageScan.value = formData.crawl && formData.maxPages && formData.maxPages > 1;
  maxPagesToScan.value = formData.maxPages || 1;
  scannedPages.value = 0;

  try {
    // Run selected tools in parallel
    const promises = [];

    if (activeTools.value.includes("wave") && waveApiKey.value) {
      promises.push(runWaveScan(formData.crawl, formData.maxPages));
    }

    if (activeTools.value.includes("pa11y")) {
      promises.push(runPa11yScan(formData.crawl, formData.maxPages));
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
async function runWaveScan(crawl?: boolean, maxPages?: number) {
  try {
    if (crawl && maxPages && maxPages > 1) {
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: targetUrl.value,
        maxPages: maxPages,
        tools: ["wave"],
        waveApiKey: waveApiKey.value
      });
      
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        
        // Flatten all issues from all pages
        const allIssues = [];
        response.data.pages.forEach(page => {
          if (page.toolResults?.wave?.success && page.toolResults.wave.result?.issues) {
            const pageIssues = page.toolResults.wave.result.issues.map((issue) => ({
              ...issue,
              source: "wave",
              pageUrl: page.url
            }));
            allIssues.push(...pageIssues);
          }
        });
        processWaveResults({ issues: allIssues });
        return;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      // Single page scan
      await waveApi.fetchData(waveApiKey.value, targetUrl.value);

      if (waveApi.error.value) {
        throw new Error(`WAVE API Error: ${waveApi.error.value.message}`);
      }

      if (waveApi.result.value) {
        scannedPages.value = 1;
        processWaveResults(waveApi.result.value);
      }
    }
  } catch (err: any) {
    throw new Error(`WAVE scan failed: ${err.message}`);
  }
}

// Run Pa11y scan
async function runPa11yScan(crawl?: boolean, maxPages?: number) {
  try {
    if (crawl && maxPages && maxPages > 1) {
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: targetUrl.value,
        maxPages: maxPages,
        tools: ["pa11y"],
        waveApiKey: waveApiKey.value
      });
      
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        
        // Flatten all issues from all pages
        const allIssues = [];
        response.data.pages.forEach(page => {
          if (page.toolResults?.pa11y?.success && page.toolResults.pa11y.result?.issues) {
            const pageIssues = page.toolResults.pa11y.result.issues.map((issue) => ({
              ...issue,
              source: "pa11y",
              pageUrl: page.url
            }));
            allIssues.push(...pageIssues);
          }
        });
        processPa11yResults({ issues: allIssues });
        return;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      // Single page scan
      await pa11yApi.runTest(targetUrl.value);

      if (pa11yApi.error.value) {
        throw new Error(`Pa11y API Error: ${pa11yApi.error.value.message}`);
      }

      if (pa11yApi.result.value) {
        scannedPages.value = 1;
        processPa11yResults(pa11yApi.result.value);
      }
    }
  } catch (err: any) {
    throw new Error(`Pa11y scan failed: ${err.message}`);
  }
}
</script>
