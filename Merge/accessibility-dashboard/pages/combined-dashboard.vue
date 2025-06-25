<template>
  <div v-if="isAnalysisComplete" :key="dashboardKey" class="min-h-screen py-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-6 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Web Analytics Dashboard</h1>
            <span class="text-gray-400 dark:text-gray-500">•</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-[300px] sm:max-w-[500px]">{{ displayUrl }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span class="text-gray-500 dark:text-gray-400">Last analyzed:</span>
            <span class="text-gray-700 dark:text-gray-300">{{ lastAnalyzedDate || 'Never' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Scores Section -->
    <div class="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Overall Score -->
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-4">Overall Score</div>
        <div class="relative flex items-center justify-center mb-4">
          <div class="absolute w-[200px] h-[200px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
          <DoughnutChart :value="overallScore" :color="getScoreColor(overallScore)" :size="200" :showPercent="true" />
        </div>
        <div class="flex gap-8">
          <div class="flex flex-col items-center">
            <DoughnutChart :value="rounded(a11yScore)" :color="getScoreColor(a11yScore)" :size="80" :showPercent="true" />
            <div class="text-sm font-semibold text-gray-800 dark:text-white mt-2">Accessibility</div>
          </div>
          <div class="flex flex-col items-center">
            <DoughnutChart :value="seoScore" :color="getScoreColor(seoScore)" :size="80" :showPercent="true" />
            <div class="text-sm font-semibold text-gray-800 dark:text-white mt-2">SEO</div>
          </div>
        </div>
      </div>

      <!-- Critical Issues Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-4">Critical Issues</div>
        <div class="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-4">
          {{ totalCriticalIssues }}
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center">
              <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span class="text-red-600 dark:text-red-400 font-semibold">Critical</span>
            </span>
            <span class="text-gray-900 dark:text-white font-bold text-lg">{{ rounded(currentAccessibilitySummary?.errorCount || 0) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center">
              <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
              <span class="text-yellow-600 dark:text-yellow-400 font-semibold">Warnings</span>
            </span>
            <span class="text-gray-900 dark:text-white font-bold text-lg">{{ rounded(currentAccessibilitySummary?.warningCount || 0) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center">
              <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span class="text-blue-600 dark:text-blue-400 font-semibold">Notices</span>
            </span>
            <span class="text-gray-900 dark:text-white font-bold text-lg">{{ rounded(currentAccessibilitySummary?.noticeCount || 0) }}</span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <span class="text-gray-700 dark:text-gray-300 font-medium">Total Issues</span>
            <span class="text-gray-900 dark:text-white font-bold text-xl">{{ rounded(currentAccessibilitySummary?.totalIssues || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">Performance Metrics</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="flex flex-col items-center">
            <span class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.firstContentfulPaint) }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 text-center">First Contentful Paint</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.loadTime) }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 text-center">Load Time</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.largestContentfulPaint) }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 text-center">Largest Contentful Paint</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.timeToInteractive) }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 text-center">Time to Interactive</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Non-Alt Image Issues -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">Image Accessibility Issues</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Images Missing Alt Text</div>
            <BarChart 
              :labels="nonAltChartData.labels" 
              :values="nonAltChartData.values" 
              color="#EF4444" 
              label="Missing Alt Text" 
              :height="120"
            />
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span class="text-red-700 dark:text-red-300 font-medium">Critical Images</span>
              </div>
              <span class="text-red-700 dark:text-red-300 font-bold text-lg">{{ nonAltCriticalCount }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-yellow-700 dark:text-yellow-300 font-medium">Decorative Images</span>
              </div>
              <span class="text-yellow-700 dark:text-yellow-300 font-bold text-lg">{{ nonAltDecorativeCount }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span class="text-blue-700 dark:text-blue-300 font-medium">Total Images</span>
              </div>
              <span class="text-blue-700 dark:text-blue-300 font-bold text-lg">{{ totalImageCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Accessibility Issues by Category -->
    <div class="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">Accessibility Issues by Category</div>
        <div class="space-y-4">
          <div v-for="(count, category) in accessibilityIssuesByCategory" :key="category" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{{ category }}</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- SEO Category Scores -->
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">SEO Category Scores</div>
        <div class="space-y-4">
          <div v-for="(cat, index) in seoMetaAnalysis" :key="index" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ cat.name }}</span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ cat.score }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div class="h-full rounded-full" :class="getScoreColorClass(cat.score)" :style="{ width: `${cat.score}%` }"></div>
            </div>
            <div v-if="cat.issues.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
              {{ cat.issues.length }} issue{{ cat.issues.length !== 1 ? 's' : '' }} found
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues by Page (Multi-Page Analysis) -->
    <div v-if="issuesByPage.length > 1" class="max-w-7xl mx-auto mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">
          Issues by Page ({{ issuesByPage.length }} pages analyzed)
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Total Issues by Page</div>
            <BarChart :labels="issuesByPageChart.labels" :values="issuesByPageChart.values" color="#3B82F6" label="Total Issues" :height="120" />
          </div>
        </div>
        <div class="mt-6">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Page Details</div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Errors</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Warnings</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notices</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="page in issuesByPage" :key="page.url" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    <div class="truncate max-w-xs" :title="page.url">{{ getPageName(page.url) }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ page.errors }}</td>
                  <td class="px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">{{ page.warnings }}</td>
                  <td class="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">{{ page.notices }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{{ page.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Single Page Analysis fallback -->
    <div v-else-if="issuesByPage.length === 1" class="max-w-7xl mx-auto mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">Single Page Analysis</div>
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Single Page Analyzed</h4>
          <p class="text-gray-600 dark:text-gray-400">Enable multi-page crawling to see issues across multiple pages.</p>
        </div>
      </div>
    </div>

    <!-- AI Analysis Overview -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8">
        <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-6">AI Analysis Overview</div>
        <div class="w-full">
          <div v-if="aiOverviewLoading" class="text-center text-gray-400 dark:text-gray-300 py-8">
            Generating analysis overview...
          </div>
          <div v-else-if="aiOverviewError" class="text-center text-red-500 dark:text-red-400 py-8">
            Could not generate AI summary. <button @click="fetchAiOverview" class="underline text-blue-600 dark:text-blue-400">Retry</button>
          </div>
          <div v-else-if="aiOverviewSummary && aiOverviewSummary.length" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 prose prose-base max-w-none border border-blue-100 dark:border-blue-900 shadow-sm dark:text-gray-100">
            <div v-html="formatAiSummary(aiOverviewSummary)"></div>
          </div>
          <div v-else class="text-center py-8">
            <button @click="fetchAiOverview" class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800">
              Generate AI Summary
            </button>
            <div class="text-gray-400 dark:text-gray-300 mt-2">Click to generate a summary based on the latest analysis.</div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analysis in Progress</h2>
      <p class="text-gray-600 dark:text-gray-300">Please wait while we analyze your website...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from '#app'
import DoughnutChart from '~/components/ui/DoughnutChart.vue'
import BarChart from '~/components/ui/BarChart.vue'
import type { SEOAnalysisType } from '~/types'

type AccessibilitySummary = {
  errorCount: number,
  warningCount: number,
  noticeCount: number,
  contrastIssues: number,
  focusIssues: number,
  nonTextIssues: number,
  labelIssues: number,
  totalIssues: number
}

type SEOSummary = {
  performance?: any,
  language?: any,
  improvement?: any,
  metrics?: any
}

const route = useRoute()

// Props
const props = defineProps<{
  seoResults: SEOAnalysisType | null
  accessibilityResults: Issue[]
  accessibilitySummary: AccessibilitySummary
  seoSummary: SEOSummary
  analyzedUrl?: string
}>()

// State
const currentUrl = ref('')
const lastAnalyzedDate = ref('')
const storedSeoResults = ref<SEOAnalysisType | null>(null)
const storedAccessibilityResults = ref<Issue[]>([])
const storedAccessibilitySummary = ref<AccessibilitySummary>({})
const storedSeoSummary = ref<SEOSummary>({})
const aiOverviewSummary = ref([])
const aiOverviewError = ref(false)
const aiOverviewLoading = ref(false)

// Add a reactive key to force re-render when data changes
const dashboardKey = ref(0)

// Initialize data from localStorage and props
onMounted(() => {
  try {
    // First, try to get URL from props or route
    const urlFromProps = props.analyzedUrl
    const urlFromRoute = route?.query?.url as string
    
    // Set the current URL with priority: props > route > stored
    if (urlFromProps) {
      currentUrl.value = urlFromProps
    } else if (urlFromRoute) {
      currentUrl.value = urlFromRoute
    }
    
    // Load stored results
    const storedResults = localStorage.getItem('latestAnalysis')
    if (storedResults) {
      const parsed = JSON.parse(storedResults)
      
      // Only use stored results if they match the current URL
      if (!currentUrl.value || parsed.url === currentUrl.value) {
        storedSeoResults.value = parsed.seoResults
        storedAccessibilityResults.value = parsed.accessibilityResults
        storedAccessibilitySummary.value = parsed.accessibilitySummary
        storedSeoSummary.value = parsed.seoSummary
        currentUrl.value = currentUrl.value || parsed.url || ''
        lastAnalyzedDate.value = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString() : ''
      }
    }
    
    // Final fallback for URL
    if (!currentUrl.value) {
      currentUrl.value = 'No URL available'
    }
  } catch (error) {
    console.error('Error in CombinedDashboard mounted hook:', error)
    currentUrl.value = props.analyzedUrl || 'No URL available'
  }
})

// Update stored results with better URL handling
const updateStoredResults = () => {
  try {
    if (props.seoResults && props.accessibilityResults) {
      const resultsToStore = {
        url: props.analyzedUrl || currentUrl.value,
        seoResults: props.seoResults,
        accessibilityResults: props.accessibilityResults,
        accessibilitySummary: props.accessibilitySummary,
        seoSummary: props.seoSummary,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('latestAnalysis', JSON.stringify(resultsToStore))
      
      storedSeoResults.value = props.seoResults
      storedAccessibilityResults.value = props.accessibilityResults
      storedAccessibilitySummary.value = props.accessibilitySummary
      storedSeoSummary.value = props.seoSummary
      currentUrl.value = props.analyzedUrl || currentUrl.value
      lastAnalyzedDate.value = new Date(resultsToStore.timestamp).toLocaleString()
    }
  } catch (error) {
    console.error('Error updating stored results:', error)
  }
}

// Watch for changes with immediate execution
watch(() => props.analyzedUrl, (newUrl) => {
  if (newUrl) {
    currentUrl.value = newUrl
    updateStoredResults()
  }
}, { immediate: true })

watch(() => [props.seoResults, props.accessibilityResults], () => {
  updateStoredResults()
}, { deep: true, immediate: true })

// Watch for route changes to update URL
watch(() => route.query.url, (newUrl) => {
  if (newUrl && typeof newUrl === 'string') {
    currentUrl.value = newUrl
    // Try to load stored results for this URL
    try {
      const storedResults = localStorage.getItem('latestAnalysis')
      if (storedResults) {
        const parsed = JSON.parse(storedResults)
        if (parsed.url === newUrl) {
          storedSeoResults.value = parsed.seoResults
          storedAccessibilityResults.value = parsed.accessibilityResults
          storedAccessibilitySummary.value = parsed.accessibilitySummary
          storedSeoSummary.value = parsed.seoSummary
          lastAnalyzedDate.value = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString() : ''
        }
      }
    } catch (error) {
      console.error('Error loading stored results for URL:', error)
    }
  }
}, { immediate: true })

// Add a computed property for the display URL
const displayUrl = computed(() => {
  return currentUrl.value || props.analyzedUrl || 'No URL analyzed'
})

// Computed properties for current data
const currentSeoResults = computed(() => {
  const results = props.seoResults || storedSeoResults.value;
  console.log("currentSeoResults computed:", results);
  return results;
})
const currentAccessibilityResults = computed(() => props.accessibilityResults || storedAccessibilityResults.value)
const currentAccessibilitySummary = computed(() => props.accessibilitySummary || storedAccessibilitySummary.value)
const currentSeoSummary = computed(() => {
  const summary = props.seoSummary || storedSeoSummary.value;
  console.log("currentSeoSummary computed:", summary);
  console.log("Performance metrics:", summary?.metrics?.performance);
  return summary;
})

// Utility functions
const rounded = (val: number) => Math.round(val)
const formatTime = (ms: number) => ms ? (ms / 1000).toFixed(2) + 's' : 'N/A'

// Score calculations
const a11yScore = computed(() => {
  const summary = currentAccessibilitySummary.value;
  
  if (!summary || !currentAccessibilityResults.value.length) {
    return 0;
  }

  const weights = {
    error: 1.0,
    warning: 0.6,
    notice: 0.3
  };

  const totalWeightedIssues = 
    (summary.errorCount * weights.error) +
    (summary.warningCount * weights.warning) +
    (summary.noticeCount * weights.notice);

  const totalIssues = summary.errorCount + summary.warningCount + summary.noticeCount;
  
  const baseScore = totalIssues > 0
    ? Math.max(0, 100 - (totalWeightedIssues / totalIssues) * 100)
    : 100;

  return Math.round(baseScore);
});

const seoScore = computed(() => rounded(currentSeoResults.value?.score || 0))

const overallScore = computed(() => {
  const a11y = rounded(a11yScore.value);
  const seo = seoScore.value;
  
  if (a11y > 0 && seo === 0) return a11y;
  if (seo > 0 && a11y === 0) return seo;
  if (a11y > 0 && seo > 0) return rounded((a11y * 0.7) + (seo * 0.3));
  return 0;
});

const totalCriticalIssues = computed(() => {
  const a11yErrors = currentAccessibilitySummary.value?.errorCount || 0;
  const seoHighIssues = currentSeoResults.value?.issues?.filter(i => i.severity === 'high').length || 0;
  return a11yErrors + seoHighIssues;
});

// Color functions
function getScoreColor(score: number): string {
  if (score >= 90) return '#22C55E'
  if (score >= 70) return '#FACC15'
  if (score >= 50) return '#3B82F6'
  return '#EF4444'
}

function getScoreColorClass(score: number): string {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-yellow-400'
  if (score >= 50) return 'bg-blue-500'
  return 'bg-red-500'
}

// Page data extraction
const realPageData = computed(() => {
  const pages = new Set();
  const pageIssues = {};
  
  currentAccessibilityResults.value.forEach(issue => {
    const page = issue.url || currentUrl.value || 'Main Page';
    pages.add(page);
    
    if (!pageIssues[page]) {
      pageIssues[page] = {
        labelIssues: 0,
        contrastIssues: 0,
        focusIssues: 0,
        nonTextIssues: 0,
        totalIssues: 0
      };
    }
    
    pageIssues[page].totalIssues++;
    
    const message = issue.message?.toLowerCase() || '';
    if (message.includes('label') || message.includes('input') || message.includes('form')) {
      pageIssues[page].labelIssues++;
    }
    if (message.includes('contrast') || message.includes('color')) {
      pageIssues[page].contrastIssues++;
    }
    if (message.includes('focus')) {
      pageIssues[page].focusIssues++;
    }
    if (message.includes('alt') || message.includes('image')) {
      pageIssues[page].nonTextIssues++;
    }
  });
  
  return {
    pages: Array.from(pages).slice(0, 7),
    pageIssues
  };
});

// Helper function for page names
const getPageName = (url: string): string => {
  try {
    if (!url || url === 'undefined') return 'Main Page';
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    if (pathname === '/' || pathname === '') return 'Home';
    return pathname.slice(1).replace(/\//g, ' ').replace(/-/g, ' ') || 'Page';
  } catch (error) {
    return 'Main Page';
  }
};

// Chart data
const contrastChartData = computed(() => {
  const { pages, pageIssues } = realPageData.value;
  
  if (pages.length === 0) {
    return {
      labels: ['Main Page'],
      values: [Math.round(100 - (currentAccessibilitySummary.value?.contrastIssues || 0))]
    };
  }
  
  return {
    labels: pages.map(page => getPageName(page)),
    values: pages.map(page => {
      const issues = pageIssues[page] || {};
      const contrastIssues = issues.contrastIssues || 0;
      const totalIssues = issues.totalIssues || 1;
      return Math.round(100 - (contrastIssues / totalIssues) * 100);
    })
  };
});

const labelsChartData = computed(() => {
  const { pages, pageIssues } = realPageData.value;
  
  if (pages.length === 0) {
    return {
      labels: ['Main Page'],
      values: [Math.round(100 - (currentAccessibilitySummary.value?.labelIssues || 0))]
    };
  }
  
  return {
    labels: pages.map(page => getPageName(page)),
    values: pages.map(page => {
      const issues = pageIssues[page] || {};
      const labelIssues = issues.labelIssues || 0;
      const totalIssues = issues.totalIssues || 1;
      return Math.round(100 - (labelIssues / totalIssues) * 100);
    })
  };
});

// SEO analysis
const seoMetaAnalysis = computed(() => {
  const seo = currentSeoResults.value;
  if (!seo || !seo.scoreBreakdown) return [];

  const issues = seo.issues || [];
  
  const groupIssues = (keywords: string[]) =>
    issues.filter(issue =>
      keywords.some(key => (issue.message || '').toLowerCase().includes(key))
    );

  return [
    {
      name: 'Meta',
      score: seo.scoreBreakdown.meta ?? 0,
      issues: groupIssues(['meta', 'title', 'description', 'canonical', 'robots', 'og', 'twitter', 'schema'])
    },
    {
      name: 'Content',
      score: seo.scoreBreakdown.content ?? 0,
      issues: groupIssues(['content', 'word count', 'keyword', 'text', 'readability', 'duplicate'])
    },
    {
      name: 'Technical',
      score: seo.scoreBreakdown.technical ?? 0,
      issues: groupIssues(['image', 'link', 'performance', 'load time', 'ssl', 'https', 'redirect'])
    },
    {
      name: 'Structure',
      score: seo.scoreBreakdown.structure ?? 0,
      issues: groupIssues(['heading', 'structure', 'semantic', 'html', 'tag'])
    }
  ];
});

// Accessibility issues by category
const accessibilityIssuesByCategory = computed(() => {
  if (!currentAccessibilityResults.value?.length) {
    return {
      contrast: 0,
      focus: 0,
      nonText: 0,
      labels: 0,
      structure: 0,
      keyboard: 0
    };
  }

  const categories = {
    contrast: 0,
    focus: 0,
    nonText: 0,
    labels: 0,
    structure: 0,
    keyboard: 0
  };

  currentAccessibilityResults.value.forEach(issue => {
    const message = issue.message?.toLowerCase() || '';
    const code = issue.code?.toLowerCase() || '';

    if (message.includes('contrast') || message.includes('color') || code.includes('contrast')) {
      categories.contrast++;
    }
    if (message.includes('focus') || message.includes('keyboard') || code.includes('focus')) {
      categories.focus++;
    }
    if (message.includes('alt') || message.includes('image') || message.includes('non-text') || code.includes('alt')) {
      categories.nonText++;
    }
    if (message.includes('label') || message.includes('input') || message.includes('form') || code.includes('label')) {
      categories.labels++;
    }
    if (message.includes('structure') || message.includes('semantic') || message.includes('heading') || code.includes('structure')) {
      categories.structure++;
    }
    if (message.includes('keyboard') || message.includes('tab') || code.includes('keyboard')) {
      categories.keyboard++;
    }
  });

  return categories;
});

// Analysis completion check
const isAnalysisComplete = computed(() => {
  return (
    currentAccessibilityResults.value?.length > 0 &&
    currentSeoResults.value !== null &&
    currentAccessibilitySummary.value &&
    currentSeoSummary.value
  );
});

// AI Overview functions
const fetchAiOverview = async () => {
  aiOverviewLoading.value = true
  aiOverviewError.value = false
  try {
    const prompt = `You are an expert web accessibility and SEO consultant. Given the following accessibility and SEO analysis results, write a concise, high-level summary (bulleted list, max 5 items) that:
- Highlights the most important accessibility and SEO issues found on the site
- Explains the real-world impact of these issues on users and search ranking
- Prioritizes the most critical problems to fix first
- Gives actionable, plain-language recommendations for improvement (not just code or tag names)
- Avoids generic advice and focuses on what is actually found in the analysis

Accessibility Results: ${JSON.stringify(currentAccessibilityResults.value)}

SEO Results: ${JSON.stringify(currentSeoResults.value)}

Accessibility Summary: ${JSON.stringify(currentAccessibilitySummary.value)}

SEO Summary: ${JSON.stringify(currentSeoSummary.value)}
`;
    const response = await $fetch('/api/gemini-summary', {
      method: 'POST',
      body: { prompt }
    })
    let summary = []
    try {
      summary = JSON.parse(response)
    } catch {
      summary = response.split('\n').filter(Boolean)
    }
    aiOverviewSummary.value = summary.slice(0, 5)
  } catch (e) {
    aiOverviewError.value = true
    aiOverviewSummary.value = []
    console.error('Gemini API error:', e)
  } finally {
    aiOverviewLoading.value = false
  }
}

function formatAiSummary(summary: string[] | string): string {
  let html = Array.isArray(summary) ? summary.join('\n') : summary;
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  }
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = `<p>${html}</p>`;
  return html;
}

// Refresh function
const refreshAnalysis = () => {
  emit('refresh-analysis')
}

const emit = defineEmits(['refresh-analysis'])

// Multi-page accessibility issues by page
const issuesByPage = computed(() => {
  const issues = currentAccessibilityResults.value || [];
  console.log("issuesByPage computed - total issues:", issues.length);
  console.log("Sample issues with pageUrl:", issues.slice(0, 3).map(issue => ({
    pageUrl: issue.pageUrl,
    url: issue.url,
    message: issue.message?.substring(0, 50)
  })));
  
  const pageMap = {};
  issues.forEach(issue => {
    const page = issue.pageUrl || issue.url || currentUrl.value || 'Main Page';
    if (!pageMap[page]) {
      pageMap[page] = { url: page, errors: 0, warnings: 0, notices: 0, total: 0 };
    }
    if (issue.type === 'error') pageMap[page].errors++;
    if (issue.type === 'warning') pageMap[page].warnings++;
    if (issue.type === 'notice') pageMap[page].notices++;
    pageMap[page].total++;
  });
  
  const result = Object.values(pageMap).sort((a, b) => b.total - a.total);
  console.log("issuesByPage result:", result);
  return result;
});

const issuesByPageChart = computed(() => {
  const pages = issuesByPage.value;
  return {
    labels: pages.map(p => getPageName(p.url)),
    values: pages.map(p => p.total)
  };
});

// Non-alt image data
const nonAltChartData = computed(() => {
  const { pages, pageIssues } = realPageData.value;
  
  if (pages.length === 0) {
    return {
      labels: ['Main Page'],
      values: [currentAccessibilitySummary.value?.nonTextIssues || 0]
    };
  }
  
  return {
    labels: pages.map(page => getPageName(page)),
    values: pages.map(page => {
      const issues = pageIssues[page] || {};
      return issues.nonTextIssues || 0;
    })
  };
});

const nonAltCriticalCount = computed(() => {
  if (!currentAccessibilityResults.value?.length) return 0;
  return currentAccessibilityResults.value.filter(issue => 
    (issue.message?.toLowerCase().includes('alt') || issue.message?.toLowerCase().includes('image')) &&
    issue.type === 'error'
  ).length;
});

const nonAltDecorativeCount = computed(() => {
  if (!currentAccessibilityResults.value?.length) return 0;
  return currentAccessibilityResults.value.filter(issue => 
    (issue.message?.toLowerCase().includes('alt') || issue.message?.toLowerCase().includes('image')) &&
    issue.type === 'warning'
  ).length;
});

const totalImageCount = computed(() => {
  return nonAltCriticalCount.value + nonAltDecorativeCount.value;
});

// Force refresh when new data comes in
const refreshDashboard = () => {
  dashboardKey.value++
  updateStoredResults()
}

// Watch for new analysis results and refresh
watch(() => [props.seoResults, props.accessibilityResults, props.analyzedUrl], () => {
  refreshDashboard()
}, { deep: true, immediate: true })

</script>

<style scoped>
.prose {
  font-size: 1.05rem;
}
.prose h2, .prose h3 {
  color: #2563eb;
  margin-top: 1.2em;
}
.prose ul {
  list-style-type: disc;
  margin-left: 1.5em;
}
.dark .prose {
  color: #e5e7eb !important;
}
.dark .prose :is(strong, b, .font-bold) {
  color: #fff !important;
}
</style> 