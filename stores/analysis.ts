import { defineStore } from 'pinia'
import { reactive, computed, toRefs } from 'vue'

interface SEOResults {
  overallScore: number
  categoryScores: Record<string, number>
  issues: Array<{
    title: string
    description: string
    severity: 'high' | 'medium' | 'low'
    recommendation?: string
  }>
}

interface AccessibilityResults {
  overallScore: number
  wcagLevels: Array<{
    name: string
    score: number
  }>
  issues: Array<{
    title: string
    description: string
    severity: 'high' | 'medium' | 'low'
    wcagReference?: string
    recommendation?: string
  }>
}

interface AnalysisState {
  url: string
  isLoading: boolean
  error: string | null
  seoResults: SEOResults | null
  accessibilityResults: AccessibilityResults | null
}

export const useAnalysisStore = defineStore('analysis', () => {
  const state = reactive<AnalysisState>({
    url: '',
    isLoading: false,
    error: null,
    seoResults: null,
    accessibilityResults: null
  })

  const setUrl = (url: string) => {
    state.url = url
  }

  const setLoading = (loading: boolean) => {
    state.isLoading = loading
  }

  const setError = (error: string | null) => {
    state.error = error
  }

  const setSEOResults = (results: SEOResults) => {
    state.seoResults = results
  }

  const setAccessibilityResults = (results: AccessibilityResults) => {
    state.accessibilityResults = results
  }

  const analyzeUrl = async (url: string) => {
    setUrl(url)
    setLoading(true)
    setError(null)

    try {
      // Run both analyses in parallel
      const [seoResponse, accessibilityResponse] = await Promise.all([
        fetch('/api/seo-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        }),
        fetch('/api/accessibility-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })
      ])

      if (!seoResponse.ok || !accessibilityResponse.ok) {
        throw new Error('Analysis failed')
      }

      const seoResults = await seoResponse.json()
      const accessibilityResults = await accessibilityResponse.json()

      setSEOResults(seoResults)
      setAccessibilityResults(accessibilityResults)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    state.url = ''
    state.seoResults = null
    state.accessibilityResults = null
    state.error = null
  }

  const hasResults = computed(() => state.seoResults !== null && state.accessibilityResults !== null)
  const hasError = computed(() => state.error !== null)

  return {
    ...toRefs(state),
    setUrl,
    setLoading,
    setError,
    setSEOResults,
    setAccessibilityResults,
    analyzeUrl,
    clearResults,
    hasResults,
    hasError
  }
}) 