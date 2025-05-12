<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar navigation - hidden on mobile -->
      <AppNavigation
        class="hidden lg:block flex-shrink-0"
        :recentScans="recentScans"
        @scan="handleRecentScan"
        @navigate="handleNavigation"
      />

      <div class="flex flex-col flex-1 w-0 overflow-hidden">
        <header class="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div class="flex justify-between items-center px-4 py-3">
            <div class="flex items-center lg:hidden">
              <!-- Mobile logo and menu button -->
              <button
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
                aria-label="Open menu"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 class="text-xl font-semibold text-blue-600 ml-2">
                SEO & A11y Dashboard
              </h1>
            </div>

            <div class="hidden lg:block">
              <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
                Accessibility Dashboard
              </h1>
            </div>

            <div class="flex items-center space-x-3">
              <ThemeToggle />
              <a
                href="#"
                class="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"
                ></span>
              </a>
              <button
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="User menu"
              >
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </button>
            </div>
          </div>
        </header>

        <!-- Mobile menu (hidden by default) -->
        <div v-if="isMobileMenuOpen" class="lg:hidden">
          <AppNavigation
            :recentScans="recentScans"
            @scan="handleRecentScan"
            @navigate="handleNavigation"
          />
        </div>

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <!-- Dashboard View -->
          <div v-if="currentView === 'dashboard'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold mb-2">Run Accessibility Scan</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Enter a URL to check for accessibility issues using multiple
                tools.
              </p>
            </div>

            <!-- Scan Form Card -->
            <div
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
            >
              <form @submit.prevent="runScan" class="space-y-4">
                <div>
                  <label
                    for="url"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    URL to Scan
                  </label>
                  <div class="relative rounded-md shadow-sm">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <input
                      id="url"
                      v-model="url"
                      type="url"
                      required
                      placeholder="https://example.com"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Make sure to include the full URL including https://
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="wave-api-key"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      WAVE API Key
                    </label>
                    <div class="relative rounded-md shadow-sm">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                      </div>
                      <input
                        id="wave-api-key"
                        v-model="waveApiKey"
                        type="password"
                        placeholder="Enter your WAVE API key"
                        class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Tools to Use
                    </label>
                    <div class="flex flex-wrap gap-4">
                      <label class="inline-flex items-center">
                        <input
                          type="checkbox"
                          v-model="selectedTools"
                          value="wave"
                          class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                        />
                        <span class="ml-2 text-gray-700 dark:text-gray-300"
                          >WAVE</span
                        >
                      </label>
                      <label class="inline-flex items-center">
                        <input
                          type="checkbox"
                          v-model="selectedTools"
                          value="pa11y"
                          class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                        />
                        <span class="ml-2 text-gray-700 dark:text-gray-300"
                          >Pa11y</span
                        >
                      </label>
                      <label class="inline-flex items-center">
                        <input
                          type="checkbox"
                          v-model="selectedTools"
                          value="lighthouse"
                          class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                        />
                        <span class="ml-2 text-gray-700 dark:text-gray-300"
                          >Lighthouse</span
                        >
                      </label>
                      <label class="inline-flex items-center">
                        <input
                          type="checkbox"
                          v-model="selectedTools"
                          value="ibm-a11y"
                          class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                        />
                        <span class="ml-2 text-gray-700 dark:text-gray-300"
                          >IBM A11y</span
                        >
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Advanced Options Section -->
                <div
                  class="mt-4 border-t border-b border-gray-200 dark:border-gray-700 py-4"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h3
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Advanced Options
                    </h3>
                    <button
                      type="button"
                      @click="advancedOptionsOpen = !advancedOptionsOpen"
                      class="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                    >
                      {{ advancedOptionsOpen ? "Hide" : "Show" }}
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

                  <div v-if="advancedOptionsOpen" class="space-y-4">
                    <div class="flex items-center">
                      <input
                        id="enable-crawling"
                        type="checkbox"
                        v-model="enableCrawling"
                        class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <label
                        for="enable-crawling"
                        class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Enable multi-page crawling
                      </label>
                    </div>

                    <div v-if="enableCrawling" class="ml-6 space-y-3">
                      <div>
                        <label
                          for="max-pages"
                          class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Maximum pages to scan
                        </label>
                        <div class="flex items-center">
                          <input
                            id="max-pages"
                            type="number"
                            v-model="maxPages"
                            min="1"
                            max="20"
                            class="w-24 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm px-3 py-1 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <span
                            class="ml-2 text-sm text-gray-500 dark:text-gray-400"
                          >
                            (1-20 pages)
                          </span>
                        </div>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        >
                          Higher page count will increase scan time
                          significantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="visualReport"
                      class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Show visual WAVE report (when available)
                    </span>
                  </label>
                  <button
                    type="button"
                    class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Learn more about visual report"
                  >
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="isLoading"
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    {{ isLoading ? "Scanning..." : "Run Scan" }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Loading state -->
            <div
              v-if="isLoading"
              class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
            >
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Scanning {{ url }}...
              </p>
              <div class="flex justify-center">
                <div
                  class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                ></div>
              </div>
            </div>

            <!-- Error message -->
            <div
              v-else-if="error"
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
                  <h3 class="text-sm leading-5 font-medium">Scan failed</h3>
                  <div class="mt-1 text-sm leading-5">{{ error }}</div>
                </div>
              </div>
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
              <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
              >
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-white mb-6"
                >
                  Results Summary
                </h3>

                <!-- Visual Summary Chart -->
                <SummaryChart
                  :errors="errorCount"
                  :warnings="warningCount"
                  :notices="noticeCount"
                />

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <!-- Added mt-6 for spacing -->
                  <div
                    class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div
                      class="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300"
                    >
                      Total Issues
                    </div>
                    <div
                      class="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                      {{ filteredResults.length }}
                    </div>
                  </div>

                  <div
                    class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/40"
                  >
                    <div
                      class="text-lg font-semibold mb-1 text-red-700 dark:text-red-400"
                    >
                      Errors
                    </div>
                    <div class="flex items-center">
                      <div
                        class="text-3xl font-bold text-red-700 dark:text-red-400"
                      >
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

                  <div
                    class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/40"
                  >
                    <div
                      class="text-lg font-semibold mb-1 text-yellow-700 dark:text-yellow-500"
                    >
                      Warnings
                    </div>
                    <div class="flex items-center">
                      <div
                        class="text-3xl font-bold text-yellow-700 dark:text-yellow-500"
                      >
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

                  <div
                    class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800/40"
                  >
                    <div
                      class="text-lg font-semibold mb-1 text-blue-700 dark:text-blue-400"
                    >
                      Notices
                    </div>
                    <div class="flex items-center">
                      <div
                        class="text-3xl font-bold text-blue-700 dark:text-blue-400"
                      >
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
              <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
              >
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3
                      class="text-xl font-semibold text-gray-800 dark:text-white"
                    >
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
                  v-for="code in sortedGroupCodes"
                  :key="code"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <!-- Group Header -->
                  <button
                    @click="toggleGroup(code)"
                    class="w-full px-6 py-4 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div class="flex justify-between items-center">
                      <h3
                        class="text-lg font-semibold text-gray-800 dark:text-white"
                      >
                        Issue Code:
                        <code
                          class="text-sm bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded"
                          >{{ code }}</code
                        >
                        <span
                          class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400"
                          >({{ groupedIssues[code].length }} occurrence{{
                            groupedIssues[code].length === 1 ? "" : "s"
                          }})</span
                        >
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

                  <!-- Issues within the group (conditionally rendered) -->
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
                        <div class="flex items-start">
                          <!-- Issue Type Badge -->
                          <div
                            :class="{
                              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400':
                                issue.type === 'error',
                              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500':
                                issue.type === 'warning',
                              'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400':
                                issue.type === 'notice',
                            }"
                            class="px-2.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide mr-4 mt-1 flex-shrink-0"
                          >
                            {{ issue.type }}
                          </div>
                          <div class="flex-1">
                            <div
                              class="flex flex-col md:flex-row md:justify-between md:items-start"
                            >
                              <h4
                                class="text-base font-medium text-gray-900 dark:text-white mb-1 md:mb-0"
                              >
                                {{ issue.message }}
                              </h4>
                              <span
                                :class="{
                                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300':
                                    issue.source === 'pa11y',
                                  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400':
                                    issue.source === 'wave',
                                }"
                                class="px-2 py-0.5 rounded text-xs font-medium md:ml-2 mt-1 md:mt-0 inline-block"
                              >
                                {{ issue.source }}
                              </span>
                            </div>
                            <!-- Issue Code (already shown in header, maybe remove here?) -->
                            <!-- <p v-if="issue.code" class="text-sm text-gray-600 dark:text-gray-400 mt-2"> ... </p> -->

                            <!-- Collapsible Details Button -->
                            <div class="mt-3">
                              <!-- Need unique key/index for toggleDetails. Using global index for now -->
                              <button
                                @click="toggleDetails(results.indexOf(issue))"
                                class="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                              >
                                <span
                                  >{{
                                    expandedDetails.includes(
                                      results.indexOf(issue)
                                    )
                                      ? "Hide"
                                      : "Show"
                                  }}
                                  details</span
                                >
                                <svg
                                  :class="{
                                    'transform rotate-180':
                                      expandedDetails.includes(
                                        results.indexOf(issue)
                                      ),
                                  }"
                                  class="ml-1 h-4 w-4 transition-transform"
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
                              </button>
                            </div>

                            <!-- Details Content (conditionally shown) -->
                            <div
                              v-if="
                                expandedDetails.includes(results.indexOf(issue))
                              "
                              class="mt-3 space-y-3 text-sm"
                            >
                              <!-- HTML Context -->
                              <div v-if="issue.context" class="overflow-hidden">
                                <div
                                  class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                                >
                                  HTML Context:
                                </div>
                                <pre
                                  class="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto font-mono text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-words max-h-48"
                                  >{{ issue.context }}</pre
                                >
                              </div>
                              <!-- Selector -->
                              <div
                                v-if="issue.selector"
                                class="overflow-hidden"
                              >
                                <div
                                  class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                                >
                                  Selector:
                                </div>
                                <code
                                  class="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 block overflow-x-auto font-mono text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-words max-h-24"
                                  >{{ issue.selector }}</code
                                >
                              </div>
                              <!-- Guidelines & Documentation (sample - would be dynamic in production) -->
                              <div
                                class="pt-2 border-t border-gray-200 dark:border-gray-700"
                              >
                                <div
                                  class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
                                >
                                  Related Guidelines:
                                </div>
                                <div class="flex flex-wrap gap-2">
                                  <a
                                    href="https://www.w3.org/WAI/WCAG21/quickref/"
                                    target="_blank"
                                    rel="noopener"
                                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                  >
                                    <span v-if="issue.type === 'error'"
                                      >WCAG 2.1 A</span
                                    >
                                    <span v-else-if="issue.type === 'warning'"
                                      >WCAG 2.1 AA</span
                                    >
                                    <span v-else>Best Practice</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-3 w-3 ml-1"
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
                              </div>
                              <!-- Suggested Fix -->
                              <div
                                v-if="issue.detail"
                                class="pt-2 border-t border-gray-200 dark:border-gray-700"
                              >
                                <div
                                  class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                                >
                                  Suggested Fix:
                                </div>
                                <div class="text-gray-700 dark:text-gray-300">
                                  <template v-for="(part, index) in formatDetailWithLinks(issue.detail)" :key="index">
                                    <a
                                      v-if="part.isLink"
                                      :href="part.text"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      {{ shortenUrl(part.text) }}
                                    </a>
                                    <span v-else>{{ part.text }}</span>
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Saved Reports View -->
          <div v-else-if="currentView === 'saved-reports'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold mb-2">Saved Reports</h2>
              <p class="text-gray-600 dark:text-gray-300">
                View and manage your saved accessibility reports.
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3
                class="text-xl font-semibold text-gray-800 dark:text-white mb-4"
              >
                Stored Scan Results
              </h3>

              <div v-if="savedReports.length > 0">
                <div class="overflow-x-auto">
                  <table
                    class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          URL
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Tools
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Issues
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <tr
                        v-for="(report, index) in savedReports"
                        :key="report.id"
                        class="hover:bg-gray-50 dark:hover:bg-gray-750"
                      >
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                        >
                          {{ formatDate(report.date) }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          <a
                            :href="report.url"
                            target="_blank"
                            class="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {{ formatUrl(report.url) }}
                          </a>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-center"
                        >
                          <div class="flex justify-center space-x-1">
                            <span
                              v-for="tool in report.tools"
                              :key="tool"
                              class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {{ tool }}
                            </span>
                          </div>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-center"
                        >
                          <div class="flex justify-center space-x-2">
                            <span
                              class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                            >
                              {{ report.errors }}
                            </span>
                            <span
                              class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500"
                            >
                              {{ report.warnings }}
                            </span>
                            <span
                              class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                            >
                              {{ report.notices }}
                            </span>
                          </div>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-right text-sm"
                        >
                          <button
                            @click="loadReport(report)"
                            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                          >
                            View
                          </button>
                          <button
                            @click="deleteReport(report.id)"
                            class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                v-else
                class="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                <p>No saved reports available.</p>
                <p class="mt-2 text-sm">
                  Run scans and save them to view them here.
                </p>
              </div>
            </div>
          </div>

          <!-- Settings View -->
          <div v-else-if="currentView === 'settings'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold mb-2">Settings</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Configure your accessibility testing preferences.
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3
                class="text-xl font-semibold text-gray-800 dark:text-white mb-4"
              >
                Testing Configuration
              </h3>

              <div class="space-y-6">
                <div>
                  <h4
                    class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    API Keys
                  </h4>
                  <div class="space-y-4">
                    <div>
                      <label
                        for="settings-wave-key"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        WAVE API Key
                      </label>
                      <input
                        id="settings-wave-key"
                        v-model="waveApiKey"
                        type="password"
                        class="w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Get your WAVE API key from
                        <a
                          href="https://wave.webaim.org/api/"
                          target="_blank"
                          class="text-blue-600 dark:text-blue-400 hover:underline"
                          >wave.webaim.org/api</a
                        >
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4
                    class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Default Testing Tools
                  </h4>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="defaultTools"
                        value="wave"
                        class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300"
                        >WAVE</span
                      >
                    </label>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="defaultTools"
                        value="pa11y"
                        class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300"
                        >Pa11y</span
                      >
                    </label>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="defaultTools"
                        value="lighthouse"
                        class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300"
                        >Lighthouse</span
                      >
                    </label>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="defaultTools"
                        value="ibm-a11y"
                        class="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300"
                        >IBM A11y</span
                      >
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    @click="saveSettings"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Help View -->
          <div v-else-if="currentView === 'help'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold mb-2">Help & Documentation</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Learn how to use the Accessibility Dashboard effectively.
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div class="space-y-6">
                <div>
                  <h3
                    class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
                  >
                    Getting Started
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300">
                    This dashboard helps you identify and fix accessibility
                    issues on your websites by using industry-standard tools.
                  </p>
                </div>

                <div>
                  <h3
                    class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
                  >
                    Testing Tools
                  </h3>

                  <div class="space-y-4 mt-4">
                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4
                        class="text-lg font-medium text-gray-800 dark:text-white mb-2"
                      >
                        WAVE
                      </h4>
                      <p class="text-gray-600 dark:text-gray-300 mb-2">
                        WebAIM's WAVE (Web Accessibility Evaluation Tool) helps
                        authors make their web content more accessible.
                      </p>
                      <a
                        href="https://wave.webaim.org/"
                        target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                        >Learn more about WAVE</a
                      >
                    </div>

                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4
                        class="text-lg font-medium text-gray-800 dark:text-white mb-2"
                      >
                        Pa11y
                      </h4>
                      <p class="text-gray-600 dark:text-gray-300 mb-2">
                        Pa11y is an automated accessibility testing tool that
                        runs HTML CodeSniffer from the command line.
                      </p>
                      <a
                        href="https://pa11y.org/"
                        target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                        >Learn more about Pa11y</a
                      >
                    </div>

                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4
                        class="text-lg font-medium text-gray-800 dark:text-white mb-2"
                      >
                        Lighthouse
                      </h4>
                      <p class="text-gray-600 dark:text-gray-300 mb-2">
                        Lighthouse is an open-source, automated tool for improving the quality of web pages. It has audits for performance, accessibility, progressive web apps, SEO, and more.
                      </p>
                      <a
                        href="https://developers.google.com/web/tools/lighthouse"
                        target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                        >Learn more about Lighthouse</a
                      >
                    </div>

                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4
                        class="text-lg font-medium text-gray-800 dark:text-white mb-2"
                      >
                        IBM Accessibility Checker
                      </h4>
                      <p class="text-gray-600 dark:text-gray-300 mb-2">
                        IBM's Accessibility Checker is a comprehensive tool that helps identify accessibility issues and provides detailed guidance on how to fix them according to WCAG guidelines.
                      </p>
                      <a
                        href="https://www.ibm.com/able/toolkit/tools"
                        target="_blank"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                        >Learn more about IBM Accessibility Checker</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- History Tracking (shown on dashboard only) -->
          <div v-if="currentView === 'dashboard'" class="mt-8">
            <h2 class="text-2xl font-bold mb-2">Accessibility Scan History</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Track your accessibility improvements over time and compare scan
              results.
            </p>

            <HistoryTracking :loading="isLoading" @rescan="handleRescan" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import AppNavigation from "./components/AppNavigation.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import Tooltip from "./components/Tooltip.vue";
import HistoryTracking from "./components/HistoryTracking.vue";
import SummaryChart from "./components/SummaryChart.vue";
import { nanoid } from "nanoid/non-secure";

// Define the Issue type
interface Issue {
  type: "error" | "warning" | "notice";
  code: string;
  message: string;
  context?: string;
  source: "pa11y" | "wave" | "lighthouse" | "ibm-a11y";
  selector?: string;
  detail?: string;
  pageUrl?: string;
}

// Define a type for the scan summary
interface ScanSummary {
  id: string;
  date: string;
  url: string;
  errors: number;
  warnings: number;
  notices: number;
  tools: string[];
  issues: Partial<Issue>[];
  pageTitle?: string;
  timestamp: number;
  scanDuration: number;
  toolVersions: { [key: string]: string | null };
  previousScanId?: string;
  improvement?: {
    errors: number;
    warnings: number;
    notices: number;
    total: number;
    percentage?: number;
  };
}

// State
const url = ref("");
const waveApiKey = ref("8S4DTy1N5235");
const selectedTools = ref(["wave", "pa11y"]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const results = ref<Issue[]>([]);
const scanCompleted = ref(false);
const visualReport = ref(true);
const waveReportUrl = ref("");
const filterSource = ref("all");
const filterType = ref("all");
const isMobileMenuOpen = ref(false);
const expandedDetails = ref<number[]>([]);
const expandedGroups = ref<string[]>([]);
const showTechDetails = ref<number[]>([]);
const recentScans = ref<string[]>([]);
const currentView = ref("dashboard");
const savedReports = ref<ScanSummary[]>([]);
const defaultTools = ref(["wave", "pa11y"]);
const advancedOptionsOpen = ref(false);
const enableCrawling = ref(false);
const maxPages = ref(5);
const QUICK_WIN_THRESHOLD = 5; // Define threshold for highlighting

// Laad recente scans bij initialisatie
onMounted(() => {
  try {
    const storedScans = JSON.parse(localStorage.getItem("recentScans") || "[]");
    recentScans.value = storedScans;
  } catch (err) {
    console.error("Error loading recent scans:", err);
  }
});

// Handle scan from recent scans list
function handleRecentScan(selectedUrl: string) {
  url.value = selectedUrl;
  isMobileMenuOpen.value = false;
  currentView.value = "dashboard";
  document
    .querySelector("#url")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Handle navigation from AppNavigation
function handleNavigation(page: string) {
  currentView.value = page;
  if (page === "saved-reports") {
    loadSavedReports();
  }
}

// Handle rescan request from HistoryTracking component
function handleRescan(rescanUrl: string) {
  url.value = rescanUrl;
  runScan();
}

// Toggle individual issue details
function toggleDetails(issueGlobalIndex: number) {
  const position = expandedDetails.value.indexOf(issueGlobalIndex);
  if (position === -1) {
    expandedDetails.value.push(issueGlobalIndex);
    const techPos = showTechDetails.value.indexOf(issueGlobalIndex);
    if (techPos !== -1) {
      showTechDetails.value.splice(techPos, 1);
    }
  } else {
    expandedDetails.value.splice(position, 1);
    const techPos = showTechDetails.value.indexOf(issueGlobalIndex);
    if (techPos !== -1) {
      showTechDetails.value.splice(techPos, 1);
    }
  }
}

// Toggle technical details visibility
function toggleTechDetails(issueGlobalIndex: number) {
  const position = showTechDetails.value.indexOf(issueGlobalIndex);
  if (position === -1) {
    showTechDetails.value.push(issueGlobalIndex);
  } else {
    showTechDetails.value.splice(position, 1);
  }
}

// --- Grouping Logic ---
const groupedIssues = computed(() => {
  const groups: { [key: string]: Issue[] } = {};
  filteredIssues.value.forEach((issue) => {
    const key = issue.code || "uncategorized";
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(issue);
  });
  return groups;
});

const sortedGroupCodes = computed(() => {
  // Sort codes: Prioritize groups containing errors, then sort by occurrence count (desc), then alphabetically
  return Object.keys(groupedIssues.value).sort((codeA, codeB) => {
    const groupA = groupedIssues.value[codeA];
    const groupB = groupedIssues.value[codeB];

    // Check if groups contain errors
    const groupAHasError = groupA.some((issue) => issue.type === "error");
    const groupBHasError = groupB.some((issue) => issue.type === "error");

    // Prioritize groups with errors
    if (groupAHasError && !groupBHasError) {
      return -1; // A comes first
    }
    if (!groupAHasError && groupBHasError) {
      return 1; // B comes first
    }

    // If both have/don't have errors, sort by occurrence count (descending)
    const countDiff = groupB.length - groupA.length;
    if (countDiff !== 0) {
      return countDiff;
    }

    // If counts are equal, sort alphabetically
    return codeA.localeCompare(codeB);
  });
});

function toggleGroup(code: string) {
  const index = expandedGroups.value.indexOf(code);
  if (index === -1) {
    expandedGroups.value.push(code);
  } else {
    expandedGroups.value.splice(index, 1);
  }
}

// Computed properties
const filteredResults = computed(() => {
  if (filterSource.value === "all") {
    return results.value;
  }
  return results.value.filter((issue) => issue.source === filterSource.value);
});

const filteredIssues = computed(() => {
  let issues = filteredResults.value;
  if (filterType.value !== "all") {
    issues = issues.filter((issue) => issue.type === filterType.value);
  }
  return issues;
});

// Watch filters to reset groups and expanded details
watch([filterSource, filterType], () => {
  expandedGroups.value = [];
  expandedDetails.value = [];
  showTechDetails.value = [];
});

const errorCount = computed(
  () => filteredResults.value.filter((issue) => issue.type === "error").length
);

const warningCount = computed(
  () => filteredResults.value.filter((issue) => issue.type === "warning").length
);

const noticeCount = computed(
  () => filteredResults.value.filter((issue) => issue.type === "notice").length
);

const hasWaveIssues = computed(() =>
  results.value.some((issue) => issue.source === "wave")
);

const hasPa11yIssues = computed(() =>
  results.value.some((issue) => issue.source === "pa11y")
);

// Add these computed properties after the existing hasWaveIssues and hasPa11yIssues
const hasLighthouseIssues = computed(() =>
  results.value.some((issue) => issue.source === 'lighthouse')
);

const hasIbmA11yIssues = computed(() =>
  results.value.some((issue) => issue.source === 'ibm-a11y')
);

// Run an accessibility scan
async function runScan() {
  if (!url.value || selectedTools.value.length === 0) {
    return;
  }
  results.value = [];
  error.value = null;
  scanCompleted.value = false;
  visualReport.value = true;
  waveReportUrl.value = "";
  isLoading.value = true;
  expandedGroups.value = [];
  expandedDetails.value = [];
  showTechDetails.value = [];
  try {
    if (selectedTools.value.includes("wave") && visualReport.value) {
      try {
        let formattedUrl = url.value.trim();
        if (
          !formattedUrl.startsWith("http://") &&
          !formattedUrl.startsWith("https://")
        ) {
          formattedUrl = "https://" + formattedUrl;
        }
        waveReportUrl.value = `https://wave.webaim.org/report#/${encodeURIComponent(
          formattedUrl
        )}`;
      } catch (urlError) {
        console.error("Error creating WAVE report URL:", urlError);
      }
    }
    const needsCrawling = enableCrawling.value;
    if (needsCrawling) {
      const maxPagesToScan = maxPages.value || 5;
      console.log(
        `Running multi-page scan on ${url.value}, max pages: ${maxPagesToScan}`
      );
      try {
        const response = await axios.post("/api/crawl", {
          url: url.value,
          maxPages: maxPagesToScan,
          tools: selectedTools.value,
          waveApiKey: waveApiKey.value,
        });
        if (response.data?.success) {
          console.log(`Scanned ${response.data.summary.pagesScanned} pages.`);
          response.data.pages.forEach((page: any) => {
            if (page.toolResults.pa11y?.success) {
              const pageIssues = page.toolResults.pa11y.result.issues.map(
                (issue: any) => ({
                  ...issue,
                  source: "pa11y",
                  pageUrl: page.url,
                })
              );
              results.value.push(...pageIssues);
            }
            if (page.toolResults.wave?.success) {
              const pageIssues = page.toolResults.wave.result.issues.map(
                (issue: any) => ({
                  ...issue,
                  source: "wave",
                  pageUrl: page.url,
                })
              );
              results.value.push(...pageIssues);
            }
          });
          if (response.data.errors?.length > 0) {
            error.value =
              (error.value ? error.value + "\n" : "") +
              "Crawler Errors:\n" +
              response.data.errors.join("\n");
          }
        } else {
          throw new Error(
            response.data?.error || "Crawler returned no results or failed"
          );
        }
      } catch (crawlError: any) {
        console.error("Crawling error:", crawlError);
        error.value =
          (error.value ? error.value + "\n" : "") +
          `Crawling failed: ${crawlError.message}. Falling back to single page scan.`;
        await runSinglePageScan(); // Fallback
      }
    } else {
      await runSinglePageScan();
    }
    saveToRecentScans(url.value);
    scanCompleted.value = true;
  } catch (err: any) {
    console.error("Scan error:", err);
    error.value =
      (error.value ? error.value + "\n" : "") +
      (err.message || "An unknown error occurred");
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      document
        .querySelector("#results-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

// Function to handle single page scanning
async function runSinglePageScan() {
  // Run each selected tool
  const scanPromises: Promise<any>[] = [];

  for (const tool of selectedTools.value) {
    if (tool === "pa11y") {
      scanPromises.push(runPa11yScan());
    } else if (tool === "wave") {
      scanPromises.push(runWaveScan());
    } else if (tool === "lighthouse") {
      scanPromises.push(runLighthouseScan());
    } else if (tool === "ibm-a11y") {
      scanPromises.push(runIbmA11yScan());
    }
  }

  // Wait for all scans to complete
  await Promise.all(scanPromises);
}

async function runPa11yScan() {
  try {
    console.log("Running Pa11y scan on:", url.value);

    // Make the actual API call to the backend Pa11y endpoint
    const response = await axios.post<{ pages: { issues: any[] }[] }>(
      "/api/pa11y",
      {
        url: url.value,
        // You could add other pa11y options here if needed, e.g.:
        // standard: 'WCAG2AA',
        // includeNotices: true,
        // includeWarnings: true,
        // timeout: 30000,
      }
    );

    // Check if the response contains the expected data structure
    if (
      response.data &&
      response.data.pages &&
      response.data.pages.length > 0 &&
      response.data.pages[0].issues
    ) {
      // Extract issues from the first page result (since this function handles single page scans)
      const pa11yIssues = response.data.pages[0].issues;

      // Map issues to the format expected by the frontend, adding the source
      const formattedIssues: Issue[] = pa11yIssues.map((issue) => ({
        ...issue,
        source: "pa11y",
      }));

      // Add the formatted issues to the main results array
      results.value.push(...formattedIssues);
      console.log(
        `Pa11y scan completed, added ${formattedIssues.length} issues.`
      );
      return formattedIssues; // Return the processed issues
    } else {
      // Handle cases where the response structure is unexpected
      console.warn(
        "Pa11y scan response did not contain expected issues structure:",
        response.data
      );
      throw new Error("Pa11y scan returned unexpected data format.");
    }
  } catch (err: any) {
    console.error("Pa11y scan error:", err);
    // Improve error message detail if possible
    const errorMessage =
      err.response?.data?.error ||
      err.message ||
      "An unknown error occurred during the Pa11y scan";
    // Ensure error ref is typed correctly
    if (error.value !== null) {
      error.value = `Pa11y scan failed: ${errorMessage}`;
    }
  }
}

async function runWaveScan() {
  try {
    // This is a demo implementation - in production, this would call the WAVE API
    console.log("Running WAVE scan on:", url.value);

    // In a real application, you would make actual API calls
    if (waveApiKey.value) {
      try {
        // Uncomment and modify this code to make real API calls
        // const response = await axios.get('https://wave.webaim.org/api/request', {
        //   params: {
        //     key: waveApiKey.value,
        //     url: url.value,
        //     reporttype: 3, // JSON format
        //   },
        // });
        // if (!response.data) {
        //   throw new Error('Empty response from WAVE API');
        // }
        // if (response.data.status && !response.data.status.success) {
        //   throw new Error(response.data.status.error || 'WAVE scan failed');
        // }
      } catch (apiError: any) {
        // Added type annotation for catch block
        console.error("WAVE API error:", apiError);
        if (error.value !== null) {
          error.value = "Error connecting to WAVE API: " + apiError.message;
        }
      }
    }

    // Simulate a delay for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Sample data for demonstration
    const sampleIssues: Issue[] = [
      {
        type: "error",
        code: "contrast",
        message: "Very low contrast",
        context:
          '<p style="color: #ccc">This text has low contrast against the background.</p>',
        source: "wave",
        selector: 'p[style="color: #ccc"]',
        detail:
          "Text elements should have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.",
      },
      {
        type: "warning",
        code: "heading-order",
        message: "Skipped heading level",
        context: "<h1>Page Title</h1>\n<h3>Subheading</h3>",
        source: "wave",
        selector: "h3",
        detail:
          "Heading levels should not be skipped. After an h1, the next heading should be an h2.",
      },
      {
        type: "notice",
        code: "aria",
        message: "ARIA attribute detected",
        context: '<button aria-label="Close dialog">X</button>',
        source: "wave",
        selector: 'button[aria-label="Close dialog"]',
        detail:
          "ARIA attributes were detected. Ensure they are used correctly.",
      },
    ];

    // Add sample issues to results
    results.value.push(...sampleIssues);

    // In production, you would process API response like this:
    // if (response.data.categories) {
    //   processWaveCategory(response.data.categories.error, 'error');
    //   processWaveCategory(response.data.categories.contrast, 'error');
    //   processWaveCategory(response.data.categories.alert, 'warning');
    //   processWaveCategory(response.data.categories.feature, 'notice');
    //   processWaveCategory(response.data.categories.structure, 'notice');
    //   processWaveCategory(response.data.categories.aria, 'notice');
    // }
  } catch (err: any) {
    // Added type annotation for catch block
    console.error("WAVE scan error:", err);
    // Ensure error ref is typed correctly
    if (error.value !== null) {
      error.value =
        "WAVE scan failed: " + (err.response?.data?.error || err.message);
    }
  }
}

async function runLighthouseScan() {
  try {
    console.log("Running Lighthouse scan on:", url.value);
    
    // Make API call to backend Lighthouse endpoint
    const response = await axios.post("/api/lighthouse", {
      url: url.value,
      categories: ['accessibility', 'seo'] // Focus on accessibility and SEO
    });

    if (response.data?.success) {
      const lighthouseIssues = response.data.audits
        .filter((audit: any) => audit.score !== null && audit.score < 1)
        .map((audit: any) => ({
          type: audit.score === 0 ? "error" : "warning",
          code: audit.id,
          message: audit.title,
          context: audit.description,
          source: "lighthouse",
          selector: audit.selector,
          detail: audit.explanation
        }));

      results.value.push(...lighthouseIssues);
      console.log(`Lighthouse scan completed, added ${lighthouseIssues.length} issues.`);
    } else {
      throw new Error(response.data?.error || "Lighthouse scan failed");
    }
  } catch (err: any) {
    console.error("Lighthouse scan error:", err);
    if (error.value !== null) {
      error.value = "Lighthouse scan failed: " + (err.response?.data?.error || err.message);
    }
  }
}

async function runIbmA11yScan() {
  try {
    console.log("Running IBM Accessibility Checker scan on:", url.value);
    
    // Make API call to backend IBM A11y endpoint
    const response = await axios.post("/api/ibm-a11y", {
      url: url.value
    });

    if (response.data?.success) {
      const ibmIssues = response.data.issues.map((issue: any) => ({
        type: issue.type,
        code: issue.code,
        message: issue.message,
        context: issue.context,
        source: "ibm-a11y",
        selector: issue.selector,
        detail: issue.detail
      }));

      results.value.push(...ibmIssues);
      console.log(`IBM A11y scan completed, added ${ibmIssues.length} issues.`);
    } else {
      throw new Error(response.data?.error || "IBM A11y scan failed");
    }
  } catch (err: any) {
    console.error("IBM A11y scan error:", err);
    if (error.value !== null) {
      error.value = "IBM A11y scan failed: " + (err.response?.data?.error || err.message);
    }
  }
}

// Save scanned URL to recent scans and store scan results
function saveToRecentScans(scannedUrl: string) {
  try {
    // Add to beginning, remove duplicates for recent scans list
    const newScans = [
      scannedUrl,
      ...recentScans.value.filter((scan) => scan !== scannedUrl),
    ].slice(0, 5); // Keep only 5 most recent

    // Update reactive state
    recentScans.value = newScans;

    // Save to localStorage
    localStorage.setItem("recentScans", JSON.stringify(newScans));
    console.log("Saved to recent scans:", newScans);

    // Now save the full scan data for history tracking
    saveFullScanHistory(scannedUrl);
  } catch (err) {
    console.error("Error saving to recent scans:", err);
  }
}

// Save complete scan data for historical analysis
function saveFullScanHistory(scannedUrl: string) {
  try {
    // Create a detailed summary of the scan
    const scanSummary: ScanSummary = {
      id: nanoid(), // Unique ID for this scan
      date: new Date().toISOString(),
      url: scannedUrl,
      errors: errorCount.value,
      warnings: warningCount.value,
      notices: noticeCount.value,
      tools: selectedTools.value,
      // Ensure issues conform to the Issue interface (or a subset for storage)
      issues: results.value.map((issue: Issue) => ({
        type: issue.type,
        code: issue.code,
        message: issue.message,
        source: issue.source,
        context: issue.context ?? undefined, // Convert null to undefined
        selector: issue.selector,
        // detail: issue.detail, // Optional: Detail might be too large for history
      })),
      // Additional metadata for trend analysis
      pageTitle: typeof document !== "undefined" ? document.title : undefined, // Added check for document
      timestamp: Date.now(),
      scanDuration: Math.floor(1000 + Math.random() * 4000), // Simulated scan duration in ms
      toolVersions: {
        pa11y: selectedTools.value.includes("pa11y") ? "6.1.0" : null,
        wave: selectedTools.value.includes("wave") ? "3.1.2" : null,
        lighthouse: selectedTools.value.includes("lighthouse") ? "10.0.0" : null,
        "ibm-a11y": selectedTools.value.includes("ibm-a11y") ? "4.0.0" : null
      },
      // previousScanId: undefined, // Properties are optional in interface
      // improvement: undefined,
    };

    // Get existing history from localStorage
    let scanHistory: ScanSummary[] = []; // Use the defined interface
    try {
      scanHistory = JSON.parse(
        localStorage.getItem("scanHistory") || "[]"
      ) as ScanSummary[];

      // Check if we've scanned this URL before
      const previousScansForUrl = scanHistory.filter(
        (scan) => scan.url === scannedUrl
      );

      // Calculate improvement if there are previous scans
      if (previousScansForUrl.length > 0) {
        // Sort by date (newest first)
        previousScansForUrl.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Compare with most recent previous scan
        const previousScan = previousScansForUrl[0];

        scanSummary.previousScanId = previousScan.id;
        const prevErrors = previousScan.errors ?? 0;
        const prevWarnings = previousScan.warnings ?? 0;
        const prevNotices = previousScan.notices ?? 0;
        scanSummary.improvement = {
          errors: prevErrors - scanSummary.errors,
          warnings: prevWarnings - scanSummary.warnings,
          notices: prevNotices - scanSummary.notices,
          total:
            prevErrors +
            prevWarnings +
            prevNotices -
            (scanSummary.errors + scanSummary.warnings + scanSummary.notices),
          percentage: undefined as number | undefined, // Initialize percentage
        };

        // Calculate percentage improvement
        const previousTotal = prevErrors + prevWarnings + prevNotices;
        const currentTotal =
          scanSummary.errors + scanSummary.warnings + scanSummary.notices;
        if (previousTotal > 0) {
          scanSummary.improvement.percentage = Math.round(
            ((previousTotal - currentTotal) / previousTotal) * 100
          );
        }
      }
    } catch (e) {
      console.error("Error processing scan history:", e);
      scanHistory = [];
    }

    // Add new scan to history
    scanHistory.push(scanSummary);

    // Limit history size to prevent excessive localStorage usage (keeping last 100 entries)
    if (scanHistory.length > 100) {
      scanHistory = scanHistory.slice(-100);
    }

    // Save updated history to localStorage
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory));
    console.log("Saved full scan data to history:", scanSummary);

    // Return the scan summary for potential further use
    return scanSummary;
  } catch (err) {
    console.error("Error saving full scan history:", err);
    return null;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function formatUrl(urlStr: string): string {
  const maxLength = 50; // Define the maximum length for the URL
  if (urlStr.length > maxLength) {
    return urlStr.slice(0, maxLength) + "..."; // Truncate the URL if it's too long
  }
  return urlStr;
}

function loadReport(report: ScanSummary) {
  console.log("Loading report:", report.id, report.url);

  // Set the state based on the loaded report
  url.value = report.url;
  results.value = report.issues.map(
    (issue) =>
      ({
        // Map the potentially partial stored issue back to the full Issue type
        // Provide defaults for any fields that might be missing if we change the Issue interface later
        type: issue.type ?? "notice",
        code: issue.code ?? "unknown",
        message: issue.message ?? "No message provided",
        context: issue.context, // Optional field
        source: issue.source ?? "unknown", // Provide default source
        selector: issue.selector, // Optional field
        detail: issue.detail, // Optional field (might not be stored)
        pageUrl: issue.pageUrl, // Optional field (might not be stored)
      } as Issue)
  ); // Assert as Issue type

  selectedTools.value = report.tools;
  error.value = null; // Clear any previous errors
  scanCompleted.value = true; // Mark as completed to show results
  isLoading.value = false; // Ensure loading state is off
  waveReportUrl.value = ""; // Clear visual report URL

  // Reset expansion states
  expandedGroups.value = [];
  expandedDetails.value = [];
  showTechDetails.value = [];

  // Switch view to dashboard
  currentView.value = "dashboard";

  // Scroll to results after a short delay to allow rendering
  setTimeout(() => {
    document
      .querySelector("#results-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function deleteReport(id: string) {
  console.log("Deleting report with id:", id);
  try {
    let scanHistory: ScanSummary[] = JSON.parse(
      localStorage.getItem("scanHistory") || "[]"
    );
    scanHistory = scanHistory.filter((report) => report.id !== id);
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory));
    savedReports.value = scanHistory; // Update the reactive list
  } catch (e) {
    console.error("Error deleting report:", e);
  }
}

function saveSettings() {
  // Implement the logic to save settings
  console.log("Saving settings");
}

// Load saved reports from localStorage
function loadSavedReports() {
  try {
    const savedHistory = localStorage.getItem("scanHistory");
    if (savedHistory) {
      // Explicitly type the parsed history using the same interface or any[]
      savedReports.value = JSON.parse(savedHistory) as ScanSummary[];
    } else {
      savedReports.value = [];
    }
  } catch (error) {
    console.error("Error loading saved reports:", error);
    savedReports.value = [];
  }
}

// Add these functions in the script section, before the return statement
// Add this interface before the formatDetailWithLinks function
interface DetailPart {
  text: string;
  isLink: boolean;
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

function shortenUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch {
    return url;
  }
}
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}
</style>
