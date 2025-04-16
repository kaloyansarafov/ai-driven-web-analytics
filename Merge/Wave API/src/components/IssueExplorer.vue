<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
      Issue Explorer
    </h3>

    <!-- Filters -->
    <div class="mb-4 flex space-x-4 items-center">
      <span class="font-medium text-sm text-gray-700">Filter by Category:</span>
      <label class="flex items-center space-x-1 text-sm">
        <input
          type="checkbox"
          v-model="filters.error"
          class="rounded text-red-600 focus:ring-red-500"
        />
        <span>Errors ({{ categoryCounts.error }})</span>
      </label>
      <label class="flex items-center space-x-1 text-sm">
        <input
          type="checkbox"
          v-model="filters.contrast"
          class="rounded text-orange-600 focus:ring-orange-500"
        />
        <span>Contrast ({{ categoryCounts.contrast }})</span>
      </label>
      <label class="flex items-center space-x-1 text-sm">
        <input
          type="checkbox"
          v-model="filters.alert"
          class="rounded text-yellow-600 focus:ring-yellow-500"
        />
        <span>Alerts ({{ categoryCounts.alert }})</span>
      </label>
      <!-- Add more filters later if needed (e.g., keyboard-specific) -->
    </div>

    <!-- Issue List -->
    <div
      v-if="filteredIssues.length > 0"
      class="space-y-3 max-h-[600px] overflow-y-auto pr-2"
    >
      <Disclosure
        v-for="(issue, index) in filteredIssues"
        :key="`${issue.id}-${index}`"
        v-slot="{ open }"
      >
        <DisclosureButton
          class="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
          :class="getCategoryColor(issue.category)"
        >
          <span class="truncate mr-2">
            <span :class="`font-bold ${getCategoryTextColor(issue.category)}`"
              >[{{ issue.category.toUpperCase() }}]</span
            >
            {{ issue.description }} ({{ issue.count }})
            <span
              v-if="isKeyboardFocusIssue(issue)"
              title="Potential Keyboard/Focus Issue"
              class="ml-1 text-blue-700 font-bold"
              >⌨️</span
            >
          </span>
          <ChevronUpIcon
            :class="open ? 'rotate-180 transform' : ''"
            class="w-5 h-5 text-gray-500"
          />
        </DisclosureButton>
        <DisclosurePanel
          class="px-4 pt-2 pb-3 text-sm text-gray-700 bg-gray-50 rounded-b-lg border border-t-0 border-gray-200"
        >
          <p class="mb-2 italic">
            {{ issue.rawDescription || issue.description }}
          </p>
          <div v-if="issue.selectors && issue.selectors.length">
            <h5 class="font-semibold text-xs mb-1 text-gray-600">
              Selectors ({{ issue.selectors.length }}):
            </h5>
            <ul
              class="list-disc list-inside space-y-1 max-h-20 overflow-y-auto bg-gray-100 p-2 rounded font-mono text-xs"
            >
              <li
                v-for="(selector, sIndex) in issue.selectors"
                :key="sIndex"
                class="truncate"
                :title="selector"
              >
                {{ selector }}
              </li>
            </ul>
          </div>
          <div v-if="issue.xpaths && issue.xpaths.length" class="mt-2">
            <h5 class="font-semibold text-xs mb-1 text-gray-600">
              Xpaths ({{ issue.xpaths.length }}):
            </h5>
            <ul
              class="list-disc list-inside space-y-1 max-h-20 overflow-y-auto bg-gray-100 p-2 rounded font-mono text-xs"
            >
              <li
                v-for="(xpath, xIndex) in issue.xpaths"
                :key="xIndex"
                class="truncate"
                :title="xpath"
              >
                {{ xpath }}
              </li>
            </ul>
          </div>
          <!-- TODO: Add contrast data if applicable -->
          <!-- TODO: Add code snippets / screenshot previews later -->
        </DisclosurePanel>
      </Disclosure>
    </div>
    <div v-else class="text-center py-6 text-gray-500">
      No issues found matching the current filters.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { PropType } from "vue";
import type { WaveApiResponse, WaveCategory, WaveIssueItem } from "../types";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/20/solid";

// Define the structure for the flattened issue list
interface FlattenedIssue extends WaveIssueItem {
  category: "error" | "contrast" | "alert" | "feature" | "structure" | "aria";
  rawDescription: string; // Keep original description if modified for display
}

const props = defineProps({
  // Pass only the categories object
  categories: {
    type: Object as PropType<WaveApiResponse["categories"] | null>,
    required: true,
  },
});

const filters = ref({
  error: true,
  contrast: true,
  alert: true,
  // feature: false, // Example: Defaulting some filters off
  // structure: false,
  // aria: false,
});

// Helper to get category counts for filter labels
const categoryCounts = computed(() => {
  const counts = {
    error: 0,
    contrast: 0,
    alert: 0,
    feature: 0,
    structure: 0,
    aria: 0,
  };
  if (!props.categories) return counts;
  for (const key in counts) {
    if (props.categories[key]) {
      counts[key as keyof typeof counts] =
        props.categories[key as keyof typeof counts]?.count ?? 0;
    }
  }
  return counts;
});

// Flatten issues from categories into a single list with category info
const allIssues = computed<FlattenedIssue[]>(() => {
  if (!props.categories) return [];
  const issues: FlattenedIssue[] = [];

  // Process categories that might contain focus/keyboard issues first (or all based on filters)
  const categoriesToProcess: Array<keyof WaveApiResponse["categories"]> = [
    "error",
    "contrast",
    "alert",
    "feature",
    "structure",
    "aria",
  ];

  categoriesToProcess.forEach((catKey) => {
    const category = props.categories![catKey];
    if (category && category.items) {
      Object.values(category.items).forEach((item) => {
        issues.push({
          ...item,
          category: catKey as any, // Cast needed here
          rawDescription: item.description, // Store original
        });
      });
    }
  });

  // Optional: Sort issues (e.g., by category severity)
  issues.sort((a, b) => {
    const severity = {
      error: 0,
      contrast: 1,
      alert: 2,
      feature: 3,
      structure: 4,
      aria: 5,
    };
    return severity[a.category] - severity[b.category];
  });

  return issues;
});

// Apply filters to the flattened list
const filteredIssues = computed(() => {
  return allIssues.value.filter((issue) => filters.value[issue.category]);
});

// Basic check for potential keyboard/focus issues (expand later)
// Based on WAVE documentation and common issues
const KEYBOARD_FOCUS_IDS: Set<string> = new Set([
  "alt_link_missing", // Links missing text can be hard to navigate
  "label_missing", // Form elements without labels
  "button_empty", // Buttons without text
  "link_empty", // Links without text
  "link_skip_broken", // Skip link issues
  "tabindex_positive", // Positive tabindex can break focus order
  "accesskey", // Accesskey attribute can conflict
  "event_handler", // Generic event handlers might lack keyboard equivalent
  // Add more specific WAVE IDs related to focus indication, keyboard traps etc. when identified
  // Might need to check descriptions for keywords too
]);

const isKeyboardFocusIssue = (issue: FlattenedIssue): boolean => {
  if (KEYBOARD_FOCUS_IDS.has(issue.id)) {
    return true;
  }
  // Crude keyword check in description (can be inaccurate)
  const keywords = ["keyboard", "focus", "tab", "navigation", "interactive"];
  const descLower = issue.description.toLowerCase();
  return keywords.some((keyword) => descLower.includes(keyword));
};

// --- Styling Helpers ---
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "error":
      return "bg-red-100 hover:bg-red-200";
    case "contrast":
      return "bg-orange-100 hover:bg-orange-200";
    case "alert":
      return "bg-yellow-100 hover:bg-yellow-200";
    case "feature":
      return "bg-green-100 hover:bg-green-200";
    case "structure":
      return "bg-blue-100 hover:bg-blue-200";
    case "aria":
      return "bg-purple-100 hover:bg-purple-200";
    default:
      return "bg-gray-100 hover:bg-gray-200";
  }
};
const getCategoryTextColor = (category: string): string => {
  switch (category) {
    case "error":
      return "text-red-700";
    case "contrast":
      return "text-orange-700";
    case "alert":
      return "text-yellow-700";
    case "feature":
      return "text-green-700";
    case "structure":
      return "text-blue-700";
    case "aria":
      return "text-purple-700";
    default:
      return "text-gray-700";
  }
};
</script>

<style scoped>
/* Add custom scrollbar styling for the issue list */
.max-h-\[600px\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[600px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
