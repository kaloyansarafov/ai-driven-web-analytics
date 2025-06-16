<template>
  <div v-if="isAnalysisComplete" class="min-h-screen py-6">
    <!-- Minimalistic Header -->
    <div class="max-w-7xl mx-auto mb-6 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Web Analytics Dashboard</h1>
            <span class="text-gray-400 dark:text-gray-500">•</span>
            <span class="text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-[300px] sm:max-w-[500px]">{{ currentUrl || 'No URL analyzed' }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span class="text-gray-500 dark:text-gray-300">Last analyzed: {{ lastAnalyzedDate }}</span>
            <button @click="refreshAnalysis" class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Section: Two-column layout -->
    <div class="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left: Combined Score Doughnuts -->
      <div class="h-full">
        <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex-1 flex flex-col justify-center items-center h-full">
          <div class="flex flex-col items-center w-full justify-center flex-1">
            <!-- Large Overall Score Doughnut -->
            <div class="relative flex items-center justify-center mb-4">
              <div class="absolute w-[200px] h-[200px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
              <DoughnutChart :value="overallScore" :color="overallScore > 80 ? '#22C55E' : '#FACC15'" :size="200" :showPercent="true" />
            </div>
            <div class="text-[18px] font-semibold text-gray-800 dark:text-white mb-4">Overall Score</div>
            <!-- Row of two smaller doughnuts -->
            <div class="flex flex-row items-center justify-center gap-12 w-full">
              <div class="flex flex-col items-center">
                <div class="relative flex items-center justify-center mb-2">
                  <div class="absolute w-[90px] h-[90px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
                  <DoughnutChart :value="rounded(a11yScore)" :color="a11yScore > 80 ? '#22C55E' : '#FACC15'" :size="90" :showPercent="true" />
                </div>
                <div class="text-[14px] font-semibold text-gray-800 dark:text-white">Accessibility</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="relative flex items-center justify-center mb-2">
                  <div class="absolute w-[90px] h-[90px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
                  <DoughnutChart :value="seoScore" :color="seoScore > 80 ? '#22C55E' : '#FACC15'" :size="90" :showPercent="true" />
                </div>
                <div class="text-[14px] font-semibold text-gray-800 dark:text-white">SEO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Right: 2 rows, each with 2 cards side by side -->
      <div class="flex flex-col gap-6 h-full">
        <!-- Row 1: Non-text & Focus Visible -->
        <div class="flex flex-row gap-6">
          <!-- Non-text Doughnut Card -->
          <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-6 flex flex-col items-center flex-1">
            <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Non-text</div>
            <div class="relative flex items-center justify-center mb-2">
              <div class="absolute w-[90px] h-[90px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
              <DoughnutChart :value="nonTextScore" :color="getScoreColor(nonTextScore)" :size="90" />
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 text-center">Images with Alt Text</div>
          </div>
          <!-- Focus Visible Doughnut Card -->
          <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-6 flex flex-col items-center flex-1">
            <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Focus Visible</div>
            <div class="relative flex items-center justify-center mb-2">
              <div class="absolute w-[90px] h-[90px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
              <DoughnutChart :value="focusVisibleScore" :color="getScoreColor(focusVisibleScore)" :size="90" />
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 text-center">Focusable elements with visible focus</div>
          </div>
        </div>
        <!-- Row 2: Performance & Critical Issues -->
        <div class="flex flex-row gap-6">
          <!-- Performance Doughnut Card -->
          <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-6 flex flex-col items-center flex-1">
            <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Performance</div>
            <div class="relative flex items-center justify-center mb-2">
              <div class="absolute w-[90px] h-[90px] rounded-full bg-[#6BCCFE] dark:bg-blue-400 opacity-10"></div>
              <DoughnutChart :value="calculateOverallPerformance()" :color="getScoreColor(calculateOverallPerformance())" :size="90" />
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 text-center">Performance Score</div>
          </div>
          <!-- Critical Issues Card -->
          <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-6 flex flex-col items-center flex-1">
            <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Critical Issues</div>
            <div class="text-2xl font-extrabold text-red-600 dark:text-red-400 mb-2">
              {{ (currentAccessibilitySummary?.errorCount || 0) + (currentSeoResults?.issues?.filter(i => i.severity === 'high').length || 0) }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300 mb-2">Critical Issues Found</div>
            <div class="w-full">
              <div class="flex items-center justify-between mb-1">
                <span class="inline-flex items-center">
                  <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  <span class="text-red-600 dark:text-red-400 font-semibold">Critical</span>
                </span>
                <span class="text-gray-900 dark:text-white font-medium">{{ rounded(currentAccessibilitySummary?.errorCount || 0) }}</span>
              </div>
              <div class="flex items-center justify-between mb-1">
                <span class="inline-flex items-center">
                  <span class="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                  <span class="text-yellow-600 dark:text-yellow-400 font-semibold">Warnings</span>
                </span>
                <span class="text-gray-900 dark:text-white font-medium">{{ rounded(currentAccessibilitySummary?.warningCount || 0) }}</span>
              </div>
              <div class="flex items-center justify-between mb-1">
                <span class="inline-flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span class="text-blue-600 dark:text-blue-400 font-semibold">Notices</span>
                </span>
                <span class="text-gray-900 dark:text-white font-medium">{{ rounded(currentAccessibilitySummary?.noticeCount || 0) }}</span>
              </div>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span class="text-gray-700 dark:text-gray-300 font-medium">Total Issues</span>
                <span class="text-gray-900 dark:text-white font-bold text-lg">{{ rounded(currentAccessibilitySummary?.totalIssues || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Metrics Section -->
    <div class="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center">
        <div class="text-[14px] font-semibold text-gray-800 dark:text-white mb-4">Performance Metrics</div>
        <div class="grid grid-cols-2 gap-8 w-full">
          <div class="flex flex-col items-center">
            <span class="text-[32px] font-semibold text-[#0fbe23] dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.firstContentfulPaint) }}</span>
            <span class="text-[14px] text-gray-800 dark:text-gray-300">First Contentful Paint</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[32px] font-semibold text-[#0fbe23] dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.loadTime) }}</span>
            <span class="text-[14px] text-gray-800 dark:text-gray-300">Load Time</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[32px] font-semibold text-[#0fbe23] dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.largestContentfulPaint) }}</span>
            <span class="text-[14px] text-gray-800 dark:text-gray-300">Largest Contentful Paint</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[32px] font-semibold text-[#0fbe23] dark:text-green-400">{{ formatTime(currentSeoSummary?.metrics?.performance?.timeToInteractive) }}</span>
            <span class="text-[14px] text-gray-800 dark:text-gray-300">Time to Interactive</span>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center">
        <div class="text-[14px] font-semibold text-gray-800 dark:text-white mb-4">Labels / Instructions</div>
        <div class="w-full">
          <div class="mb-4">
            <div class="flex justify-between mb-1">
              <span class="text-[12px] text-gray-800 dark:text-gray-300">Home page</span>
              <span class="text-[12px] text-gray-800 dark:text-gray-300">74</span>
            </div>
            <div class="w-full h-2 bg-[#F2F7FF] dark:bg-gray-700 rounded-full">
              <div class="h-full bg-gradient-to-r from-[#EEA216] to-[#FFE57D] dark:from-yellow-500 dark:to-yellow-300 rounded-full" style="width: 74%"></div>
            </div>
          </div>
          <div class="mb-4">
            <div class="flex justify-between mb-1">
              <span class="text-[12px] text-gray-800 dark:text-gray-300">Another page</span>
              <span class="text-[12px] text-gray-800 dark:text-gray-300">52</span>
            </div>
            <div class="w-full h-2 bg-[#F2F7FF] dark:bg-gray-700 rounded-full">
              <div class="h-full bg-gradient-to-r from-[#EEA216] to-[#FFE57D] dark:from-yellow-500 dark:to-yellow-300 rounded-full" style="width: 52%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-[12px] text-gray-800 dark:text-gray-300">Contact page</span>
              <span class="text-[12px] text-gray-800 dark:text-gray-300">27</span>
            </div>
            <div class="w-full h-2 bg-[#F2F7FF] dark:bg-gray-700 rounded-full">
              <div class="h-full bg-gradient-to-r from-[#EEA216] to-[#FFE57D] dark:from-yellow-500 dark:to-yellow-300 rounded-full" style="width: 27%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reintroduced Metrics & Cards -->
    <div class="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 mt-8">
      <!-- Left: SEO Meta Analysis Card -->
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center min-h-[400px]">
        <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">SEO Category Scores</div>
        <div class="w-full flex flex-col gap-4">
          <div v-for="(cat, index) in seoMetaAnalysis" :key="index" class="flex flex-col gap-0.5">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-800 dark:text-white">{{ cat.name }}</span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ cat.score }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-0.5">
              <div class="h-full rounded-full" :class="getScoreColorClass(cat.score)" :style="{ width: `${cat.score}%` }"></div>
            </div>
            <div v-if="cat.issues.length" class="space-y-0.5 pl-6">
              <div v-for="(issue, issueIndex) in cat.issues.slice(0, 2)" :key="issueIndex" class="flex items-start gap-1.5">
                <span class="text-sm text-red-400">&#9888;</span>
                <span class="text-xs text-gray-700 dark:text-gray-300">{{ issue.message }}</span>
              </div>
              <div v-if="cat.issues.length > 2" class="text-xs text-gray-400 dark:text-gray-400 ml-4">+{{ cat.issues.length - 2 }} more</div>
            </div>
            <div v-else class="text-xs text-green-600 dark:text-green-400 pl-6">No major issues</div>
          </div>
        </div>
      </div>
      <!-- Right: Contrast and Labels stacked vertically -->
      <div class="flex flex-col gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center">
          <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Contrast (minimum)</div>
          <BarChart :labels="['Page 1','Page 2','Page 3','Page 4','Page 5','Page 6','Page 7']" :values="[20,40,30,60,80,50,70]" color="#3B82F6" label="Contrast" :height="120" />
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center">
          <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Labels / Instructions</div>
          <BarChart :labels="['Home page','Another page','Contact page']" :values="[74,52,27]" color="#6366F1" label="Inputs without labels" :height="120" />
        </div>
      </div>
    </div>

    <!-- AI-generated Analysis Overview -->
    <div class="max-w-7xl mx-auto mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 flex flex-col items-center min-h-[200px]">
        <div class="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">Analysis Overview</div>
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
import { ref, onMounted, watch, computed, watchEffect } from 'vue'
import { useRoute } from '#app'
import DoughnutChart from '~/components/ui/DoughnutChart.vue'
import BarChart from '~/components/ui/BarChart.vue'
import DashboardCard from '~/components/ui/DashboardCard.vue'
import Tooltip from '../components/Tooltip.vue'
import SummaryChart from '../components/SummaryChart.vue'
import IssueList from '../components/IssueList.vue'
import SEOAnalysis from './seo-analysis.vue'

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

const seoCategoryIcons = {
  Meta: 'mdi-file-document-outline',
  Content: 'mdi-text-box-outline',
  Technical: 'mdi-cog-outline',
  Structure: 'mdi-view-grid-outline'
};

onMounted(() => {
  try {
    const storedResults = localStorage.getItem('latestAnalysis')
    if (storedResults) {
      const parsed = JSON.parse(storedResults)
      storedSeoResults.value = parsed.seoResults
      storedAccessibilityResults.value = parsed.accessibilityResults
      storedAccessibilitySummary.value = parsed.accessibilitySummary
      storedSeoSummary.value = parsed.seoSummary
      currentUrl.value = props.analyzedUrl || parsed.url || ''
      lastAnalyzedDate.value = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString() : ''
    } else {
      currentUrl.value = props.analyzedUrl || ''
    }
    
    // Use the query param if no prop is provided
    if (!props.analyzedUrl && route?.query?.url) {
      currentUrl.value = route.query.url as string
    }
    
    // Debug logging
    console.log('CombinedDashboard - Initial URL:', currentUrl.value)
    console.log('CombinedDashboard - Props URL:', props.analyzedUrl)
  } catch (error) {
    console.error('Error in CombinedDashboard mounted hook:', error)
    // Set a default URL if everything fails
    currentUrl.value = props.analyzedUrl || 'No URL available'
  }
})

// Update the storage logic to include URL
const updateStoredResults = () => {
  try {
    if (props.seoResults && props.accessibilityResults) {
      const resultsToStore = {
        url: props.analyzedUrl || (route?.query?.url as string) || currentUrl.value,
        seoResults: props.seoResults,
        accessibilityResults: props.accessibilityResults,
        accessibilitySummary: props.accessibilitySummary,
        seoSummary: props.seoSummary,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('latestAnalysis', JSON.stringify(resultsToStore))
      
      // Update stored references
      storedSeoResults.value = props.seoResults
      storedAccessibilityResults.value = props.accessibilityResults
      storedAccessibilitySummary.value = props.accessibilitySummary
      storedSeoSummary.value = props.seoSummary
      currentUrl.value = props.analyzedUrl || (route?.query?.url as string) || currentUrl.value
      lastAnalyzedDate.value = new Date(resultsToStore.timestamp).toLocaleString()
      
      // Debug logging
      console.log('CombinedDashboard - Updated URL:', currentUrl.value)
    }
  } catch (error) {
    console.error('Error updating stored results:', error)
  }
}

// Watch for changes in the analyzed URL
watch(() => props.analyzedUrl, (newUrl) => {
  if (newUrl) {
    currentUrl.value = newUrl
    updateStoredResults()
    console.log('CombinedDashboard - URL changed to:', newUrl)
  }
}, { immediate: true })

// Use computed properties to always return the latest results
const currentSeoResults = computed(() => props.seoResults || storedSeoResults.value)
const currentAccessibilityResults = computed(() => props.accessibilityResults || storedAccessibilityResults.value)
const currentAccessibilitySummary = computed(() => props.accessibilitySummary || storedAccessibilitySummary.value)
const currentSeoSummary = computed(() => props.seoSummary || storedSeoSummary.value)

// Update stored results whenever new props are received
watch(() => [props.seoResults, props.accessibilityResults], () => {
  updateStoredResults()
}, { deep: true })

const rounded = (val) => Math.round(val)
const formatTime = (ms) => ms ? (ms / 1000).toFixed(2) + 's' : 'N/A'

const a11yScore = computed(() => {
  const summary = currentAccessibilitySummary.value;
  console.log('Accessibility Summary:', summary);
  
  // If no summary or no results, return 0 (no data)
  if (!summary || !currentAccessibilityResults.value.length) {
    console.log('No accessibility data available, returning 0');
    return 0;
  }

  // Calculate weights for different types of issues
  const weights = {
    error: 1.0,      // Critical issues have full weight
    warning: 0.6,    // Warnings have 60% weight
    notice: 0.3      // Notices have 30% weight
  };

  // Calculate weighted score based on issue types
  const totalWeightedIssues = 
    (summary.errorCount * weights.error) +
    (summary.warningCount * weights.warning) +
    (summary.noticeCount * weights.notice);

  const totalIssues = summary.errorCount + summary.warningCount + summary.noticeCount;
  
  // Calculate base score (100 - weighted percentage of issues)
  const baseScore = totalIssues > 0
    ? Math.max(0, 100 - (totalWeightedIssues / totalIssues) * 100)
    : 100;

  console.log('Base Score Calculation:', {
    totalWeightedIssues,
    totalIssues,
    baseScore
  });

  // Calculate specific category scores with improved weights
  const categoryScores = {
    contrast: calculateCategoryScore(summary.contrastIssues || 0, totalIssues),
    focus: calculateCategoryScore(summary.focusIssues || 0, totalIssues),
    nonText: calculateCategoryScore(summary.nonTextIssues || 0, totalIssues),
    labels: calculateCategoryScore(summary.labelIssues || 0, totalIssues),
    // Add new categories
    structure: calculateCategoryScore(
      currentAccessibilityResults.value.filter(issue => 
        issue.code?.toLowerCase().includes('structure') ||
        issue.message?.toLowerCase().includes('structure') ||
        issue.message?.toLowerCase().includes('semantic')
      ).length,
      totalIssues
    ),
    keyboard: calculateCategoryScore(
      currentAccessibilityResults.value.filter(issue => 
        issue.code?.toLowerCase().includes('keyboard') ||
        issue.message?.toLowerCase().includes('keyboard') ||
        issue.message?.toLowerCase().includes('focus')
      ).length,
      totalIssues
    )
  };

  console.log('Category Scores:', categoryScores);

  // Calculate final score as weighted average of base score and category scores
  // Adjusted weights to account for new categories
  const finalScore = Math.round(
    (baseScore * 0.4) + // Base score has 40% weight
    (categoryScores.contrast * 0.1) + // Each category has 10% weight
    (categoryScores.focus * 0.1) +
    (categoryScores.nonText * 0.1) +
    (categoryScores.labels * 0.1) +
    (categoryScores.structure * 0.1) +
    (categoryScores.keyboard * 0.1)
  );

  console.log('Final Accessibility Score:', finalScore);
  return finalScore;
});

// Helper function to calculate category scores with improved logic
function calculateCategoryScore(issues: number, totalIssues: number): number {
  if (totalIssues === 0) return 100;
  // Use a logarithmic scale to make the score more forgiving for fewer issues
  const rawScore = (issues / totalIssues) * 100;
  return Math.max(0, 100 - rawScore);
}

const seoScore = computed(() => rounded(currentSeoResults.value?.score || 0))
const overallScore = computed(() => {
  const a11y = rounded(a11yScore.value);
  const seo = seoScore.value;
  
  // If we have accessibility results but no SEO results
  if (a11y > 0 && seo === 0) {
    return a11y;
  }
  
  // If we have SEO results but no accessibility results
  if (seo > 0 && a11y === 0) {
    return seo;
  }
  
  // If we have both results, calculate weighted average
  // Give more weight to accessibility score (70%) than SEO score (30%)
  if (a11y > 0 && seo > 0) {
    return rounded((a11y * 0.7) + (seo * 0.3));
  }
  
  // If no results at all, return 0
  return 0;
});

function getScoreColor(score: number): string {
  if (score >= 90) return '#22C55E' // green-500
  if (score >= 70) return '#FACC15' // yellow-400
  if (score >= 50) return '#3B82F6' // blue-500
  return '#EF4444' // red-500
}

function getScoreColorClass(score: number): string {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-yellow-400'
  if (score >= 50) return 'bg-blue-500'
  return 'bg-red-500'
}

function formatCategory(category: string): string {
  return category
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function seoCategoryScore(category: string): number {
  const breakdown = currentSeoResults.value?.scoreBreakdown || {};
  switch (category) {
    case 'Meta': return rounded(breakdown.meta || 0);
    case 'Content': return rounded(breakdown.content || 0);
    case 'Technical': return rounded(breakdown.technical || 0);
    case 'Structure': return rounded(breakdown.structure || 0);
    default: return 0;
  }
}

// Add refresh function
const refreshAnalysis = () => {
  // Emit an event to trigger a new analysis
  emit('refresh-analysis')
}

// Add emit definition
const emit = defineEmits(['refresh-analysis'])

// Update the non-text score calculation to round the percentage
const nonTextScore = computed(() => {
  const summary = currentAccessibilitySummary.value;
  
  // If no summary or no results, return 0 (no data)
  if (!summary || !currentAccessibilityResults.value.length) {
    console.log('No accessibility data available for non-text score, returning 0');
    return 0;
  }

  // Get non-text issues count from summary and additional checks
  const nonTextIssues = summary.nonTextIssues || 0;
  const additionalNonTextIssues = currentAccessibilityResults.value.filter(issue =>
    issue.code?.toLowerCase().includes('alt') ||
    issue.message?.toLowerCase().includes('image') ||
    issue.message?.toLowerCase().includes('alt') ||
    issue.message?.toLowerCase().includes('non-text') ||
    issue.context?.toLowerCase().includes('img') ||
    issue.context?.toLowerCase().includes('image')
  ).length;

  const totalNonTextIssues = nonTextIssues + additionalNonTextIssues;
  const totalIssues = summary.totalIssues || 0;

  // Calculate score (100 - percentage of non-text issues) and round it
  const score = totalIssues > 0
    ? Math.round(100 - (totalNonTextIssues / totalIssues) * 100)
    : 100;

  console.log('Non-text Score Calculation:', {
    nonTextIssues,
    additionalNonTextIssues,
    totalNonTextIssues,
    totalIssues,
    score
  });

  return score;
});

const calculateOverallPerformance = () => {
  if (!currentSeoSummary.value?.metrics?.performance) return 0;

  const performance = currentSeoSummary.value.metrics.performance;
  
  // Calculate weighted scores for different performance metrics
  const weights = {
    firstContentfulPaint: 0.25,
    largestContentfulPaint: 0.25,
    timeToInteractive: 0.25,
    loadTime: 0.25
  };

  // Convert all metrics to scores (0-100)
  const getMetricScore = (value: number, threshold: number) => {
    return Math.max(0, Math.min(100, Math.round((1 - (value / threshold)) * 100)));
  };

  const scores = {
    firstContentfulPaint: getMetricScore(performance.firstContentfulPaint || 0, 2000), // 2s threshold
    largestContentfulPaint: getMetricScore(performance.largestContentfulPaint || 0, 2500), // 2.5s threshold
    timeToInteractive: getMetricScore(performance.timeToInteractive || 0, 3500), // 3.5s threshold
    loadTime: getMetricScore(performance.loadTime || 0, 3000) // 3s threshold
  };

  // Calculate weighted average
  const weightedScore = 
    (scores.firstContentfulPaint * weights.firstContentfulPaint) +
    (scores.largestContentfulPaint * weights.largestContentfulPaint) +
    (scores.timeToInteractive * weights.timeToInteractive) +
    (scores.loadTime * weights.loadTime);

  return Math.round(weightedScore);
};

const isAnalysisComplete = computed(() => {
  return (
    currentAccessibilityResults.value?.length > 0 &&
    currentSeoResults.value !== null &&
    currentAccessibilitySummary.value &&
    currentSeoSummary.value
  );
});

const criticalAccessibilityIssues = computed(() => {
  if (!currentAccessibilityResults.value.length) return [];
  
  return currentAccessibilityResults.value
    .filter(issue => issue.severity === 'error' || issue.severity === 'critical')
    .slice(0, 3) // Show top 3 critical issues
    .map(issue => issue.message);
});

const criticalSeoIssues = computed(() => {
  if (!currentSeoResults.value?.issues) return [];
  
  return currentSeoResults.value.issues
    .filter(issue => issue.severity === 'high')
    .slice(0, 3) // Show top 3 critical issues
    .map(issue => issue.message);
});

const generateDetailedReport = async () => {
  try {
    // Use Gemini to generate a detailed report
    const report = await generateReport({
      accessibilityResults: currentAccessibilityResults.value,
      seoResults: currentSeoResults.value,
      accessibilitySummary: currentAccessibilitySummary.value,
      seoSummary: currentSeoSummary.value
    });
    
    // Handle the generated report (e.g., show in modal, download, etc.)
    console.log('Generated Report:', report);
  } catch (error) {
    console.error('Error generating report:', error);
  }
};

const focusVisibleScore = computed(() => {
  if (!currentAccessibilityResults.value?.length) return 0;
  
  const focusIssues = currentAccessibilityResults.value.filter(issue => 
    issue.code?.toLowerCase().includes('focus') ||
    issue.message?.toLowerCase().includes('focus')
  ).length;
  
  const totalIssues = currentAccessibilityResults.value.length;
  return totalIssues > 0 ? Math.round(100 - (focusIssues / totalIssues) * 100) : 100;
});

const seoMetaAnalysis = computed(() => {
  const seo = currentSeoResults.value;
  if (!seo || !seo.scoreBreakdown) return [];

  // Group issues by category
  const issues = seo.issues || [];
  const groupIssues = (keywords) =>
    issues.filter(issue =>
      keywords.some(key => (issue.message || '').toLowerCase().includes(key))
    );

  return [
    {
      name: 'Meta',
      score: seo.scoreBreakdown.meta ?? 0,
      issues: groupIssues(['meta', 'title', 'description', 'canonical', 'robots', 'og', 'twitter'])
    },
    {
      name: 'Content',
      score: seo.scoreBreakdown.content ?? 0,
      issues: groupIssues(['content', 'word count', 'keyword'])
    },
    {
      name: 'Technical',
      score: seo.scoreBreakdown.technical ?? 0,
      issues: groupIssues(['image', 'link', 'performance', 'load time'])
    },
    {
      name: 'Structure',
      score: seo.scoreBreakdown.structure ?? 0,
      issues: groupIssues(['heading', 'structure'])
    }
  ];
});

// Update the aiRecommendations computed property
const aiRecommendations = computed(async () => {
  if (!currentAccessibilityResults.value?.length && !currentSeoResults.value?.issues) return [];

  try {
    // Prepare data for Gemini
    const analysisData = {
      accessibility: {
        results: currentAccessibilityResults.value,
        summary: currentAccessibilitySummary.value,
        score: a11yScore.value
      },
      seo: {
        results: currentSeoResults.value,
        summary: currentSeoSummary.value,
        score: seoScore.value
      },
      performance: {
        metrics: currentSeoSummary.value?.metrics?.performance,
        score: calculateOverallPerformance()
      }
    };

    // Get AI recommendations from Gemini
    const recommendations = await generateAnalysisRecommendations(analysisData);
    return recommendations;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
});

// Add function to generate recommendations using Gemini
const generateAnalysisRecommendations = async (analysisData) => {
  try {
    const prompt = `Analyze the following web analytics data and provide specific, actionable recommendations:

    Accessibility Analysis:
    - Score: ${analysisData.accessibility.score}%
    - Issues: ${JSON.stringify(analysisData.accessibility.results)}
    - Summary: ${JSON.stringify(analysisData.accessibility.summary)}

    SEO Analysis:
    - Score: ${analysisData.seo.score}%
    - Issues: ${JSON.stringify(analysisData.seo.results)}
    - Summary: ${JSON.stringify(analysisData.seo.summary)}

    Performance Metrics:
    - Score: ${analysisData.performance.score}%
    - Metrics: ${JSON.stringify(analysisData.performance.metrics)}

    Please provide:
    1. Top 3 critical accessibility issues with specific recommendations
    2. Top 3 critical SEO issues with specific recommendations
    3. Performance improvement suggestions based on the metrics
    4. Overall improvement strategy

    Format the response as a JSON object with the following structure:
    {
      "accessibility": {
        "issues": [
          {
            "message": "issue description",
            "impact": "severity level",
            "recommendation": "specific recommendation"
          }
        ]
      },
      "seo": {
        "issues": [
          {
            "message": "issue description",
            "impact": "severity level",
            "recommendation": "specific recommendation"
          }
        ]
      },
      "performance": {
        "issues": [
          {
            "message": "issue description",
            "impact": "severity level",
            "recommendation": "specific recommendation"
          }
        ]
      },
      "overall": {
        "summary": "overall analysis summary",
        "priority": "high/medium/low",
        "recommendations": ["specific recommendation 1", "specific recommendation 2"]
      }
    }`;

    const response = await generateReport(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error in generateAnalysisRecommendations:', error);
    return null;
  }
};

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
  // Headings
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Bullet points
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  // Wrap <li> in <ul> if any
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  }
  // Paragraphs
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = `<p>${html}</p>`;
  return html;
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
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
/* Fix bold text and base text in AI analysis for dark mode */
.dark .prose {
  color: #e5e7eb !important;
}
.dark .prose :is(strong, b, .font-bold) {
  color: #fff !important;
}
</style> 