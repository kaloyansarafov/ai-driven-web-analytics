<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Run Accessibility Scan</h2>

    <form @submit.prevent="submitScan">
      <div class="mb-4">
        <label for="url" class="block text-sm font-medium text-gray-700 mb-1"
          >URL to Scan</label
        >
        <div class="flex">
          <input
            id="url"
            v-model="url"
            type="text"
            required
            placeholder="https://example.com"
            class="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="button"
            @click="showBookmarks = !showBookmarks"
            class="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        <!-- Bookmark dropdown -->
        <div
          v-if="showBookmarks && bookmarks.length > 0"
          class="mt-2 bg-white border border-gray-300 rounded-md shadow-sm"
        >
          <ul class="max-h-60 overflow-y-auto">
            <li
              v-for="bookmark in bookmarks"
              :key="bookmark.id"
              @click="selectBookmark(bookmark)"
              class="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex justify-between items-center"
            >
              <div>
                <div class="font-medium">
                  {{ bookmark.title || bookmark.url }}
                </div>
                <div class="text-sm text-gray-500">{{ bookmark.url }}</div>
              </div>
              <div class="text-xs text-gray-400" v-if="bookmark.lastScanned">
                Last scanned: {{ formatDate(bookmark.lastScanned) }}
              </div>
            </li>
          </ul>
        </div>
        <div
          v-else-if="showBookmarks"
          class="mt-2 p-2 text-sm text-gray-500 border border-gray-300 rounded-md"
        >
          No bookmarks yet. Add URLs to bookmarks for quick access.
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            for="wave-api-key"
            class="block text-sm font-medium text-gray-700 mb-1"
            >WAVE API Key</label
          >
          <input
            id="wave-api-key"
            v-model="waveApiKey"
            type="password"
            placeholder="Enter your WAVE API key"
            :required="selectedTools.includes('wave')"
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Tools to Use</label
          >
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="selectedTools"
                value="wave"
                class="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2">WAVE</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="selectedTools"
                value="pa11y"
                class="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2">Pa11y</span>
            </label>
          </div>
          <div
            v-if="selectedTools.length === 0"
            class="mt-1 text-sm text-red-500"
          >
            Please select at least one tool
          </div>
        </div>
      </div>

      <!-- Advanced Options -->
      <div class="mt-4 mb-6 border-t border-b border-gray-200 py-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-semibold text-gray-700">Advanced Options</h3>
          <button
            type="button"
            @click="showAdvancedOptions = !showAdvancedOptions"
            class="text-sm text-blue-600 flex items-center"
          >
            {{ showAdvancedOptions ? "Hide" : "Show" }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div v-if="showAdvancedOptions" class="space-y-4">
          <div class="flex items-center">
            <input
              id="enable-crawling"
              type="checkbox"
              v-model="enableCrawling"
              class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label for="enable-crawling" class="ml-2 text-sm text-gray-700">
              Enable multi-page crawling
            </label>
          </div>

          <div v-if="enableCrawling" class="ml-6 space-y-3">
            <div>
              <label for="max-pages" class="block text-sm text-gray-700 mb-1">
                Maximum pages to scan
              </label>
              <div class="flex items-center">
                <input
                  id="max-pages"
                  type="number"
                  v-model="maxPages"
                  min="1"
                  max="20"
                  class="w-24 rounded-md border border-gray-300 px-3 py-1 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                />
                <span class="ml-2 text-sm text-gray-500"> (1-20 pages) </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Higher page count will increase scan time significantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <div>
          <button
            type="button"
            @click="saveBookmark"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Bookmark URL
          </button>
        </div>

        <button
          type="submit"
          :disabled="selectedTools.length === 0 || !url"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Run Scan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useHistoryStore } from "~/stores/historyStore";
import type { UrlBookmark } from "~/types";

// State
const url = ref("");
const waveApiKey = ref("");
const selectedTools = ref<string[]>(["wave", "pa11y"]);
const showBookmarks = ref(false);
const showAdvancedOptions = ref(false);
const enableCrawling = ref(false);
const maxPages = ref(5);

// Store
const historyStore = useHistoryStore();
const bookmarks = computed(() => historyStore.bookmarks);

// Emit events
const emit = defineEmits<{
  (
    e: "runScan",
    data: {
      url: string;
      waveApiKey: string;
      tools: string[];
      crawl?: boolean;
      maxPages?: number;
    }
  ): void;
}>();

function submitScan() {
  if (selectedTools.value.length === 0 || !url.value) return;

  // Add protocol if missing
  let formattedUrl = url.value.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  emit("runScan", {
    url: formattedUrl,
    waveApiKey: waveApiKey.value,
    tools: selectedTools.value,
    ...(enableCrawling.value && {
      crawl: true,
      maxPages: maxPages.value,
    }),
  });

  // Close the bookmark dropdown
  showBookmarks.value = false;
}

function saveBookmark() {
  if (!url.value) return;

  historyStore.addBookmark(url.value);
}

function selectBookmark(bookmark: UrlBookmark) {
  url.value = bookmark.url;
  showBookmarks.value = false;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (e) {
    return dateString;
  }
}
</script>
