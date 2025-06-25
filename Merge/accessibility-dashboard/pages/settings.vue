<template>
  <div class="max-w-2xl mx-auto p-8" data-page="settings">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>
    <form @submit.prevent="save">
      <label class="block mb-2 font-medium">WAVE API Key</label>
      <input
        v-model="waveApiKey"
        type="text"
        class="w-full border rounded p-2 mb-4"
        placeholder="Enter your WAVE API key"
      />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
    <div v-if="saved" class="text-green-600 mt-2">Settings saved!</div>
    
    <!-- Current API Key Display -->
    <div v-if="waveApiKey" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm text-green-800 dark:text-green-200">
          WAVE API Key is configured and ready to use.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const waveApiKey = ref('')
const saved = ref(false)

onMounted(() => {
  // Load the API key from localStorage
  waveApiKey.value = localStorage.getItem('waveApiKey') || ''
})

function save() {
  // Save to localStorage
  localStorage.setItem('waveApiKey', waveApiKey.value)
  
  // Also update the main app's settings if we can access it
  if (typeof window !== 'undefined') {
    // Dispatch a custom event to notify the main app
    window.dispatchEvent(new CustomEvent('waveApiKeyUpdated', {
      detail: { apiKey: waveApiKey.value }
    }))
  }
  
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script> 