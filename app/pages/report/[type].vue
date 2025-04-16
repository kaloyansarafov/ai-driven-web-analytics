<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <UContainer>
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold">
            {{ reportType === 'accessibility' ? 'Accessibility Report' : 'SEO Analysis Report' }}
          </h1>
          <UButton
            icon="i-heroicons-arrow-left"
            @click="navigateBack"
            color="gray"
            variant="soft"
          >
            Back
          </UButton>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-12">
          <ULoadingIcon />
        </div>

        <!-- Error state -->
        <UAlert
          v-else-if="error"
          title="Error"
          description="Failed to load the report data"
          color="red"
          icon="i-heroicons-exclamation-triangle"
        />

        <!-- Accessibility Report -->
        <div v-else-if="reportType === 'accessibility' && report" class="space-y-6">
          <div v-for="(violation, index) in report.results" :key="index" class="border rounded-lg p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-lg">{{ violation.ruleId }}</h3>
                <p class="text-gray-600 mt-1">{{ violation.message }}</p>
              </div>
              <UBadge
                :color="getViolationColor(violation.level)"
                variant="soft"
                class="capitalize"
              >
                {{ violation.level }}
              </UBadge>
            </div>
            
            <div class="mt-4 space-y-2">
              <div class="text-sm">
                <span class="font-medium">Path:</span>
                <code class="ml-2 bg-gray-100 px-2 py-1 rounded">{{ violation.path.dom }}</code>
              </div>
              <div class="text-sm">
                <span class="font-medium">Category:</span>
                <span class="ml-2">{{ violation.category }}</span>
              </div>
              <div v-if="violation.snippet" class="text-sm">
                <span class="font-medium">Code:</span>
                <pre class="mt-1 bg-gray-100 p-2 rounded overflow-x-auto"><code>{{ violation.snippet }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- SEO Report -->
        <div v-else-if="reportType === 'seo' && report" class="prose max-w-none">
          <div class="whitespace-pre-wrap">{{ report }}</div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const reportType = computed(() => route.params.type as string)
const loading = ref(true)
const error = ref(false)
const report = ref<any>(null)

// Get report data from route state or localStorage
onMounted(async () => {
  try {
    if (route.params.type === 'accessibility') {
      const storedReport = localStorage.getItem('accessibilityReport')
      if (storedReport) {
        report.value = JSON.parse(storedReport)
      }
    } else if (route.params.type === 'seo') {
      const storedReport = localStorage.getItem('seoReport')
      if (storedReport) {
        report.value = storedReport
      }
    }
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
})

function getViolationColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'violation':
      return 'red'
    case 'potentialviolation':
      return 'orange'
    case 'recommendation':
      return 'blue'
    case 'potentialrecommendation':
      return 'sky'
    case 'manual':
      return 'gray'
    default:
      return 'gray'
  }
}

function navigateBack() {
  router.push('/')
}
</script> 