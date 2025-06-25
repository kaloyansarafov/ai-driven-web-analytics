import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url, apiKey } = body

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required'
      })
    }

    if (!apiKey) {
      throw createError({
        statusCode: 400,
        statusMessage: 'WAVE API key is required'
      })
    }

    console.log(`Running WAVE test for: ${url}`)

    // Call WAVE API
    const response = await axios.get('https://wave.webaim.org/api/request', {
      params: {
        key: apiKey,
        url: url,
        format: 'json',
        reporttype: 3
      },
      timeout: 30000
    })

    if (!response.data) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Empty response from WAVE API'
      })
    }

    console.log(`WAVE API call successful for: ${url}`)

    // Check if WAVE API reported an error
    if (response.data.error) {
      throw createError({
        statusCode: 500,
        statusMessage: `WAVE API reported an error: ${response.data.error}`
      })
    }

    // Process WAVE results
    const waveData = response.data
    let issues = []

    // Handle different WAVE API response formats
    if (waveData.issues) {
      // Direct issues array
      issues = waveData.issues
    } else if (waveData.categories) {
      // Grouped by categories
      Object.values(waveData.categories).forEach((category: any) => {
        if (category.items) {
          issues = issues.concat(category.items)
        }
      })
    } else if (waveData.summary) {
      // Summary format with nested issues
      if (waveData.summary.errors) {
        issues = issues.concat(
          waveData.summary.errors.map((error: any) => ({
            ...error,
            type: 'error'
          }))
        )
      }
      if (waveData.summary.warnings) {
        issues = issues.concat(
          waveData.summary.warnings.map((warning: any) => ({
            ...warning,
            type: 'warning'
          }))
        )
      }
      if (waveData.summary.notices) {
        issues = issues.concat(
          waveData.summary.notices.map((notice: any) => ({
            ...notice,
            type: 'notice'
          }))
        )
      }
    }

    // Transform issues to consistent format
    const transformedIssues = issues.map((issue: any) => ({
      type: issue.type || 'notice',
      code: issue.code || issue.id || 'WAVE-UNKNOWN',
      message: issue.message || issue.description || 'No message provided',
      context: issue.context || issue.html || '',
      selector: issue.selector || '',
      detail: issue.detail || issue.explanation || '',
      source: 'wave'
    }))

    console.log(`WAVE scan completed. Found ${transformedIssues.length} issues`)

    return {
      success: true,
      issues: transformedIssues,
      summary: {
        errors: transformedIssues.filter((issue: any) => issue.type === 'error').length,
        warnings: transformedIssues.filter((issue: any) => issue.type === 'warning').length,
        notices: transformedIssues.filter((issue: any) => issue.type === 'notice').length,
        total: transformedIssues.length
      },
      raw: waveData
    }

  } catch (error: any) {
    console.error('WAVE API error:', error)

    if (error.response?.data?.error) {
      throw createError({
        statusCode: error.response.status || 500,
        statusMessage: `WAVE API error: ${error.response.data.error}`
      })
    } else if (error.message) {
      throw createError({
        statusCode: 500,
        statusMessage: `WAVE scan failed: ${error.message}`
      })
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'WAVE scan failed: Unknown error'
      })
    }
  }
})
