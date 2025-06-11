<template>
  <div class="min-h-screen bg-gray-50">
    <main class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          SEO & Accessibility Dashboard
        </h1>
        <p class="text-lg text-gray-600">
          Analyze your website's SEO and accessibility in one go
        </p>
      </div>

      <!-- URL Input Form -->
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-8">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <div class="flex gap-4">
              <input
                id="url"
                v-model="url"
                type="url"
                required
                placeholder="https://example.com"
                class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                :disabled="isLoading"
              />
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading || !url"
              >
                <span v-if="isLoading">Analyzing...</span>
                <span v-else>Analyze</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="max-w-2xl mx-auto mb-8">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Results Navigation -->
      <div v-if="hasResults" class="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          to="/seo-results"
          class="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">SEO Analysis</h2>
          <p class="text-gray-600">View detailed SEO analysis and recommendations</p>
        </NuxtLink>

        <NuxtLink
          to="/accessibility-results"
          class="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Accessibility Analysis</h2>
          <p class="text-gray-600">View detailed accessibility analysis and recommendations</p>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnalysisStore } from '~/stores/analysis'

const store = useAnalysisStore()
const url = ref('')

const isLoading = computed(() => store.isLoading)
const error = computed(() => store.error)
const hasResults = computed(() => store.hasResults)

async function handleSubmit() {
  if (!url.value) return
  await store.analyzeUrl(url.value)
}
</script>
