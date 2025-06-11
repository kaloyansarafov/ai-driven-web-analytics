<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="close"></div>

    <!-- Panel -->
    <div class="absolute inset-y-0 right-0 max-w-full flex">
      <div class="w-screen max-w-md">
        <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                AI Analysis
              </h2>
              <button
                @click="close"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">Close panel</span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center h-full">
              <div class="text-center">
                <svg
                  class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-400">
                  Analyzing with AI...
                </p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-8">
              <svg
                class="h-12 w-12 text-red-500 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p class="text-red-600 dark:text-red-400 mb-2">
                {{ error }}
              </p>
              <button
                @click="fetchRecommendations"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Try again
              </button>
            </div>

            <!-- Content -->
            <div v-else-if="recommendations" class="space-y-6">
              <!-- Explanation -->
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Analysis
                </h3>
                <p class="text-sm text-blue-700 dark:text-blue-400">
                  {{ recommendations.explanation }}
                </p>
              </div>

              <!-- Recommendations -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Recommendations
                </h3>
                <ul class="space-y-3">
                  <li
                    v-for="(rec, index) in recommendations.recommendations"
                    :key="index"
                    class="flex items-start"
                  >
                    <span
                      class="flex-shrink-0 h-5 w-5 text-blue-500 dark:text-blue-400 mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {{ rec }}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Technical Terms -->
              <div v-if="recommendations.technicalTerms?.length">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Technical Terms
                </h3>
                <dl class="space-y-3">
                  <div
                    v-for="term in recommendations.technicalTerms"
                    :key="term.term"
                    class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <dt class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ term.term }}
                    </dt>
                    <dd class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ term.definition }}
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Related Links -->
              <div v-if="recommendations.relatedLinks?.length">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Related Resources
                </h3>
                <div class="space-y-3">
                  <a
                    v-for="link in recommendations.relatedLinks"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                  >
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {{ link.title }}
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ link.description }}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';

interface TechnicalTerm {
  term: string;
  definition: string;
}

interface RelatedLink {
  title: string;
  url: string;
  description: string;
}

interface AIRecommendations {
  explanation: string;
  recommendations: string[];
  technicalTerms?: TechnicalTerm[];
  relatedLinks?: RelatedLink[];
}

const props = defineProps<{
  isOpen: boolean;
  issue: any;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isLoading = ref(false);
const error = ref<string | null>(null);
const recommendations = ref<AIRecommendations | null>(null);

// Watch for changes in the issue prop
watch(
  () => props.issue,
  async (newIssue) => {
    if (newIssue && props.isOpen) {
      await fetchRecommendations();
    }
  }
);

// Watch for panel open state
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.issue) {
      await fetchRecommendations();
    }
  }
);

async function fetchRecommendations() {
  if (!props.issue) return;

  isLoading.value = true;
  error.value = null;
  recommendations.value = null;

  try {
    const response = await axios.post('/api/gemini', {
      issue: {
        type: props.issue.type,
        message: props.issue.message,
        context: props.issue.context,
        detail: props.issue.detail,
        source: props.issue.source,
        category: props.issue.category,
        url: props.issue.url
      },
      includeRelatedLinks: true
    });

    if (response.data?.success) {
      recommendations.value = response.data.data;
    } else {
      throw new Error('Failed to get AI recommendations');
    }
  } catch (err) {
    console.error('Error getting AI recommendations:', err);
    error.value = 'Failed to get AI recommendations. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function close() {
  emit('close');
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 