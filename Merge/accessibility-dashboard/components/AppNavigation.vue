<template>
  <div>
    <!-- Mobile menu button -->
    <button
      @click="isOpen = !isOpen"
      class="lg:hidden fixed z-50 bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-expanded="isOpen"
      aria-controls="mobile-menu"
      aria-label="Open navigation menu"
    >
      <svg
        v-if="!isOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
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

    <!-- Sidebar for desktop -->
    <div
      class="hidden lg:block w-64 bg-white border-r border-gray-200 h-full overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-4">
        <div class="flex items-center space-x-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span class="text-xl font-semibold text-gray-800 dark:text-white"
            >A11y Dashboard</span
          >
        </div>
        <nav aria-label="Main Navigation">
          <ul class="space-y-2">
            <li>
              <button
                @click="navigateTo('dashboard')"
                class="w-full flex items-center space-x-2 p-2 rounded-md"
                :class="
                  activePage === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                "
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
                    d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
                  />
                </svg>
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('saved-reports')"
                class="w-full flex items-center space-x-2 p-2 rounded-md"
                :class="
                  activePage === 'saved-reports'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                "
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>Saved Reports</span>
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('settings')"
                class="w-full flex items-center space-x-2 p-2 rounded-md"
                :class="
                  activePage === 'settings'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                "
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Settings</span>
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('help')"
                class="w-full flex items-center space-x-2 p-2 rounded-md"
                :class="
                  activePage === 'help'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                "
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Help</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Recent scans section -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Recent Scans
        </h3>
        <ul v-if="recentScans.length > 0" class="space-y-2 text-sm">
          <li v-for="(scan, index) in recentScans" :key="index">
            <button
              @click="scanUrl(scan)"
              class="text-left w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
            >
              {{ formatUrl(scan) }}
            </button>
          </li>
        </ul>
        <p v-else class="text-xs text-gray-500 dark:text-gray-400 italic">
          No recent scans yet
        </p>
      </div>
    </div>

    <!-- Mobile navigation overlay -->
    <div
      v-if="isOpen"
      class="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
      @click="isOpen = false"
      aria-hidden="true"
    ></div>

    <!-- Mobile navigation menu -->
    <div
      v-if="isOpen"
      id="mobile-menu"
      class="lg:hidden fixed inset-y-0 left-0 w-full max-w-xs z-40 bg-white dark:bg-gray-800 shadow-xl transform transition ease-in-out duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-full flex flex-col">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span class="text-xl font-semibold text-gray-800 dark:text-white"
                >A11y Dashboard</span
              >
            </div>
            <button
              @click="isOpen = false"
              class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
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

        <div class="flex-1 overflow-y-auto">
          <nav class="p-4" aria-label="Mobile Navigation">
            <ul class="space-y-2">
              <li>
                <button
                  @click="navigateTo('dashboard')"
                  class="w-full flex items-center space-x-2 p-2 rounded-md"
                  :class="
                    activePage === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  "
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
                      d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
                    />
                  </svg>
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  @click="navigateTo('saved-reports')"
                  class="w-full flex items-center space-x-2 p-2 rounded-md"
                  :class="
                    activePage === 'saved-reports'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  "
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>Saved Reports</span>
                </button>
              </li>
              <li>
                <button
                  @click="navigateTo('settings')"
                  class="w-full flex items-center space-x-2 p-2 rounded-md"
                  :class="
                    activePage === 'settings'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  "
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Settings</span>
                </button>
              </li>
              <li>
                <button
                  @click="navigateTo('help')"
                  class="w-full flex items-center space-x-2 p-2 rounded-md"
                  :class="
                    activePage === 'help'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  "
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
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Help</span>
                </button>
              </li>
            </ul>
          </nav>

          <div class="border-t border-gray-200 dark:border-gray-700 p-4">
            <h3
              class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3"
            >
              Recent Scans
            </h3>
            <ul v-if="recentScans.length > 0" class="space-y-2 text-sm">
              <li v-for="(scan, index) in recentScans" :key="index">
                <button
                  @click="scanUrl(scan)"
                  class="text-left w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                >
                  {{ formatUrl(scan) }}
                </button>
              </li>
            </ul>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 italic">
              No recent scans yet
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  recentScans: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["scan", "navigate"]);

const isOpen = ref(false);
const activePage = ref("dashboard");

// Helper function to format URL for display (removes protocol, trailing slashes, etc.)
function formatUrl(url) {
  try {
    // Remove protocol
    let formatted = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    // Remove trailing slash
    formatted = formatted.replace(/\/$/, "");
    // Limit length
    if (formatted.length > 30) {
      formatted = formatted.substring(0, 30) + "...";
    }
    return formatted;
  } catch (e) {
    return url;
  }
}

// Function to emit scan event with the selected URL
function scanUrl(url) {
  emit("scan", url);
  isOpen.value = false; // Close mobile menu if open
}

// Function to handle navigation
function navigateTo(page) {
  activePage.value = page;
  emit("navigate", page);
  isOpen.value = false; // Close mobile menu
}
</script>
