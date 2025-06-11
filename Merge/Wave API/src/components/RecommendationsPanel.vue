<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3
      class="text-lg font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center"
    >
      <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
      Recommendations
    </h3>

    <div v-if="!categories" class="text-gray-500">
      Scan a URL to generate recommendations.
    </div>

    <div v-else-if="keyboardFocusIssueCount > 0" class="space-y-4">
      <p class="text-sm text-gray-600">
        Found
        <span class="font-bold text-blue-700">{{
          keyboardFocusIssueCount
        }}</span>
        potential keyboard/focus-related issue(s). AI-powered recommendations
        and code examples will appear here soon to help you fix them.
      </p>
      <!-- Placeholder for actual recommendations -->
      <div
        class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 text-sm text-blue-800"
      >
        <p>
          <span class="font-semibold">Example Suggestion (Coming Soon):</span>
          Ensure all interactive elements have clear visual focus indicators
          that meet contrast requirements.
        </p>
      </div>
      <div
        class="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 text-sm text-gray-600"
      >
        <p>
          <span class="font-semibold">Another Suggestion (Coming Soon):</span>
          Verify logical focus order when navigating with the Tab key.
        </p>
      </div>
      <!-- Placeholder for Export button -->
      <button
        disabled
        class="mt-4 px-4 py-2 text-sm bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
      >
        Export Recommendations (Soon)
      </button>
    </div>
    <div v-else class="text-sm text-gray-600">
      No specific keyboard/focus issues flagged in this scan based on current
      criteria. General accessibility best practices still apply.
      <p class="mt-4 text-xs italic">AI analysis features coming soon.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import type { WaveApiResponse, WaveIssueItem } from "../types";
import { LightBulbIcon } from "@heroicons/vue/24/outline"; // Using outline icon

// Reuse the keyboard focus identification logic (or import from a shared util)
const KEYBOARD_FOCUS_IDS: Set<string> = new Set([
  "alt_link_missing",
  "label_missing",
  "button_empty",
  "link_empty",
  "link_skip_broken",
  "tabindex_positive",
  "accesskey",
  "event_handler",
]);

const isKeyboardFocusIssue = (issue: WaveIssueItem): boolean => {
  if (KEYBOARD_FOCUS_IDS.has(issue.id)) {
    return true;
  }
  const keywords = ["keyboard", "focus", "tab", "navigation", "interactive"];
  const descLower = issue.description.toLowerCase();
  return keywords.some((keyword) => descLower.includes(keyword));
};
// --------

interface FlattenedIssueForRecs extends WaveIssueItem {
  category: string;
}

const props = defineProps({
  // Accept the full categories object
  categories: {
    type: Object as PropType<WaveApiResponse["categories"] | null>,
    required: true,
  },
});

// Compute the count of keyboard/focus issues from the passed categories
const keyboardFocusIssueCount = computed(() => {
  if (!props.categories) return 0;
  let count = 0;
  const categoriesToProcess: Array<keyof WaveApiResponse["categories"]> = [
    "error",
    "contrast",
    "alert",
  ]; // Focus on actionable categories first

  categoriesToProcess.forEach((catKey) => {
    const category = props.categories![catKey];
    if (category && category.items) {
      Object.values(category.items).forEach((item) => {
        if (isKeyboardFocusIssue(item)) {
          count += item.count; // Use item count for total instances
        }
      });
    }
  });
  return count;
});
</script>

<style scoped>
/* Scoped styles for RecommendationsPanel */
</style>
