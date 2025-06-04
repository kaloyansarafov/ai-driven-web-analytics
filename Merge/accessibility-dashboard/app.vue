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
            <!-- Only show user, notification, and theme toggle on mobile header -->
            <div class="flex items-center space-x-3 lg:hidden">
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
            <!-- HERO SECTION FULL WIDTH BACKGROUND START -->
            <div class="w-full bg-[linear-gradient(90deg,_#3C585E_0%,_#232B62_100%)] min-h-[420px] overflow-x-hidden">
              <div class="flex items-center justify-center py-12 min-h-[420px]">
                <section class="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto rounded-2xl shadow-xl p-8 relative z-10">
                  <!-- Left: Text and Form -->
                  <div class="flex-1 max-w-xl text-left">
                    <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-4">Welcome to Crea8ion.lab!</h1>
                    <h2 class="text-3xl font-bold text-white mb-4">Manage your SEO and Accessibility Dashboard Easily!</h2>
                    <p class="text-lg text-blue-100 mb-8 max-w-lg">
                      Our dashboard will help you get all the analytics that you need to improve the SEO and WCAG Accessibility of your website. Just paste the website link below, and let us explore the results together!
                    </p>
                    <!-- Scan Form (preserve all logic) -->
                    <div class="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow p-6 w-full">
                      <form @submit.prevent="runAnalyses" class="space-y-4">
                        <div>
                          <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                          <div class="mt-1 flex items-center space-x-2">
                            <input
                              type="url"
                              id="url"
                              v-model="url"
                              placeholder="enter url link here"
                              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              :disabled="isLoading"
                            />
                            <button
                              type="submit"
                              :disabled="isLoading || !url || (!analysisTypes.accessibility && !analysisTypes.seo)"
                              class="px-6 py-2 rounded-md font-semibold bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {{ isLoading ? 'Analyzing...' : 'Analyze' }}
                            </button>
                          </div>
                        </div>
                        <!-- Advanced Options Toggle -->
                        <div class="flex items-center space-x-2">
                          <input type="checkbox" id="advanced-options" v-model="showAdvancedOptions" class="toggle toggle-sm" />
                          <label for="advanced-options" class="text-xs text-gray-600 dark:text-gray-300 cursor-pointer">Advanced Options</label>
                        </div>
                        <!-- Advanced Options Section (conditionally shown) -->
                        <div v-if="showAdvancedOptions" class="space-y-4 border-t pt-4 mt-2">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis Types</label>
                            <div class="space-y-2">
                              <label class="flex items-center space-x-3">
                                <input type="checkbox" v-model="analysisTypes.accessibility" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" :disabled="isLoading" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">Accessibility Analysis</span>
                              </label>
                              <label class="flex items-center space-x-3">
                                <input type="checkbox" v-model="analysisTypes.seo" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" :disabled="isLoading" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">SEO Analysis</span>
                              </label>
                            </div>
                          </div>
                          <div v-if="analysisTypes.accessibility" class="space-y-4">
                            <div>
                              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accessibility Tools</label>
                              <div class="space-y-2">
                                <label v-for="tool in availableTools" :key="tool.id" class="flex items-center space-x-3">
                                  <input type="checkbox" :value="tool.id" v-model="selectedTools" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" :disabled="isLoading" />
                                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ tool.name }}</span>
                                </label>
                              </div>
                            </div>
                            <div v-if="selectedTools.includes('wave')">
                              <label class="flex items-center space-x-3">
                                <input type="checkbox" v-model="visualReport" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" :disabled="isLoading" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">Include Visual Report</span>
                              </label>
                            </div>
                            <div>
                              <label class="flex items-center space-x-3">
                                <input type="checkbox" v-model="includeHistory" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" :disabled="isLoading" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">Track Scan History</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <!-- Right: Illustration -->
                  <div class="flex-1 flex items-center justify-center mt-10 lg:mt-0">
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
            <div v-if="analysisComplete" class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Analysis Complete</h3>
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
              class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div class="text-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Analyzing {{ url }}
                </h3>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
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
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accessibility Analysis
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ analysisProgress.accessibility.completed }}/{{ analysisProgress.accessibility.total }} tools
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(analysisProgress.accessibility.completed / analysisProgress.accessibility.total) * 100}%` }"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ analysisProgress.accessibility.status }}
                  </p>
                </div>

                <!-- SEO Progress -->
                <div v-if="analysisTypes.seo" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      SEO Analysis
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ analysisProgress.seo.completed }}/{{ analysisProgress.seo.total }} steps
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-green-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(analysisProgress.seo.completed / analysisProgress.seo.total) * 100}%` }"
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
              @update:analysis="(newAnalysis) => seoAnalysisResults = newAnalysis"
            />
          </div>

          <!-- Other views remain unchanged -->
          <div v-else-if="currentView === 'saved-reports'">
            <HistoryTracking
              :reports="savedReports"
              @rescan="handleRescan"
            />
          </div>

          <div v-else-if="currentView === 'settings'">
            <div class="max-w-7xl mx-auto">
              <h2 class="text-2xl font-bold mb-4">Settings</h2>
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <form @submit.prevent="saveSettings" class="space-y-6">
                  <div>
                    <label for="waveApiKey" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <div class="max-w-7xl mx-auto">
              <h2 class="text-2xl font-bold mb-4">Help & Documentation</h2>
              <!-- Help content -->
            </div>
          </div>

          <div v-else-if="currentView === 'combined-dashboard'">
            <CombinedDashboard :seo-results="seoAnalysisResults" :accessibility-results="results" :accessibility-summary="accessibilitySummary" :seo-summary="seoSummary" />
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
  seo: true
});
const analysisComplete = ref(false);
const seoAnalysisResults = ref<SEOAnalysisType | null>(null);
const analysisProgress = ref({
  overall: 0,
  accessibility: {
    total: 0,
    completed: 0,
    currentTool: '',
    status: ''
  },
  seo: {
    total: 0,
    completed: 0,
    currentStep: '',
    status: ''
  }
});
const availableTools = [
  { id: 'pa11y', name: 'Pa11y' },
  { id: 'wave', name: 'WAVE' },
  { id: 'lighthouse', name: 'Lighthouse' },
  { id: 'ibm-a11y', name: 'IBM A11y' }
];
const settings = ref({
  waveApiKey: '',
  // Add other settings as needed
});
const showAdvancedOptions = ref(false);
const targetUrl = ref('');

// Add this function to safely access localStorage
function getLocalStorage(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (err) {
      console.error('Error accessing localStorage:', err);
      return defaultValue;
    }
  }
  return defaultValue;
}

// Add this function to safely set localStorage
function setLocalStorage(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error('Error setting localStorage:', err);
    }
  }
}

// Update the onMounted section
onMounted(() => {
  // Initialize with default tools
  selectedTools.value = [...defaultTools];
  
  // Load settings
  settings.value.waveApiKey = getLocalStorage('waveApiKey');
  
  // Load recent scans
  try {
    const storedScans = JSON.parse(getLocalStorage('recentScans', '[]'));
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
    error.value = '';
    // Clear the results
    results.value = [];
    seoAnalysisResults.value = null;
  } else if (view === "combined-dashboard") {
    // Load the latest analysis results if available
    const latestAnalysis = localStorage.getItem('latestAnalysis');
    if (latestAnalysis) {
      try {
        const parsed = JSON.parse(latestAnalysis);
        // Update the reactive state
        url.value = parsed.url || '';
        results.value = parsed.accessibilityResults || [];
        seoAnalysisResults.value = parsed.seoResults || null;
        // Update the summaries through their setters if they exist
        if (parsed.accessibilitySummary) {
          Object.assign(accessibilitySummary.value, parsed.accessibilitySummary);
        }
        if (parsed.seoSummary) {
          Object.assign(seoSummary.value, parsed.seoSummary);
        }
      } catch (error) {
        console.error('Error loading latest analysis:', error);
      }
    }
  }
  
  // Update the current view
  currentView.value = view;
  
  // Scroll to top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle rescan request from HistoryTracking component
function handleRescan(rescanUrl: string) {
  url.value = rescanUrl;
  currentView.value = 'dashboard';
  // Reset states
  results.value = [];
  scanCompleted.value = false;
  analysisComplete.value = false;
  error.value = '';
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
  results.value.some((issue) => issue.source === 'lighthouse')
);

const hasIbmA11yIssues = computed(() =>
  results.value.some((issue) => issue.source === 'ibm-a11y')
);

// Watch for changes in currentView
watch(currentView, (newView) => {
  if (newView === 'accessibility-analysis' && results.value.length > 0) {
    // If we have results, show them in the analysis view
    scanCompleted.value = true;
  }
});

// Run an accessibility scan
async function runAnalyses() {
  if (!url.value) return;
  if (!analysisTypes.value.accessibility && !analysisTypes.value.seo) return;

  isLoading.value = true;
  error.value = '';
  analysisComplete.value = false;
  results.value = [];
  scanCompleted.value = false;
  visualReport.value = true;
  waveReportUrl.value = '';

  // Reset progress
  analysisProgress.value = {
    overall: 0,
    accessibility: {
      total: analysisTypes.value.accessibility ? selectedTools.value.length : 0,
      completed: 0,
      currentTool: '',
      status: 'Initializing...'
    },
    seo: {
      total: analysisTypes.value.seo ? 4 : 0,
      completed: 0,
      currentStep: '',
      status: 'Initializing...'
    }
  };

  try {
    // Format URL
    let formattedUrl = url.value.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    url.value = formattedUrl;

    // Run accessibility analysis if selected
    if (analysisTypes.value.accessibility && selectedTools.value.length > 0) {
      // Set WAVE report URL if WAVE is selected
      if (selectedTools.value.includes("wave") && visualReport.value) {
        waveReportUrl.value = `https://wave.webaim.org/report#/${encodeURIComponent(formattedUrl)}`;
      }

      // Run each selected tool
      const scanPromises: Promise<any>[] = [];

      for (const tool of selectedTools.value) {
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
          
          analysisProgress.value.accessibility.completed++;
          updateOverallProgress();
        } catch (toolError: any) {
          console.error(`${tool} scan error:`, toolError);
          error.value += `\n${tool} scan failed: ${toolError.message || 'Unknown error'}`;
          analysisProgress.value.accessibility.completed++;
          updateOverallProgress();
        }
      }

      // Wait for all scans to complete
      await Promise.allSettled(scanPromises);
      analysisProgress.value.accessibility.status = 'Accessibility analysis complete';

      // Save scan results if history tracking is enabled
      if (includeHistory.value) {
        saveToRecentScans(url.value);
      }
      scanCompleted.value = true;
    }

    // Run SEO analysis if selected
    if (analysisTypes.value.seo) {
      await runSEOAnalysis();
    }

    analysisComplete.value = true;
    analysisProgress.value.overall = 100;
  } catch (err: any) {
    console.error("Analysis error:", err);
    error.value = err.message || 'An error occurred during analysis';
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      document.querySelector("#results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

// Add this helper function
function updateOverallProgress() {
  const totalSteps = (analysisTypes.value.accessibility ? analysisProgress.value.accessibility.total : 0) +
                    (analysisTypes.value.seo ? analysisProgress.value.seo.total : 0);
  
  const completedSteps = analysisProgress.value.accessibility.completed +
                        analysisProgress.value.seo.completed;
  
  analysisProgress.value.overall = Math.round((completedSteps / totalSteps) * 100);
}

// Update the runPa11yScan function to return results
async function runPa11yScan() {
  try {
    console.log("Running Pa11y scan on:", url.value);
    const response = await axios.post("/api/pa11y", {
      url: url.value,
      standard: 'WCAG2AA',
      includeNotices: true,
      includeWarnings: true,
      timeout: 30000
    });

    if (response.data?.pages?.[0]?.issues) {
      return response.data.pages[0].issues.map((issue: any) => ({
        ...issue,
        source: "pa11y"
      }));
    } else {
      throw new Error("Invalid response format from Pa11y API");
    }
  } catch (err: any) {
    console.error("Pa11y scan error:", err);
    throw new Error(err.response?.data?.error || err.message || "Pa11y scan failed");
  }
}

// Update the runWaveScan function to return results
async function runWaveScan() {
  try {
    console.log("Running WAVE scan on:", url.value);
    const response = await axios.post("/api/wave", {
      url: url.value,
      apiKey: settings.value.waveApiKey
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
          issues = issues.concat(response.data.summary.errors.map((error: any) => ({
            ...error,
            type: 'error'
          })));
        }
        if (response.data.summary.warnings) {
          issues = issues.concat(response.data.summary.warnings.map((warning: any) => ({
            ...warning,
            type: 'warning'
          })));
        }
        if (response.data.summary.notices) {
          issues = issues.concat(response.data.summary.notices.map((notice: any) => ({
            ...notice,
            type: 'notice'
          })));
        }
      }

      if (issues.length > 0) {
        return issues.map((issue: any) => ({
          type: issue.type || 'notice',
          code: issue.code || issue.id || 'WAVE-UNKNOWN',
          message: issue.message || issue.description || 'No message provided',
          context: issue.context || issue.html || '',
          source: "wave",
          selector: issue.selector || '',
          detail: issue.detail || issue.explanation || ''
        }));
      } else {
        console.log('WAVE scan completed with no issues found');
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
      categories: ['accessibility']
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
          detail: audit.explanation
        }));
    } else {
      throw new Error("Invalid response format from Lighthouse API");
    }
  } catch (err: any) {
    console.error("Lighthouse scan error:", err);
    throw new Error(err.response?.data?.error || err.message || "Lighthouse scan failed");
  }
}

// Update the runIbmA11yScan function to return results
async function runIbmA11yScan() {
  try {
    console.log("Running IBM Accessibility Checker scan on:", url.value);
    const response = await axios.post("/api/ibm-a11y", {
      url: url.value
    });

    if (response.data?.issues) {
      return response.data.issues.map((issue: any) => ({
        ...issue,
        source: "ibm-a11y"
      }));
    } else {
      throw new Error("Invalid response format from IBM A11y API");
    }
  } catch (err: any) {
    console.error("IBM A11y scan error:", err);
    throw new Error(err.response?.data?.error || err.message || "IBM A11y scan failed");
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
    setLocalStorage('recentScans', JSON.stringify(newScans));
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
        lighthouse: selectedTools.value.includes("lighthouse") ? "10.0.0" : null,
        "ibm-a11y": selectedTools.value.includes("ibm-a11y") ? "4.0.0" : null
      },
    };

    // Get existing history
    let scanHistory: ScanSummary[] = [];
    try {
      scanHistory = JSON.parse(getLocalStorage('scanHistory', '[]'));
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
    setLocalStorage('scanHistory', JSON.stringify(scanHistory));
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
    setLocalStorage('waveApiKey', settings.value.waveApiKey);
    // Add other settings as needed
    console.log('Settings saved successfully');
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

// Load saved reports from localStorage
function loadSavedReports() {
  try {
    const savedHistory = getLocalStorage('scanHistory');
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

// Add this function after the existing functions
async function getAIRecommendations(issue: Issue) {
  try {
    const response = await axios.post('/api/gemini', {
      issue: {
        type: issue.type,
        message: issue.message,
        context: issue.context,
        detail: issue.detail,
        source: issue.source
      }
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format from AI API");
    }
  } catch (err: any) {
    console.error('Error getting AI recommendations:', err);
    throw new Error(err.response?.data?.error || err.message || "Failed to get AI recommendations");
  }
}

// Update the runSEOAnalysis function
async function runSEOAnalysis() {
  try {
    const steps = ['performance', 'content', 'technical', 'meta'];
    let combinedResults = {};
    
    for (const step of steps) {
      analysisProgress.value.seo.currentStep = step;
      analysisProgress.value.seo.status = `Analyzing ${step}...`;
      
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.value,
          options: {
            [step]: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to analyze ${step}`);
      }

      const data = await response.json();
      combinedResults = {
        ...combinedResults,
        ...data
      };
      
      analysisProgress.value.seo.completed++;
      updateOverallProgress();
    }

    analysisProgress.value.seo.status = 'SEO analysis complete';
    seoAnalysisResults.value = combinedResults;
    return combinedResults;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to complete SEO analysis');
  }
}

// Update the navigateToAnalysis function
function navigateToAnalysis(type: 'accessibility' | 'seo' | 'combined') {
  if (type === 'accessibility') {
    if (!results.value.length) {
      console.error('No accessibility results available');
      return;
    }
    currentView.value = 'accessibility-analysis';
  } else if (type === 'seo') {
    if (!url.value || !seoAnalysisResults.value) {
      console.error('Missing URL or SEO analysis results');
      return;
    }
    currentView.value = 'seo-analysis';
  } else if (type === 'combined') {
    if (!url.value || (!results.value.length && !seoAnalysisResults.value)) {
      console.error('No analysis results available');
      return;
    }
    currentView.value = 'combined-dashboard';
    // Store the results in localStorage for the combined dashboard
    const combinedResults = {
      url: url.value,
      seoResults: seoAnalysisResults.value,
      accessibilityResults: results.value,
      accessibilitySummary: accessibilitySummary.value,
      seoSummary: seoSummary.value,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('latestAnalysis', JSON.stringify(combinedResults));
  }
}

const accessibilitySummary = computed({
  get: () => {
    const contrastIssues = results.value.filter(issue => 
      issue.code && issue.code.toLowerCase().includes('contrast')).length;
    const focusIssues = results.value.filter(issue => 
      issue.code && issue.code.toLowerCase().includes('focus')).length;
    const nonTextIssues = results.value.filter(issue => 
      issue.code && (issue.code.toLowerCase().includes('alt') || issue.code.toLowerCase().includes('non-text'))).length;
    const labelIssues = results.value.filter(issue => 
      issue.code && issue.code.toLowerCase().includes('label')).length;
    
    return {
      errorCount: errorCount.value,
      warningCount: warningCount.value,
      noticeCount: noticeCount.value,
      contrastIssues,
      focusIssues,
      nonTextIssues,
      labelIssues,
      totalIssues: results.value.length
    };
  },
  set: (newValue) => {
    // Allow setting the summary if needed
    if (newValue) {
      Object.assign(accessibilitySummary.value, newValue);
    }
  }
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
  }
});

// Function to set scan completed and target URL
function setScanCompleted(url: string) {
  scanCompleted.value = true;
  targetUrl.value = url;
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
</style>
