<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Accessibility Analysis Results</h1>
        <NuxtLink
          to="/"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Home
        </NuxtLink>
      </div>

      <!-- Results Content -->
      <div v-if="accessibilityResults" class="space-y-8">
        <!-- Overall Score -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Overall Score</h2>
          <div class="flex items-center gap-4">
            <div class="w-24 h-24">
              <CircleProgress
                :percent="accessibilityResults.overallScore"
                :size="96"
                :border-width="8"
                :border-bg-width="8"
                fill-color="#3B82F6"
                empty-color="#E5E7EB"
              />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ accessibilityResults.overallScore }}%</p>
              <p class="text-gray-600">{{ getScoreDescription(accessibilityResults.overallScore) }}</p>
            </div>
          </div>
        </div>

        <!-- WCAG Compliance -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">WCAG Compliance</h2>
          <div class="space-y-4">
            <div
              v-for="(level, index) in accessibilityResults.wcagLevels"
              :key="index"
              class="flex items-center justify-between"
            >
              <span class="text-gray-700">{{ level.name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    class="h-full rounded-full"
                    :class="getScoreColorClass(level.score)"
                    :style="{ width: `${level.score}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ level.score }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Issues and Recommendations -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Issues & Recommendations</h2>
          <div class="space-y-4">
            <div
              v-for="(issue, index) in accessibilityResults.issues"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ issue.title }}</h3>
                  <p class="text-gray-600 mt-1">{{ issue.description }}</p>
                  <p v-if="issue.wcagReference" class="text-sm text-gray-500 mt-1">
                    WCAG Reference: {{ issue.wcagReference }}
                  </p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getSeverityClass(issue.severity)"
                >
                  {{ issue.severity }}
                </span>
              </div>
              <div v-if="issue.recommendation" class="mt-3">
                <button
                  @click="getAIRecommendation(issue)"
                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Get AI Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600">No accessibility analysis results available.</p>
        <NuxtLink
          to="/"
          class="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
        >
          Run a new analysis
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAnalysisStore } from '~/stores/analysis'
import CircleProgress from 'vue3-circle-progress'

const store = useAnalysisStore()
const accessibilityResults = computed(() => store.accessibilityResults)

// Redirect to home if no results
onMounted(() => {
  if (!store.hasResults) {
    navigateTo('/')
  }
})

function getScoreDescription(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Improvement'
}

function getScoreColorClass(score: number): string {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-blue-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getSeverityClass(severity: string): string {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  }
  return classes[severity.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

async function getAIRecommendation(issue: any) {
  // Implement AI recommendation logic here
  // This could call your Gemini API endpoint
}
</script> 