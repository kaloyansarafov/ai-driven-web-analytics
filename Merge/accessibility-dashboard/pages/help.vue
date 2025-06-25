<template>
  <div class="max-w-6xl mx-auto p-6" data-page="help">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Help & Support</h1>
      
      <!-- Quick Start Guide -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quick Start Guide</h2>
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">Getting Started</h3>
          <ol class="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Enter a website URL in the main dashboard</li>
            <li>Select the analysis types (Accessibility and/or SEO)</li>
            <li>Choose your preferred testing tools</li>
            <li>Click "Analyze" to start the scan</li>
            <li>View results in the dashboard of your choice</li>
          </ol>
        </div>
      </div>

      <!-- Analysis Types -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Analysis Types</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Accessibility Analysis
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Test your website for accessibility compliance and identify issues that affect users with disabilities.
            </p>
            <div class="space-y-2">
              <div class="flex items-center text-sm">
                <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span class="text-gray-700 dark:text-gray-300">Errors - Critical issues that must be fixed</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <span class="text-gray-700 dark:text-gray-300">Warnings - Issues that should be addressed</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span class="text-gray-700 dark:text-gray-300">Notices - Informational items</span>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              SEO Analysis
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Analyze your website's search engine optimization and get recommendations for improvement.
            </p>
            <div class="space-y-2">
              <div class="flex items-center text-sm">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span class="text-gray-700 dark:text-gray-300">Performance - Page speed and loading times</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span class="text-gray-700 dark:text-gray-300">Meta Tags - Title, description, and keywords</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <span class="text-gray-700 dark:text-gray-300">Content - Headings, links, and structure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Testing Tools -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Testing Tools</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Pa11y</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Automated accessibility testing tool that checks for WCAG compliance.</p>
          </div>
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">WAVE</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Web Accessibility Evaluation Tool with visual feedback and detailed reports.</p>
          </div>
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Lighthouse</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Google's automated tool for improving web page quality and performance.</p>
          </div>
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">IBM A11y</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">IBM's accessibility testing tool with comprehensive compliance checking.</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Views -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard Views</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Accessibility Dashboard</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Detailed view of accessibility issues with explanations and recommendations for each problem found.
            </p>
            <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Issue categorization by severity</li>
              <li>• Technical explanations</li>
              <li>• AI-powered recommendations</li>
              <li>• Code examples and fixes</li>
            </ul>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">SEO Dashboard</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Comprehensive SEO analysis with performance metrics, optimization suggestions, and improvement scores.
            </p>
            <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Performance metrics</li>
              <li>• SEO score breakdown</li>
              <li>• Optimization recommendations</li>
              <li>• Technical SEO analysis</li>
            </ul>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Combined Dashboard</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Unified view showing both accessibility and SEO results together for comprehensive website analysis.
            </p>
            <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Overall website score</li>
              <li>• Combined metrics</li>
              <li>• Cross-analysis insights</li>
              <li>• Unified recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Settings & Configuration</h2>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 class="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">WAVE API Key</h3>
          <p class="text-yellow-800 dark:text-yellow-200 mb-3">
            To use WAVE testing, you need to configure your WAVE API key in the Settings page.
          </p>
          <ol class="list-decimal list-inside space-y-1 text-yellow-800 dark:text-yellow-200 text-sm">
            <li>Go to the Settings page</li>
            <li>Enter your WAVE API key</li>
            <li>Click "Save" to store the key</li>
            <li>WAVE testing will now be available in your scans</li>
          </ol>
        </div>
      </div>

      <!-- Troubleshooting -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Troubleshooting</h2>
        <div class="space-y-4">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">Scan Not Starting</h3>
            <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Ensure you've entered a valid URL (including http:// or https://)</li>
              <li>• Check that at least one analysis type is selected</li>
              <li>• Verify your internet connection</li>
              <li>• Try refreshing the page and starting again</li>
            </ul>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">WAVE API Errors</h3>
            <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Verify your WAVE API key is correct in Settings</li>
              <li>• Check that your API key has sufficient credits</li>
              <li>• Ensure the website URL is accessible</li>
              <li>• Try using a different testing tool temporarily</li>
            </ul>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">No Results Showing</h3>
            <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Check that the scan completed successfully</li>
              <li>• Verify you're viewing the correct dashboard</li>
              <li>• Try refreshing the page</li>
              <li>• Check the browser console for any errors</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Support -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Need More Help?</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="text-center">
            <button 
              @click="goToDashboard" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <div class="text-center">
            <button 
              @click="goToSettings" 
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Navigation functions
function goToDashboard() {
  if (typeof window !== 'undefined') {
    window.location.href = '/#dashboard'
  }
}

function goToSettings() {
  if (typeof window !== 'undefined') {
    window.location.href = '/#settings'
  }
}

// Ensure the page always loads content
onMounted(() => {
  // This ensures the page is always responsive
  console.log('Help page loaded successfully')
})
</script> 