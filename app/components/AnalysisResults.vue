<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';

// Allowed badge colors for UBadge
type BadgeColor = "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" | undefined;

// Minimal types for props (expand as needed)
interface TabItem {
  id: string;
  label: string;
}

interface AnalysisData {
  // Define structure as needed, fallback to unknown for now
  [key: string]: unknown;
}

const props = defineProps<{
  analysis: AnalysisData;
  tabs: TabItem[];
}>();

// Local state
const priorityFilter = ref('');
const priorityOptions = ref(['High', 'Medium', 'Low']);

// Computed properties
const filteredRecommendations = computed(() => {
  // Placeholder: return all recommendations if available
  return (props.analysis as any)?.data?.lighthouse?.recommendations || [];
});

// Methods (placeholders)
function getScoreColor(_score: unknown): BadgeColor { return "primary"; }
function getPriorityColor(_priority: unknown): BadgeColor { return "primary"; }
function getStatusColor(_status: unknown): BadgeColor { return "primary"; }
function getDifficultyColor(_difficulty: unknown): BadgeColor { return "primary"; }
function getRatingColor(_rating: unknown): BadgeColor { return "primary"; }
function getSeverityColor(_severity: unknown): BadgeColor { return "primary"; }
</script>

<template>
  <div class="space-y-12">
    <!-- Tabbed Navigation -->
    <UTabs :items="tabs" class="w-full">
      <template #default="{ item }">
        <!-- Performance Tab -->
        <div v-if="item.id === 'performance'" class="space-y-8">
          <div v-if="analysis?.data?.lighthouse || analysis?.errors?.lighthouse">
            <template v-if="analysis?.status?.lighthouse === 'success'">
              <!-- Overview Section -->
              <UCard class="mb-6">
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold">Overview</h3>
                  <p class="text-gray-700 dark:text-gray-300">{{ analysis.data.lighthouse.overview.summary }}</p>
                  
                  <!-- Performance Snapshot -->
                  <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div class="flex items-center gap-4">
                      <div class="relative h-24 w-24">
                        <div class="absolute inset-0 flex items-center justify-center">
                          <span class="text-2xl font-bold">{{ analysis.data.lighthouse.overview.performance_snapshot.score }}</span>
                        </div>
                        <!-- This would be replaced with an actual gauge chart in a real implementation -->
                        <div class="h-full w-full rounded-full border-8 border-primary-500"></div>
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-700 dark:text-gray-300">
                          {{ analysis.data.lighthouse.overview.performance_snapshot.interpretation }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Critical Issues -->
                  <div>
                    <h4 class="font-medium mb-2">Critical Issues</h4>
                    <ul class="space-y-2">
                      <li v-for="(issue, index) in analysis.data.lighthouse.overview.critical_issues" :key="index" 
                          class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div class="font-medium text-red-700 dark:text-red-300">{{ issue.issue }}</div>
                        <div class="text-sm text-red-600 dark:text-red-400">{{ issue.impact }}</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </UCard>
              
              <!-- Category Analysis -->
              <div class="space-y-4 mb-6">
                <h3 class="text-xl font-semibold">Category Analysis</h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <UCard v-for="(category, index) in analysis.data.lighthouse.category_analysis" :key="index">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">{{ category.category }}</h4>
                        <UBadge :color="getScoreColor(category.score)" :label="category.score" />
                      </div>
                      
                      <div v-if="category.strengths && category.strengths.length" class="space-y-1">
                        <div class="text-sm font-medium text-green-600 dark:text-green-400">Strengths:</div>
                        <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          <li v-for="(strength, idx) in category.strengths" :key="idx">{{ strength }}</li>
                        </ul>
                      </div>
                      
                      <div v-if="category.weaknesses && category.weaknesses.length" class="space-y-1">
                        <div class="text-sm font-medium text-red-600 dark:text-red-400">Weaknesses:</div>
                        <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          <li v-for="(weakness, idx) in category.weaknesses" :key="idx">{{ weakness }}</li>
                        </ul>
                      </div>
                      
                      <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {{ category.technical_details }}
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
              
              <!-- Recommendations -->
              <div class="space-y-4 mb-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold">Recommendations</h3>
                  <USelect v-model="priorityFilter" :options="priorityOptions" placeholder="Filter by priority" />
                </div>
                
                <div class="grid sm:grid-cols-2 gap-4">
                  <UCard 
                    v-for="(rec, index) in filteredRecommendations" 
                    :key="index"
                    class="relative overflow-hidden"
                  >
                    <div class="absolute top-0 right-0 p-2">
                      <UBadge :color="getPriorityColor(rec.priority)" :label="rec.priority" />
                    </div>
                    <div class="space-y-3 pt-6">
                      <h4 class="font-medium">{{ rec.issue }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ rec.description }}</p>
                      
                      <div class="space-y-2">
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-wrench-screwdriver" class="h-4 w-4" />
                          <span>Solution: {{ rec.solution }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-arrow-trending-up" class="h-4 w-4" />
                          <span>Improvement: {{ rec.potential_improvement }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                          <span>Effort: {{ rec.effort }}</span>
                        </div>
                      </div>
                      
                      <div v-if="rec.code_example" class="mt-3">
                        <div class="text-sm font-medium mb-1">Code Example:</div>
                        <pre class="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">{{ rec.code_example }}</pre>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
              
              <!-- Technical Terms -->
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                <h3 class="text-lg font-medium mb-4">Technical Glossary</h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div v-for="(term, index) in analysis.data.lighthouse.technical_glossary" :key="index" class="space-y-1">
                    <h4 class="font-medium">{{ term.term }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ term.definition }}</p>
                  </div>
                </div>
              </div>
            </template>

            <UAlert
              v-else
              color="error"
              variant="soft"
              :title="analysis?.errors?.lighthouse"
              icon="i-heroicons-exclamation-triangle"
            />
          </div>
        </div>
        
        <!-- Accessibility Tab -->
        <div v-if="item.id === 'accessibility'" class="space-y-8">
          <div v-if="analysis?.data?.accessibility || analysis?.errors?.accessibility">
            <template v-if="analysis?.status?.accessibility === 'success'">
              <!-- Compliance Summary -->
              <UCard class="mb-6">
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold">Compliance Overview</h3>
                  
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                      <div class="text-2xl font-bold text-red-500">
                        {{ analysis.data.accessibility.compliance_summary.violation_count.critical || 0 }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Critical</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                      <div class="text-2xl font-bold text-orange-500">
                        {{ analysis.data.accessibility.compliance_summary.violation_count.serious || 0 }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Serious</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                      <div class="text-2xl font-bold text-yellow-500">
                        {{ analysis.data.accessibility.compliance_summary.violation_count.moderate || 0 }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Moderate</div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                      <div class="text-2xl font-bold text-blue-500">
                        {{ analysis.data.accessibility.compliance_summary.violation_count.minor || 0 }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Minor</div>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <div>
                      <div class="font-medium">WCAG Status:</div>
                      <div class="text-gray-700 dark:text-gray-300">
                        {{ analysis.data.accessibility.compliance_summary.wcag_status }}
                      </div>
                    </div>
                    
                    <div>
                      <div class="font-medium">Risk Assessment:</div>
                      <div class="text-gray-700 dark:text-gray-300">
                        {{ analysis.data.accessibility.compliance_summary.risk_assessment }}
                      </div>
                    </div>
                    
                    <div v-if="analysis.data.accessibility.compliance_summary.affected_user_groups?.length">
                      <div class="font-medium">Affected User Groups:</div>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <UBadge 
                          v-for="(group, idx) in analysis.data.accessibility.compliance_summary.affected_user_groups" 
                          :key="idx"
                          color="info"
                          variant="soft"
                          :label="group"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </UCard>
              
              <!-- Issue Categories -->
              <div class="space-y-4 mb-6">
                <h3 class="text-xl font-semibold">Issue Categories</h3>
                <div class="space-y-4">
                  <UAccordion 
                    v-for="(category, index) in analysis.data.accessibility.issue_categories" 
                    :key="index"
                    :items="[{
                      label: category.category,
                      icon: 'i-heroicons-folder',
                      description: category.description,
                      slot: 'category-' + index,
                      defaultOpen: index === 0
                    }]"
                  >
                    <template #category-0>
                      <div class="space-y-4 p-4">
                        <div class="text-gray-700 dark:text-gray-300">
                          <div class="font-medium mb-2">Impact:</div>
                          <p>{{ category.impact }}</p>
                        </div>
                        
                        <div v-if="category.violations?.length" class="space-y-3">
                          <div class="font-medium">Violations:</div>
                          <UCard 
                            v-for="(violation, vIdx) in category.violations" 
                            :key="vIdx"
                            class="border border-gray-200 dark:border-gray-700"
                          >
                            <div class="space-y-3">
                              <div class="flex items-center justify-between">
                                <div class="font-medium">{{ violation.rule_id }}</div>
                                <UBadge 
                                  :color="getSeverityColor(violation.severity)" 
                                  :label="violation.severity"
                                />
                              </div>
                              
                              <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ violation.description }}
                              </p>
                              
                              <div v-if="violation.affected_elements?.length" class="text-sm">
                                <div class="font-medium mb-1">Affected Elements:</div>
                                <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
                                  <li v-for="(element, eIdx) in violation.affected_elements" :key="eIdx">
                                    {{ element }}
                                  </li>
                                </ul>
                              </div>
                              
                              <div v-if="violation.code_snippet" class="text-sm">
                                <div class="font-medium mb-1">Code Snippet:</div>
                                <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto">{{ violation.code_snippet }}</pre>
                              </div>
                            </div>
                          </UCard>
                        </div>
                      </div>
                    </template>
                  </UAccordion>
                </div>
              </div>
              
              <!-- Remediation Steps -->
              <div class="space-y-4 mb-6">
                <h3 class="text-xl font-semibold">Remediation Plan</h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <UCard 
                    v-for="(step, index) in analysis.data.accessibility.remediation_steps" 
                    :key="index"
                    class="relative overflow-hidden"
                  >
                    <div class="absolute top-0 right-0 p-2">
                      <UBadge :color="getPriorityColor(step.priority)" :label="step.priority" />
                    </div>
                    <div class="space-y-3 pt-6">
                      <h4 class="font-medium">{{ step.issue_type }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ step.fix_description }}</p>
                      
                      <div v-if="step.code_before || step.code_after" class="space-y-2">
                        <div v-if="step.code_before" class="text-sm">
                          <div class="font-medium mb-1">Before:</div>
                          <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto">{{ step.code_before }}</pre>
                        </div>
                        <div v-if="step.code_after" class="text-sm">
                          <div class="font-medium mb-1">After:</div>
                          <pre class="bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto">{{ step.code_after }}</pre>
                        </div>
                      </div>
                      
                      <div class="space-y-1">
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-beaker" class="h-4 w-4" />
                          <span>Testing: {{ step.testing_procedure }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                          <span>Effort: {{ step.estimated_effort }}</span>
                        </div>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
              
              <!-- Accessibility Resources -->
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                <h3 class="text-lg font-medium mb-4">Resources</h3>
                <div class="space-y-6">
                  <div v-for="(resource, index) in analysis.data.accessibility.accessibility_resources" :key="index" class="space-y-3">
                    <h4 class="font-medium">{{ resource.topic }}</h4>
                    
                    <div v-if="resource.best_practices?.length" class="space-y-1">
                      <div class="text-sm font-medium">Best Practices:</div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(practice, pIdx) in resource.best_practices" :key="pIdx">{{ practice }}</li>
                      </ul>
                    </div>
                    
                    <div v-if="resource.learning_resources?.length" class="space-y-1">
                      <div class="text-sm font-medium">Learning Resources:</div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(res, rIdx) in resource.learning_resources" :key="rIdx">{{ res }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <UAlert
              v-else
              color="error"
              variant="soft"
              :title="analysis?.errors?.accessibility"
              icon="i-heroicons-exclamation-triangle"
            />
          </div>
        </div>
        
        <!-- SEO Tab -->
        <div v-if="item.id === 'seo'" class="space-y-8">
          <div v-if="analysis?.data?.seo || analysis?.errors?.seo">
            <template v-if="analysis?.status?.seo === 'success'">
              <!-- SEO Health Score -->
              <UCard class="mb-6">
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold">SEO Health</h3>
                  <p class="text-gray-700 dark:text-gray-300">{{ analysis.data.seo.seo_health_score }}</p>
                  
                  <!-- Critical Issues -->
                  <div v-if="analysis.data.seo.critical_issues?.length">
                    <h4 class="font-medium mb-2">Critical Issues</h4>
                    <div class="space-y-2">
                      <UCard 
                        v-for="(issue, index) in analysis.data.seo.critical_issues" 
                        :key="index"
                        class="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                      >
                        <div class="space-y-2">
                          <div class="flex items-center justify-between">
                            <h5 class="font-medium text-red-700 dark:text-red-300">{{ issue.issue }}</h5>
                            <UBadge color="error" :label="issue.fix_priority" />
                          </div>
                          <p class="text-sm text-red-600 dark:text-red-400">{{ issue.impact }}</p>
                        </div>
                      </UCard>
                    </div>
                  </div>
                </div>
              </UCard>
              
              <!-- Technical SEO -->
              <div class="space-y-4 mb-6">
                <h3 class="text-xl font-semibold">Technical SEO</h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Metadata Analysis</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.technical_seo.metadata_analysis.status)" :label="analysis.data.seo.technical_seo.metadata_analysis.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.technical_seo.metadata_analysis.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                  
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Structured Data</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.technical_seo.structured_data.status)" :label="analysis.data.seo.technical_seo.structured_data.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.technical_seo.structured_data.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                  
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Crawlability</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.technical_seo.crawlability.status)" :label="analysis.data.seo.technical_seo.crawlability.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.technical_seo.crawlability.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                  
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Mobile Optimization</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.technical_seo.mobile_optimization.status)" :label="analysis.data.seo.technical_seo.mobile_optimization.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.technical_seo.mobile_optimization.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                </div>
              </div>
              
              <!-- Content Optimization -->
              <div class="space-y-4 mb-6">
                <h3 class="text-xl font-semibold">Content Optimization</h3>
                <div class="grid sm:grid-cols-3 gap-4">
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Heading Structure</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.content_optimization.heading_structure.status)" :label="analysis.data.seo.content_optimization.heading_structure.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.content_optimization.heading_structure.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                  
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Keyword Usage</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.content_optimization.keyword_usage.status)" :label="analysis.data.seo.content_optimization.keyword_usage.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.content_optimization.keyword_usage.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                  
                  <UCard>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium">Internal Linking</h4>
                        <UBadge :color="getStatusColor(analysis.data.seo.content_optimization.internal_linking.status)" :label="analysis.data.seo.content_optimization.internal_linking.status" />
                      </div>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(finding, idx) in analysis.data.seo.content_optimization.internal_linking.findings" :key="idx">
                          {{ finding }}
                        </li>
                      </ul>
                    </div>
                  </UCard>
                </div>
              </div>
              
              <!-- Action Plan -->
              <div class="space-y-4">
                <h3 class="text-xl font-semibold">Action Plan</h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <UCard 
                    v-for="(action, index) in analysis.data.seo.action_plan" 
                    :key="index"
                    class="relative overflow-hidden"
                  >
                    <div class="absolute top-0 right-0 p-2">
                      <UBadge :color="getDifficultyColor(action.difficulty)" :label="action.difficulty" />
                    </div>
                    <div class="space-y-3 pt-6">
                      <h4 class="font-medium">{{ action.recommendation }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ action.implementation }}</p>
                      
                      <div class="space-y-1">
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-arrow-trending-up" class="h-4 w-4" />
                          <span>Impact: {{ action.expected_impact }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                          <span>Timeframe: {{ action.timeframe }}</span>
                        </div>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
            </template>

            <UAlert
              v-else
              color="error"
              variant="soft"
              :title="analysis?.errors?.seo"
              icon="i-heroicons-exclamation-triangle"
            />
          </div>
        </div>
        
        <!-- UX Tab -->
        <div v-if="item.id === 'ux'" class="space-y-8">
          <div v-if="analysis?.data?.ux || analysis?.errors?.ux">
            <template v-if="analysis?.status?.ux === 'success'">
              <!-- UX Assessment -->
              <UCard class="mb-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold">UX Assessment</h3>
                    <UBadge 
                      :color="getRatingColor(analysis.data.ux.ux_assessment.overall_rating)" 
                      :label="analysis.data.ux.ux_assessment.overall_rating" 
                    />
                  </div>
                  
                  <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 class="font-medium mb-2">Key Strengths</h4>
                      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        <li v-for="(strength, idx) in analysis.data.ux.ux_assessment.key_strengths" :key="idx">
                          {{ strength }}
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 class="font-medium mb-2">Critical Issues</h4>
<ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
  <li v-for="(issue, idx) in analysis.data.ux.ux_assessment.critical_issues" :key="idx">
    {{ issue }}
  </li>
</ul>
</div>
</div>
</div>
</UCard>
</template>
</div>
</div>
</template>
</UTabs>
</div>
</template>
