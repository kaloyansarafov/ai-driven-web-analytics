<template>
  <div class="seo-dashboard">
    <!-- SEO Score Breakdown Section (modern card style) -->
    <div class="score-breakdown-section card modern-score-breakdown">
      <h2 class="score-breakdown-title">SEO Score Breakdown</h2>
      <div class="score-breakdown-bar-chart">
        <div class="score-bar" style="background:#1976d2" :style="{width: (scoreBreakdown.meta || 0) + '%'}">
          <span class="score-bar-label">{{ scoreBreakdown.meta ?? 0 }}</span>
          <span class="score-bar-title">Meta</span>
        </div>
        <div class="score-bar" style="background:#43a047" :style="{width: (scoreBreakdown.content || 0) + '%'}">
          <span class="score-bar-label">{{ scoreBreakdown.content ?? 0 }}</span>
          <span class="score-bar-title">Content</span>
        </div>
        <div class="score-bar" style="background:#ff9800" :style="{width: (scoreBreakdown.technical || 0) + '%'}">
          <span class="score-bar-label">{{ scoreBreakdown.technical ?? 0 }}</span>
          <span class="score-bar-title">Technical</span>
        </div>
        <div class="score-bar" style="background:#f44336" :style="{width: (scoreBreakdown.structure || 0) + '%'}">
          <span class="score-bar-label">{{ scoreBreakdown.structure ?? 0 }}</span>
          <span class="score-bar-title">Structure</span>
        </div>
      </div>
      <div class="score-breakdown-cards">
        <div class="score-card total">
          <div class="score-card-title">Total Score</div>
          <div class="score-card-value">{{ scoreBreakdown.total ?? '-' }}</div>
          <span class="score-badge neutral">Overall</span>
        </div>
        <div class="score-card meta">
          <div class="score-card-title">Meta</div>
          <div class="score-card-value">{{ scoreBreakdown.meta ?? '-' }}</div>
          <span class="score-badge blue">Meta</span>
        </div>
        <div class="score-card content">
          <div class="score-card-title">Content</div>
          <div class="score-card-value">{{ scoreBreakdown.content ?? '-' }}</div>
          <span class="score-badge green">Content</span>
        </div>
        <div class="score-card technical">
          <div class="score-card-title">Technical</div>
          <div class="score-card-value">{{ scoreBreakdown.technical ?? '-' }}</div>
          <span class="score-badge orange">Technical</span>
        </div>
        <div class="score-card structure">
          <div class="score-card-title">Structure</div>
          <div class="score-card-value">{{ scoreBreakdown.structure ?? '-' }}</div>
          <span class="score-badge red">Structure</span>
        </div>
      </div>
      <div class="score-explanation modern">The SEO score is calculated based on four main categories: Meta, Content, Technical, and Structure. Each category contributes up to 25 points, for a total of 100. The score reflects the average across all successfully crawled pages.</div>
    </div>

    <!-- Add search component before the issues section -->
    <div class="mt-8">
      <IssueSearch
        :total-count="(props.analysis?.issues || []).length + (props.analysis?.robotsAnalysis?.issues || []).length"
        :filtered-count="filteredIssues.length + (props.analysis?.robotsAnalysis?.issues || []).filter(issue => {
          const query = searchQuery.toLowerCase();
          return !query || 
            issue.message.toLowerCase().includes(query) ||
            issue.recommendation.toLowerCase().includes(query);
        }).length"
        @search="handleSearch"
      />
    </div>

    <!-- Issues by Category Section (accordion/card style) -->
    <div class="category-issues-section">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">Issues by Category</h3>
          <button @click="openAIRecommendation({ type: 'info', message: 'General advice for Issues by Category', category: 'All' })"
                  class="ai-fix-button prominent">
            Fix with AI
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="cat in nonEmptyCategories" :key="cat" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-2">
                <template v-if="cat === 'Meta Data'">&#128196;</template>
                <template v-else-if="cat === 'Content'">&#128221;</template>
                <template v-else-if="cat === 'Technical'">&#9881;</template>
                <template v-else-if="cat === 'Robots.txt'">&#128203;</template>
                <template v-else>&#128203;</template>
              </span>
              <span class="category-title">{{ cat }}</span>
              <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({{ filteredIssuesByCategory[cat].length }})
              </span>
            </div>
            <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="issue in filteredIssuesByCategory[cat]" :key="issue.message"
                :class="{
                  'bg-red-50 dark:bg-red-900/20': issue.type === 'error',
                  'bg-yellow-50 dark:bg-yellow-900/20': issue.type === 'warning',
                  'bg-blue-50 dark:bg-blue-900/20': issue.type === 'notice'
                }"
                class="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                @click="scrollToIssue(issue)">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg v-if="issue.type === 'error'" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else-if="issue.type === 'warning'" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3 flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ issue.message }}</div>
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ issue.recommendation }}</div>
                    <div class="mt-1 text-xs text-gray-400 dark:text-gray-500">Page: {{ issue.url }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues by Page Section -->
    <div class="issues-by-page-section">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">Issues by Page</h3>
          <button @click="openAIRecommendation({ type: 'info', message: 'General advice for Issues by Page', category: 'All' })"
                  class="ai-fix-button prominent">
            Fix with AI
          </button>
        </div>
        <div v-for="(issues, url) in sortedIssuesByPage" :key="url" class="page-issues-block card">
          <div class="page-url-title">{{ url }}</div>
          <div v-if="issues.length === 0" class="no-issues">No issues</div>
          <div v-for="(issue, idx) in issues" :key="idx" 
            :id="`issue-${url}-${issue.message}`.replace(/[^a-zA-Z0-9-]/g, '-')"
            class="issue-card enhanced" 
            :class="issue.type">
            <div class="issue-header">
              <span class="issue-type-icon" :class="issue.type">
                <template v-if="issue.type === 'error'">&#9888;</template>
                <template v-else-if="issue.type === 'warning'">&#9889;</template>
                <template v-else>&#9432;</template>
              </span>
              <span class="issue-type-label" :class="issue.type">{{ issue.type.toUpperCase() }}</span>
              <span class="issue-message">{{ issue.message }}</span>
            </div>
            <div v-if="issue.element" class="issue-element">{{ issue.element }}</div>
            <div class="issue-recommendation">{{ issue.recommendation }}</div>
            <button @click="openAIRecommendation(issue)" class="ai-fix-button prominent">Get AI Analysis</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Robots.txt Analysis Section -->
    <div v-if="analysis.robotsAnalysis.exists" class="mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 robots-analysis-section">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">Robots.txt Analysis</h3>
          <button @click="openAIRecommendation({ type: 'info', message: 'General advice for Robots.txt', category: 'Robots.txt' })"
                  class="ai-fix-button prominent">
            Fix with AI
          </button>
        </div>

        <div class="space-y-4">
          <!-- Directives -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">User Agents</h4>
              <ul class="list-disc list-inside">
                <li v-for="agent in analysis.robotsAnalysis.directives.userAgent" :key="agent">
                  {{ agent }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">Sitemaps</h4>
              <ul class="list-disc list-inside">
                <li v-for="sitemap in analysis.robotsAnalysis.directives.sitemap" :key="sitemap">
                  {{ sitemap }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">Allow Directives</h4>
              <ul class="list-disc list-inside">
                <li v-for="path in analysis.robotsAnalysis.directives.allow" :key="path">
                  {{ path }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">Disallow Directives</h4>
              <ul class="list-disc list-inside">
                <li v-for="path in analysis.robotsAnalysis.directives.disallow" :key="path">
                  {{ path }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Crawl Delay -->
          <div v-if="analysis.robotsAnalysis.directives.crawlDelay !== null">
            <h4 class="font-medium mb-2">Crawl Delay</h4>
            <p>{{ analysis.robotsAnalysis.directives.crawlDelay }} seconds</p>
          </div>

          <!-- Issues -->
          <div v-if="analysis.robotsAnalysis.issues.length > 0">
            <h4 class="font-medium mb-2">Issues</h4>
            <div class="space-y-2">
              <div v-for="(issue, index) in analysis.robotsAnalysis.issues" :key="index"
                :class="{
                  'bg-red-50 dark:bg-red-900/20': issue.type === 'error',
                  'bg-yellow-50 dark:bg-yellow-900/20': issue.type === 'warning',
                  'bg-blue-50 dark:bg-blue-900/20': issue.type === 'notice'
                }"
                class="p-3 rounded-lg">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg v-if="issue.type === 'error'" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else-if="issue.type === 'warning'" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="text-sm font-medium" :class="{
                      'text-red-800 dark:text-red-200': issue.type === 'error',
                      'text-yellow-800 dark:text-yellow-200': issue.type === 'warning',
                      'text-blue-800 dark:text-blue-200': issue.type === 'notice'
                    }">
                      {{ issue.message }}
                    </h5>
                    <p class="mt-1 text-sm" :class="{
                      'text-red-700 dark:text-red-300': issue.type === 'error',
                      'text-yellow-700 dark:text-yellow-300': issue.type === 'warning',
                      'text-blue-700 dark:text-blue-300': issue.type === 'notice'
                    }">
                      {{ issue.recommendation }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- High Impact Issues Section (deduped and grouped) -->
    <div class="high-impact-section">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">High Impact Issues</h3>
          <button @click="openAIRecommendation({ type: 'info', message: 'General advice for High Impact Issues', category: 'High Impact' })"
                  class="ai-fix-button prominent">
            Fix with AI
          </button>
        </div>
        <div v-if="dedupedHighImpactIssues.length === 0" class="no-issues">No high impact issues</div>
        <div v-for="(issue, idx) in dedupedHighImpactIssues" :key="idx" class="high-impact-card">
          <div class="issue-header">
            <span class="issue-type error">High</span>
            <span class="issue-message">{{ issue.message }}</span>
          </div>
          <div class="issue-recommendation">{{ issue.recommendation }}</div>
          <div class="affected-pages">
            <span>Affected pages ({{ issue.pages.length }}):</span>
            <ul>
              <li v-for="url in issue.pages" :key="url" class="affected-page-url">{{ url }}</li>
            </ul>
          </div>
          <button @click="openAIRecommendation({ ...issue, url: issue.pages[0] })" class="ai-fix-button prominent">Get AI Analysis</button>
        </div>
      </div>
    </div>

    <!-- Main Body -->
    <div class="dashboard-main">
      <!-- Recommendations -->
      <div class="recommendations-section">
        <h2>SEO Improvement Recommendations</h2>
        <div v-for="priority in ['high', 'medium', 'low']" :key="priority" class="rec-group">
          <div class="rec-priority" :class="priority">
            <span v-if="priority === 'high'">High Priority</span>
            <span v-else-if="priority === 'medium'">Medium Priority</span>
            <span v-else>Low Priority</span>
          </div>
          <ul>
            <li v-for="rec in recommendationsByPriority[priority]" :key="rec.message">
              {{ rec.message }}
              <span class="rec-impact">{{ rec.impact }}</span>
              <button @click="openAIRecommendation(rec)" class="ai-fix-button prominent">Get AI Analysis</button>
            </li>
            <li v-if="recommendationsByPriority[priority].length === 0" class="no-recs">No {{ priority }} priority recommendations</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Technical Metrics Section -->
    <div class="metrics-section">
      <h2>Technical Metrics</h2>
      <div class="metrics-grid">
        <!-- Performance -->
        <div class="metric-card">
          <h3>Performance</h3>
          <div class="metric-item">
            <span>Load Time:</span>
            <span>{{ formatTime(analysis?.metrics.performance.loadTime) }}</span>
          </div>
          <div class="metric-item">
            <span>First Contentful Paint:</span>
            <span>{{ formatTime(analysis?.metrics.performance.firstContentfulPaint) }}</span>
          </div>
          <div class="metric-item">
            <span>Largest Contentful Paint:</span>
            <span>{{ formatTime(analysis?.metrics.performance.largestContentfulPaint) }}</span>
          </div>
          <div class="metric-item">
            <span>Time to Interactive:</span>
            <span>{{ formatTime(analysis?.metrics.performance.timeToInteractive) }}</span>
          </div>
        </div>
        <!-- Content -->
        <div class="metric-card">
          <h3>Content</h3>
          <div class="metric-item">
            <span>Word Count:</span>
            <span>{{ analysis?.metrics.content.wordCount }}</span>
          </div>
          <div class="metric-item">
            <span>Top Keywords:</span>
            <div class="keyword-list">
              <div v-for="(density, keyword) in topKeywords" :key="keyword" class="keyword-item">
                <span>{{ keyword }}</span>
                <span>{{ density.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Technical -->
        <div class="metric-card">
          <h3>Technical</h3>
          <div class="metric-item">
            <span>Images:</span>
            <span>{{ analysis?.metrics.technical.images.total }} total</span>
            <span>{{ analysis?.metrics.technical.images.withoutAlt }} missing alt</span>
          </div>
          <div class="metric-item">
            <span>Links:</span>
            <span>{{ analysis?.metrics.technical.links.internal }} internal</span>
            <span>{{ analysis?.metrics.technical.links.external }} external</span>
            <span>{{ analysis?.metrics.technical.links.broken }} broken</span>
          </div>
          <div class="metric-item">
            <span>Headings:</span>
            <span>H1: {{ analysis?.metrics.technical.headings.h1 }}</span>
            <span>H2: {{ analysis?.metrics.technical.headings.h2 }}</span>
            <span>H3: {{ analysis?.metrics.technical.headings.h3 }}</span>
          </div>
        </div>
        <!-- Meta -->
        <div class="metric-card">
          <h3>Meta Tags</h3>
          <div class="metric-item">
            <span>Title:</span>
            <span :class="{ 'missing': !analysis?.metrics.meta.hasTitle }">
              {{ analysis?.metrics.meta.hasTitle ? 'Present' : 'Missing' }}
            </span>
          </div>
          <div class="metric-item">
            <span>Description:</span>
            <span :class="{ 'missing': !analysis?.metrics.meta.hasDescription }">
              {{ analysis?.metrics.meta.hasDescription ? 'Present' : 'Missing' }}
            </span>
          </div>
          <div class="metric-item">
            <span>Canonical:</span>
            <span :class="{ 'missing': !analysis?.metrics.meta.hasCanonical }">
              {{ analysis?.metrics.meta.hasCanonical ? 'Present' : 'Missing' }}
            </span>
          </div>
          <div class="metric-item">
            <span>Social Tags:</span>
            <span>{{ analysis?.metrics.meta.ogTags }} OG</span>
            <span>{{ analysis?.metrics.meta.twitterTags }} Twitter</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Crawled Pages Section -->
    <div class="crawled-pages-section">
      <h2>Crawled Pages ({{ analysis?.crawledPages.total }})</h2>
      <div class="pages-list">
        <div v-for="(page, index) in analysis?.crawledPages.pages" :key="index" class="page-card">
          <div class="page-header">
            <h3 class="page-url">{{ page.url }}</h3>
            <span class="page-status" :class="getStatusClass(page.status)">
              Status: {{ page.status }}
            </span>
          </div>
          <div class="page-metrics">
            <div class="metric-group">
              <h4>Content</h4>
              <div class="metric-item">
                <span>Word Count:</span>
                <span>{{ page.wordCount }}</span>
              </div>
              <div class="metric-item">
                <span>Headings:</span>
                <span>H1: {{ page.headings.h1 }}</span>
                <span>H2: {{ page.headings.h2 }}</span>
                <span>H3: {{ page.headings.h3 }}</span>
              </div>
            </div>
            <div class="metric-group">
              <h4>Images</h4>
              <div class="metric-item">
                <span>Total:</span>
                <span>{{ page.images.total }}</span>
              </div>
              <div class="metric-item">
                <span>With Alt:</span>
                <span>{{ page.images.withAlt }}</span>
              </div>
              <div class="metric-item">
                <span>Without Alt:</span>
                <span>{{ page.images.withoutAlt }}</span>
              </div>
            </div>
            <div class="metric-group">
              <h4>Links</h4>
              <div class="metric-item">
                <span>Internal:</span>
                <span>{{ page.links.internal }}</span>
              </div>
              <div class="metric-item">
                <span>External:</span>
                <span>{{ page.links.external }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations by Page Section -->
    <div class="recommendations-by-page-section">
      <h2>Recommendations by Page</h2>
      <div v-for="(recs, url) in recommendationsByPage" :key="url" class="page-recs-block">
        <div class="page-url-title">{{ url }}</div>
        <div v-if="recs.length === 0" class="no-recs">No recommendations</div>
        <ul>
          <li v-for="rec in recs" :key="rec.message">
            <span class="rec-priority" :class="rec.priority">{{ rec.priority.toUpperCase() }}</span>
            {{ rec.message }}
            <span class="rec-impact">{{ rec.impact }}</span>
            <button @click="openAIRecommendation(rec)" class="ai-fix-button prominent">Get AI Analysis</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Failed Pages Section -->
    <div v-if="failedPages.length" class="failed-pages-section">
      <h2>Failed Pages</h2>
      <div v-for="page in failedPages" :key="page.url" class="failed-page-block">
        <div class="failed-page-url">{{ page.url }}</div>
        <div class="failed-page-status">Status: {{ page.status }}</div>
        <div class="failed-page-error">Failed to load page content.</div>
      </div>
    </div>

    <!-- Add AIRecommendation side panel component at the root -->
    <AIRecommendation
      :is-open="isAIRecommendationOpen"
      :issue="selectedIssue"
      @close="closeAIRecommendation"
    />
  </div>
</template>

<script setup lang="ts">
import CircleProgress from 'vue3-circle-progress';
import { computed, ref } from 'vue';
import type { SEOAnalysis } from '../utils/seo/SEOAnalyzer';
import AIRecommendation from './AIRecommendation.vue';
import IssueSearch from './IssueSearch.vue';

const props = defineProps<{ analysis: SEOAnalysis | null }>();

const seoScore = computed(() =>
  props.analysis?.score ?? 0
);
const scoreColor = computed(() =>
  seoScore.value >= 80 ? '#4CAF50' : seoScore.value >= 60 ? '#FFC107' : '#F44336'
);

const scoreBreakdown = computed(() => props.analysis?.scoreBreakdown || {});

const categoryScores = computed(() => {
  const m = props.analysis?.metrics;
  if (!m) return [];
  // Meta
  let metaScore = 0;
  metaScore += m.meta.hasTitle ? 20 : 0;
  metaScore += m.meta.hasDescription ? 20 : 0;
  metaScore += m.meta.hasCanonical ? 15 : 0;
  metaScore += m.meta.hasRobots ? 15 : 0;
  metaScore += m.meta.ogTags > 0 ? 15 : 0;
  metaScore += m.meta.twitterTags > 0 ? 15 : 0;
  // Content
  let contentScore = 0;
  contentScore += m.content.wordCount > 300 ? 40 : 0;
  contentScore += Object.keys(m.content.keywordDensity).length > 2 ? 30 : 0;
  contentScore += m.technical.headings.h1 === 1 ? 30 : 0;
  // Technical
  let technicalScore = 0;
  technicalScore += m.technical.images.withAlt === m.technical.images.total && m.technical.images.total > 0 ? 30 : 0;
  technicalScore += m.technical.links.broken === 0 ? 30 : 0;
  technicalScore += m.performance.loadTime < 3000 ? 40 : 0;
  // Structure
  let structureScore = 0;
  structureScore += m.technical.headings.h1 === 1 ? 30 : 0;
  structureScore += m.technical.headings.h2 >= 2 ? 30 : 0;
  structureScore += m.technical.headings.h3 >= 1 ? 20 : 0;
  structureScore += m.technical.links.internal > 0 ? 20 : 0;
  return [
    { name: 'Meta Data', score: Math.round(metaScore / 100 * 100) },
    { name: 'Content', score: Math.round(contentScore / 100 * 100) },
    { name: 'Technical', score: Math.round(technicalScore / 100 * 100) },
    { name: 'Structure', score: Math.round(structureScore / 100 * 100) }
  ];
});

const issuesByImpact = computed(() => {
  const grouped = { high: [], medium: [], low: [] };
  (props.analysis?.issues || []).forEach(issue => {
    if (issue.type === 'error') grouped.high.push(issue);
    else if (issue.type === 'warning') grouped.medium.push(issue);
    else grouped.low.push(issue);
  });
  return grouped;
});

const issueCounts = computed(() => ({
  high: issuesByImpact.value.high.length,
  medium: issuesByImpact.value.medium.length,
  low: issuesByImpact.value.low.length
}));

const categoryList = ['Meta Data', 'Content', 'Technical', 'Structure', 'Robots.txt'];

const searchQuery = ref('');
const filteredIssues = computed(() => {
  if (!searchQuery.value) return props.analysis?.issues || [];
  
  const query = searchQuery.value.toLowerCase();
  return (props.analysis?.issues || []).filter(issue => 
    issue.message.toLowerCase().includes(query) ||
    issue.recommendation?.toLowerCase().includes(query) ||
    issue.url?.toLowerCase().includes(query)
  );
});

const filteredIssuesByCategory = computed(() => {
  const grouped = {
    'Meta Data': [],
    'Content': [],
    'Technical': [],
    'Structure': [],
    'Robots.txt': []
  };

  filteredIssues.value.forEach(issue => {
    const msg = (issue.message + ' ' + (issue.recommendation || '')).toLowerCase();
    if (msg.includes('meta') || msg.includes('title') || msg.includes('description') || msg.includes('canonical') || msg.includes('robots') || msg.includes('og') || msg.includes('twitter')) grouped['Meta Data'].push(issue);
    else if (msg.includes('content') || msg.includes('word count') || msg.includes('keyword')) grouped['Content'].push(issue);
    else if (msg.includes('image') || msg.includes('link') || msg.includes('performance') || msg.includes('load time')) grouped['Technical'].push(issue);
    else if (msg.includes('heading') || msg.includes('structure')) grouped['Structure'].push(issue);
    else grouped['Technical'].push(issue);
  });

  // Add robots.txt issues
  if (props.analysis?.robotsAnalysis?.issues) {
    grouped['Robots.txt'] = props.analysis.robotsAnalysis.issues.filter(issue => {
      const query = searchQuery.value.toLowerCase();
      return !query || 
        issue.message.toLowerCase().includes(query) ||
        issue.recommendation.toLowerCase().includes(query);
    }).map(issue => ({
      ...issue,
      url: props.analysis.url // Add the root URL to each robots.txt issue
    }));
  }

  return grouped;
});

const recommendationsByPriority = computed(() => {
  const grouped = { high: [], medium: [], low: [] };
  (props.analysis?.recommendations || []).forEach(rec => {
    grouped[rec.priority].push(rec);
  });
  return grouped;
});

const topKeywords = computed(() => {
  if (!props.analysis?.metrics.content.keywordDensity) return {};
  return Object.entries(props.analysis.metrics.content.keywordDensity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
});

const formatTime = (ms: number | undefined) => {
  if (!ms || ms === 0) return 'N/A';
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const getStatusClass = (status: number) => {
  if (status >= 200 && status < 300) return 'success';
  if (status >= 300 && status < 400) return 'redirect';
  if (status >= 400 && status < 500) return 'client-error';
  if (status >= 500) return 'server-error';
  return 'unknown';
};

const sortedIssuesByPage = computed(() => {
  // Sort issues by type: error > warning > info
  const order = { error: 0, warning: 1, info: 2 };
  const grouped: Record<string, any[]> = {};
  (props.analysis?.issues || []).forEach(issue => {
    if (!grouped[issue.url]) grouped[issue.url] = [];
    grouped[issue.url].push(issue);
  });
  Object.keys(grouped).forEach(url => {
    grouped[url].sort((a, b) => order[a.type] - order[b.type]);
  });
  return grouped;
});

const recommendationsByPage = computed(() => {
  const grouped: Record<string, any[]> = {};
  (props.analysis?.recommendations || []).forEach(rec => {
    if (!grouped[rec.url]) grouped[rec.url] = [];
    grouped[rec.url].push(rec);
  });
  return grouped;
});

const failedPages = computed(() =>
  (props.analysis?.crawledPages.pages || []).filter((p: any) => p.status === 0)
);
const successfulPages = computed(() =>
  (props.analysis?.crawledPages.pages || []).filter((p: any) => p.status !== 0)
);

const dedupedHighImpactIssues = computed(() => {
  const highIssues = (props.analysis?.issues || []).filter(i => i.type === 'error' || i.type === 'warning');
  const grouped: Record<string, { message: string; recommendation: string; pages: string[] } > = {};
  highIssues.forEach(issue => {
    const key = issue.message + '|' + issue.recommendation;
    if (!grouped[key]) {
      grouped[key] = { message: issue.message, recommendation: issue.recommendation, pages: [] };
    }
    if (!grouped[key].pages.includes(issue.url)) {
      grouped[key].pages.push(issue.url);
    }
  });
  return Object.values(grouped);
});

const isAIRecommendationOpen = ref(false);
const selectedIssue = ref<any>(null);

function openAIRecommendation(issue: any) {
  selectedIssue.value = {
    ...issue,
    type: issue.type || 'info',
    message: issue.message,
    context: issue.context || '',
    detail: issue.detail || issue.recommendation || '',
    source: 'seo',
    category: issue.category || 'General',
    url: issue.url || ''
  };
  isAIRecommendationOpen.value = true;
}

function closeAIRecommendation() {
  isAIRecommendationOpen.value = false;
  selectedIssue.value = null;
}

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const nonEmptyCategories = computed(() => {
  return categoryList.filter(cat => filteredIssuesByCategory.value[cat].length > 0);
});

function scrollToIssue(issue: any) {
  // Handle robots.txt issues
  if (issue.category === 'Robots.txt' || issue.url === props.analysis?.url) {
    const robotsSection = document.querySelector('.robots-analysis-section');
    if (robotsSection) {
      robotsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a temporary highlight effect
      robotsSection.classList.add('highlight-issue');
      setTimeout(() => {
        robotsSection.classList.remove('highlight-issue');
      }, 2000);
    }
    return;
  }

  // Find the corresponding issue in the issues by page section
  const pageIssues = sortedIssuesByPage.value[issue.url] || [];
  const targetIssue = pageIssues.find((i: any) => 
    i.message === issue.message && 
    i.recommendation === issue.recommendation
  );

  if (targetIssue) {
    // Create a unique ID for the issue if it doesn't exist
    const issueId = `issue-${issue.url}-${issue.message}`.replace(/[^a-zA-Z0-9-]/g, '-');
    const element = document.getElementById(issueId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a temporary highlight effect
      element.classList.add('highlight-issue');
      setTimeout(() => {
        element.classList.remove('highlight-issue');
      }, 2000);
    }
  }
}
</script>

<style scoped>
.seo-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  /* background: #fff; */
}

/* --- CARD STYLING TO MATCH AccessibilityAnalysis.vue --- */
.card,
.score-breakdown-section,
.modern-score-breakdown,
.category-card,
.category-accordion-card,
.high-impact-section,
.recommendations-section,
.metrics-section .metric-card,
.crawled-pages-section,
.failed-pages-section,
.page-card,
.page-issues-block,
.page-recs-block {
  background: #fff;
  border-radius: 0.75rem; /* rounded-lg */
  box-shadow: 0 4px 24px 0 rgba(30,41,59,0.08), 0 1.5px 4px 0 rgba(30,41,59,0.03); /* shadow-md */
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

/* Score bar title and explanation text for contrast */
.score-bar-title,
.score-explanation,
.score-explanation.modern {
  color: #374151; /* text-gray-700 */
  font-weight: 500;
}

/* In dark mode, use Tailwind's text-gray-300 for these */
.dark .card,
.dark .score-breakdown-section,
.dark .modern-score-breakdown,
.dark .category-card,
.dark .category-accordion-card,
.dark .high-impact-section,
.dark .recommendations-section,
.dark .metrics-section .metric-card,
.dark .crawled-pages-section,
.dark .failed-pages-section,
.dark .page-card,
.dark .page-issues-block,
.dark .page-recs-block {
  background: #1f2937 !important; /* bg-gray-800 */
  color: #f3f4f6 !important; /* text-gray-100 */
  border-color: #374151 !important; /* border-gray-700 */
}
.dark .score-bar-title,
.dark .score-explanation,
.dark .score-explanation.modern {
  color: #d1d5db !important; /* text-gray-300 */
  font-weight: 500;
}

/* Remove custom backgrounds on .score-card, use card style above */
.score-card {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}
.dark .score-card {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

/* Remove custom color on .score-bar-title in all modes */

/* Remove custom color on .score-explanation in all modes */

.dashboard-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.score-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.score-label {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}
.issue-summary-bar {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0 0.5rem 0;
  justify-content: center;
}
.issue-summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  min-width: 60px;
}
.issue-summary-item .count {
  font-size: 2rem;
  font-weight: bold;
}
.issue-summary-item.high { color: #d32f2f; }
.issue-summary-item.medium { color: #ff9800; }
.issue-summary-item.low { color: #1976d2; }
.category-cards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.category-card {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.2rem 2rem;
  background: #fff;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.category-score {
  font-size: 2rem;
  font-weight: bold;
}
.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.high-impact-section {
  background: #f9fafb; /* bg-gray-50 */
  color: #1e293b;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(30,41,59,0.04);
  border-left: 6px solid #F44336;
  border: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  margin-bottom: 1.2rem;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.dark .high-impact-card {
  background: #374151 !important; /* bg-gray-700 */
  color: #f3f4f6 !important;
  border-left: 6px solid #ef4444 !important;
  border-color: #374151 !important;
}
.high-impact-section h2 {
  color: #d32f2f;
  margin-bottom: 1rem;
}
.category-issues-section {
  margin-bottom: 2rem;
}
.category-accordion {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.category-accordion-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.2rem 1.5rem;
  margin-bottom: 0.5rem;
}
.category-accordion-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
}
.category-icon {
  font-size: 1.5rem;
  vertical-align: middle;
}
.category-title {
  flex: 1;
}
.category-issue-count {
  color: #888;
  font-size: 1rem;
  font-weight: 400;
}
.category-accordion-header.meta-data { color: #1976d2; }
.category-accordion-header.content { color: #43a047; }
.category-accordion-header.technical { color: #ff9800; }
.category-accordion-header.structure { color: #f44336; }
.category-accordion-body {
  padding-left: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.issue-card.mini {
  background: #f8fafc;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  padding: 0.7rem 1rem;
  margin-bottom: 0.2rem;
  border-left-width: 4px;
  border-left-style: solid;
}
.issue-card.mini.error { border-left-color: #F44336; }
.issue-card.mini.warning { border-left-color: #FFC107; }
.issue-card.mini.info { border-left-color: #2196F3; }
.no-issues {
  color: #bbb;
  font-style: italic;
  text-align: center;
  margin-bottom: 1rem;
}
.issue-card,
.issue-card.enhanced {
  background: #f9fafb; /* bg-gray-50 */
  color: #1e293b;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(30,41,59,0.04);
  border: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
}
.dark .issue-card,
.dark .issue-card.enhanced {
  background: #374151 !important; /* bg-gray-700 */
  color: #f3f4f6 !important;
  border-color: #374151 !important;
}
.issue-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.issue-type {
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.7rem;
  display: inline-block;
}
.issue-card.error .issue-type {
  background: #fee2e2; /* bg-red-100 */
  color: #991b1b;      /* text-red-800 */
}
.issue-card.warning .issue-type {
  background: #fef9c3; /* bg-yellow-100 */
  color: #92400e;      /* text-yellow-800 */
}
.issue-card.info .issue-type {
  background: #dbeafe; /* bg-blue-100 */
  color: #1e40af;      /* text-blue-800 */
}
.dark .issue-card.error .issue-type {
  background: rgba(185,28,28,0.4) !important; /* bg-red-900/40 */
  color: #fca5a5 !important;                  /* text-red-200 */
}
.dark .issue-card.warning .issue-type {
  background: rgba(202,138,4,0.4) !important; /* bg-yellow-900/40 */
  color: #fde68a !important;                  /* text-yellow-200 */
}
.dark .issue-card.info .issue-type {
  background: rgba(30,64,175,0.4) !important; /* bg-blue-900/40 */
  color: #bfdbfe !important;                  /* text-blue-200 */
}
.issue-element {
  background: #f3f4f6; /* bg-gray-100 */
  color: #1e293b;      /* text-gray-800 */
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-family: monospace;
  font-size: 0.95em;
}
.dark .issue-element {
  background: #1f2937 !important; /* bg-gray-800 */
  color: #f3f4f6 !important;      /* text-gray-100 */
}
.recommendations-section {
  margin-top: 2rem;
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}
.rec-group {
  margin-bottom: 1.5rem;
}
.rec-priority {
  font-weight: bold;
  margin-bottom: 0.5rem;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  display: inline-block;
}
.rec-priority.high { background: #fdecea; color: #d32f2f; }
.rec-priority.medium { background: #fff8e1; color: #ff9800; }
.rec-priority.low { background: #e3f2fd; color: #1976d2; }
.rec-impact {
  font-size: 0.9em;
  color: #888;
  margin-left: 0.5em;
}
.no-recs {
  color: #bbb;
  font-style: italic;
}
.metrics-section {
  margin-bottom: 2rem;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.metric-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.metric-card h3 {
  margin-bottom: 1rem;
  color: #333;
}
.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.metric-item span {
  color: #666;
}
.metric-item span:first-child {
  font-weight: bold;
  color: #333;
}
.missing {
  color: #F44336;
}
.keyword-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.keyword-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}
.keyword-item:last-child {
  border-bottom: none;
}
.crawled-pages-section {
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.pages-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}
.page-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.page-url {
  font-size: 1rem;
  color: #2d3748;
  word-break: break-all;
}
.page-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}
.page-status.success {
  background: #c6f6d5;
  color: #2f855a;
}
.page-status.redirect {
  background: #e9d8fd;
  color: #553c9a;
}
.page-status.client-error {
  background: #fed7d7;
  color: #c53030;
}
.page-status.server-error {
  background: #fed7d7;
  color: #c53030;
}
.page-status.unknown {
  background: #e2e8f0;
  color: #4a5568;
}
.page-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.metric-group {
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}
.metric-group h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}
.metric-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}
.metric-item:last-child {
  margin-bottom: 0;
}
.score-breakdown-section {
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}
.score-breakdown-grid {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}
.score-breakdown-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.1rem;
  min-width: 120px;
  flex: 1;
  margin-bottom: 0.5rem;
}
.score-breakdown-item.total {
  font-weight: bold;
  color: #1976d2;
}
.score-breakdown-item .label {
  color: #888;
}
.score-breakdown-item .value {
  font-size: 1.3rem;
}
.score-explanation {
  font-size: 0.95rem;
  color: #666;
  margin-top: 0.5rem;
  margin-bottom: 0;
}
.issues-by-page-section, .recommendations-by-page-section {
  margin-bottom: 2rem;
}
.page-issues-block, .page-recs-block {
  background: #f8fafc;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.page-url-title {
  font-size: 1.05rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
  color: #1976d2;
}
.failed-pages-section {
  margin-bottom: 2rem;
  background: #fff3f3;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(211,47,47,0.04);
}
.failed-page-block {
  margin-bottom: 1rem;
}
.failed-page-url {
  font-weight: bold;
  color: #d32f2f;
}
.failed-page-status {
  color: #888;
}
.failed-page-error {
  color: #d32f2f;
  font-style: italic;
}
.rec-priority.high { background: #fdecea; color: #d32f2f; padding: 0.2em 0.5em; border-radius: 4px; margin-right: 0.5em; }
.rec-priority.medium { background: #fff8e1; color: #ff9800; padding: 0.2em 0.5em; border-radius: 4px; margin-right: 0.5em; }
.rec-priority.low { background: #e3f2fd; color: #1976d2; padding: 0.2em 0.5em; border-radius: 4px; margin-right: 0.5em; }
.rec-impact { font-size: 0.9em; color: #888; margin-left: 0.5em; }
.high-impact-card {
  background: #f9fafb; /* bg-gray-50 */
  color: #1e293b;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(30,41,59,0.04);
  border-left: 6px solid #F44336;
  border: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.dark .high-impact-card {
  background: #374151 !important; /* bg-gray-700 */
  color: #f3f4f6 !important;
  border-left: 6px solid #ef4444 !important;
  border-color: #374151 !important;
}
.affected-pages {
  margin-top: 0.7rem;
  font-size: 0.97rem;
}
.affected-page-url {
  color: #1976d2;
  font-size: 0.95rem;
  word-break: break-all;
}
.issue-url {
  margin-top: 0.5rem;
  font-size: 0.93rem;
  color: #888;
}
.issue-url-link {
  color: #1976d2;
  word-break: break-all;
}
.issue-card.enhanced {
  border-left-width: 6px;
  margin-bottom: 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.1rem 1.5rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.issue-type-icon {
  font-size: 1.3rem;
  margin-right: 0.7rem;
  vertical-align: middle;
}
.issue-type-label {
  font-size: 0.95rem;
  font-weight: bold;
  margin-right: 0.7rem;
  text-transform: uppercase;
  padding: 0.2em 0.6em;
  border-radius: 4px;
}
.issue-type-label.error {
  background: #fdecea;
  color: #d32f2f;
}
.dark .issue-type-label.error {
  background: #7f1d1d !important; /* bg-red-900 */
  color: #fca5a5 !important;      /* text-red-200 */
}

.issue-type-label.warning {
  background: #fff8e1;
  color: #ff9800;
}
.dark .issue-type-label.warning {
  background: #78350f !important; /* bg-yellow-900 */
  color: #fde68a !important;      /* text-yellow-200 */
}
.issue-type-label.info {
  background: #e3f2fd;
  color: #1976d2;
}
.dark .issue-type-label.info {
  background: #1e3a8a !important; /* bg-blue-900 */
  color: #bfdbfe !important;      /* text-blue-200 */
}
.issue-card.error { border-left: 6px solid #F44336; }
.issue-card.warning { border-left: 6px solid #FFC107; }
.issue-card.info { border-left: 6px solid #2196F3; }
.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
}
.score-breakdown-section {
  margin-bottom: 2rem;
}
.score-breakdown-grid {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.score-breakdown-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.1rem;
  min-width: 120px;
  flex: 1;
  margin-bottom: 0.5rem;
}
.score-breakdown-item.total {
  font-weight: bold;
  color: #1976d2;
}
.score-breakdown-item .label {
  color: #888;
  margin-bottom: 0.2rem;
}
.score-breakdown-item .value {
  font-size: 1.3rem;
  margin-top: 0.2rem;
}
.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 0.2rem 0 0.2rem 0;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s;
}
.score-explanation {
  font-size: 0.95rem;
  color: #666;
  margin-top: 0.5rem;
  margin-bottom: 0;
}
.ai-fix-button.prominent {
  background: none;
  color: #1976d2;
  font-size: 1em;
  padding: 0.4em 1.2em;
  margin-left: 0.3em;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border 0.15s, box-shadow 0.15s;
  white-space: nowrap;
  line-height: 1.2;
  font-weight: 500;
  box-shadow: none;
  max-width: max-content;
}
.ai-fix-button.prominent:hover,
.ai-fix-button.prominent:focus {
  background: #e3f2fd;
  border: 1.5px solid #1976d2;
  color: #1976d2;
  outline: none;
  box-shadow: 0 0 0 2px #1976d2, 0 1.5px 4px 0 rgba(30,41,59,0.03);
  transition: background 0.15s, border 0.15s, box-shadow 0.15s;
}
.dark .ai-fix-button.prominent:hover,
.dark .ai-fix-button.prominent:focus {
  background: #1e3a8a !important;
  border: 1.5px solid #60a5fa !important;
  color: #60a5fa !important;
  box-shadow: 0 0 0 2px #60a5fa, 0 1.5px 4px 0 rgba(30,41,59,0.10);
}
/* Remove icon emoji, use SVG in template instead */
.ai-fix-button.prominent::before {
  content: none;
}
/* Responsive: slightly larger touch area on mobile */
@media (max-width: 600px) {
  .ai-fix-button.prominent {
    padding: 0.3em 0.7em;
    font-size: 1.2em;
  }
}
/* Tooltip styling */
.ai-fix-button.prominent[aria-label]:hover::after,
.ai-fix-button.prominent[aria-label]:focus::after {
  content: attr(aria-label);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #222;
  color: #fff;
  font-size: 0.75em;
  padding: 0.25em 0.6em;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
  opacity: 1;
  pointer-events: none;
  margin-left: 0.5em;
}
/* Remove absolute positioning from previous attempts */
.issue-card .ai-fix-button.prominent,
.issue-card.mini .ai-fix-button.prominent {
  position: static;
  left: unset;
  top: unset;
  margin: 0 0 0 0.3em;
}
.issue-card, .issue-card.mini {
  position: relative;
}
/* Show button text if present */
.ai-fix-button.prominent span {
  display: inline;
  margin-left: 0.3em;
  font-size: 0.95em;
}
/* Modern Score Breakdown Styles */
.modern-score-breakdown {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem 2.5rem 2.5rem 2.5rem;
  margin-bottom: 2.5rem;
}
.score-breakdown-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.score-breakdown-bar-chart {
  display: flex;
  gap: 2.5rem;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 2.2rem;
  margin-top: 0.5rem;
}
.score-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 60px;
  height: 80px;
  border-radius: 8px 8px 0 0;
  position: relative;
  margin-bottom: 0.5rem;
  transition: width 0.4s;
}
.score-bar-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
  margin-top: 0.7rem;
}
.score-bar-title {
  font-size: 1rem;
  color: #222;
  margin-top: 0.5rem;
  font-weight: 500;
  background: #fff;
  border-radius: 6px;
  padding: 0.1em 0.7em;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  position: absolute;
  bottom: -2.1em;
  left: 50%;
  transform: translateX(-50%);
}
.score-breakdown-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.score-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid transparent;
}
.score-card.total {
  border-color: #e0e0e0;
}
.score-card.meta {
  border-color: #1976d2;
}
.score-card.content {
  border-color: #43a047;
}
.score-card.technical {
  border-color: #ff9800;
}
.score-card.structure {
  border-color: #f44336;
}
.dark .score-card {
  background: #23272f !important;
  color: #f3f4f6 !important;
  border-color: #374151 !important;
}
.dark .score-card.total {
  border-color: #374151 !important;
}
.dark .score-card.meta {
  border-color: #2563eb !important;
}
.dark .score-card.content {
  border-color: #22c55e !important;
}
.dark .score-card.technical {
  border-color: #f59e42 !important;
}
.dark .score-card.structure {
  border-color: #ef4444 !important;
}

.score-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.5rem;
}
.score-card-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 0.7rem;
}
.score-badge {
  font-size: 0.95em;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.2em 0.9em;
  margin-top: 0.2em;
  background: #e0e0e0;
  color: #222;
  display: inline-block;
}
.score-badge.neutral {
  background: #e0e0e0;
  color: #222;
}
.score-badge.blue {
  background: #e3f2fd;
  color: #1976d2;
}
.score-badge.green {
  background: #e8f5e9;
  color: #43a047;
}
.score-badge.orange {
  background: #fff3e0;
  color: #ff9800;
}
.score-badge.red {
  background: #ffebee;
  color: #f44336;
}
.score-explanation.modern {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
  margin-bottom: 0;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Dark mode styles */
.dark .custom-scrollbar {
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

.highlight-issue {
  animation: highlight 2s ease-out;
}

@keyframes highlight {
  0% {
    background-color: rgba(59, 130, 246, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

/* DARK MODE OVERRIDES */
.dark .seo-dashboard {
  /* background: #111827 !important; */
}
.dark .score-breakdown-section,
.dark .card,
.dark .modern-score-breakdown,
.dark .category-card,
.dark .category-accordion-card,
.dark .high-impact-section,
.dark .recommendations-section,
.dark .metrics-section .metric-card,
.dark .crawled-pages-section,
.dark .failed-pages-section,
.dark .page-card,
.dark .page-issues-block,
.dark .page-recs-block {
  background: #1f2937 !important; /* bg-gray-800 */
  color: #f3f4f6 !important; /* text-gray-100 */
  border-color: #374151 !important; /* border-gray-700 */
}
.dark .score-breakdown-title,
.dark .score-card-title,
.dark .score-card-value,
.dark .score-explanation,
.dark .score-bar-title,
.dark .category-title,
.dark .page-url-title,
.dark .issue-header,
.dark .issue-type-label,
.dark .issue-type-icon,
.dark .metric-card h3,
.dark .score-breakdown-item.total {
  color: #f3f4f6 !important; /* text-gray-100 */
}
.dark .score-explanation.modern,
.dark .issue-recommendation,
.dark .rec-impact,
.dark .no-issues,
.dark .no-recs,
.dark .metric-item span,
.dark .category-issue-count {
  color: #d1d5db !important; /* text-gray-300 */
}
.dark .score-card {
  background: #23272f !important;
  color: #f3f4f6 !important;
  border-color: #374151 !important;
}
.dark .score-badge.neutral {
  background: #374151 !important;
  color: #f3f4f6 !important;
}
.dark .score-badge.blue {
  background: #1e40af !important;
  color: #93c5fd !important;
}
.dark .score-badge.green {
  background: #166534 !important;
  color: #6ee7b7 !important;
}
.dark .score-badge.orange {
  background: #78350f !important;
  color: #fde68a !important;
}
.dark .score-badge.red {
  background: #7f1d1d !important;
  color: #fca5a5 !important;
}
.dark .bg-red-50 {
  background: rgba(185,28,28,0.12) !important; /* bg-red-900/20 */
}
.dark .bg-yellow-50 {
  background: rgba(202,138,4,0.08) !important; /* bg-yellow-900/10 */
}
.dark .bg-blue-50 {
  background: rgba(30,64,175,0.08) !important; /* bg-blue-900/10 */
}
.dark .border-gray-200 {
  border-color: #374151 !important;
}
.dark .border-blue-200 {
  border-color: #1e40af !important;
}
.dark .border-green-200 {
  border-color: #166534 !important;
}
.dark .border-yellow-200 {
  border-color: #78350f !important;
}
.dark .border-red-200 {
  border-color: #7f1d1d !important;
}
.dark .text-gray-800,
.dark .text-gray-900 {
  color: #f3f4f6 !important;
}
.dark .text-gray-700 {
  color: #d1d5db !important;
}
.dark .text-blue-700 {
  color: #60a5fa !important;
}
.dark .text-green-700 {
  color: #6ee7b7 !important;
}
.dark .text-yellow-700 {
  color: #fde68a !important;
}
.dark .text-red-700 {
  color: #fca5a5 !important;
}
.dark .text-blue-400 {
  color: #93c5fd !important;
}
.dark .text-green-400 {
  color: #6ee7b7 !important;
}
.dark .text-yellow-400 {
  color: #fde68a !important;
}
.dark .text-red-400 {
  color: #fca5a5 !important;
}
.dark .text-gray-500 {
  color: #9ca3af !important;
}
.dark .text-gray-400 {
  color: #6b7280 !important;
}
.dark .bg-gray-50 {
  background: #23272f !important;
}
.dark .bg-gray-100 {
  background: #23272f !important;
}
.dark .bg-gray-200 {
  background: #23272f !important;
}
.dark .bg-gray-700 {
  background: #23272f !important;
}
.dark .bg-gray-800 {
  background: #1f2937 !important;
}
.dark .bg-white {
  background: #1f2937 !important;
}

/* ...existing styles... */
.dark .issue-card.error .issue-type {
  background: #7f1d1d !important; /* bg-red-900 */
  color: #fca5a5 !important;      /* text-red-200 */
}
.dark .issue-card.warning .issue-type {
  background: #78350f !important; /* bg-yellow-900 */
  color: #fde68a !important;      /* text-yellow-200 */
}
.dark .issue-card.info .issue-type {
  background: #1e3a8a !important; /* bg-blue-900 */
  color: #bfdbfe !important;      /* text-blue-200 */
}

/* ...existing styles... */
.dark .issue-card.error .issue-type {
  background: #ef4444 !important; /* bg-red-500 */
  color: #fff !important;
  font-weight: bold;
  letter-spacing: 0.03em;
}
.dark .issue-card.warning .issue-type {
  background: #f59e42 !important; /* bg-yellow-500 */
  color: #fff !important;
  font-weight: bold;
  letter-spacing: 0.03em;
}
.dark .issue-card.info .issue-type {
  background: #3b82f6 !important; /* bg-blue-500 */
  color: #fff !important;
  font-weight: bold;
  letter-spacing: 0.03em;
}

/* ...existing styles... */
.dark .issue-card.error { border-left: 6px solid #ef4444 !important; }
.dark .issue-card.warning { border-left: 6px solid #f59e42 !important; }
.dark .issue-card.info { border-left: 6px solid #3b82f6 !important; }

/* ...existing styles... */
.high-impact-card .issue-header {
  background: #fee2e2; /* bg-red-50 */
  color: #b91c1c;      /* text-red-700 */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.dark .high-impact-card .issue-header {
  background: rgba(185,28,28,0.12) !important; /* bg-red-900/20 */
  color: #fca5a5 !important;                   /* text-red-200 */
}

.dark .page-card {
  background: #1f2937 !important; /* bg-gray-800 */
  color: #f3f4f6 !important;      /* text-gray-100 */
  border-color: #374151 !important; /* border-gray-700 */
}
.dark .metric-group {
  background: #23272f !important; /* bg-gray-900 */
  border-color: #374151 !important; /* border-gray-700 */
}
.dark .page-header {
  color: #f3f4f6 !important;
}
.dark .page-url {
  color: #93c5fd !important; /* text-blue-300 */
}
.dark .page-status {
  color: #f3f4f6 !important;
  background: #374151 !important;
  border-color: #374151 !important;
}
.dark .page-status.success {
  background: #166534 !important; /* bg-green-900 */
  color: #6ee7b7 !important;      /* text-green-300 */
}
.dark .page-status.redirect {
  background: #312e81 !important; /* bg-indigo-900 */
  color: #a5b4fc !important;      /* text-indigo-300 */
}
.dark .page-status.client-error,
.dark .page-status.server-error {
  background: #7f1d1d !important; /* bg-red-900 */
  color: #fca5a5 !important;      /* text-red-200 */
}
.dark .page-status.unknown {
  background: #374151 !important;
  color: #9ca3af !important;      /* text-gray-400 */
}
.dark .metric-group h4 {
  color: #f3f4f6 !important;
}
.dark .metric-item {
  color: #d1d5db !important; /* text-gray-300 */
}

.dark .score-bar-title {
  background: #23272f !important; /* bg-gray-900 */
  color: #f3f4f6 !important;      /* text-gray-100 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.18) !important;
}

.dark .score-card.total {
  border-color: #374151 !important; /* dark neutral border */
}
.dark .score-card.meta {
  border-color: #2563eb !important; /* blue-600 */
}
.dark .score-card.content {
  border-color: #22c55e !important; /* green-500 */
}
.dark .score-card.technical {
  border-color: #f59e42 !important; /* yellow-500 */
}
.dark .score-card.structure {
  border-color: #ef4444 !important; /* red-500 */
}
</style> 