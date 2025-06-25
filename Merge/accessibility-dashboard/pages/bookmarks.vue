<template>
  <div class="max-w-6xl mx-auto p-6" data-page="saved-reports">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Saved Reports & Scan History</h1>
      
      <!-- Tabs for Saved Reports and Scan History -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'reports'"
              :class="[
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Saved Reports ({{ reports.length }})
            </button>
            <button
              @click="activeTab = 'history'"
              :class="[
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Scan History ({{ scanHistory.length }})
            </button>
          </nav>
        </div>
      </div>

      <!-- Saved Reports Tab -->
      <div v-if="activeTab === 'reports'">
        <!-- No reports message -->
        <div v-if="reports.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved reports yet</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Your analysis reports will appear here once you run some scans.</p>
          <button 
            @click="goToDashboard" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Run Your First Analysis
          </button>
        </div>

        <!-- Reports list -->
        <div v-else class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ reports.length }} Saved Report{{ reports.length !== 1 ? 's' : '' }}
            </h2>
            <button 
              @click="clearAllReports" 
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          <div class="grid gap-4">
            <div 
              v-for="(report, index) in reports" 
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {{ report.url }}
                    </h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(report.timestamp) }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600">{{ report.errors || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Errors</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-yellow-600">{{ report.warnings || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Warnings</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ report.notices || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Notices</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-green-600">{{ report.scannedPages || 1 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Pages</div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 mb-3">
                    <span 
                      v-for="tool in report.tools" 
                      :key="tool"
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {{ tool }}
                    </span>
                  </div>
                </div>

                <div class="flex space-x-2 ml-4">
                  <button 
                    @click="viewReport(report)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    View
                  </button>
                  <button 
                    @click="deleteReport(index)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scan History Tab -->
      <div v-if="activeTab === 'history'">
        <!-- No history message -->
        <div v-if="scanHistory.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No scan history yet</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Your scan history will appear here once you run some analyses.</p>
          <button 
            @click="goToDashboard" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Run Your First Analysis
          </button>
        </div>

        <!-- History list -->
        <div v-else class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ scanHistory.length }} Scan{{ scanHistory.length !== 1 ? 's' : '' }} in History
            </h2>
            <button 
              @click="clearAllHistory" 
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear History
            </button>
          </div>

          <div class="grid gap-4">
            <div 
              v-for="(scan, index) in scanHistory" 
              :key="scan.id || index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {{ scan.url }}
                    </h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(scan.timestamp || scan.date) }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600">{{ scan.errors || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Errors</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-yellow-600">{{ scan.warnings || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Warnings</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ scan.notices || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Notices</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-green-600">{{ scan.scannedPages || 1 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Pages</div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 mb-3">
                    <span 
                      v-for="tool in scan.tools" 
                      :key="tool"
                      class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                    >
                      {{ tool }}
                    </span>
                  </div>

                  <div v-if="scan.scanDuration" class="text-xs text-gray-500 dark:text-gray-400">
                    Duration: {{ Math.round(scan.scanDuration / 1000) }}s
                  </div>
                </div>

                <div class="flex space-x-2 ml-4">
                  <button 
                    @click="viewScanHistory(scan)"
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    View
                  </button>
                  <button 
                    @click="deleteScanHistory(index)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const reports = ref([])
const scanHistory = ref([])
const activeTab = ref('reports')

// Load reports from localStorage
function loadReports() {
  try {
    // Use scanHistory instead of savedReports since that's where the actual data is saved
    const savedHistory = localStorage.getItem('scanHistory')
    if (savedHistory) {
      reports.value = JSON.parse(savedHistory)
    } else {
      reports.value = []
    }
  } catch (error) {
    console.error('Error loading saved reports:', error)
    reports.value = []
  }
}

// Load scan history from localStorage
function loadScanHistory() {
  try {
    const history = localStorage.getItem('scanHistory')
    if (history) {
      scanHistory.value = JSON.parse(history)
    } else {
      scanHistory.value = []
    }
  } catch (error) {
    console.error('Error loading scan history:', error)
    scanHistory.value = []
  }
}

// Save reports to localStorage
function saveReports() {
  try {
    // Save to scanHistory to maintain consistency with the main app
    localStorage.setItem('scanHistory', JSON.stringify(reports.value))
  } catch (error) {
    console.error('Error saving reports:', error)
  }
}

// Format date for display
function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date'
  
  try {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  } catch (error) {
    return 'Invalid date'
  }
}

// View a specific report
function viewReport(report) {
  // Store the report data for the dashboard to use
  localStorage.setItem('selectedReport', JSON.stringify(report))
  
  // Navigate to dashboard with the report data
  if (typeof window !== 'undefined') {
    window.location.href = '/#dashboard'
  }
}

// View a specific scan from history
function viewScanHistory(scan) {
  // Store the scan data for the dashboard to use
  localStorage.setItem('selectedScanHistory', JSON.stringify(scan))
  
  // Navigate to dashboard with the scan data
  if (typeof window !== 'undefined') {
    window.location.href = '/#dashboard'
  }
}

// Delete a specific report
function deleteReport(index) {
  if (confirm('Are you sure you want to delete this report?')) {
    reports.value.splice(index, 1)
    saveReports()
  }
}

// Delete a specific scan from history
function deleteScanHistory(index) {
  if (confirm('Are you sure you want to delete this scan from history?')) {
    scanHistory.value.splice(index, 1)
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory.value))
  }
}

// Clear all reports
function clearAllReports() {
  if (confirm('Are you sure you want to delete all saved reports? This action cannot be undone.')) {
    reports.value = []
    saveReports()
  }
}

// Clear all scan history
function clearAllHistory() {
  if (confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
    scanHistory.value = []
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory.value))
  }
}

// Go to dashboard
function goToDashboard() {
  if (typeof window !== 'undefined') {
    window.location.href = '/#dashboard'
  }
}

// Load reports on mount
onMounted(() => {
  loadReports()
  loadScanHistory()
  
  // Listen for storage changes to update the list
  const handleStorageChange = () => {
    loadReports()
    loadScanHistory()
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // Clean up event listener
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })
})

// Expose functions for parent components
defineExpose({
  loadReports,
  saveReports,
  loadScanHistory
})
</script>
