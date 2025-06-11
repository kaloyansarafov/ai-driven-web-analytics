<template>
  <div>
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          Scan Results:
          <span class="font-normal text-blue-700">{{ results.url }}</span>
        </h2>
        <div class="flex space-x-3">
          <button
            @click="exportCSV"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            :disabled="isExporting"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
          <button
            @click="exportPDF"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            :disabled="isExporting"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div class="text-lg font-semibold mb-1">Total Issues</div>
          <div class="flex items-center">
            <div class="text-3xl font-bold mr-2">
              {{ results.statistics.total }}
            </div>
            <div
              v-if="results.statistics.total > 0"
              class="text-sm text-red-500"
            >
              Needs attention
            </div>
            <div v-else class="text-sm text-green-500">All clear!</div>
          </div>
        </div>

        <div class="bg-red-50 p-4 rounded-lg border border-red-200">
          <div class="text-lg font-semibold mb-1 text-red-700">Errors</div>
          <div class="flex items-center">
            <div class="text-3xl font-bold mr-2 text-red-700">
              {{ results.statistics.errors }}
            </div>
            <div class="text-sm text-red-500">Critical issues</div>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div class="text-lg font-semibold mb-1 text-yellow-700">Warnings</div>
          <div class="flex items-center">
            <div class="text-3xl font-bold mr-2 text-yellow-700">
              {{ results.statistics.warnings }}
            </div>
            <div class="text-sm text-yellow-600">Potential issues</div>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div class="text-lg font-semibold mb-1 text-blue-700">Notices</div>
          <div class="flex items-center">
            <div class="text-3xl font-bold mr-2 text-blue-700">
              {{ results.statistics.notices }}
            </div>
            <div class="text-sm text-blue-600">For review</div>
          </div>
        </div>
      </div>

      <!-- WCAG Compliance -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">WCAG Compliance Issues</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-3 border rounded-md flex items-center">
            <div
              class="bg-red-100 text-red-800 font-bold text-lg rounded-full h-10 w-10 flex items-center justify-center mr-3"
            >
              A
            </div>
            <div>
              <div class="font-medium">Level A</div>
              <div class="text-sm text-gray-500">
                {{ results.statistics.wcagACount }} issues
              </div>
            </div>
          </div>

          <div class="p-3 border rounded-md flex items-center">
            <div
              class="bg-orange-100 text-orange-800 font-bold text-lg rounded-full h-10 w-10 flex items-center justify-center mr-3"
            >
              AA
            </div>
            <div>
              <div class="font-medium">Level AA</div>
              <div class="text-sm text-gray-500">
                {{ results.statistics.wcagAACount }} issues
              </div>
            </div>
          </div>

          <div class="p-3 border rounded-md flex items-center">
            <div
              class="bg-yellow-100 text-yellow-800 font-bold text-lg rounded-full h-10 w-10 flex items-center justify-center mr-3"
            >
              AAA
            </div>
            <div>
              <div class="font-medium">Level AAA</div>
              <div class="text-sm text-gray-500">
                {{ results.statistics.wcagAAACount }} issues
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools Used -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Tools Used</h3>
        <div class="flex space-x-2">
          <span
            v-for="tool in activeTools"
            :key="tool"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {{ tool.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Filtering Controls -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="flex flex-wrap justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Filters</h3>

        <div class="flex flex-wrap gap-3 mt-2 sm:mt-0">
          <div>
            <label
              for="issue-type"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Issue Type</label
            >
            <select
              id="issue-type"
              v-model="filters.type"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Issues</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
              <option value="notice">Notices Only</option>
            </select>
          </div>

          <div>
            <label
              for="issue-source"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Source</label
            >
            <select
              id="issue-source"
              v-model="filters.source"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Sources</option>
              <option value="pa11y">Pa11y Only</option>
              <option value="wave">WAVE Only</option>
            </select>
          </div>

          <div>
            <label
              for="wcag-level"
              class="block text-sm font-medium text-gray-700 mb-1"
              >WCAG Level</label
            >
            <select
              id="wcag-level"
              v-model="filters.wcagLevel"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Levels</option>
              <option value="A">Level A</option>
              <option value="AA">Level AA</option>
              <option value="AAA">Level AAA</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-4">
        Issues ({{ filteredIssues.length }})
      </h3>

      <div v-if="filteredIssues.length === 0" class="text-center py-8">
        <p class="text-gray-500">No issues match the current filters.</p>
      </div>

      <div v-else>
        <div
          v-for="(issue, index) in filteredIssues"
          :key="`${issue.source}-${issue.code}-${index}`"
          class="border-b border-gray-200 last:border-b-0 py-4"
        >
          <div class="flex items-start">
            <!-- Issue type badge -->
            <div
              :class="{
                'bg-red-100 text-red-800': issue.type === 'error',
                'bg-yellow-100 text-yellow-800': issue.type === 'warning',
                'bg-blue-100 text-blue-800': issue.type === 'notice',
              }"
              class="px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 mt-1"
            >
              {{ issue.type }}
            </div>

            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="text-base font-medium">{{ issue.message }}</h4>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500 text-sm"
                    >{{ issue.occurrences }} occurrence(s)</span
                  >
                  <span
                    :class="{
                      'bg-gray-100 text-gray-800': issue.source === 'pa11y',
                      'bg-indigo-100 text-indigo-800': issue.source === 'wave',
                    }"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {{ issue.source }}
                  </span>
                </div>
              </div>

              <div class="mt-2">
                <p class="text-sm text-gray-600">
                  {{ issue.details || issue.message }}
                </p>

                <!-- WCAG guideline if available -->
                <div v-if="issue.wcagGuideline" class="mt-1">
                  <span
                    :class="{
                      'bg-red-100 text-red-800':
                        issue.wcagGuideline.includes('A') &&
                        !issue.wcagGuideline.includes('AA'),
                      'bg-orange-100 text-orange-800':
                        issue.wcagGuideline.includes('AA') &&
                        !issue.wcagGuideline.includes('AAA'),
                      'bg-yellow-100 text-yellow-800':
                        issue.wcagGuideline.includes('AAA'),
                    }"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {{ issue.wcagGuideline }}
                  </span>
                </div>

                <!-- Toggle for details -->
                <button
                  @click="toggleIssueDetails(issue)"
                  class="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  {{
                    expandedIssues.includes(issue)
                      ? "Hide Details"
                      : "Show Details"
                  }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 ml-1"
                    :class="{
                      'transform rotate-180': expandedIssues.includes(issue),
                    }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <!-- Details if expanded -->
                <div
                  v-if="expandedIssues.includes(issue)"
                  class="mt-2 pl-4 border-l-2 border-gray-200"
                >
                  <!-- Selectors if available -->
                  <div
                    v-if="issue.selectors && issue.selectors.length"
                    class="mt-2"
                  >
                    <div class="text-sm font-medium text-gray-700">
                      Affected Elements:
                    </div>
                    <ul class="mt-1 space-y-1">
                      <li
                        v-for="(selector, i) in issue.selectors"
                        :key="i"
                        class="text-sm bg-gray-50 rounded p-1 font-mono"
                      >
                        {{ selector }}
                      </li>
                    </ul>
                  </div>

                  <!-- Context if available -->
                  <div
                    v-if="issue.contexts && issue.contexts.length"
                    class="mt-2"
                  >
                    <div class="text-sm font-medium text-gray-700">
                      HTML Context:
                    </div>
                    <ul class="mt-1 space-y-1">
                      <li
                        v-for="(context, i) in issue.contexts"
                        :key="i"
                        class="text-sm bg-gray-50 rounded p-1 font-mono"
                      >
                        {{ context }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CombinedDashboard
      :seo-results="seoResults"
      :accessibility-results="accessibilityResults"
      :accessibility-summary="accessibilitySummary"
      :seo-summary="seoSummary"
      :analyzed-url="results.url"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { saveAs } from "file-saver";
import type { UnifiedScanResults, UnifiedResultItem } from "~/types";
import CombinedDashboard from "~/components/CombinedDashboard.vue";

const props = defineProps<{
  results: UnifiedScanResults;
  activeTools: string[];
  analyzedUrl: string;
}>();

// UI state
const expandedIssues = ref<UnifiedResultItem[]>([]);
const isExporting = ref(false);

// Filters
const filters = ref({
  type: "all",
  source: "all",
  wcagLevel: "all",
});

// Add computed properties for the dashboard data
const seoResults = computed(() => ({
  score: 85,
  scoreBreakdown: {
    meta: 90,
    content: 85,
    technical: 80,
    structure: 85
  },
  issues: []
}));

const accessibilityResults = computed(() => props.results.issues);
const accessibilitySummary = computed(() => ({
  errorCount: props.results.statistics.errors,
  warningCount: props.results.statistics.warnings,
  noticeCount: props.results.statistics.notices,
  contrastIssues: 0,
  focusIssues: 0,
  nonTextIssues: 0,
  labelIssues: 0,
  totalIssues: props.results.statistics.total
}));

const seoSummary = computed(() => ({
  performance: {
    firstContentfulPaint: 1200,
    loadTime: 1500,
    largestContentfulPaint: 1800
  }
}));

// Ensure results has a URL
onMounted(() => {
  if (!props.results.url && props.analyzedUrl) {
    props.results.url = props.analyzedUrl;
  }
});

// Watch for changes in the analyzed URL
watch(() => props.analyzedUrl, (newUrl) => {
  if (newUrl && !props.results.url) {
    props.results.url = newUrl;
  }
});

// Add debug logging
console.log('ResultsViewer - Results URL:', props.results.url);
console.log('ResultsViewer - Analyzed URL:', props.analyzedUrl);

// Toggle issue details expansion
function toggleIssueDetails(issue: UnifiedResultItem) {
  const index = expandedIssues.value.indexOf(issue);
  if (index === -1) {
    expandedIssues.value.push(issue);
  } else {
    expandedIssues.value.splice(index, 1);
  }
}

// Computed filtered issues
const filteredIssues = computed(() => {
  return props.results.issues.filter((issue) => {
    // Type filter
    if (filters.value.type !== "all" && issue.type !== filters.value.type) {
      return false;
    }

    // Source filter
    if (
      filters.value.source !== "all" &&
      issue.source !== filters.value.source
    ) {
      return false;
    }

    // WCAG Level filter
    if (filters.value.wcagLevel !== "all") {
      if (!issue.wcagGuideline) return false;

      if (
        filters.value.wcagLevel === "A" &&
        !issue.wcagGuideline.includes("A")
      ) {
        return false;
      } else if (
        filters.value.wcagLevel === "AA" &&
        !issue.wcagGuideline.includes("AA")
      ) {
        return false;
      } else if (
        filters.value.wcagLevel === "AAA" &&
        !issue.wcagGuideline.includes("AAA")
      ) {
        return false;
      }
    }

    return true;
  });
});

// Export results as CSV
function exportCSV() {
  isExporting.value = true;

  try {
    const headers = [
      "Issue Type",
      "Source",
      "Code",
      "Message",
      "Occurrences",
      "WCAG Guideline",
      "Impact",
      "Selectors",
    ];

    const rows = filteredIssues.value.map((issue) => [
      issue.type,
      issue.source,
      issue.code,
      issue.message,
      issue.occurrences,
      issue.wcagGuideline || "",
      issue.impact || "",
      issue.selectors ? issue.selectors.join(", ") : "",
    ]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    rows.forEach((row) => {
      const formattedRow = row.map((cell) => {
        // Escape commas and quotes
        const formatted = String(cell).replace(/"/g, '""');
        return `"${formatted}"`;
      });

      csvContent += formattedRow.join(",") + "\n";
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const filename = `accessibility-scan-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    saveAs(blob, filename);
  } catch (err) {
    console.error("Error exporting CSV:", err);
    alert("Failed to export CSV. Please try again.");
  } finally {
    isExporting.value = false;
  }
}

// Export results as PDF (placeholder)
function exportPDF() {
  alert("PDF export functionality will be implemented soon.");
}
</script>
