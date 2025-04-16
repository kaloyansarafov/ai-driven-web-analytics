<template>
  <div class="min-h-screen py-12 space-y-8">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <UBadge color="primary" variant="subtle">Web Analytics Tool</UBadge>
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
        Website Performance Scanner - UI connections
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Get instant insights about your website's performance and accessibility with our AI-powered analysis tool
      </p>
    </div>

    <!-- URL Input Section -->
    <div class="max-w-2xl mx-auto w-full px-4">
      <UCard class="backdrop-blur-sm">
        <form @submit.prevent="analyzeWebsite" class="space-y-4">
          <UFormField label="Enter your website URL" help="Example: https://example.com">
            <div class="flex gap-2">
              <UInput
                v-model="url"
                placeholder="https://your-website.com"
                :ui="{
                  base: 'relative w-full flex-1',
                  icon: {
                    base: 'flex-shrink-0 h-4 w-4',
                    pointer: 'cursor-pointer',
                  }
                }"
                icon="i-heroicons-globe-alt"
                size="lg"
                color="primary"
                variant="outline"
                :loading="loading"
              />
              <UButton
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="!url || loading"
                size="lg"
                icon="i-heroicons-magnifying-glass"
              >
                {{ loading ? 'Analyzing...' : 'Analyze' }}
              </UButton>
            </div>
          </UFormField>
        </form>
      </UCard>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="max-w-2xl mx-auto px-4">
      <UAlert
        :title="error"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
      >
        <template #description>
          Please check the URL and try again
        </template>
      </UAlert>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-2xl mx-auto px-4">
      <UCard class="text-center py-12">
        <div class="space-y-4">
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="h-12 w-12 mx-auto animate-spin text-primary-500"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Analyzing Your Website
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              This might take a minute. We're checking performance and accessibility...
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Results Section -->
    <div v-if="analysis && !loading" class="max-w-5xl mx-auto px-4">
      <!-- Performance Score Card -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <UCard v-if="analysis.status.lighthouse === 'success'" class="relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4">
            <UBadge color="primary" variant="subtle">Performance</UBadge>
          </div>
          <div class="pt-8">
            <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-primary-500 mb-4" />
            <h3 class="text-xl font-semibold mb-2">Performance Score</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ analysis.data.lighthouse.simplified_explanation }}
            </p>
          </div>
        </UCard>

        <UCard v-if="analysis.status.accessibility === 'success'" class="relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4">
            <UBadge color="orange" variant="subtle">Accessibility</UBadge>
          </div>
          <div class="pt-8">
            <UIcon name="i-heroicons-user-group" class="h-8 w-8 text-orange-500 mb-4" />
            <h3 class="text-xl font-semibold mb-2">Accessibility Score</h3>
            <div class="flex gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-red-500">
                  {{ analysis.data.accessibility.scan_summary.total_violations }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Violations</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-500">
                  {{ analysis.data.accessibility.scan_summary.total_potential_issues }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Potential Issues</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Detailed Analysis -->
      <AnalysisResults :analysis="analysis" />
    </div>
  </div>
</template>

<script setup lang="ts">
const url = ref('')
const loading = ref(false)
const error = ref('')
const analysis = ref(null)

const analyzeWebsite = async () => {
  if (!url.value) return

  loading.value = true
  error.value = ''
  analysis.value = null

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.value }),
    })

    const data = await response.json()

    if (!data.success && !data.data?.lighthouse && !data.data?.accessibility) {
      throw new Error(data.error || 'Failed to analyze website')
    }

    analysis.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while analyzing the website'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script> 