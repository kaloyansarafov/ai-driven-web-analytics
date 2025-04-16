<template>
  <header class="bg-white shadow-md p-4">
    <div class="container mx-auto flex items-center space-x-4">
      <h1 class="text-xl font-semibold text-gray-700">Accessibility Scanner</h1>
      <div class="flex-grow flex space-x-2">
        <input
          type="url"
          v-model="store.targetUrl"
          placeholder="Enter website URL (e.g., https://example.com)"
          class="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          @keyup.enter="startScan"
        />
        <button
          @click="startScan"
          :disabled="store.isLoading || !isValidUrl"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="store.isLoading">Scanning...</span>
          <span v-else>Scan</span>
        </button>
      </div>
    </div>
    <div class="container mx-auto mt-2">
      <input
        type="text"
        v-model="apiKey"
        placeholder="Enter WAVE API Key"
        class="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
      />
      <p class="text-xs text-gray-500 mt-1">
        Get a key from
        <a
          href="https://wave.webaim.org/api/"
          target="_blank"
          class="text-blue-600 hover:underline"
          >WAVE API</a
        >. For development, you might use a test key or mock data.
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useScanStore } from "../stores/scanStore";

const store = useScanStore();

const apiKey = ref("");

const isValidUrl = computed(() => {
  try {
    new URL(store.targetUrl);
    return true;
  } catch (_) {
    return false;
  }
});

const startScan = () => {
  if (isValidUrl.value && !store.isLoading && apiKey.value) {
    console.log("Requesting scan via store for:", store.targetUrl);
    store.fetchScanResult(apiKey.value);
  } else if (!apiKey.value) {
    alert("Please enter your WAVE API Key.");
  }
};
</script>

<style scoped>
/* Scoped styles for TheHeaderBar */
</style>
