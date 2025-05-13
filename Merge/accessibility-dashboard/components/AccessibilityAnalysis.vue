<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">Accessibility Analysis</h2>
      <p class="text-gray-600 dark:text-gray-300">
        View detailed analysis of your accessibility scan results.
      </p>
    </div>

    <!-- WAVE Visual Report -->
    <div
      v-if="
        visualReport &&
        waveReportUrl &&
        scanCompleted &&
        selectedTools.includes('wave')
      "
      class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
      >
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          WAVE Visual Report
        </h3>
        <a
          :href="waveReportUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          <span class="mr-1">Open in new window</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
      <div class="overflow-hidden" style="height: 600px">
        <iframe
          :src="waveReportUrl"
          frameborder="0"
          title="WAVE Report"
          class="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="results.length > 0" id="results-section" class="mt-8">
      <!-- Summary Stats Cards -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Results Summary
        </h3>

        <!-- Visual Summary Chart -->
        <SummaryChart
          :errors="errorCount"
          :warnings="warningCount"
          :notices="noticeCount"
        />

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Total Issues
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ filteredResults.length }}
            </div>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/40">
            <div class="text-lg font-semibold mb-1 text-red-700 dark:text-red-400">
              Errors
            </div>
            <div class="flex items-center">
              <div class="text-3xl font-bold text-red-700 dark:text-red-400">
                {{ errorCount }}
              </div>
              <div
                v-if="errorCount > 0"
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
              >
                Critical
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/40">
            <div class="text-lg font-semibold mb-1 text-yellow-700 dark:text-yellow-500">
              Warnings
            </div>
            <div class="flex items-center">
              <div class="text-3xl font-bold text-yellow-700 dark:text-yellow-500">
                {{ warningCount }}
              </div>
              <div
                v-if="warningCount > 0"
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200"
              >
                Moderate
              </div>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800/40">
            <div class="text-lg font-semibold mb-1 text-blue-700 dark:text-blue-400">
              Notices
            </div>
            <div class="flex items-center">
              <div class="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {{ noticeCount }}
              </div>
              <div
                v-if="noticeCount > 0"
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200"
              >
                Info
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              Results ({{ results.length }} issues)
            </h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <!-- Source Filter -->
            <div class="flex space-x-2">
              <button
                @click="filterSource = 'all'"
                :class="{
                  'bg-blue-600 text-white': filterSource === 'all',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterSource !== 'all',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                All
              </button>
              <button
                v-if="hasWaveIssues"
                @click="filterSource = 'wave'"
                :class="{
                  'bg-blue-600 text-white': filterSource === 'wave',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterSource !== 'wave',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                WAVE
              </button>
              <button
                v-if="hasPa11yIssues"
                @click="filterSource = 'pa11y'"
                :class="{
                  'bg-blue-600 text-white': filterSource === 'pa11y',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterSource !== 'pa11y',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Pa11y
              </button>
              <button
                v-if="hasLighthouseIssues"
                @click="filterSource = 'lighthouse'"
                :class="{
                  'bg-blue-600 text-white': filterSource === 'lighthouse',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterSource !== 'lighthouse',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Lighthouse
              </button>
              <button
                v-if="hasIbmA11yIssues"
                @click="filterSource = 'ibm-a11y'"
                :class="{
                  'bg-blue-600 text-white': filterSource === 'ibm-a11y',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterSource !== 'ibm-a11y',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                IBM A11y
              </button>
            </div>

            <!-- Type Filter -->
            <div class="flex space-x-2">
              <button
                @click="filterType = 'all'"
                :class="{
                  'bg-blue-600 text-white': filterType === 'all',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterType !== 'all',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                All Types
              </button>
              <button
                @click="filterType = 'error'"
                :class="{
                  'bg-red-600 text-white': filterType === 'error',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterType !== 'error',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Errors
              </button>
              <button
                @click="filterType = 'warning'"
                :class="{
                  'bg-yellow-500 text-white': filterType === 'warning',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterType !== 'warning',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Warnings
              </button>
              <button
                @click="filterType = 'notice'"
                :class="{
                  'bg-blue-500 text-white': filterType === 'notice',
                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                    filterType !== 'notice',
                }"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Notices
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Grouped Issues List -->
      <div class="space-y-4">
        <div
          v-if="sortedGroupCodes.length === 0"
          class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400"
        >
          No issues found matching your criteria.
        </div>

        <div
          v-for="(code, index) in sortedGroupCodes"
          :key="code"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <!-- Group Header -->
          <button
            @click="toggleGroup(code)"
            class="w-full px-6 py-4 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                Issue Code:
                <code class="text-sm bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{{ code }}</code>
                <span class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({{ groupedIssues[code].length }} occurrence{{ groupedIssues[code].length === 1 ? "" : "s" }})
                </span>
              </h3>
              <svg
                :class="{
                  'transform rotate-180': expandedGroups.includes(code),
                }"
                class="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>

          <!-- Issues within the group -->
          <div
            v-if="expandedGroups.includes(code)"
            class="border-t border-gray-200 dark:border-gray-700"
          >
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li
                v-for="(issue, index) in groupedIssues[code]"
                :key="issue.selector + '-' + index"
                class="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <!-- Issue Type Badge -->
                <div class="flex items-center mb-2">
                  <span
                    :class="{
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
                        issue.type === 'error',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
                        issue.type === 'warning',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400':
                        issue.type === 'notice',
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ issue.type.charAt(0).toUpperCase() + issue.type.slice(1) }}
                  </span>
                  <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {{ issue.source }}
                  </span>
                </div>

                <!-- Issue Message -->
                <p class="text-gray-800 dark:text-gray-200 mb-2">{{ issue.message }}</p>

                <!-- Issue Context -->
                <div v-if="issue.context" class="mb-4">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Context:</p>
                  <pre
                    class="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto"
                  ><code>{{ issue.context }}</code></pre>
                </div>

                <!-- Issue Detail -->
                <div v-if="issue.detail" class="mb-4">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Details:</p>
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    <template v-for="(part, i) in formatDetailWithLinks(issue.detail)" :key="i">
                      <a
                        v-if="part.isLink"
                        :href="part.text"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {{ part.text }}
                      </a>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </div>
                </div>

                <!-- AI Recommendations -->
                <div v-if="issue.aiRecommendations" class="mt-4">
                  <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      AI Recommendations
                    </h4>
                    <p class="text-sm text-blue-700 dark:text-blue-400 mb-3">
                      {{ issue.aiRecommendations.explanation }}
                    </p>
                    <ul class="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li v-for="(rec, i) in issue.aiRecommendations.recommendations" :key="i">
                        {{ rec }}
                      </li>
                    </ul>

                    <!-- Technical Terms -->
                    <div v-if="issue.aiRecommendations.technicalTerms?.length" class="mt-4">
                      <h5 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Technical Terms
                      </h5>
                      <dl class="space-y-2">
                        <div v-for="(term, i) in issue.aiRecommendations.technicalTerms" :key="i">
                          <dt class="text-sm font-medium text-blue-700 dark:text-blue-400">
                            {{ term.term }}
                          </dt>
                          <dd class="text-sm text-blue-600 dark:text-blue-500 ml-4">
                            {{ term.definition }}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <!-- Related Links -->
                    <div v-if="issue.aiRecommendations.relatedLinks?.length" class="mt-4">
                      <h5 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Related Resources
                      </h5>
                      <div class="space-y-3">
                        <a
                          v-for="(link, i) in issue.aiRecommendations.relatedLinks"
                          :key="i"
                          :href="link.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                        >
                          <h6 class="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                            {{ link.title }}
                          </h6>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ link.description }}
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Loading State for AI -->
                <div v-else-if="issue.isLoadingAI" class="mt-4">
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
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
                    Loading AI recommendations...
                  </div>
                </div>

                <!-- AI Analysis Button -->
                <div v-else class="mt-4">
                  <button
                    @click="toggleDetails(index, code)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Get AI Analysis
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- History Tracking -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-2">Accessibility Scan History</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Track your accessibility improvements over time and compare scan results.
      </p>

      <HistoryTracking :loading="isLoading" @rescan="handleRescan" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SummaryChart from './SummaryChart.vue';
import HistoryTracking from './HistoryTracking.vue';
import axios from 'axios';

const props = defineProps<{
  results: any[];
  selectedTools: string[];
  scanCompleted: boolean;
  visualReport: boolean;
  waveReportUrl: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'rescan', url: string): void;
}>();

// State
const filterSource = ref('all');
const filterType = ref('all');
const expandedGroups = ref<string[]>([]);
const expandedDetails = ref<number[]>([]);
const showTechDetails = ref<number[]>([]);

// Computed properties
const filteredResults = computed(() => {
  if (filterSource.value === 'all') {
    return props.results;
  }
  return props.results.filter((issue) => issue.source === filterSource.value);
});

const filteredIssues = computed(() => {
  let issues = filteredResults.value;
  if (filterType.value !== 'all') {
    issues = issues.filter((issue) => issue.type === filterType.value);
  }
  return issues;
});

const errorCount = computed(() =>
  filteredResults.value.filter((issue) => issue.type === 'error').length
);

const warningCount = computed(() =>
  filteredResults.value.filter((issue) => issue.type === 'warning').length
);

const noticeCount = computed(() =>
  filteredResults.value.filter((issue) => issue.type === 'notice').length
);

const hasWaveIssues = computed(() =>
  props.results.some((issue) => issue.source === 'wave')
);

const hasPa11yIssues = computed(() =>
  props.results.some((issue) => issue.source === 'pa11y')
);

const hasLighthouseIssues = computed(() =>
  props.results.some((issue) => issue.source === 'lighthouse')
);

const hasIbmA11yIssues = computed(() =>
  props.results.some((issue) => issue.source === 'ibm-a11y')
);

// Methods
function toggleGroup(code: string) {
  const index = expandedGroups.value.indexOf(code);
  if (index === -1) {
    expandedGroups.value.push(code);
  } else {
    expandedGroups.value.splice(index, 1);
  }
}

function handleRescan(url: string) {
  emit('rescan', url);
}

// Add this interface before the formatDetailWithLinks function
interface DetailPart {
  text: string;
  isLink: boolean;
}

interface AIRecommendations {
  explanation: string;
  recommendations: string[];
  technicalTerms: {
    term: string;
    definition: string;
  }[];
  relatedLinks: {
    title: string;
    url: string;
    description: string;
  }[];
}

function formatDetailWithLinks(text: string): DetailPart[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: DetailPart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isLink: false
      });
    }
    // Add the URL
    parts.push({
      text: match[0],
      isLink: true
    });
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isLink: false
    });
  }

  return parts;
}

// Grouping logic
const groupedIssues = computed(() => {
  const groups: { [key: string]: any[] } = {};
  filteredIssues.value.forEach((issue) => {
    const key = issue.code || 'uncategorized';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(issue);
  });
  return groups;
});

const sortedGroupCodes = computed(() => {
  return Object.keys(groupedIssues.value).sort((codeA, codeB) => {
    const groupA = groupedIssues.value[codeA];
    const groupB = groupedIssues.value[codeB];

    const groupAHasError = groupA.some((issue) => issue.type === 'error');
    const groupBHasError = groupB.some((issue) => issue.type === 'error');

    if (groupAHasError && !groupBHasError) return -1;
    if (!groupAHasError && groupBHasError) return 1;

    const countDiff = groupB.length - groupA.length;
    if (countDiff !== 0) return countDiff;

    return codeA.localeCompare(codeB);
  });
});

async function toggleDetails(issueIndex: number, groupCode: string) {
  const issue = groupedIssues.value[groupCode][issueIndex];
  if (!issue.aiRecommendations && !issue.isLoadingAI) {
    issue.isLoadingAI = true;
    try {
      const recommendations = await getAIRecommendations(issue);
      if (recommendations) {
        issue.aiRecommendations = recommendations;
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      issue.isLoadingAI = false;
    }
  }
}

async function getAIRecommendations(issue: any) {
  try {
    const response = await axios.post('/api/gemini', {
      issue: {
        type: issue.type,
        message: issue.message,
        context: issue.context,
        detail: issue.detail,
        source: issue.source
      },
      includeRelatedLinks: true
    });
    
    if (response.data?.success) {
      return response.data.data;
    }
    return null;
  } catch (err) {
    console.error('Error getting AI recommendations:', err);
    return null;
  }
}
</script> 