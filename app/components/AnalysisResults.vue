<template>
  <div class="space-y-8">
    <!-- Lighthouse Analysis -->
    <div v-if="analysis?.data?.lighthouse || analysis?.errors?.lighthouse">
      <div class="flex items-center gap-2 mb-4">
        <UIcon name="i-heroicons-chart-bar" class="h-6 w-6 text-primary-500" />
        <h2 class="text-2xl font-semibold">Performance Analysis</h2>
      </div>

      <template v-if="analysis?.status?.lighthouse === 'success'">
        <!-- Recommendations -->
        <div class="grid sm:grid-cols-2 gap-4 mb-6">
          <template v-for="(rec, index) in analysis.data.lighthouse.actionable_recommendations" :key="index">
            <UCard class="relative overflow-hidden" :ui="{ ring: '', base: 'relative overflow-hidden' }">
              <div class="absolute top-0 right-0 p-2">
                <UBadge :color="getPriorityColor(rec.priority)" :label="rec.priority" />
              </div>
              <div class="space-y-2 pt-6">
                <h4 class="font-medium">{{ rec.recommendation }}</h4>
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UIcon name="i-heroicons-arrow-trending-up" class="h-4 w-4" />
                    <span>Impact: {{ rec.impact }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                    <span>Effort: {{ rec.estimated_effort }}</span>
                  </div>
                </div>
              </div>
            </UCard>
          </template>
        </div>

        <!-- Technical Terms -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 class="text-lg font-medium mb-4">Technical Terms</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div v-for="(term, index) in analysis.data.lighthouse.technical_terms_explained" :key="index" class="space-y-1">
              <h4 class="font-medium">{{ term.term }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ term.definition }}</p>
            </div>
          </div>
        </div>
      </template>

      <UAlert
        v-else
        color="red"
        variant="soft"
        :title="analysis?.errors?.lighthouse"
        icon="i-heroicons-exclamation-triangle"
      />
    </div>

    <!-- Accessibility Analysis -->
    <div v-if="analysis?.data?.accessibility || analysis?.errors?.accessibility">
      <div class="flex items-center gap-2 mb-4">
        <UIcon name="i-heroicons-user-group" class="h-6 w-6 text-orange-500" />
        <h2 class="text-2xl font-semibold">Accessibility Analysis</h2>
      </div>

      <template v-if="analysis?.status?.accessibility === 'success'">
        <!-- Issues by Category -->
        <div class="space-y-4 mb-8">
          <UCard
            v-for="(category, index) in analysis.data.accessibility.issues_by_category"
            :key="index"
            class="overflow-hidden"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-folder" class="h-5 w-5 text-orange-500" />
                  <h4 class="font-medium">{{ category.category }}</h4>
                </div>
                <div class="flex gap-2">
                  <UBadge v-if="category.violations" color="red" :label="`${category.violations} violations`" />
                  <UBadge v-if="category.potential_issues" color="yellow" :label="`${category.potential_issues} potential`" />
                </div>
              </div>
              
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ category.description }}</p>
              
              <div v-if="category.examples?.length" class="bg-gray-50 dark:bg-gray-800/50 rounded p-4">
                <p class="text-sm font-medium mb-2">Examples:</p>
                <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li v-for="(example, idx) in category.examples" :key="idx">{{ example }}</li>
                </ul>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Recommendations -->
        <div class="space-y-4 mb-8">
          <h3 class="text-lg font-medium">Recommendations</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <UCard
              v-for="(rec, index) in analysis.data.accessibility.actionable_recommendations"
              :key="index"
              class="relative overflow-hidden"
            >
              <div class="absolute top-0 right-0 p-2">
                <UBadge :color="getPriorityColor(rec.priority)" :label="rec.priority" />
              </div>
              <div class="space-y-3 pt-6">
                <h4 class="font-medium">{{ rec.recommendation }}</h4>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UIcon name="i-heroicons-arrow-trending-up" class="h-4 w-4" />
                    <span>Impact: {{ rec.impact }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                    <span>Effort: {{ rec.estimated_effort }}</span>
                  </div>
                </div>
                <div v-if="rec.affected_elements?.length" class="pt-2">
                  <p class="text-sm font-medium mb-1">Affected Elements:</p>
                  <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    <li v-for="(element, idx) in rec.affected_elements" :key="idx">{{ element }}</li>
                  </ul>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Technical Terms -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 class="text-lg font-medium mb-4">Technical Terms</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div v-for="(term, index) in analysis.data.accessibility.technical_terms_explained" :key="index" class="space-y-1">
              <h4 class="font-medium">{{ term.term }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ term.definition }}</p>
            </div>
          </div>
        </div>
      </template>

      <UAlert
        v-else
        color="red"
        variant="soft"
        :title="analysis?.errors?.accessibility"
        icon="i-heroicons-exclamation-triangle"
      />
    </div>

    <div class="flex flex-col gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">SEO Analysis</h3>
            <UButton
              icon="i-heroicons-document-magnifying-glass"
              @click="viewFullReport('seo')"
              color="gray"
              variant="soft"
              size="sm"
            >
              View Full Report
            </UButton>
          </div>
        </template>
        <div class="whitespace-pre-wrap">{{ seoReport }}</div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Accessibility Analysis</h3>
            <UButton
              icon="i-heroicons-document-magnifying-glass"
              @click="viewFullReport('accessibility')"
              color="gray"
              variant="soft"
              size="sm"
            >
              View Full Report
            </UButton>
          </div>
        </template>
        <div v-if="accessibilityReport" class="space-y-4">
          <!-- Accessibility Report content -->
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  analysis: {
    success: boolean
    data: {
      lighthouse?: any
      accessibility?: any
      seo?: any
    }
    errors: {
      lighthouse?: string
      accessibility?: string
      seo?: string
    }
    status: {
      lighthouse: 'success' | 'error'
      accessibility: 'success' | 'error'
      seo: 'success' | 'error'
    }
  }
  seoReport?: string
  accessibilityReport?: any
}>()

const router = useRouter()

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'red'
    case 'medium':
      return 'yellow'
    case 'low':
      return 'green'
    default:
      return 'gray'
  }
}

function viewFullReport(type: 'seo' | 'accessibility') {
  // Store the report data in localStorage before navigation
  if (type === 'seo' && props.seoReport) {
    localStorage.setItem('seoReport', props.seoReport)
  } else if (type === 'accessibility' && props.accessibilityReport) {
    localStorage.setItem('accessibilityReport', JSON.stringify(props.accessibilityReport))
  }
  
  // Navigate to the report page
  router.push(`/report/${type}`)
}
</script> 