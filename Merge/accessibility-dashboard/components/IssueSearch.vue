<template>
  <div class="mb-6">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search issues..."
        class="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        @input="onSearch"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <div v-if="searchQuery" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ filteredCount }} of {{ totalCount }} issues match your search
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  totalCount: number;
  filteredCount: number;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const searchQuery = ref('');

const onSearch = () => {
  emit('search', searchQuery.value);
};

// Clear search when component is unmounted
onUnmounted(() => {
  searchQuery.value = '';
  emit('search', '');
});
</script> 