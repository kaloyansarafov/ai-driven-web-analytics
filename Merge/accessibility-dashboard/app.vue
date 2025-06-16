<template>
  <div
    class="min-h-screen bg-[linear-gradient(90deg,_#3C585E_0%,_#232B62_100%)] text-gray-900 dark:text-gray-100"
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
        <header class="bg-white/10 backdrop-blur-sm shadow-sm z-10">
          <div class="flex justify-between items-center px-4 py-3">
            <div class="flex items-center lg:hidden">
              <!-- Mobile logo and menu button -->
              <button
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="text-white focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
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
              <h1 class="text-xl font-semibold text-white ml-2">
                SEO & A11y Dashboard
              </h1>
            </div>
            <!-- Only show user, notification, and theme toggle on mobile header -->
            <div class="flex items-center space-x-3 lg:hidden">
              <ThemeToggle />
              <a
                href="#"
                class="relative p-1 rounded-full text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <main class="flex-1 overflow-y-auto p-4">
          <!-- Dashboard View -->
          <div v-if="currentView === 'dashboard'">
            <!-- HERO SECTION FULL WIDTH BACKGROUND START -->
            <div class="w-full min-h-[420px] overflow-x-hidden">
              <div class="flex items-center justify-center py-12 min-h-[420px]">
                <section
                  class="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto rounded-2xl shadow-xl p-8 relative z-10"
                >
                  <!-- Left: Text and Form -->
                  <div class="flex-1 max-w-xl text-left">
                    <h1
                      class="text-5xl md:text-6xl font-extrabold text-white mb-4"
                    >
                      Welcome to The Cre8ion Lab!
                    </h1>
                    <h2 class="text-3xl font-bold text-white mb-4">
                      Manage your website's SEO and Accessibility metrics
                      Easily!
                    </h2>
                    <p class="text-lg text-blue-100 mb-8 max-w-lg">
                      Our dashboard will help you get all the analytics that you
                      need to improve the SEO and Accessibility of your website.
                      Just enter the website link below, and let us explore the
                      results together!
                    </p>
                    <!-- Scan Form (preserve all logic) -->
                    <div
                      class="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow p-6 w-full"
                    >
                      <form @submit.prevent="runAnalyses" class="space-y-4">
                        <div>
                          <label
                            for="url"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >URL</label
                          >
                          <div class="mt-1 flex items-center space-x-2">
                            <input
                              type="url"
                              id="url"
                              v-model="url"
                              placeholder="https://example.com"
                              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              :disabled="isLoading"
                            />
                            <button
                              type="submit"
                              :disabled="
                                isLoading ||
                                !url ||
                                (!analysisTypes.accessibility &&
                                  !analysisTypes.seo)
                              "
                              class="px-6 py-2 rounded-md font-semibold bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {{ isLoading ? "Analyzing..." : "Analyze" }}
                            </button>
                          </div>
                        </div>
                        <!-- Advanced Options Toggle -->
                        <div class="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="advanced-options"
                            v-model="showAdvancedOptions"
                            class="toggle toggle-sm"
                          />
                          <label
                            for="advanced-options"
                            class="text-xs text-gray-600 dark:text-gray-300 cursor-pointer"
                            >Advanced Options</label
                          >
                        </div>
                        <!-- Advanced Options Section (conditionally shown) -->
                        <div
                          v-if="showAdvancedOptions"
                          class="space-y-4 border-t pt-4 mt-2"
                        >
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                              >Analysis Types</label
                            >
                            <div class="space-y-2">
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="analysisTypes.accessibility"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span
                                  class="text-sm text-gray-700 dark:text-gray-300"
                                  >Accessibility Analysis</span
                                >
                              </label>
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="analysisTypes.seo"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span
                                  class="text-sm text-gray-700 dark:text-gray-300"
                                  >SEO Analysis</span
                                >
                              </label>
                            </div>
                          </div>
                          <div
                            v-if="analysisTypes.accessibility"
                            class="space-y-4"
                          >
                            <div>
                              <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >Accessibility Tools</label
                              >
                              <div class="space-y-2">
                                <label
                                  v-for="tool in availableTools"
                                  :key="tool.id"
                                  class="flex items-center space-x-3"
                                >
                                  <input
                                    type="checkbox"
                                    :value="tool.id"
                                    v-model="selectedTools"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                    :disabled="isLoading"
                                  />
                                  <span
                                    class="text-sm text-gray-700 dark:text-gray-300"
                                    >{{ tool.name }}</span
                                  >
                                </label>
                              </div>
                            </div>
                            <div v-if="selectedTools.includes('wave')">
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="visualReport"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span
                                  class="text-sm text-gray-700 dark:text-gray-300"
                                  >Include Visual Report</span
                                >
                              </label>
                            </div>
                            <div>
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="includeHistory"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span
                                  class="text-sm text-gray-700 dark:text-gray-300"
                                  >Track Scan History</span
                                >
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <!-- Right: Illustration -->
                  <div
                    class="flex-1 flex items-center justify-center mt-10 lg:mt-0"
                  >
                    <img
                      src="/assets/Image/Side%20Illustration.png"
                      alt="Person analyzing dashboard illustration"
                      class="max-w-xs w-full h-auto rounded-xl shadow-lg"
                      loading="lazy"
                    />
                  </div>
                </section>
              </div>
            </div>
            <!-- HERO SECTION FULL WIDTH BACKGROUND END -->

            <!-- Results Navigation (unchanged) -->
            <div
              v-if="analysisComplete"
              class="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md p-6"
            >
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-white mb-4"
              >
                Analysis Complete
              </h3>
              <div class="flex flex-wrap gap-4">
                <button
                  v-if="analysisTypes.accessibility"
                  @click="navigateToAnalysis('accessibility')"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Accessibility Results
                </button>
                <button
                  v-if="analysisTypes.seo"
                  @click="navigateToAnalysis('seo')"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  View SEO Results
                </button>
                <button
                  @click="navigateToAnalysis('combined')"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  View Combined Dashboard
                </button>
              </div>
            </div>

            <!-- Loading state (unchanged) -->
            <div
              v-if="isLoading"
              class="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md p-6"
            >
              <div class="text-center mb-6">
                <h3
                  class="text-lg font-semibold text-gray-800 dark:text-white mb-2"
                >
                  Analyzing {{ url }}
                </h3>
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4"
                >
                  <div
                    class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    :style="{ width: `${analysisProgress.overall}%` }"
                  ></div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Overall Progress: {{ analysisProgress.overall }}%
                </p>
              </div>

              <div class="space-y-6">
                <!-- Accessibility Progress -->
                <div v-if="analysisTypes.accessibility" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Accessibility Analysis
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ analysisProgress.accessibility.completed }}/{{
                        analysisProgress.accessibility.total
                      }}
                      tools
                    </span>
                  </div>
                  <div
                    class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                  >
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: `${
                          (analysisProgress.accessibility.completed /
                            analysisProgress.accessibility.total) *
                          100
                        }%`,
                      }"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ analysisProgress.accessibility.status }}
                  </p>
                </div>

                <!-- SEO Progress -->
                <div v-if="analysisTypes.seo" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      SEO Analysis
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ analysisProgress.seo.completed }}/{{
                        analysisProgress.seo.total
                      }}
                      steps
                    </span>
                  </div>
                  <div
                    class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                  >
                    <div
                      class="bg-green-600 h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: `${
                          (analysisProgress.seo.completed /
                            analysisProgress.seo.total) *
                          100
                        }%`,
                      }"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ analysisProgress.seo.status }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Error message (unchanged) -->
            <div
              v-else-if="error"
              class="mt-8 bg-red-50/90 dark:bg-red-900/20 backdrop-blur-sm border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-md"
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
                  <h3 class="text-sm leading-5 font-medium">Analysis failed</h3>
                  <div class="mt-1 text-sm leading-5">{{ error }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Accessibility Analysis View -->
          <div v-else-if="currentView === 'accessibility-analysis'">
            <AccessibilityAnalysis
              :results="results"
              :selected-tools="selectedTools"
              :scan-completed="scanCompleted"
              :visual-report="visualReport"
              :wave-report-url="waveReportUrl"
              :is-loading="isLoading"
              :url="url"
              @rescan="handleRescan"
            />
          </div>

          <!-- SEO Analysis View -->
          <div v-else-if="currentView === 'seo-analysis'">
            <SEOAnalysis
              :url="url"
              :initial-analysis="seoAnalysisResults"
              @update:analysis="
                (newAnalysis) => (seoAnalysisResults = newAnalysis)
              "
            />
          </div>

          <!-- Other views remain unchanged -->
          <div v-else-if="currentView === 'saved-reports'">
            <HistoryTracking :reports="savedReports" @rescan="handleRescan" />
          </div>

          <div v-else-if="currentView === 'settings'">
            <div class="max-w-7xl mx-auto">
              <h2 class="text-2xl font-bold mb-4">Settings</h2>
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <form @submit.prevent="saveSettings" class="space-y-6">
                  <div>
                    <label
                      for="waveApiKey"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      WAVE API Key
                    </label>
                    <div class="mt-1">
                      <input
                        type="password"
                        id="waveApiKey"
                        v-model="settings.waveApiKey"
                        class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your WAVE API key"
                      />
                    </div>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Get your API key from the WAVE API service.
                    </p>
                  </div>

                  <div class="flex justify-end">
                    <button
                      type="submit"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div v-else-if="currentView === 'help'">
            <div class="max-w-7xl mx-auto px-4 py-6">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <!-- Header -->
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h1
                    class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center"
                  >
                    <span aria-hidden="true">📚</span> Help & Documentation
                  </h1>
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    Complete guide to using the AI-Driven Web Analytics
                    Dashboard
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: January 2025 •
                    <button
                      @click="currentView = 'settings'"
                      class="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Theme Settings
                    </button>
                    • Press
                    <kbd
                      class="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs"
                      >Ctrl+D</kbd
                    >
                    to bookmark
                  </p>
                </div>

                <div class="p-6">
                  <!-- Table of Contents -->
                  <nav
                    class="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                    role="navigation"
                    aria-label="Documentation table of contents"
                  >
                    <h2
                      class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3"
                    >
                      <span aria-hidden="true">📋</span> Table of Contents
                    </h2>
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
                    >
                      <a
                        href="#overview"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">🏠</span> Overview</a
                      >
                      <a
                        href="#running-scans"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">🔍</span> Running Scans</a
                      >
                      <a
                        href="#tool-deep-dive"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">🔧</span> Tool Deep Dive</a
                      >
                      <a
                        href="#understanding-results"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">📊</span> Understanding
                        Results</a
                      >
                      <a
                        href="#ai-features"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">🤖</span> AI Features</a
                      >
                      <a
                        href="#settings-config"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">⚙️</span> Settings</a
                      >
                      <a
                        href="#troubleshooting"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">🔧</span> Troubleshooting</a
                      >
                      <a
                        href="#best-practices"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">💡</span> Best Practices</a
                      >
                      <a
                        href="#faq"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        ><span aria-hidden="true">❓</span> FAQ</a
                      >
                    </div>
                  </nav>

                  <!-- Overview -->
                  <section id="overview" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      <span aria-hidden="true">🏠</span> Overview
                    </h2>

                    <div class="space-y-6">
                      <div
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg"
                      >
                        <h3
                          class="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                        >
                          What is this Dashboard?
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-4">
                          The AI-Driven Web Analytics Dashboard is a
                          comprehensive tool that combines accessibility
                          testing, SEO analysis, and AI-powered recommendations
                          to help you optimize websites for better user
                          experience and search engine performance.
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div
                            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                          >
                            <h4
                              class="font-semibold text-green-600 dark:text-green-400 mb-2"
                            >
                              🌐 Accessibility Testing
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              Multi-tool scanning with WAVE, Pa11y, Lighthouse,
                              and IBM A11y
                            </p>
                          </div>
                          <div
                            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                          >
                            <h4
                              class="font-semibold text-blue-600 dark:text-blue-400 mb-2"
                            >
                              🔍 SEO Analysis
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              Technical SEO, content optimization, and
                              performance metrics
                            </p>
                          </div>
                          <div
                            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                          >
                            <h4
                              class="font-semibold text-purple-600 dark:text-purple-400 mb-2"
                            >
                              🤖 AI Recommendations
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              Smart suggestions powered by advanced AI analysis
                            </p>
                          </div>
                          <div
                            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                          >
                            <h4
                              class="font-semibold text-orange-600 dark:text-orange-400 mb-2"
                            >
                              📈 Progress Tracking
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              Historical data and improvement monitoring
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        <div
                          class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                        >
                          <div class="text-2xl mb-2" aria-hidden="true">👨‍💻</div>
                          <h4
                            class="font-semibold text-green-800 dark:text-green-200 mb-2"
                          >
                            Developers
                          </h4>
                          <p
                            class="text-sm text-green-600 dark:text-green-400 mb-3"
                          >
                            Test compliance & technical SEO
                          </p>
                          <a
                            href="#running-scans"
                            class="text-xs text-green-700 dark:text-green-300 hover:underline"
                          >
                            Learn more →
                          </a>
                        </div>
                        <div
                          class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          <div class="text-2xl mb-2" aria-hidden="true">📊</div>
                          <h4
                            class="font-semibold text-blue-800 dark:text-blue-200 mb-2"
                          >
                            SEO Specialists
                          </h4>
                          <p
                            class="text-sm text-blue-600 dark:text-blue-400 mb-3"
                          >
                            Optimize search performance
                          </p>
                          <a
                            href="#understanding-results"
                            class="text-xs text-blue-700 dark:text-blue-300 hover:underline"
                          >
                            Learn more →
                          </a>
                        </div>
                        <div
                          class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                        >
                          <div class="text-2xl mb-2" aria-hidden="true">🎨</div>
                          <h4
                            class="font-semibold text-purple-800 dark:text-purple-200 mb-2"
                          >
                            UX Designers
                          </h4>
                          <p
                            class="text-sm text-purple-600 dark:text-purple-400 mb-3"
                          >
                            Ensure accessible designs
                          </p>
                          <a
                            href="#ai-features"
                            class="text-xs text-purple-700 dark:text-purple-300 hover:underline"
                          >
                            Learn more →
                          </a>
                        </div>
                        <div
                          class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                        >
                          <div class="text-2xl mb-2" aria-hidden="true">📝</div>
                          <h4
                            class="font-semibold text-orange-800 dark:text-orange-200"
                          >
                            Content Managers
                          </h4>
                          <p
                            class="text-sm text-orange-600 dark:text-orange-400"
                          >
                            Optimize content strategy
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Running Scans -->
                  <section id="running-scans" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      🔍 How to Run Scans
                    </h2>

                    <div class="space-y-6">
                      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          Step-by-Step Process
                        </h3>

                        <div class="space-y-4">
                          <div class="flex items-start space-x-4">
                            <div
                              class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
                            >
                              1
                            </div>
                            <div>
                              <h4
                                class="font-semibold text-gray-900 dark:text-white"
                              >
                                Enter Website URL
                              </h4>
                              <p
                                class="text-gray-600 dark:text-gray-400 text-sm"
                              >
                                Type the complete URL (e.g.,
                                https://example.com)
                              </p>
                            </div>
                          </div>

                          <div class="flex items-start space-x-4">
                            <div
                              class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
                            >
                              2
                            </div>
                            <div>
                              <h4
                                class="font-semibold text-gray-900 dark:text-white"
                              >
                                Select Analysis Types
                              </h4>
                              <p
                                class="text-gray-600 dark:text-gray-400 text-sm"
                              >
                                Choose Accessibility, SEO, or both analyses
                              </p>
                            </div>
                          </div>

                          <div class="flex items-start space-x-4">
                            <div
                              class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
                            >
                              3
                            </div>
                            <div>
                              <h4
                                class="font-semibold text-gray-900 dark:text-white"
                              >
                                Choose Testing Tools
                              </h4>
                              <p
                                class="text-gray-600 dark:text-gray-400 text-sm"
                              >
                                Select from WAVE, Pa11y, Lighthouse, or IBM A11y
                              </p>
                            </div>
                          </div>

                          <div class="flex items-start space-x-4">
                            <div
                              class="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
                            >
                              4
                            </div>
                            <div>
                              <h4
                                class="font-semibold text-gray-900 dark:text-white"
                              >
                                Run Analysis
                              </h4>
                              <p
                                class="text-gray-600 dark:text-gray-400 text-sm"
                              >
                                Click "Run Analysis" and wait for completion
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4"
                      >
                        <div class="flex">
                          <div class="flex-shrink-0">
                            <svg
                              class="h-5 w-5 text-yellow-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                          <div class="ml-3">
                            <h4
                              class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
                            >
                              💡 Pro Tip
                            </h4>
                            <p
                              class="text-sm text-yellow-700 dark:text-yellow-300"
                            >
                              For comprehensive results, run scans at different
                              times and use multiple tools to get varied
                              perspectives on your website's performance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Tool Deep Dive -->
                  <section id="tool-deep-dive" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      🔧 Tool Deep Dive: Your Testing Arsenal
                    </h2>

                    <div class="space-y-8">
                      <!-- Introduction -->
                      <div
                        class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-lg"
                      >
                        <h3
                          class="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                        >
                          Why Multiple Tools?
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-4">
                          Each accessibility testing tool has its own strengths
                          and detection methods. By combining multiple tools,
                          you get comprehensive coverage that no single tool can
                          provide alone.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4
                              class="font-semibold text-indigo-600 dark:text-indigo-400 mb-2"
                            >
                              🎯 Different Detection Methods
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              Visual detection, rule-based automation,
                              performance correlation, and enterprise compliance
                            </p>
                          </div>
                          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4
                              class="font-semibold text-blue-600 dark:text-blue-400 mb-2"
                            >
                              👥 Different Audiences
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              Designers, developers, managers, and compliance
                              teams each benefit from different tool
                              perspectives
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Tool Comparison Grid -->
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- WAVE -->
                        <div
                          class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500"
                        >
                          <div class="flex items-center mb-4">
                            <span class="text-3xl mr-3">🌊</span>
                            <div>
                              <h3
                                class="text-lg font-semibold text-blue-800 dark:text-blue-200"
                              >
                                WAVE - Visual Explorer
                              </h3>
                              <p
                                class="text-sm text-blue-600 dark:text-blue-400"
                              >
                                Web Accessibility Evaluation Tool
                              </p>
                            </div>
                          </div>

                          <div class="space-y-3 mb-4">
                            <div class="text-sm">
                              <strong class="text-blue-700 dark:text-blue-300"
                                >Best For:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Client presentations, visual issue
                                identification</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong class="text-blue-700 dark:text-blue-300"
                                >Unique Feature:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Shows exactly where issues appear on the
                                page</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong class="text-blue-700 dark:text-blue-300"
                                >Use When:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                You need visual context or stakeholder
                                buy-in</span
                              >
                            </div>
                          </div>

                          <div class="mb-4">
                            <h4
                              class="font-medium text-blue-800 dark:text-blue-200 mb-2"
                            >
                              What WAVE Excels At:
                            </h4>
                            <ul
                              class="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                            >
                              <li>
                                • 🎯 Visual Context: Shows exactly where issues
                                occur
                              </li>
                              <li>
                                • 📚 Educational: Explains WHY each issue
                                matters
                              </li>
                              <li>
                                • 🔍 Detailed Analysis: Covers 6 major
                                categories
                              </li>
                              <li>
                                • 🖼️ Visual Reports: Shareable reports with page
                                intact
                              </li>
                            </ul>
                          </div>

                          <div
                            class="bg-blue-100 dark:bg-blue-800/30 p-3 rounded text-xs"
                          >
                            <strong>WAVE Categories:</strong> Errors, Contrast,
                            Alerts, Features, Structure, ARIA
                          </div>
                        </div>

                        <!-- Pa11y -->
                        <div
                          class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500"
                        >
                          <div class="flex items-center mb-4">
                            <span class="text-3xl mr-3">🤖</span>
                            <div>
                              <h3
                                class="text-lg font-semibold text-green-800 dark:text-green-200"
                              >
                                Pa11y - Technical Validator
                              </h3>
                              <p
                                class="text-sm text-green-600 dark:text-green-400"
                              >
                                Command-line Accessibility Testing
                              </p>
                            </div>
                          </div>

                          <div class="space-y-3 mb-4">
                            <div class="text-sm">
                              <strong class="text-green-700 dark:text-green-300"
                                >Best For:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Automated testing, WCAG compliance
                                verification</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong class="text-green-700 dark:text-green-300"
                                >Unique Feature:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Strict WCAG rule checking with technical
                                details</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong class="text-green-700 dark:text-green-300"
                                >Use When:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Building automated testing or need compliance
                                proof</span
                              >
                            </div>
                          </div>

                          <div class="mb-4">
                            <h4
                              class="font-medium text-green-800 dark:text-green-200 mb-2"
                            >
                              What Pa11y Excels At:
                            </h4>
                            <ul
                              class="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                            >
                              <li>
                                • 🔄 Automation: Perfect for CI/CD pipelines
                              </li>
                              <li>
                                • 📋 WCAG Compliance: Strict adherence to
                                guidelines
                              </li>
                              <li>
                                • ⚡ Speed: Fast execution for large-scale
                                testing
                              </li>
                              <li>
                                • 🎯 Precision: Detailed technical information
                              </li>
                            </ul>
                          </div>

                          <div
                            class="bg-green-100 dark:bg-green-800/30 p-3 rounded text-xs"
                          >
                            <strong>Standards:</strong> WCAG 2.1 AA/AAA,
                            HTML_CodeSniffer, aXe-core integration
                          </div>
                        </div>

                        <!-- Lighthouse -->
                        <div
                          class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-l-4 border-purple-500"
                        >
                          <div class="flex items-center mb-4">
                            <span class="text-3xl mr-3">🏠</span>
                            <div>
                              <h3
                                class="text-lg font-semibold text-purple-800 dark:text-purple-200"
                              >
                                Lighthouse - Holistic Auditor
                              </h3>
                              <p
                                class="text-sm text-purple-600 dark:text-purple-400"
                              >
                                Google's Web Quality Audit Tool
                              </p>
                            </div>
                          </div>

                          <div class="space-y-3 mb-4">
                            <div class="text-sm">
                              <strong
                                class="text-purple-700 dark:text-purple-300"
                                >Best For:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Performance correlation, SEO impact
                                analysis</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong
                                class="text-purple-700 dark:text-purple-300"
                                >Unique Feature:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Combines accessibility with performance and
                                SEO</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong
                                class="text-purple-700 dark:text-purple-300"
                                >Use When:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Optimizing for both accessibility and
                                performance</span
                              >
                            </div>
                          </div>

                          <div class="mb-4">
                            <h4
                              class="font-medium text-purple-800 dark:text-purple-200 mb-2"
                            >
                              What Lighthouse Excels At:
                            </h4>
                            <ul
                              class="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                            >
                              <li>
                                • 🎯 Performance Context: Shows
                                accessibility-performance relationship
                              </li>
                              <li>
                                • 📊 Scoring System: Quantitative metrics for
                                tracking
                              </li>
                              <li>
                                • 🔍 SEO Integration: Identifies issues
                                affecting search ranking
                              </li>
                              <li>
                                • 📱 Mobile Testing: Specifically tests mobile
                                accessibility
                              </li>
                            </ul>
                          </div>

                          <div
                            class="bg-purple-100 dark:bg-purple-800/30 p-3 rounded text-xs"
                          >
                            <strong>Audit Areas:</strong> Color Contrast,
                            Keyboard Navigation, Labeling, Images, Structure
                          </div>
                        </div>

                        <!-- IBM A11y -->
                        <div
                          class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border-l-4 border-orange-500"
                        >
                          <div class="flex items-center mb-4">
                            <span class="text-3xl mr-3">🏢</span>
                            <div>
                              <h3
                                class="text-lg font-semibold text-orange-800 dark:text-orange-200"
                              >
                                IBM A11y - Enterprise Compliance
                              </h3>
                              <p
                                class="text-sm text-orange-600 dark:text-orange-400"
                              >
                                Enterprise-Grade Accessibility Checker
                              </p>
                            </div>
                          </div>

                          <div class="space-y-3 mb-4">
                            <div class="text-sm">
                              <strong
                                class="text-orange-700 dark:text-orange-300"
                                >Best For:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Enterprise applications, legal compliance</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong
                                class="text-orange-700 dark:text-orange-300"
                                >Unique Feature:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Detailed remediation guidance for
                                developers</span
                              >
                            </div>
                            <div class="text-sm">
                              <strong
                                class="text-orange-700 dark:text-orange-300"
                                >Use When:</strong
                              >
                              <span class="text-gray-700 dark:text-gray-300">
                                Need enterprise-grade compliance
                                verification</span
                              >
                            </div>
                          </div>

                          <div class="mb-4">
                            <h4
                              class="font-medium text-orange-800 dark:text-orange-200 mb-2"
                            >
                              What IBM A11y Excels At:
                            </h4>
                            <ul
                              class="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                            >
                              <li>
                                • 🏢 Enterprise Compliance: Meets enterprise
                                accessibility requirements
                              </li>
                              <li>
                                • 📚 Detailed Remediation: Step-by-step fixing
                                instructions
                              </li>
                              <li>
                                • 🌐 Multi-Standard Testing: WCAG, Section 508,
                                EN 301 549
                              </li>
                              <li>
                                • 🔧 Developer-Focused: Technical details for
                                implementation
                              </li>
                            </ul>
                          </div>

                          <div
                            class="bg-orange-100 dark:bg-orange-800/30 p-3 rounded text-xs"
                          >
                            <strong>Issue Levels:</strong> Violations, Potential
                            Violations, Recommendations, Needs Review
                          </div>
                        </div>
                      </div>

                      <!-- Tool Comparison Tables -->
                      <div class="space-y-8">
                        <h3
                          class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
                        >
                          📊 Detailed Tool Comparison
                        </h3>

                        <!-- Overview Comparison Table -->
                        <div
                          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                        >
                          <div
                            class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                          >
                            <h4
                              class="text-lg font-medium text-gray-900 dark:text-white"
                            >
                              🔍 Overview Comparison
                            </h4>
                          </div>
                          <div class="overflow-x-auto">
                            <table class="w-full">
                              <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Tool
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Developer
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Type
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Primary Focus
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    API Required
                                  </th>
                                </tr>
                              </thead>
                              <tbody
                                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600"
                              >
                                <tr
                                  class="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-2xl mr-3">🌊</span>
                                      <div>
                                        <div
                                          class="text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                          WAVE
                                        </div>
                                        <div
                                          class="text-sm text-blue-600 dark:text-blue-400"
                                        >
                                          Visual Explorer
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    WebAIM
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Web API
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Visual accessibility evaluation
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    >
                                      Yes (Free tier available)
                                    </span>
                                  </td>
                                </tr>
                                <tr
                                  class="hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-2xl mr-3">🤖</span>
                                      <div>
                                        <div
                                          class="text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                          Pa11y
                                        </div>
                                        <div
                                          class="text-sm text-green-600 dark:text-green-400"
                                        >
                                          Technical Validator
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Team Pa11y
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Command Line
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    WCAG compliance testing
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      No
                                    </span>
                                  </td>
                                </tr>
                                <tr
                                  class="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                >
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-2xl mr-3">🏠</span>
                                      <div>
                                        <div
                                          class="text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                          Lighthouse
                                        </div>
                                        <div
                                          class="text-sm text-purple-600 dark:text-purple-400"
                                        >
                                          Holistic Auditor
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Google Chrome Team
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Browser Engine
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Performance + Accessibility
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      No
                                    </span>
                                  </td>
                                </tr>
                                <tr
                                  class="hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                >
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-2xl mr-3">🏢</span>
                                      <div>
                                        <div
                                          class="text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                          IBM A11y
                                        </div>
                                        <div
                                          class="text-sm text-orange-600 dark:text-orange-400"
                                        >
                                          Enterprise Compliance
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    IBM Accessibility
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Library + Engine
                                  </td>
                                  <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Enterprise compliance
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      No
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- Technical Specifications Table -->
                        <div
                          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                        >
                          <div
                            class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                          >
                            <h4
                              class="text-lg font-medium text-gray-900 dark:text-white"
                            >
                              ⚙️ Technical Specifications
                            </h4>
                          </div>
                          <div class="overflow-x-auto">
                            <table class="w-full">
                              <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Tool
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Detection Engine
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Standards Covered
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Output Format
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Speed
                                  </th>
                                </tr>
                              </thead>
                              <tbody
                                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600"
                              >
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🌊</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >WAVE</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Custom rule engine + Visual analysis
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    WCAG 2.1, Section 508
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    JSON + Visual report
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    >
                                      Medium
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🤖</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >Pa11y</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    HTML_CodeSniffer + aXe-core
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    WCAG 2.1 AA/AAA
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    JSON, CLI output
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      Fast
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🏠</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >Lighthouse</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Chrome DevTools + aXe-core
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    WCAG 2.1, Performance metrics
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    JSON, HTML report
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    >
                                      Medium
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🏢</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >IBM A11y</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    IBM Custom engine + Rules
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    WCAG 2.1, Section 508, EN 301 549
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    JSON, Detailed reports
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                    >
                                      Slower
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- Use Cases & Best Practices Table -->
                        <div
                          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                        >
                          <div
                            class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                          >
                            <h4
                              class="text-lg font-medium text-gray-900 dark:text-white"
                            >
                              🎯 Use Cases & Best Practices
                            </h4>
                          </div>
                          <div class="overflow-x-auto">
                            <table class="w-full">
                              <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Tool
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Ideal For
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Unique Strength
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Learning Curve
                                  </th>
                                  <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Setup Complexity
                                  </th>
                                </tr>
                              </thead>
                              <tbody
                                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600"
                              >
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🌊</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >WAVE</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Designers, Client presentations, Education
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Visual context on actual page
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      Easy
                                    </span>
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    >
                                      API Key needed
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🤖</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >Pa11y</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Developers, CI/CD, Automation
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Strict WCAG compliance checking
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    >
                                      Medium
                                    </span>
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      Simple
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🏠</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >Lighthouse</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Product managers, Performance teams
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Holistic quality scoring
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      Easy
                                    </span>
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      Simple
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                      <span class="text-xl mr-2">🏢</span>
                                      <span
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                        >IBM A11y</span
                                      >
                                    </div>
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Enterprise, Legal compliance, Complex apps
                                  </td>
                                  <td
                                    class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                                  >
                                    Detailed remediation guidance
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                    >
                                      Advanced
                                    </span>
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    >
                                      Moderate
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- Pros and Cons Comparison -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div
                            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                          >
                            <div
                              class="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700"
                            >
                              <h4
                                class="text-lg font-medium text-green-800 dark:text-green-200"
                              >
                                ✅ Pros Summary
                              </h4>
                            </div>
                            <div class="p-6 space-y-4">
                              <div class="border-l-4 border-blue-500 pl-4">
                                <h5
                                  class="font-medium text-blue-700 dark:text-blue-300"
                                >
                                  🌊 WAVE
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Excellent visual feedback</li>
                                  <li>• Great educational value</li>
                                  <li>• Perfect for stakeholder demos</li>
                                  <li>• Comprehensive issue categorization</li>
                                </ul>
                              </div>
                              <div class="border-l-4 border-green-500 pl-4">
                                <h5
                                  class="font-medium text-green-700 dark:text-green-300"
                                >
                                  🤖 Pa11y
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Fast and reliable automation</li>
                                  <li>• Strict WCAG compliance</li>
                                  <li>• Perfect for CI/CD integration</li>
                                  <li>• No API dependencies</li>
                                </ul>
                              </div>
                              <div class="border-l-4 border-purple-500 pl-4">
                                <h5
                                  class="font-medium text-purple-700 dark:text-purple-300"
                                >
                                  🏠 Lighthouse
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Holistic quality assessment</li>
                                  <li>• Google-backed credibility</li>
                                  <li>• Performance correlation insights</li>
                                  <li>• Mobile-first testing</li>
                                </ul>
                              </div>
                              <div class="border-l-4 border-orange-500 pl-4">
                                <h5
                                  class="font-medium text-orange-700 dark:text-orange-300"
                                >
                                  🏢 IBM A11y
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Enterprise-grade thoroughness</li>
                                  <li>• Multi-standard compliance</li>
                                  <li>• Detailed remediation steps</li>
                                  <li>• Legal compliance focus</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div
                            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                          >
                            <div
                              class="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700"
                            >
                              <h4
                                class="text-lg font-medium text-red-800 dark:text-red-200"
                              >
                                ⚠️ Considerations & Limitations
                              </h4>
                            </div>
                            <div class="p-6 space-y-4">
                              <div class="border-l-4 border-blue-500 pl-4">
                                <h5
                                  class="font-medium text-blue-700 dark:text-blue-300"
                                >
                                  🌊 WAVE
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Requires API key (cost factor)</li>
                                  <li>• Rate limiting on free tier</li>
                                  <li>• Less suitable for automation</li>
                                  <li>• Slower than command-line tools</li>
                                </ul>
                              </div>
                              <div class="border-l-4 border-green-500 pl-4">
                                <h5
                                  class="font-medium text-green-700 dark:text-green-300"
                                >
                                  🤖 Pa11y
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Limited visual context</li>
                                  <li>• Technical setup required</li>
                                  <li>• Command-line only interface</li>
                                  <li>• May miss some visual issues</li>
                                </ul>
                              </div>
                              <div class="border-l-4 border-purple-500 pl-4">
                                <h5
                                  class="font-medium text-purple-700 dark:text-purple-300"
                                >
                                  🏠 Lighthouse
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Limited accessibility focus</li>
                                  <li>• Performance-heavy testing</li>
                                  <li>
                                    • Less detailed than specialized tools
                                  </li>
                                  <li>• May not catch all a11y issues</li>
                                </ul>
                              </div>
                              <div class="border-l-4 border-orange-500 pl-4">
                                <h5
                                  class="font-medium text-orange-700 dark:text-orange-300"
                                >
                                  🏢 IBM A11y
                                </h5>
                                <ul
                                  class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1"
                                >
                                  <li>• Slower execution time</li>
                                  <li>• More complex setup</li>
                                  <li>• Steeper learning curve</li>
                                  <li>• Potentially overwhelming output</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Decision Matrix -->
                        <div
                          class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg"
                        >
                          <h4
                            class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                          >
                            🎯 Quick Decision Matrix
                          </h4>
                          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="text-center">
                              <div class="text-2xl mb-2">🎨</div>
                              <div
                                class="text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Visual Design
                              </div>
                              <div
                                class="text-xs text-indigo-600 dark:text-indigo-400 mt-1"
                              >
                                Use WAVE
                              </div>
                            </div>
                            <div class="text-center">
                              <div class="text-2xl mb-2">⚙️</div>
                              <div
                                class="text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Automation
                              </div>
                              <div
                                class="text-xs text-green-600 dark:text-green-400 mt-1"
                              >
                                Use Pa11y
                              </div>
                            </div>
                            <div class="text-center">
                              <div class="text-2xl mb-2">📊</div>
                              <div
                                class="text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Performance
                              </div>
                              <div
                                class="text-xs text-purple-600 dark:text-purple-400 mt-1"
                              >
                                Use Lighthouse
                              </div>
                            </div>
                            <div class="text-center">
                              <div class="text-2xl mb-2">🏢</div>
                              <div
                                class="text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Enterprise
                              </div>
                              <div
                                class="text-xs text-orange-600 dark:text-orange-400 mt-1"
                              >
                                Use IBM A11y
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Interactive Tool Selector -->
                      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          🎯 Tool Recommendation Engine
                        </h3>
                        <div class="space-y-4">
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                              What's your primary goal?
                            </label>
                            <select
                              v-model="selectedGoal"
                              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select your goal...</option>
                              <option value="presentation">
                                Present findings to stakeholders
                              </option>
                              <option value="development">
                                Automate testing in development
                              </option>
                              <option value="compliance">
                                Ensure legal compliance
                              </option>
                              <option value="performance">
                                Optimize performance and accessibility
                              </option>
                              <option value="education">
                                Learn about accessibility issues
                              </option>
                              <option value="enterprise">
                                Enterprise-grade testing
                              </option>
                            </select>
                          </div>

                          <div
                            v-if="selectedGoal"
                            class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-700"
                          >
                            <h4
                              class="font-medium text-blue-900 dark:text-blue-100 mb-3"
                            >
                              Recommended Tools for
                              {{ getGoalName(selectedGoal) }}:
                            </h4>

                            <div
                              v-if="selectedGoal === 'presentation'"
                              class="space-y-2"
                            >
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Primary: WAVE</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Visual reports perfect for stakeholders</span
                                >
                              </div>
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Secondary: Lighthouse</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Scoring metrics for executive summaries</span
                                >
                              </div>
                            </div>

                            <div
                              v-else-if="selectedGoal === 'development'"
                              class="space-y-2"
                            >
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Primary: Pa11y</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Perfect for CI/CD automation</span
                                >
                              </div>
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Secondary: WAVE</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Visual verification of fixes</span
                                >
                              </div>
                            </div>

                            <div
                              v-else-if="selectedGoal === 'compliance'"
                              class="space-y-2"
                            >
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Primary: IBM A11y</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Enterprise-grade compliance
                                  verification</span
                                >
                              </div>
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Secondary: Pa11y</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >WCAG technical validation</span
                                >
                              </div>
                            </div>

                            <div
                              v-else-if="selectedGoal === 'performance'"
                              class="space-y-2"
                            >
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Primary: Lighthouse</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Combines accessibility with performance
                                  metrics</span
                                >
                              </div>
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Secondary: WAVE</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Visual context for accessibility issues</span
                                >
                              </div>
                            </div>

                            <div
                              v-else-if="selectedGoal === 'education'"
                              class="space-y-2"
                            >
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Primary: WAVE</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Best educational explanations and visual
                                  context</span
                                >
                              </div>
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Secondary: IBM A11y</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Detailed remediation guidance</span
                                >
                              </div>
                            </div>

                            <div
                              v-else-if="selectedGoal === 'enterprise'"
                              class="space-y-2"
                            >
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Primary: IBM A11y</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Built for enterprise-scale applications</span
                                >
                              </div>
                              <div class="flex items-center space-x-2">
                                <span
                                  class="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  >Secondary: Pa11y</span
                                >
                                <span
                                  class="text-sm text-gray-600 dark:text-gray-400"
                                  >Automated compliance monitoring</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Strategic Combinations -->
                      <div
                        class="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 p-6 rounded-lg"
                      >
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          🎯 Strategic Tool Combinations
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            class="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <h4
                              class="font-medium text-gray-900 dark:text-white mb-2"
                            >
                              🚀 Complete Workflow
                            </h4>
                            <ol
                              class="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                            >
                              <li>
                                1. <strong>Start with WAVE</strong> - Visual
                                identification
                              </li>
                              <li>
                                2. <strong>Use Pa11y</strong> - Technical
                                validation
                              </li>
                              <li>
                                3. <strong>Check Lighthouse</strong> -
                                Performance impact
                              </li>
                              <li>
                                4. <strong>Verify with IBM A11y</strong> - Final
                                compliance
                              </li>
                            </ol>
                          </div>
                          <div
                            class="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <h4
                              class="font-medium text-gray-900 dark:text-white mb-2"
                            >
                              ⚡ Quick Assessment
                            </h4>
                            <ol
                              class="text-sm text-gray-700 dark:text-gray-300 space-y-1"
                            >
                              <li>
                                1. <strong>WAVE + Lighthouse</strong> - Fast
                                overview
                              </li>
                              <li>2. Great for initial assessments</li>
                              <li>3. Perfect for stakeholder meetings</li>
                              <li>4. Covers visual and performance aspects</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <!-- Advanced Tips -->
                      <div
                        class="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-6"
                      >
                        <div class="flex items-start">
                          <div class="flex-shrink-0">
                            <svg
                              class="h-5 w-5 text-amber-400 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div class="ml-3">
                            <h4
                              class="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2"
                            >
                              🎓 Pro Tips for Tool Usage
                            </h4>
                            <ul
                              class="text-sm text-amber-700 dark:text-amber-300 space-y-1"
                            >
                              <li>
                                • <strong>Start Visual:</strong> Use WAVE first
                                to get familiar with the page's accessibility
                                landscape
                              </li>
                              <li>
                                • <strong>Automate Early:</strong> Integrate
                                Pa11y into your development workflow from day
                                one
                              </li>
                              <li>
                                • <strong>Think Holistically:</strong> Use
                                Lighthouse to understand how accessibility
                                affects overall user experience
                              </li>
                              <li>
                                • <strong>Plan for Scale:</strong> IBM A11y
                                becomes more valuable as your application grows
                                in complexity
                              </li>
                              <li>
                                • <strong>Cross-Reference:</strong> Issues found
                                by multiple tools should be prioritized first
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Understanding Results -->
                  <section id="understanding-results" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      📊 Understanding Results
                    </h2>

                    <div class="space-y-6">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                          class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500"
                        >
                          <h4
                            class="font-semibold text-red-800 dark:text-red-200 flex items-center mb-2"
                          >
                            🚨 Errors
                          </h4>
                          <p class="text-sm text-red-700 dark:text-red-300">
                            Critical issues that must be fixed immediately.
                            These violate accessibility standards and prevent
                            users from accessing content.
                          </p>
                        </div>

                        <div
                          class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500"
                        >
                          <h4
                            class="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center mb-2"
                          >
                            ⚠️ Warnings
                          </h4>
                          <p
                            class="text-sm text-yellow-700 dark:text-yellow-300"
                          >
                            Important issues that should be addressed. May cause
                            difficulties for some users or impact SEO
                            performance.
                          </p>
                        </div>

                        <div
                          class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500"
                        >
                          <h4
                            class="font-semibold text-blue-800 dark:text-blue-200 flex items-center mb-2"
                          >
                            ℹ️ Notices
                          </h4>
                          <p class="text-sm text-blue-700 dark:text-blue-300">
                            Informational items and best practice suggestions
                            for continuous improvement.
                          </p>
                        </div>
                      </div>

                      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          Testing Tools Overview
                        </h3>
                        <div class="space-y-3">
                          <div class="flex items-start space-x-3">
                            <div
                              class="w-2 h-2 bg-blue-500 rounded-full mt-2"
                            ></div>
                            <div>
                              <strong class="text-gray-900 dark:text-white"
                                >WAVE:</strong
                              >
                              <span
                                class="text-gray-700 dark:text-gray-300 ml-2"
                                >Visual accessibility evaluation with detailed
                                explanations</span
                              >
                            </div>
                          </div>
                          <div class="flex items-start space-x-3">
                            <div
                              class="w-2 h-2 bg-green-500 rounded-full mt-2"
                            ></div>
                            <div>
                              <strong class="text-gray-900 dark:text-white"
                                >Pa11y:</strong
                              >
                              <span
                                class="text-gray-700 dark:text-gray-300 ml-2"
                                >Command-line accessibility testing with WCAG
                                compliance focus</span
                              >
                            </div>
                          </div>
                          <div class="flex items-start space-x-3">
                            <div
                              class="w-2 h-2 bg-purple-500 rounded-full mt-2"
                            ></div>
                            <div>
                              <strong class="text-gray-900 dark:text-white"
                                >Lighthouse:</strong
                              >
                              <span
                                class="text-gray-700 dark:text-gray-300 ml-2"
                                >Google's comprehensive audit including
                                performance and SEO</span
                              >
                            </div>
                          </div>
                          <div class="flex items-start space-x-3">
                            <div
                              class="w-2 h-2 bg-orange-500 rounded-full mt-2"
                            ></div>
                            <div>
                              <strong class="text-gray-900 dark:text-white"
                                >IBM A11y:</strong
                              >
                              <span
                                class="text-gray-700 dark:text-gray-300 ml-2"
                                >Enterprise-grade accessibility testing with
                                detailed remediation guidance</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- AI Features -->
                  <section id="ai-features" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      🤖 AI-Powered Features
                    </h2>

                    <div class="space-y-6">
                      <div
                        class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg"
                      >
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          How AI Recommendations Work
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                              <div
                                class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                              >
                                1
                              </div>
                              <p
                                class="text-gray-700 dark:text-gray-300 text-sm"
                              >
                                AI analyzes each issue in the context of your
                                specific website
                              </p>
                            </div>
                            <div class="flex items-start space-x-3">
                              <div
                                class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                              >
                                2
                              </div>
                              <p
                                class="text-gray-700 dark:text-gray-300 text-sm"
                              >
                                Provides clear explanations of why each issue
                                matters
                              </p>
                            </div>
                          </div>
                          <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                              <div
                                class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                              >
                                3
                              </div>
                              <p
                                class="text-gray-700 dark:text-gray-300 text-sm"
                              >
                                Offers step-by-step implementation guidance
                              </p>
                            </div>
                            <div class="flex items-start space-x-3">
                              <div
                                class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                              >
                                4
                              </div>
                              <p
                                class="text-gray-700 dark:text-gray-300 text-sm"
                              >
                                Includes technical terms glossary and related
                                resources
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-blue-800 dark:text-blue-200 mb-2"
                          >
                            🔧 Technical Fixes
                          </h4>
                          <p class="text-sm text-blue-700 dark:text-blue-300">
                            Code examples and implementation details for
                            developers
                          </p>
                        </div>
                        <div
                          class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-green-800 dark:text-green-200 mb-2"
                          >
                            📝 Content Improvements
                          </h4>
                          <p class="text-sm text-green-700 dark:text-green-300">
                            Writing and content structure optimization
                            suggestions
                          </p>
                        </div>
                        <div
                          class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-purple-800 dark:text-purple-200 mb-2"
                          >
                            🎨 Design Enhancements
                          </h4>
                          <p
                            class="text-sm text-purple-700 dark:text-purple-300"
                          >
                            Visual and user experience improvement
                            recommendations
                          </p>
                        </div>
                        <div
                          class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-orange-800 dark:text-orange-200 mb-2"
                          >
                            ⚡ Performance Optimizations
                          </h4>
                          <p
                            class="text-sm text-orange-700 dark:text-orange-300"
                          >
                            Speed and efficiency improvement strategies
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Settings -->
                  <section id="settings" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      ⚙️ Settings & Configuration
                    </h2>

                    <div class="space-y-6">
                      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                        >
                          API Configuration
                        </h3>
                        <div class="space-y-4">
                          <div
                            class="border border-gray-200 dark:border-gray-600 p-4 rounded-lg"
                          >
                            <h4
                              class="font-semibold text-gray-900 dark:text-white mb-2"
                            >
                              WAVE API Key
                            </h4>
                            <p
                              class="text-gray-600 dark:text-gray-400 text-sm mb-2"
                            >
                              Required for WAVE accessibility testing
                            </p>
                            <a
                              href="https://wave.webaim.org/api/"
                              target="_blank"
                              class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                              Get your free API key →
                            </a>
                          </div>
                          <div
                            class="border border-gray-200 dark:border-gray-600 p-4 rounded-lg"
                          >
                            <h4
                              class="font-semibold text-gray-900 dark:text-white mb-2"
                            >
                              Gemini AI API Key
                            </h4>
                            <p
                              class="text-gray-600 dark:text-gray-400 text-sm mb-2"
                            >
                              Required for AI-powered recommendations
                            </p>
                            <a
                              href="https://makersuite.google.com/app/apikey"
                              target="_blank"
                              class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                              Get your API key from Google AI Studio →
                            </a>
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                      >
                        <h4
                          class="font-semibold text-blue-800 dark:text-blue-200 mb-2"
                        >
                          Display Preferences
                        </h4>
                        <ul
                          class="text-sm text-blue-700 dark:text-blue-300 space-y-1"
                        >
                          <li>
                            • <strong>Theme:</strong> Switch between light and
                            dark modes
                          </li>
                          <li>
                            • <strong>Visual Reports:</strong> Enable/disable
                            embedded WAVE visual reports
                          </li>
                          <li>
                            • <strong>History Tracking:</strong> Control whether
                            scans are saved to history
                          </li>
                          <li>
                            • <strong>Advanced Options:</strong> Show/hide
                            advanced configuration options
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <!-- Troubleshooting -->
                  <section id="troubleshooting" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      🔧 Troubleshooting
                    </h2>

                    <div class="space-y-4">
                      <div
                        class="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                      >
                        <h4
                          class="font-semibold text-red-800 dark:text-red-200 mb-2"
                        >
                          ❌ Scan Failed or Timed Out
                        </h4>
                        <div
                          class="text-sm text-red-700 dark:text-red-300 space-y-2"
                        >
                          <p>
                            <strong>Common causes:</strong> Website down,
                            incorrect URL, blocked automated tools, network
                            issues
                          </p>
                          <p>
                            <strong>Solutions:</strong> Verify URL, try
                            different page, check website accessibility, wait
                            and retry
                          </p>
                        </div>
                      </div>

                      <div
                        class="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
                      >
                        <h4
                          class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2"
                        >
                          ⚠️ Missing API Key Errors
                        </h4>
                        <div
                          class="text-sm text-yellow-700 dark:text-yellow-300"
                        >
                          <p>
                            <strong>Solution:</strong> Configure your API keys
                            in the Settings section for WAVE and Gemini AI
                            services
                          </p>
                        </div>
                      </div>

                      <div
                        class="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                      >
                        <h4
                          class="font-semibold text-blue-800 dark:text-blue-200 mb-2"
                        >
                          ℹ️ Slow Performance
                        </h4>
                        <div class="text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            <strong>Tips:</strong> Select fewer tools, disable
                            visual reports, test smaller pages, clear browser
                            cache
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Best Practices -->
                  <section id="best-practices" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      💡 Best Practices
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-4">
                        <div
                          class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-green-800 dark:text-green-200 mb-2"
                          >
                            🎯 Testing Strategy
                          </h4>
                          <ul
                            class="text-sm text-green-700 dark:text-green-300 space-y-1"
                          >
                            <li>• Test key pages regularly</li>
                            <li>
                              • Use multiple tools for comprehensive coverage
                            </li>
                            <li>• Test after major updates</li>
                            <li>• Monitor trends over time</li>
                          </ul>
                        </div>

                        <div
                          class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-blue-800 dark:text-blue-200 mb-2"
                          >
                            📊 Result Analysis
                          </h4>
                          <ul
                            class="text-sm text-blue-700 dark:text-blue-300 space-y-1"
                          >
                            <li>• Prioritize errors over warnings</li>
                            <li>• Focus on high-impact issues first</li>
                            <li>• Use AI recommendations for guidance</li>
                            <li>• Track improvement over time</li>
                          </ul>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div
                          class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-purple-800 dark:text-purple-200 mb-2"
                          >
                            🔄 Workflow Integration
                          </h4>
                          <ul
                            class="text-sm text-purple-700 dark:text-purple-300 space-y-1"
                          >
                            <li>• Include in development process</li>
                            <li>• Set up regular scanning schedule</li>
                            <li>• Share results with team</li>
                            <li>• Document improvements made</li>
                          </ul>
                        </div>

                        <div
                          class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg"
                        >
                          <h4
                            class="font-semibold text-orange-800 dark:text-orange-200 mb-2"
                          >
                            ⚡ Performance Tips
                          </h4>
                          <ul
                            class="text-sm text-orange-700 dark:text-orange-300 space-y-1"
                          >
                            <li>• Start with fewer tools for speed</li>
                            <li>• Test during off-peak hours</li>
                            <li>• Use saved reports for comparison</li>
                            <li>• Export data for external analysis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- FAQ -->
                  <section id="faq" class="mb-12">
                    <h2
                      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                    >
                      ❓ Frequently Asked Questions
                    </h2>

                    <div class="space-y-4">
                      <div
                        class="border-b border-gray-200 dark:border-gray-600 pb-4"
                      >
                        <h4
                          class="font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          Q: How accurate are the accessibility test results?
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                          A: The dashboard uses industry-standard tools that
                          catch about 30-40% of accessibility issues. Manual
                          testing is still recommended for comprehensive audits.
                        </p>
                      </div>

                      <div
                        class="border-b border-gray-200 dark:border-gray-600 pb-4"
                      >
                        <h4
                          class="font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          Q: Can I test password-protected websites?
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                          A: Currently, only publicly accessible websites can be
                          tested. For internal sites, make them temporarily
                          accessible or use tools locally.
                        </p>
                      </div>

                      <div
                        class="border-b border-gray-200 dark:border-gray-600 pb-4"
                      >
                        <h4
                          class="font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          Q: How often should I run scans?
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                          A: Run scans after significant changes and at least
                          monthly for active websites. For development, consider
                          scanning with each deployment.
                        </p>
                      </div>

                      <div
                        class="border-b border-gray-200 dark:border-gray-600 pb-4"
                      >
                        <h4
                          class="font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          Q: Are my scan results stored securely?
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                          A: Results are stored locally in your browser. No data
                          is sent to external servers except for API calls to
                          testing services.
                        </p>
                      </div>

                      <div class="pb-4">
                        <h4
                          class="font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          Q: What browsers are supported?
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">
                          A: Works best in modern browsers (Chrome, Firefox,
                          Safari, Edge). Some features may not work in older
                          versions.
                        </p>
                      </div>
                    </div>
                  </section>

                  <!-- Footer -->
                  <div
                    class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
                  >
                    <div
                      class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg"
                    >
                      <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                      >
                        Need More Help?
                      </h3>
                      <p class="text-gray-600 dark:text-gray-400 mb-4">
                        This dashboard is designed to make web accessibility and
                        SEO testing accessible to everyone.
                      </p>
                      <div class="flex justify-center space-x-4 text-sm">
                        <span class="text-gray-500 dark:text-gray-400"
                          >Made with ❤️ for better web accessibility</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="currentView === 'combined-dashboard'">
            <CombinedDashboard
              :seo-results="seoAnalysisResults"
              :accessibility-results="results"
              :accessibility-summary="accessibilitySummary"
              :seo-summary="seoSummary"
            />
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
import AccessibilityAnalysis from "./components/AccessibilityAnalysis.vue";
import SEOAnalysis from "./pages/seo-analysis.vue";
import { nanoid } from "nanoid/non-secure";
import CombinedDashboard from "./pages/combined-dashboard.vue";
import type { SEOAnalysis as SEOAnalysisType } from "./utils/seo/SEOAnalyzer";

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
  isLoadingAI?: boolean;
  aiRecommendations?: {
    explanation: string;
    recommendations: string[];
    technicalTerms: {
      term: string;
      definition: string;
    }[];
    relatedLinks?: {
      title: string;
      url: string;
      description: string;
    }[];
  };
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
const selectedTools = ref<string[]>([]);
const includeVisualReport = ref(true);
const includeHistory = ref(true);
const isLoading = ref(false);
const error = ref("");
const results = ref<Issue[]>([]);
const scanCompleted = ref(false);
const currentView = ref("dashboard");
const visualReport = ref(false);
const waveReportUrl = ref("");
const filterSource = ref("all");
const filterType = ref("all");
const isMobileMenuOpen = ref(false);
const expandedDetails = ref<number[]>([]);
const expandedGroups = ref<string[]>([]);
const showTechDetails = ref<number[]>([]);
const recentScans = ref<string[]>([]);
const savedReports = ref<ScanSummary[]>([]);
const defaultTools = ["wave", "pa11y", "lighthouse", "ibm-a11y"];
const analysisTypes = ref({
  accessibility: true,
  seo: true,
});
const analysisComplete = ref(false);
const seoAnalysisResults = ref<SEOAnalysisType | null>(null);
const analysisProgress = ref({
  overall: 0,
  accessibility: {
    total: 0,
    completed: 0,
    currentTool: "",
    status: "",
  },
  seo: {
    total: 0,
    completed: 0,
    currentStep: "",
    status: "",
  },
});
const availableTools = [
  { id: "pa11y", name: "Pa11y" },
  { id: "wave", name: "WAVE" },
  { id: "lighthouse", name: "Lighthouse" },
  { id: "ibm-a11y", name: "IBM A11y" },
];
const settings = ref({
  waveApiKey: "",
  // Add other settings as needed
});
const showAdvancedOptions = ref(false);
const targetUrl = ref("");
const selectedGoal = ref("");

// Add this function to safely access localStorage
function getLocalStorage(key: string, defaultValue: string = ""): string {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (err) {
      console.error("Error accessing localStorage:", err);
      return defaultValue;
    }
  }
  return defaultValue;
}

// Add this function to safely set localStorage
function setLocalStorage(key: string, value: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error("Error setting localStorage:", err);
    }
  }
}

// Update the onMounted section
onMounted(() => {
  // Initialize with default tools
  selectedTools.value = [...defaultTools];

  // Load settings
  settings.value.waveApiKey = getLocalStorage("waveApiKey");

  // Load recent scans
  try {
    const storedScans = JSON.parse(getLocalStorage("recentScans", "[]"));
    recentScans.value = storedScans;
  } catch (err) {
    console.error("Error loading recent scans:", err);
  }

  // Load saved reports
  loadSavedReports();
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
function handleNavigation(view: string) {
  // Reset mobile menu if open
  isMobileMenuOpen.value = false;

  // Handle specific views
  if (view === "saved-reports") {
    loadSavedReports();
  } else if (view === "dashboard") {
    // Reset analysis states when going back to dashboard
    scanCompleted.value = false;
    analysisComplete.value = false;
    error.value = "";
    // Clear the results
    results.value = [];
    seoAnalysisResults.value = null;
  } else if (view === "combined-dashboard") {
    // Load the latest analysis results if available
    const latestAnalysis = localStorage.getItem("latestAnalysis");
    if (latestAnalysis) {
      try {
        const parsed = JSON.parse(latestAnalysis);
        // Update the reactive state
        url.value = parsed.url || "";
        results.value = parsed.accessibilityResults || [];
        seoAnalysisResults.value = parsed.seoResults || null;
        // Update the summaries through their setters if they exist
        if (parsed.accessibilitySummary) {
          Object.assign(
            accessibilitySummary.value,
            parsed.accessibilitySummary
          );
        }
        if (parsed.seoSummary) {
          Object.assign(seoSummary.value, parsed.seoSummary);
        }
      } catch (error) {
        console.error("Error loading latest analysis:", error);
      }
    }
  }

  // Update the current view
  currentView.value = view;

  // Scroll to top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle rescan request from HistoryTracking component
function handleRescan(rescanUrl: string) {
  url.value = rescanUrl;
  currentView.value = "dashboard";
  // Reset states
  results.value = [];
  scanCompleted.value = false;
  analysisComplete.value = false;
  error.value = "";
  // Run the analysis
  runAnalyses();
}

// Toggle individual issue details
async function toggleDetails(issueGlobalIndex: number) {
  const position = expandedDetails.value.indexOf(issueGlobalIndex);
  if (position === -1) {
    expandedDetails.value.push(issueGlobalIndex);
    const techPos = showTechDetails.value.indexOf(issueGlobalIndex);
    if (techPos !== -1) {
      showTechDetails.value.splice(techPos, 1);
    }

    // Fetch AI recommendations if not already present
    const issue = results.value[issueGlobalIndex];
    if (!issue.aiRecommendations) {
      issue.isLoadingAI = true;
      try {
        const recommendations = await getAIRecommendations(issue);
        if (recommendations) {
          issue.aiRecommendations = recommendations;
        }
      } finally {
        issue.isLoadingAI = false;
      }
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
  results.value.some((issue) => issue.source === "lighthouse")
);

const hasIbmA11yIssues = computed(() =>
  results.value.some((issue) => issue.source === "ibm-a11y")
);

// Watch for changes in currentView
watch(currentView, (newView) => {
  if (newView === "accessibility-analysis" && results.value.length > 0) {
    // If we have results, show them in the analysis view
    scanCompleted.value = true;
  }
});

// Run an accessibility scan
async function runAnalyses() {
  if (!url.value) return;
  if (!analysisTypes.value.accessibility && !analysisTypes.value.seo) return;

  isLoading.value = true;
  error.value = "";
  analysisComplete.value = false;
  results.value = [];
  scanCompleted.value = false;
  visualReport.value = true;
  waveReportUrl.value = "";

  // Reset progress
  analysisProgress.value = {
    overall: 0,
    accessibility: {
      total: analysisTypes.value.accessibility ? selectedTools.value.length : 0,
      completed: 0,
      currentTool: "",
      status: "Initializing...",
    },
    seo: {
      total: analysisTypes.value.seo ? 4 : 0,
      completed: 0,
      currentStep: "",
      status: "Initializing...",
    },
  };

  try {
    // Format URL
    let formattedUrl = url.value.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }
    url.value = formattedUrl;

    // Prepare scan promises
    const scanPromises: Promise<any>[] = [];

    // Accessibility analysis (if selected)
    if (analysisTypes.value.accessibility && selectedTools.value.length > 0) {
      if (selectedTools.value.includes("wave") && visualReport.value) {
        waveReportUrl.value = `https://wave.webaim.org/report#/${encodeURIComponent(
          formattedUrl
        )}`;
      }
      // Run each selected tool in parallel
      const accessibilityPromises = selectedTools.value.map(async (tool) => {
        try {
          analysisProgress.value.accessibility.currentTool = tool;
          analysisProgress.value.accessibility.status = `Running ${tool} analysis...`;

          let toolResults;
          if (tool === "pa11y") {
            toolResults = await runPa11yScan();
          } else if (tool === "wave") {
            toolResults = await runWaveScan();
          } else if (tool === "lighthouse") {
            toolResults = await runLighthouseScan();
          } else if (tool === "ibm-a11y") {
            toolResults = await runIbmA11yScan();
          }

          if (toolResults) {
            results.value.push(...toolResults);
          }
        } catch (toolError: any) {
          console.error(`${tool} scan error:`, toolError);
          error.value += `\n${tool} scan failed: ${
            toolError.message || "Unknown error"
          }`;
        } finally {
          analysisProgress.value.accessibility.completed++;
          updateOverallProgress();
        }
      });
      scanPromises.push(
        Promise.allSettled(accessibilityPromises).then(() => {
          analysisProgress.value.accessibility.status =
            "Accessibility analysis complete";
          if (includeHistory.value) {
            saveToRecentScans(url.value);
          }
          scanCompleted.value = true;
        })
      );
    }

    // SEO analysis (if selected)
    if (analysisTypes.value.seo) {
      scanPromises.push(runSEOAnalysis());
    }

    // Wait for all selected analyses to complete
    await Promise.allSettled(scanPromises);
    analysisComplete.value = true;
    analysisProgress.value.overall = 100;
  } catch (err: any) {
    console.error("Analysis error:", err);
    error.value = err.message || "An error occurred during analysis";
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      document
        .querySelector("#results-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

// Add this helper function
function updateOverallProgress() {
  const totalSteps =
    (analysisTypes.value.accessibility
      ? analysisProgress.value.accessibility.total
      : 0) + (analysisTypes.value.seo ? analysisProgress.value.seo.total : 0);

  const completedSteps =
    analysisProgress.value.accessibility.completed +
    analysisProgress.value.seo.completed;

  analysisProgress.value.overall = Math.round(
    (completedSteps / totalSteps) * 100
  );
}

// Update the runPa11yScan function to return results
async function runPa11yScan() {
  try {
    console.log("Running Pa11y scan on:", url.value);
    const response = await axios.post("/api/pa11y", {
      url: url.value,
      standard: "WCAG2AA",
      includeNotices: true,
      includeWarnings: true,
      timeout: 30000,
    });

    if (response.data?.pages?.[0]?.issues) {
      return response.data.pages[0].issues.map((issue: any) => ({
        ...issue,
        source: "pa11y",
      }));
    } else {
      throw new Error("Invalid response format from Pa11y API");
    }
  } catch (err: any) {
    console.error("Pa11y scan error:", err);
    throw new Error(
      err.response?.data?.error || err.message || "Pa11y scan failed"
    );
  }
}

// Update the runWaveScan function to return results
async function runWaveScan() {
  try {
    console.log("Running WAVE scan on:", url.value);
    const response = await axios.post("/api/wave", {
      url: url.value,
      apiKey: settings.value.waveApiKey,
    });

    // Check for different possible response formats
    if (response.data) {
      let issues = [];

      // Handle different WAVE API response formats
      if (response.data.issues) {
        // Direct issues array
        issues = response.data.issues;
      } else if (response.data.categories) {
        // Grouped by categories
        Object.values(response.data.categories).forEach((category: any) => {
          if (category.items) {
            issues = issues.concat(category.items);
          }
        });
      } else if (response.data.summary) {
        // Summary format with nested issues
        if (response.data.summary.errors) {
          issues = issues.concat(
            response.data.summary.errors.map((error: any) => ({
              ...error,
              type: "error",
            }))
          );
        }
        if (response.data.summary.warnings) {
          issues = issues.concat(
            response.data.summary.warnings.map((warning: any) => ({
              ...warning,
              type: "warning",
            }))
          );
        }
        if (response.data.summary.notices) {
          issues = issues.concat(
            response.data.summary.notices.map((notice: any) => ({
              ...notice,
              type: "notice",
            }))
          );
        }
      }

      if (issues.length > 0) {
        return issues.map((issue: any) => ({
          type: issue.type || "notice",
          code: issue.code || issue.id || "WAVE-UNKNOWN",
          message: issue.message || issue.description || "No message provided",
          context: issue.context || issue.html || "",
          source: "wave",
          selector: issue.selector || "",
          detail: issue.detail || issue.explanation || "",
        }));
      } else {
        console.log("WAVE scan completed with no issues found");
        return [];
      }
    } else {
      throw new Error("Empty response from WAVE API");
    }
  } catch (err: any) {
    console.error("WAVE scan error:", err);
    if (err.response?.data?.error) {
      throw new Error(`WAVE scan failed: ${err.response.data.error}`);
    } else if (err.message) {
      throw new Error(`WAVE scan failed: ${err.message}`);
    } else {
      throw new Error("WAVE scan failed: Unknown error");
    }
  }
}

// Update the runLighthouseScan function to return results
async function runLighthouseScan() {
  try {
    console.log("Running Lighthouse scan on:", url.value);
    const response = await axios.post("/api/lighthouse", {
      url: url.value,
      categories: ["accessibility"],
    });

    if (response.data?.audits) {
      return response.data.audits
        .filter((audit: any) => audit.score !== null && audit.score < 1)
        .map((audit: any) => ({
          type: audit.score === 0 ? "error" : "warning",
          code: audit.id,
          message: audit.title,
          context: audit.description,
          source: "lighthouse",
          selector: audit.selector,
          detail: audit.explanation,
        }));
    } else {
      throw new Error("Invalid response format from Lighthouse API");
    }
  } catch (err: any) {
    console.error("Lighthouse scan error:", err);
    throw new Error(
      err.response?.data?.error || err.message || "Lighthouse scan failed"
    );
  }
}

// Update the runIbmA11yScan function to return results
async function runIbmA11yScan() {
  try {
    console.log("Running IBM Accessibility Checker scan on:", url.value);
    const response = await axios.post("/api/ibm-a11y", {
      url: url.value,
    });

    if (response.data?.issues) {
      return response.data.issues.map((issue: any) => ({
        ...issue,
        source: "ibm-a11y",
      }));
    } else {
      throw new Error("Invalid response format from IBM A11y API");
    }
  } catch (err: any) {
    console.error("IBM A11y scan error:", err);
    throw new Error(
      err.response?.data?.error || err.message || "IBM A11y scan failed"
    );
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
    setLocalStorage("recentScans", JSON.stringify(newScans));
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
      id: nanoid(),
      date: new Date().toISOString(),
      url: scannedUrl,
      errors: errorCount.value,
      warnings: warningCount.value,
      notices: noticeCount.value,
      tools: selectedTools.value,
      issues: results.value.map((issue: Issue) => ({
        type: issue.type,
        code: issue.code,
        message: issue.message,
        source: issue.source,
        context: issue.context ?? undefined,
        selector: issue.selector,
      })),
      pageTitle: typeof document !== "undefined" ? document.title : undefined,
      timestamp: Date.now(),
      scanDuration: Math.floor(1000 + Math.random() * 4000),
      toolVersions: {
        pa11y: selectedTools.value.includes("pa11y") ? "6.1.0" : null,
        wave: selectedTools.value.includes("wave") ? "3.1.2" : null,
        lighthouse: selectedTools.value.includes("lighthouse")
          ? "10.0.0"
          : null,
        "ibm-a11y": selectedTools.value.includes("ibm-a11y") ? "4.0.0" : null,
      },
    };

    // Get existing history
    let scanHistory: ScanSummary[] = [];
    try {
      scanHistory = JSON.parse(getLocalStorage("scanHistory", "[]"));
    } catch (e) {
      console.error("Error processing scan history:", e);
      scanHistory = [];
    }

    // Add new scan to history
    scanHistory.push(scanSummary);

    // Limit history size
    if (scanHistory.length > 100) {
      scanHistory = scanHistory.slice(-100);
    }

    // Save updated history
    setLocalStorage("scanHistory", JSON.stringify(scanHistory));
    console.log("Saved full scan data to history:", scanSummary);

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
  try {
    // Save WAVE API key
    setLocalStorage("waveApiKey", settings.value.waveApiKey);
    // Add other settings as needed
    console.log("Settings saved successfully");
  } catch (err) {
    console.error("Error saving settings:", err);
  }
}

// Load saved reports from localStorage
function loadSavedReports() {
  try {
    const savedHistory = getLocalStorage("scanHistory");
    if (savedHistory) {
      savedReports.value = JSON.parse(savedHistory);
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
        isLink: false,
      });
    }
    // Add the URL
    parts.push({
      text: match[0],
      isLink: true,
    });
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isLink: false,
    });
  }

  return parts;
}

function shortenUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== "/" ? urlObj.pathname : "");
  } catch {
    return url;
  }
}

// Add this function after the existing functions
async function getAIRecommendations(issue: Issue) {
  try {
    const response = await axios.post("/api/gemini", {
      issue: {
        type: issue.type,
        message: issue.message,
        context: issue.context,
        detail: issue.detail,
        source: issue.source,
      },
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format from AI API");
    }
  } catch (err: any) {
    console.error("Error getting AI recommendations:", err);
    throw new Error(
      err.response?.data?.error ||
        err.message ||
        "Failed to get AI recommendations"
    );
  }
}

// Update the runSEOAnalysis function
async function runSEOAnalysis() {
  try {
    analysisProgress.value.seo.currentStep = "all";
    analysisProgress.value.seo.status = "Analyzing SEO...";

    const response = await fetch("/api/seo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to analyze SEO");
    }

    const data = await response.json();
    seoAnalysisResults.value = data;
    analysisProgress.value.seo.completed = 1;
    analysisProgress.value.seo.status = "SEO analysis complete";
    updateOverallProgress();
    return data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to complete SEO analysis");
  }
}

// Update the navigateToAnalysis function
function navigateToAnalysis(type: "accessibility" | "seo" | "combined") {
  if (type === "accessibility") {
    if (!results.value.length) {
      console.error("No accessibility results available");
      return;
    }
    currentView.value = "accessibility-analysis";
  } else if (type === "seo") {
    if (!url.value || !seoAnalysisResults.value) {
      console.error("Missing URL or SEO analysis results");
      return;
    }
    currentView.value = "seo-analysis";
  } else if (type === "combined") {
    if (!url.value || (!results.value.length && !seoAnalysisResults.value)) {
      console.error("No analysis results available");
      return;
    }
    currentView.value = "combined-dashboard";
    // Store the results in localStorage for the combined dashboard
    const combinedResults = {
      url: url.value,
      seoResults: seoAnalysisResults.value,
      accessibilityResults: results.value,
      accessibilitySummary: accessibilitySummary.value,
      seoSummary: seoSummary.value,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("latestAnalysis", JSON.stringify(combinedResults));
  }
}

const accessibilitySummary = computed({
  get: () => {
    const contrastIssues = results.value.filter(
      (issue) => issue.code && issue.code.toLowerCase().includes("contrast")
    ).length;
    const focusIssues = results.value.filter(
      (issue) => issue.code && issue.code.toLowerCase().includes("focus")
    ).length;
    const nonTextIssues = results.value.filter(
      (issue) =>
        issue.code &&
        (issue.code.toLowerCase().includes("alt") ||
          issue.code.toLowerCase().includes("non-text"))
    ).length;
    const labelIssues = results.value.filter(
      (issue) => issue.code && issue.code.toLowerCase().includes("label")
    ).length;

    return {
      errorCount: errorCount.value,
      warningCount: warningCount.value,
      noticeCount: noticeCount.value,
      contrastIssues,
      focusIssues,
      nonTextIssues,
      labelIssues,
      totalIssues: results.value.length,
    };
  },
  set: (newValue) => {
    // Allow setting the summary if needed
    if (newValue) {
      Object.assign(accessibilitySummary.value, newValue);
    }
  },
});

const seoSummary = computed({
  get: () => {
    if (!seoAnalysisResults.value) return {};
    return {
      performance: seoAnalysisResults.value.performance,
      language: seoAnalysisResults.value.language,
      improvement: seoAnalysisResults.value.improvement,
      metrics: seoAnalysisResults.value.metrics,
    };
  },
  set: (newValue) => {
    // Allow setting the summary if needed
    if (newValue) {
      Object.assign(seoSummary.value, newValue);
    }
  },
});

// Function to set scan completed and target URL
function setScanCompleted(url: string) {
  scanCompleted.value = true;
  targetUrl.value = url;
}

// Helper function for the tool recommendation engine
function getGoalName(goal: string): string {
  const goalNames: { [key: string]: string } = {
    presentation: "Client Presentations",
    development: "Development Automation",
    compliance: "Legal Compliance",
    performance: "Performance Optimization",
    education: "Learning & Training",
    enterprise: "Enterprise Testing",
  };
  return goalNames[goal] || goal;
}

// Expose the function to child components
defineExpose({ setScanCompleted });
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
}

/* Modern Scrollbar Styles */
::-webkit-scrollbar {
  width: 10px;
  background: #232b62;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3c585e 0%, #232b62 100%);
  border-radius: 8px;
  border: 2px solid #232b62;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #232b62 0%, #3c585e 100%);
}
::-webkit-scrollbar-corner {
  background: #232b62;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #3c585e #232b62;
}
</style>
