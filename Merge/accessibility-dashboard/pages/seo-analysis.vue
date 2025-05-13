<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">SEO Analysis</h2>
      <p class="text-gray-600 dark:text-gray-300">
        View your website's SEO performance analysis and recommendations.
      </p>
    </div>

    <!-- Loading State -->
    <LoadingState
      v-if="isAnalyzing"
      title="Analyzing Website"
      message="Please wait while we analyze your website's SEO performance..."
      :progress="analysisProgress"
    />

    <!-- Results -->
    <div v-if="analysis" class="mt-8">
      <SEOAnalysis :analysis="analysis" />
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-md"
      role="alert"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm leading-5 font-medium">Analysis failed</h3>
          <div class="mt-1 text-sm leading-5">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { SEOAnalyzer } from '../utils/seo/SEOAnalyzer';
import type { SEOAnalysis as SEOAnalysisType } from '../utils/seo/SEOAnalyzer';
import SEOAnalysis from '../components/SEOAnalysis.vue';
import LoadingState from '../components/LoadingState.vue';

// Define props
const props = defineProps<{
  url: string;
  initialAnalysis?: SEOAnalysisType | null;
}>();

const isAnalyzing = ref(false);
const analysis = ref<SEOAnalysisType | null>(props.initialAnalysis || null);
const error = ref('');
const analysisProgress = ref(0);

// Watch for URL changes
watch(() => props.url, async (newUrl) => {
  if (newUrl && !props.initialAnalysis) {
    await runAnalysis();
  }
}, { immediate: true });

// Watch for initial analysis changes
watch(() => props.initialAnalysis, (newAnalysis) => {
  if (newAnalysis) {
    analysis.value = newAnalysis;
    isAnalyzing.value = false;
    analysisProgress.value = 100;
  }
}, { immediate: true });

async function runAnalysis() {
  if (!props.url) return;
  if (props.initialAnalysis) {
    analysis.value = props.initialAnalysis;
    return;
  }

  isAnalyzing.value = true;
  error.value = '';
  analysis.value = null;
  analysisProgress.value = 0;

  try {
    const response = await fetch('/api/seo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: props.url,
        options: {
          performance: true,
          content: true,
          technical: true,
          meta: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze website');
    }

    const data = await response.json();
    analysis.value = data;
  } catch (err: any) {
    console.error('SEO analysis error:', err);
    error.value = err.message || 'An error occurred during analysis';
  } finally {
    isAnalyzing.value = false;
    analysisProgress.value = 100;
  }
}
</script>

<style scoped>
.seo-analysis-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.input-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.analysis-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

input[type="url"] {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
}

input[type="url"]:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.analyze-button {
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.analyze-button:hover {
  background: #1976D2;
}

.analyze-button:disabled {
  background: #BDBDBD;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background: #FFEBEE;
  color: #C62828;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}

.results-section {
  margin-top: 2rem;
}
</style> 