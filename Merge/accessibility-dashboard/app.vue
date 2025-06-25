<template>
  <div class="min-h-screen bg-[linear-gradient(90deg,_#3C585E_0%,_#232B62_100%)] text-gray-900 dark:text-gray-100">
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
                <section class="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto rounded-2xl shadow-xl p-8 relative z-10">
                  <!-- Left: Text and Form -->
                  <div class="flex-1 max-w-xl text-left">
                    <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4">
                      Welcome to The Cre8ion Lab!
                    </h1>
                    <h2 class="text-3xl font-bold text-white mb-4">
                      Manage your website's SEO and Accessibility metrics Easily!
                    </h2>
                    <p class="text-lg text-blue-100 mb-8 max-w-lg">
                      Our dashboard will help you get all the analytics that you
                      need to improve the SEO and Accessibility of your website.
                      Just enter the website link below, and let us explore the
                      results together!
                    </p>
                    <!-- Scan Form (preserve all logic) -->
                    <div class="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow p-6 w-full">
                      <form @submit.prevent="runScan" class="space-y-4">
                        <div>
                          <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
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
                              :disabled="isLoading || !url || (!analysisTypes.accessibility && !analysisTypes.seo)"
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
                          <label for="advanced-options" class="text-xs text-gray-600 dark:text-gray-300 cursor-pointer">Advanced Options</label>
                        </div>
                        <!-- Advanced Options Section (conditionally shown) -->
                        <div v-if="showAdvancedOptions" class="space-y-4 border-t pt-4 mt-2">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis Types</label>
                            <div class="space-y-2">
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="analysisTypes.accessibility"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span class="text-sm text-gray-700 dark:text-gray-300">Accessibility Analysis</span>
                              </label>
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="analysisTypes.seo"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span class="text-sm text-gray-700 dark:text-gray-300">SEO Analysis</span>
                              </label>
                            </div>
                          </div>
                          <div v-if="analysisTypes.accessibility" class="space-y-4">
                            <div>
                              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accessibility Tools</label>
                              <div class="space-y-2">
                                <label v-for="tool in availableTools" :key="tool.id" class="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    :value="tool.id"
                                    v-model="selectedTools"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                    :disabled="isLoading"
                                  />
                                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ tool.name }}</span>
                                </label>
                              </div>
                            </div>
                            
                            <!-- Multi-Page Crawling Option -->
                            <div class="space-y-3">
                              <label class="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  v-model="enableCrawling"
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  :disabled="isLoading"
                                />
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable multi-page crawling</span>
                              </label>
                              
                              <div v-if="enableCrawling" class="ml-6">
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                  Will automatically discover and analyze up to 20 pages from your website. This may take several minutes.
                                </p>
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
                                <span class="text-sm text-gray-700 dark:text-gray-300">Include Visual Report</span>
                              </label>
                              
                              <!-- WAVE API Key Warning -->
                              <div v-if="!settings.waveApiKey || settings.waveApiKey.trim() === ''" class="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                                <div class="flex items-start">
                                  <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <div>
                                    <p class="text-sm text-yellow-800 dark:text-yellow-200">
                                      <strong>WAVE API Key Required:</strong> You need to configure your WAVE API key in Settings to use WAVE testing.
                                    </p>
                                    <button 
                                      @click="currentView = 'settings'" 
                                      class="mt-1 text-sm text-yellow-700 dark:text-yellow-300 underline hover:no-underline"
                                    >
                                      Go to Settings
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <!-- HERO SECTION FULL WIDTH BACKGROUND END -->

            <!-- Loading State -->
            <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ enableCrawling ? 'Multi-Page Analysis in Progress' : 'Analysis in Progress' }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {{ enableCrawling ? `Scanning page ${scannedPages} of up to 20...` : 'Please wait while we analyze your website...' }}
                  </p>
                  
                  <!-- Multi-page progress bar -->
                  <div v-if="enableCrawling" class="mb-4">
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Page Progress</span>
                      <span>{{ scannedPages }}/20</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" :style="{ width: `${(scannedPages / 20) * 100}%` }"></div>
                    </div>
                  </div>
                  
                  <!-- Overall progress bar -->
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: `${analysisProgress.overall}%` }"></div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    Overall Progress: {{ analysisProgress.overall }}%
                  </p>
                  <p v-if="enableCrawling" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    This may take a few minutes depending on the number of pages...
                  </p>
                  
                  <!-- Detailed progress for accessibility -->
                  <div v-if="analysisTypes.accessibility" class="space-y-4 mt-6">
                    <div class="space-y-2">
                      <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Accessibility Analysis</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ analysisProgress.accessibility.completed }}/{{ analysisProgress.accessibility.total }} tools
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${(analysisProgress.accessibility.completed / analysisProgress.accessibility.total) * 100}%` }"></div>
                      </div>
                      <p v-if="analysisProgress.accessibility.currentTool" class="text-xs text-gray-500 dark:text-gray-400">
                        Current: {{ analysisProgress.accessibility.currentTool }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Detailed progress for SEO -->
                  <div v-if="analysisTypes.seo" class="space-y-4 mt-6">
                    <div class="space-y-2">
                      <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Analysis</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ analysisProgress.seo.completed }}/{{ analysisProgress.seo.total }} steps
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-green-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${(analysisProgress.seo.completed / analysisProgress.seo.total) * 100}%` }"></div>
                      </div>
                      <p v-if="analysisProgress.seo.currentStep" class="text-xs text-gray-500 dark:text-gray-400">
                        Current: {{ analysisProgress.seo.currentStep }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Results Section -->
            <div v-if="scanCompleted" class="mt-8">
              <!-- Dashboard Selection Buttons -->
              <div class="max-w-4xl mx-auto">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                  Choose Your Dashboard View
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- SEO Dashboard Button -->
                  <div v-if="seoAnalysisResults" class="group">
                    <button
                      @click="currentView = 'seo-analysis'"
                      class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:scale-105"
                    >
                      <div class="text-center">
                        <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400 transition-colors">
                          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">SEO Analysis</h3>
                        <p class="text-blue-100 text-sm mb-4">
                          View detailed SEO metrics, performance scores, and optimization recommendations
                        </p>
                        <div class="flex items-center justify-center space-x-4 text-xs text-blue-200">
                          <span class="flex items-center">
                            <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            Performance
                          </span>
                          <span class="flex items-center">
                            <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                            SEO Score
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  <!-- Accessibility Dashboard Button -->
                  <div v-if="results.length > 0" class="group">
                    <button
                      @click="currentView = 'accessibility-analysis'"
                      class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:scale-105"
                    >
                      <div class="text-center">
                        <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-400 transition-colors">
                          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">Accessibility Analysis</h3>
                        <p class="text-purple-100 text-sm mb-4">
                          Review accessibility issues, compliance status, and improvement suggestions
                        </p>
                        <div class="flex items-center justify-center space-x-4 text-xs text-purple-200">
                          <span class="flex items-center">
                            <span class="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                            {{ results.filter(r => r.type === 'error').length }} Errors
                          </span>
                          <span class="flex items-center">
                            <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                            {{ results.filter(r => r.type === 'warning').length }} Warnings
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  <!-- Combined Dashboard Button -->
                  <div v-if="seoAnalysisResults && results.length > 0" class="group">
                    <button
                      @click="currentView = 'combined-dashboard'"
                      class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group-hover:scale-105"
                    >
                      <div class="text-center">
                        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">Combined Dashboard</h3>
                        <p class="text-blue-100 text-sm mb-4">
                          Comprehensive view with both SEO and accessibility metrics in one dashboard
                        </p>
                        <div class="flex items-center justify-center space-x-4 text-xs text-blue-200">
                          <span class="flex items-center">
                            <span class="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                            SEO + A11y
                          </span>
                          <span class="flex items-center">
                            <span class="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                            Unified View
                          </span>
                        </div>
                      </div>
                    </button>
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
              :analyzed-url="url"
            />
          </div>

          <div v-else-if="currentView === 'seo-analysis'">
            <SEOAnalysis 
              :url="url" 
              :initial-analysis="seoAnalysisResults" 
              @back-to-dashboard="currentView = 'dashboard'"
            />
          </div>

          <div v-else-if="currentView === 'accessibility-analysis'">
            <div class="max-w-7xl mx-auto">
              <div class="mb-6">
                <button
                  @click="currentView = 'dashboard'"
                  class="flex items-center text-white hover:text-purple-200 transition-colors mb-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
                <h1 class="text-3xl font-bold text-white">Accessibility Analysis Results</h1>
                <p class="text-purple-100 mt-2">Accessibility issues and compliance recommendations</p>
              </div>
              <AccessibilityAnalysis 
                :results="results" 
                :selectedTools="selectedTools"
                :scanCompleted="scanCompleted"
                :visualReport="visualReport"
                :waveReportUrl="waveReportUrl"
                :isLoading="isLoading"
              />
            </div>
          </div>

          <div v-else-if="currentView === 'settings'">
            <div class="max-w-7xl mx-auto">
              <div class="mb-6">
                <button
                  @click="currentView = 'dashboard'"
                  class="flex items-center text-white hover:text-blue-200 transition-colors mb-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
                <h1 class="text-3xl font-bold text-white">Settings</h1>
                <p class="text-blue-100 mt-2">Configure your dashboard settings</p>
              </div>
              <Settings />
            </div>
          </div>

          <div v-else-if="currentView === 'help'">
            <div class="max-w-7xl mx-auto">
              <div class="mb-6">
                <button
                  @click="currentView = 'dashboard'"
                  class="flex items-center text-white hover:text-green-200 transition-colors mb-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
                <h1 class="text-3xl font-bold text-white">Help & Support</h1>
                <p class="text-green-100 mt-2">Get help and learn how to use the dashboard</p>
              </div>
              <Help />
            </div>
          </div>

          <div v-else-if="currentView === 'saved-reports'">
            <div class="max-w-7xl mx-auto">
              <div class="mb-6">
                <button
                  @click="currentView = 'dashboard'"
                  class="flex items-center text-white hover:text-yellow-200 transition-colors mb-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
                <h1 class="text-3xl font-bold text-white">Saved Reports</h1>
                <p class="text-yellow-100 mt-2">View and manage your saved analysis reports</p>
              </div>
              <Bookmarks />
            </div>
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
import Settings from "./pages/settings.vue";
import Help from "./pages/help.vue";
import Bookmarks from "./pages/bookmarks.vue";

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
  scannedPages: number;
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
const enableCrawling = ref(false);
const scannedPages = ref(0);

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

  // Load settings from localStorage
  settings.value.waveApiKey = getLocalStorage("waveApiKey");
  console.log("Loaded WAVE API key:", settings.value.waveApiKey ? "Configured" : "Not configured");

  // Listen for WAVE API key updates from settings page
  const handleWaveApiKeyUpdate = (event: CustomEvent) => {
    settings.value.waveApiKey = event.detail.apiKey;
    console.log("WAVE API key updated:", settings.value.waveApiKey ? "Configured" : "Not configured");
  };
  
  window.addEventListener('waveApiKeyUpdated', handleWaveApiKeyUpdate as EventListener);

  // Load recent scans
  try {
    const storedScans = JSON.parse(getLocalStorage("recentScans", "[]"));
    recentScans.value = storedScans;
  } catch (err) {
    console.error("Error loading recent scans:", err);
  }

  // Load saved reports
  loadSavedReports();

  // On mount, ensure 'seo' is in selectedTools if analysisTypes.seo is true
  if (analysisTypes.value.seo && !selectedTools.value.includes('seo')) {
    selectedTools.value.push('seo');
  }
  if (analysisTypes.value.accessibility) {
    const accessibilityToolIds = availableTools.map(t => t.id);
    if (!selectedTools.value.some(t => accessibilityToolIds.includes(t))) {
      selectedTools.value = [
        ...selectedTools.value,
        ...accessibilityToolIds.filter(t => !selectedTools.value.includes(t))
      ];
    }
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
function handleNavigation(view: string) {
  // Reset mobile menu if open
  isMobileMenuOpen.value = false;

  // Handle specific views
  if (view === "saved-reports") {
    loadSavedReports();
    // Ensure the page is responsive by triggering a refresh
    setTimeout(() => {
      const bookmarksComponent = document.querySelector('[data-page="saved-reports"]');
      if (bookmarksComponent && typeof bookmarksComponent.loadReports === 'function') {
        bookmarksComponent.loadReports();
      }
    }, 100);
  } else if (view === "settings") {
    // Load settings from localStorage to ensure they're available
    settings.value.waveApiKey = getLocalStorage("waveApiKey");
  } else if (view === "help") {
    // Help page is static content, no special handling needed
    console.log("Help page loaded");
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
  runScan();
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

// Update the runScan function to better handle multi-page analysis
async function runScan() {
  if (!url.value.trim()) {
    error.value = "Please enter a valid URL";
    return;
  }

  // Reset state
  results.value = [];
  error.value = null;
  isLoading.value = true;
  scanCompleted.value = false;
  scannedPages.value = 0;
  waveReportUrl.value = "";

  // Reset progress
  analysisProgress.value = {
    accessibility: { 
      currentStep: 0, 
      completed: 0, 
      status: "Starting...", 
      total: selectedTools.value.filter(t => t !== 'seo').length 
    },
    seo: { 
      currentStep: 0, 
      completed: 0, 
      status: "Starting...", 
      total: selectedTools.value.includes('seo') ? 1 : 0 
    },
    overall: 0
  };
  
  console.log("Progress initialized:", {
    accessibility: analysisProgress.value.accessibility,
    seo: analysisProgress.value.seo,
    selectedTools: selectedTools.value
  });

  try {
    console.log("Starting scan with settings:", {
      url: url.value,
      selectedTools: selectedTools.value,
      enableCrawling: enableCrawling.value,
      maxPages: enableCrawling.value ? 20 : 1
    });
    
    // Debug: Log the actual enableCrawling value
    console.log("enableCrawling.value:", enableCrawling.value);
    console.log("typeof enableCrawling.value:", typeof enableCrawling.value);

    const allIssues: Issue[] = [];
    let hasErrors = false;

    // Run accessibility tools sequentially to update progress
    const accessibilityTools = selectedTools.value.filter(t => t !== 'seo');
    for (const tool of accessibilityTools) {
      try {
        analysisProgress.value.accessibility.status = `Running ${tool} analysis...`;
        analysisProgress.value.accessibility.currentStep = tool;
        
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

        if (toolResults && Array.isArray(toolResults)) {
          allIssues.push(...toolResults);
        }
        
        analysisProgress.value.accessibility.completed++;
        updateOverallProgress();
        
      } catch (toolError: any) {
        console.error(`${tool} scan error:`, toolError);
        hasErrors = true;
        error.value = `${tool} scan failed: ${toolError.message || "Unknown error"}`;
        analysisProgress.value.accessibility.completed++;
        updateOverallProgress();
      }
    }

    // Run SEO analysis if selected
    if (selectedTools.value.includes("seo")) {
      try {
        analysisProgress.value.seo.status = "Running SEO analysis...";
        const seoResults = await runSEOAnalysis();
        
        if (seoResults && seoResults.issues) {
          // Convert SEO issues to the same format as accessibility issues
          const seoIssues = seoResults.issues.map((issue: any) => ({
            type: issue.type || 'warning',
            code: issue.code || 'SEO-ISSUE',
            message: issue.message || issue.description || 'SEO issue found',
            context: issue.context || '',
            source: 'seo',
            selector: issue.selector || '',
            detail: issue.detail || issue.explanation || '',
            pageUrl: issue.pageUrl || url.value,
          }));
          allIssues.push(...seoIssues);
        }
        
        // Store SEO results separately for the dashboard
        seoAnalysisResults.value = seoResults;
        console.log("SEO results stored:", seoAnalysisResults.value);
        
        analysisProgress.value.seo.completed = 1;
        analysisProgress.value.seo.status = "SEO analysis complete";
        updateOverallProgress();
        
      } catch (seoError: any) {
        console.error("SEO analysis error:", seoError);
        hasErrors = true;
        error.value = `SEO analysis failed: ${seoError.message || "Unknown error"}`;
        analysisProgress.value.seo.completed = 1;
        updateOverallProgress();
      }
    }

    if (allIssues.length > 0 || !hasErrors) {
      results.value = allIssues;
      scanCompleted.value = true;
      saveToRecentScans(url.value);
      
      console.log(`Scan completed successfully. Found ${allIssues.length} issues across ${scannedPages.value} pages.`);
      console.log("Final scannedPages value:", scannedPages.value);
      console.log("Final seoAnalysisResults:", seoAnalysisResults.value);
    }

    // Update progress to complete
    analysisProgress.value.accessibility.status = "Complete";
    analysisProgress.value.seo.status = "Complete";
    updateOverallProgress();

  } catch (err: any) {
    console.error("Scan error:", err);
    error.value = err.message || "An unexpected error occurred during the scan";
  } finally {
    isLoading.value = false;
  }
}

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
  scannedPages.value = 0;

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
  const totalSteps = analysisProgress.value.accessibility.total + analysisProgress.value.seo.total;
  const completedSteps = analysisProgress.value.accessibility.completed + analysisProgress.value.seo.completed;
  
  console.log("Progress update:", {
    accessibility: {
      total: analysisProgress.value.accessibility.total,
      completed: analysisProgress.value.accessibility.completed,
      status: analysisProgress.value.accessibility.status
    },
    seo: {
      total: analysisProgress.value.seo.total,
      completed: analysisProgress.value.seo.completed,
      status: analysisProgress.value.seo.status
    },
    totalSteps,
    completedSteps
  });
  
  if (totalSteps > 0) {
    analysisProgress.value.overall = Math.round((completedSteps / totalSteps) * 100);
  } else {
    analysisProgress.value.overall = 0;
  }
  
  console.log("Overall progress:", analysisProgress.value.overall + "%");
}

// Update the runPa11yScan function to support crawling
async function runPa11yScan() {
  try {
    console.log("Running Pa11y scan on:", url.value);
    console.log("enableCrawling.value in runPa11yScan:", enableCrawling.value);
    
    if (enableCrawling.value) {
      console.log("Using crawl API for multi-page analysis");
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: url.value,
        maxPages: 5,
        tools: ["pa11y"]
      });
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        console.log(`Crawl API returned ${response.data.pages.length} pages`);
        
        // Flatten all issues from all pages
        const allIssues = [];
        response.data.pages.forEach(page => {
          if (page.toolResults?.pa11y?.success && page.toolResults.pa11y.result?.issues) {
            const pageIssues = page.toolResults.pa11y.result.issues.map((issue) => ({
              ...issue,
              source: "pa11y",
              pageUrl: page.url
            }));
            allIssues.push(...pageIssues);
          }
        });
        console.log(`Total issues from crawl: ${allIssues.length}`);
        return allIssues;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      console.log("Using single page API");
      // Single page scan (existing logic)
      scannedPages.value = 1;
      const response = await axios.post("/api/pa11y", {
        url: url.value,
      });
      if (response.data?.pages?.[0]?.issues) {
        return response.data.pages[0].issues.map((issue) => ({
          ...issue,
          source: "pa11y",
        }));
      } else {
        throw new Error("Invalid response format from Pa11y API");
      }
    }
  } catch (err) {
    console.error("Pa11y scan error:", err);
    throw new Error(
      err.response?.data?.error || err.message || "Pa11y scan failed"
    );
  }
}

// Update the runWaveScan function to support crawling
async function runWaveScan() {
  try {
    console.log("Running WAVE scan on:", url.value);
    console.log("WAVE API key status:", settings.value.waveApiKey ? "Present" : "Missing");
    console.log("WAVE API key length:", settings.value.waveApiKey ? settings.value.waveApiKey.length : 0);
    
    // Check if WAVE API key is configured
    if (!settings.value.waveApiKey || settings.value.waveApiKey.trim() === '') {
      throw new Error("WAVE API key is not configured. Please go to Settings and add your WAVE API key.");
    }
    
    console.log("Making WAVE API call with key:", settings.value.waveApiKey.substring(0, 8) + "...");
    
    if (enableCrawling.value) {
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: url.value,
        maxPages: 5,
        tools: ["wave"],
        waveApiKey: settings.value.waveApiKey
      });
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        
        // Flatten all issues from all pages
        const allIssues = [];
        response.data.pages.forEach(page => {
          if (page.toolResults?.wave?.success && page.toolResults.wave.result?.issues) {
            const pageIssues = page.toolResults.wave.result.issues.map((issue) => ({
              ...issue,
              source: "wave",
              pageUrl: page.url
            }));
            allIssues.push(...pageIssues);
          }
        });
        return allIssues;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      // Single page scan (existing logic)
      scannedPages.value = 1;
      console.log("Making single page WAVE API call to /api/wave");
      const response = await axios.post("/api/wave", {
        url: url.value,
        apiKey: settings.value.waveApiKey,
      });
      console.log("WAVE API response received:", response.status, response.data ? "Has data" : "No data");
      
      // Check for different possible response formats
      if (response.data) {
        let issues = [];
        // Handle different WAVE API response formats
        if (response.data.issues) {
          // Direct issues array
          issues = response.data.issues;
        } else if (response.data.categories) {
          // Grouped by categories
          Object.values(response.data.categories).forEach((category) => {
            if (category.items) {
              issues = issues.concat(category.items);
            }
          });
        } else if (response.data.summary) {
          // Summary format with nested issues
          if (response.data.summary.errors) {
            issues = issues.concat(
              response.data.summary.errors.map((error) => ({
                ...error,
                type: "error",
              }))
            );
          }
          if (response.data.summary.warnings) {
            issues = issues.concat(
              response.data.summary.warnings.map((warning) => ({
                ...warning,
                type: "warning",
              }))
            );
          }
          if (response.data.summary.notices) {
            issues = issues.concat(
              response.data.summary.notices.map((notice) => ({
                ...notice,
                type: "notice",
              }))
            );
          }
        }
        if (issues.length > 0) {
          return issues.map((issue) => ({
            type: issue.type || "notice",
            code: issue.code || issue.id || issue.ruleId || (issue.category && issue.category.key) || "WAVE-UNKNOWN",
            message: issue.message || issue.description || issue.title || (typeof issue === 'object' ? JSON.stringify(issue) : String(issue)) || "No message provided",
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
    }
  } catch (err) {
    console.error("WAVE scan error:", err);
    console.error("Error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    // Provide specific guidance based on error type
    if (err.message && err.message.includes("WAVE API key is not configured")) {
      throw new Error("WAVE API key is not configured. Please go to Settings and add your WAVE API key.");
    } else if (err.response?.data?.error) {
      if (err.response.data.error.includes("invalid key") || err.response.data.error.includes("unauthorized")) {
        throw new Error("Invalid WAVE API key. Please check your key in Settings and try again.");
      } else if (err.response.data.error.includes("quota") || err.response.data.error.includes("limit")) {
        throw new Error("WAVE API quota exceeded. Please try again later or upgrade your WAVE account.");
      } else {
        throw new Error(`WAVE scan failed: ${err.response.data.error}`);
      }
    } else if (err.message) {
      throw new Error(`WAVE scan failed: ${err.message}`);
    } else {
      throw new Error("WAVE scan failed: Unknown error. Please check your internet connection and try again.");
    }
  }
}

// Update the runLighthouseScan function to support crawling
async function runLighthouseScan() {
  try {
    console.log("Running Lighthouse scan on:", url.value);
    if (enableCrawling.value) {
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: url.value,
        maxPages: 5,
        tools: ["lighthouse"]
      });
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        
        // Flatten all issues from all pages
        const allIssues = [];
        response.data.pages.forEach(page => {
          if (page.toolResults?.lighthouse?.success && page.toolResults.lighthouse.result?.audits) {
            const pageIssues = page.toolResults.lighthouse.result.audits
              .filter((audit: any) => audit.score !== null && audit.score < 1)
              .map((audit: any) => ({
                type: audit.score === 0 ? "error" : "warning",
                code: audit.id,
                message: audit.title,
                context: audit.description,
                source: "lighthouse",
                selector: audit.selector,
                detail: audit.explanation,
                pageUrl: page.url
              }));
            allIssues.push(...pageIssues);
          }
        });
        return allIssues;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      // Single page scan (existing logic)
      scannedPages.value = 1;
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
    }
  } catch (err: any) {
    console.error("Lighthouse scan error:", err);
    throw new Error(
      err.response?.data?.error || err.message || "Lighthouse scan failed"
    );
  }
}

// Update the runIbmA11yScan function to support crawling
async function runIbmA11yScan() {
  try {
    console.log("Running IBM Accessibility Checker scan on:", url.value);
    if (enableCrawling.value) {
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: url.value,
        maxPages: 5,
        tools: ["ibm-a11y"]
      });
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        
        // Flatten all issues from all pages
        const allIssues = [];
        response.data.pages.forEach(page => {
          if (page.toolResults?.["ibm-a11y"]?.success && page.toolResults["ibm-a11y"].result?.issues) {
            const pageIssues = page.toolResults["ibm-a11y"].result.issues.map((issue: any) => ({
              ...issue,
              source: "ibm-a11y",
              pageUrl: page.url
            }));
            allIssues.push(...pageIssues);
          }
        });
        return allIssues;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      // Single page scan (existing logic)
      scannedPages.value = 1;
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
      scannedPages: scannedPages.value,
      issues: results.value.map((issue: Issue) => ({
        type: issue.type,
        code: issue.code,
        message: issue.message,
        source: issue.source,
        context: issue.context ?? undefined,
        selector: issue.selector,
        pageUrl: issue.pageUrl ?? undefined,
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
  scannedPages.value = report.scannedPages || 1;
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

    if (enableCrawling.value) {
      // Use crawl API for multi-page analysis
      const response = await axios.post("/api/crawl", {
        url: url.value,
        maxPages: 5,
        tools: ["seo"]
      });
      
      if (response.data?.pages) {
        // Update progress
        scannedPages.value = response.data.pages.length;
        
        // Process SEO analysis for all pages
        const allSeoResults = [];
        for (const page of response.data.pages) {
          if (page.toolResults?.seo?.success) {
            allSeoResults.push({
              ...page.toolResults.seo.result,
              pageUrl: page.url
            });
          }
        }
        
        // Combine results from all pages
        const combinedSeoResults = combineSeoResults(allSeoResults);
        seoAnalysisResults.value = combinedSeoResults;
        analysisProgress.value.seo.completed = 1;
        analysisProgress.value.seo.status = "SEO analysis complete";
        updateOverallProgress();
        return combinedSeoResults;
      } else {
        throw new Error("Invalid response format from crawl API");
      }
    } else {
      // Single page scan (existing logic)
      scannedPages.value = 1;
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
    }
  } catch (err: any) {
    throw new Error(err.message || "Failed to complete SEO analysis");
  }
}

// Helper function to combine SEO results from multiple pages
function combineSeoResults(seoResults: any[]) {
  if (seoResults.length === 0) {
    return null;
  }
  
  if (seoResults.length === 1) {
    return seoResults[0];
  }
  
  // Combine metrics from all pages
  const combinedMetrics = {
    performance: {
      loadTime: seoResults.reduce((sum, r) => sum + (r.metrics?.performance?.loadTime || 0), 0) / seoResults.length,
      firstContentfulPaint: seoResults.reduce((sum, r) => sum + (r.metrics?.performance?.firstContentfulPaint || 0), 0) / seoResults.length,
      largestContentfulPaint: seoResults.reduce((sum, r) => sum + (r.metrics?.performance?.largestContentfulPaint || 0), 0) / seoResults.length,
      timeToInteractive: seoResults.reduce((sum, r) => sum + (r.metrics?.performance?.timeToInteractive || 0), 0) / seoResults.length,
    },
    content: {
      wordCount: seoResults.reduce((sum, r) => sum + (r.metrics?.content?.wordCount || 0), 0),
      keywordDensity: combineKeywordDensity(seoResults.map(r => r.metrics?.content?.keywordDensity || {})),
    },
    technical: {
      images: {
        total: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.images?.total || 0), 0),
        withAlt: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.images?.withAlt || 0), 0),
        withoutAlt: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.images?.withoutAlt || 0), 0),
      },
      links: {
        internal: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.links?.internal || 0), 0),
        external: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.links?.external || 0), 0),
        broken: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.links?.broken || 0), 0),
      },
      headings: {
        h1: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.headings?.h1 || 0), 0),
        h2: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.headings?.h2 || 0), 0),
        h3: seoResults.reduce((sum, r) => sum + (r.metrics?.technical?.headings?.h3 || 0), 0),
      },
    },
    meta: {
      hasTitle: seoResults.some(r => r.metrics?.meta?.hasTitle),
      hasDescription: seoResults.some(r => r.metrics?.meta?.hasDescription),
      hasCanonical: seoResults.some(r => r.metrics?.meta?.hasCanonical),
      hasRobots: seoResults.some(r => r.metrics?.meta?.hasRobots),
      ogTags: seoResults.reduce((sum, r) => sum + (r.metrics?.meta?.ogTags || 0), 0),
      twitterTags: seoResults.reduce((sum, r) => sum + (r.metrics?.meta?.twitterTags || 0), 0),
    },
  };
  
  // Combine issues from all pages
  const combinedIssues = [];
  for (const result of seoResults) {
    if (result.issues) {
      for (const issue of result.issues) {
        combinedIssues.push({
          ...issue,
          pageUrl: result.pageUrl || issue.url,
        });
      }
    }
  }
  
  // Combine recommendations from all pages
  const combinedRecommendations = [];
  for (const result of seoResults) {
    if (result.recommendations) {
      for (const rec of result.recommendations) {
        combinedRecommendations.push({
          ...rec,
          pageUrl: result.pageUrl || rec.url,
        });
      }
    }
  }
  
  // Calculate average score
  const avgScore = seoResults.reduce((sum, r) => sum + (r.score || 0), 0) / seoResults.length;
  
  return {
    url: url.value,
    score: Math.round(avgScore),
    issues: combinedIssues,
    recommendations: combinedRecommendations,
    metrics: combinedMetrics,
    robotsAnalysis: seoResults[0]?.robotsAnalysis || {},
    crawledPages: {
      total: seoResults.length,
      pages: seoResults.map(r => ({
        url: r.pageUrl || r.url,
        status: 200,
        wordCount: r.metrics?.content?.wordCount || 0,
        headings: {
          h1: r.metrics?.technical?.headings?.h1 || 0,
          h2: r.metrics?.technical?.headings?.h2 || 0,
          h3: r.metrics?.technical?.headings?.h3 || 0,
        },
        images: {
          total: r.metrics?.technical?.images?.total || 0,
          withAlt: r.metrics?.technical?.images?.withAlt || 0,
          withoutAlt: r.metrics?.technical?.images?.withoutAlt || 0,
        },
        links: {
          internal: r.metrics?.technical?.links?.internal || 0,
          external: r.metrics?.technical?.links?.external || 0,
        },
      })),
    },
    scoreBreakdown: {
      total: Math.round(avgScore),
      meta: Math.round(seoResults.reduce((sum, r) => sum + (r.scoreBreakdown?.meta || 0), 0) / seoResults.length),
      content: Math.round(seoResults.reduce((sum, r) => sum + (r.scoreBreakdown?.content || 0), 0) / seoResults.length),
      technical: Math.round(seoResults.reduce((sum, r) => sum + (r.scoreBreakdown?.technical || 0), 0) / seoResults.length),
      structure: Math.round(seoResults.reduce((sum, r) => sum + (r.scoreBreakdown?.structure || 0), 0) / seoResults.length),
    },
  };
}

// Helper function to combine keyword density from multiple pages
function combineKeywordDensity(keywordDensities: Record<string, number>[]) {
  const combined: Record<string, number> = {};
  const counts: Record<string, number> = {};
  
  for (const density of keywordDensities) {
    for (const [keyword, value] of Object.entries(density)) {
      if (!combined[keyword]) {
        combined[keyword] = 0;
        counts[keyword] = 0;
      }
      combined[keyword] += value;
      counts[keyword]++;
    }
  }
  
  // Calculate average
  for (const keyword in combined) {
    combined[keyword] = combined[keyword] / counts[keyword];
  }
  
  return combined;
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

// Watchers to sync analysisTypes and selectedTools
watch(
  () => analysisTypes.value.seo,
  (newVal) => {
    if (newVal) {
      if (!selectedTools.value.includes('seo')) {
        selectedTools.value.push('seo');
      }
    } else {
      selectedTools.value = selectedTools.value.filter(t => t !== 'seo');
    }
  }
);

watch(
  () => analysisTypes.value.accessibility,
  (newVal) => {
    const accessibilityToolIds = availableTools.map(t => t.id);
    if (newVal) {
      // If no accessibility tools are selected, select all by default
      if (!selectedTools.value.some(t => accessibilityToolIds.includes(t))) {
        selectedTools.value = [
          ...selectedTools.value,
          ...accessibilityToolIds.filter(t => !selectedTools.value.includes(t))
        ];
      }
    } else {
      // Remove all accessibility tools
      selectedTools.value = selectedTools.value.filter(t => !accessibilityToolIds.includes(t));
    }
  }
);
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

