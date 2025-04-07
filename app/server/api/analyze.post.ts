import { defineEventHandler, readBody, createError  } from 'h3'
import puppeteer from 'puppeteer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getLighthouseReport } from '../utils/lighthouse'
import { getCompliance } from 'accessibility-checker'


interface AccessibilityResult {
  ruleId: string
  value: [string, string]
  message: string
  messageArgs: any[]
  help: string
  level: 'violation' | 'potentialviolation'
  category: string
  snippet: string
  reasonId: string
  path: {
    dom: string
    aria: string
  }
  bounds?: {
    left: number
    top: number
    height: number
    width: number
  }
}

interface FilteredReport {
  results: AccessibilityResult[]
  summary: {
    counts: {
      violation: number
      potentialviolation: number
    }
    scanTime: number
    ruleArchive: string
    policies: string[]
    reportLevels: string[]
    URL: string
  }
}

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  
  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    // Run Lighthouse audit
    const lighthouseReport = await getLighthouseReport(url, browser)

    // Run accessibility checker
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0' })
    
    const a11yResults = await getCompliance(page, 'memory-only')

    const filteredA11yReport: FilteredReport = {
      results: (a11yResults as any).report.results
        .filter((result: any) => result.level === 'violation' || result.level === 'potentialviolation')
        .map((result: any) => ({
          ruleId: result.ruleId,
          value: result.value,
          message: result.message,
          messageArgs: result.messageArgs,
          help: result.help,
          level: result.level,
          category: result.category,
          snippet: result.snippet,
          reasonId: result.reasonId,
          path: {
            dom: result.path.dom,
            aria: result.path.aria
          },
          bounds: result.bounds
        })),
      summary: {
        counts: {
          violation: (a11yResults as any).report.summary.counts.violation,
          potentialviolation: (a11yResults as any).report.summary.counts.potentialviolation
        },
        scanTime: (a11yResults as any).report.summary.scanTime,
        ruleArchive: (a11yResults as any).report.summary.ruleArchive,
        policies: (a11yResults as any).report.summary.policies,
        reportLevels: (a11yResults as any).report.summary.reportLevels,
        URL: (a11yResults as any).report.summary.URL
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    // Lighthouse
    let lighthouseAnalysis = null
    let lighthouseError = null
    try {
      const lighthousePrompt = `You are an SEO expert explaining a lighthouse analysis to a marketing manager with limited technical knowledge. The report is attached as a json file. Explain this in plain language, provide actionable steps, and define any technical terms. Prioritize the recommendations and format the output as JSON using the following format (example data filled): 
    {
      "report_section": "Performance",
      "original_data": "The website has a First Contentful Paint of 2.5s and a Time to Interactive of 4.2s.",
      "simplified_explanation": "Your website takes 2.5 seconds to show the first content to users, and 4.2 seconds to become fully interactive. This is slower than ideal and may affect user experience.",
      "actionable_recommendations": [
        {
          "recommendation": "Optimize images and implement lazy loading.",
          "priority": "High",
          "impact": "Reduce page load time by 30-40%",
          "estimated_effort": "Medium"
        }
      ],
      "technical_terms_explained": [
        {
          "term": "First Contentful Paint",
          "definition": "The time it takes for the first piece of content to appear on the screen."
        }
      ]
    }

    IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text. Here is the report to analyze: ${JSON.stringify(lighthouseReport)}`

      const lighthouseResult = await model.generateContent(lighthousePrompt)
      const lighthouseResponse = await lighthouseResult.response
      const lighthouseText = lighthouseResponse.text().replace(/```json\n?|\n?```/g, '').trim()
      lighthouseAnalysis = JSON.parse(lighthouseText)
    } catch (error) {
      console.error('Lighthouse analysis error:', error)
      lighthouseError = 'Failed to analyze Lighthouse report'
    }

    // Accessibility
    let a11yAnalysis = null
    let a11yError = null
    try {
      const a11yPrompt = `You are an accessibility expert explaining accessibility issues to a web developer. The report is attached as a json file. Explain this in plain language, provide actionable steps, and define any technical terms. Group issues by category and prioritize the recommendations. Format the output as JSON using the following format (example data filled): 
    {
      "report_section": "Accessibility Issues",
      "scan_summary": {
        "total_violations": 5,
        "total_potential_issues": 3,
        "scan_duration": "30 seconds",
        "policies_checked": ["WCAG 2.1 Level A", "WCAG 2.1 Level AA"]
      },
      "issues_by_category": [
        {
          "category": "Color Contrast",
          "violations": 2,
          "potential_issues": 1,
          "description": "Issues related to text visibility and color contrast ratios",
          "examples": [
            "Text contrast of 2.75 with background (#9c9c9c on #ffffff) fails WCAG AA requirements"
          ]
        }
      ],
      "actionable_recommendations": [
        {
          "recommendation": "Increase text contrast ratios to meet WCAG AA standards (minimum 4.5:1 for normal text)",
          "priority": "High",
          "impact": "Improve readability for users with visual impairments",
          "affected_elements": ["timestamp class elements", "navigation links"],
          "estimated_effort": "Low"
        }
      ],
      "technical_terms_explained": [
        {
          "term": "Color Contrast Ratio",
          "definition": "The numerical difference in brightness between foreground text and its background"
        }
      ]
    }

    IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text. Here is the report to analyze: ${JSON.stringify(filteredA11yReport)}`

      const a11yResult = await model.generateContent(a11yPrompt)
      const a11yResponse = await a11yResult.response
      const a11yText = a11yResponse.text().replace(/```json\n?|\n?```/g, '').trim()
      a11yAnalysis = JSON.parse(a11yText)
    } catch (error) {
      console.error('Accessibility analysis error:', error)
      a11yError = 'Failed to analyze accessibility report'
    }

    await browser.close()

    const hasLighthouse = lighthouseAnalysis !== null
    const hasA11y = a11yAnalysis !== null

    return {
      success: hasLighthouse || hasA11y,
      data: {
        lighthouse: lighthouseAnalysis,
        accessibility: a11yAnalysis,
        seo: lighthouseReport,
        a11y: filteredA11yReport
      },
      errors: {
        lighthouse: lighthouseError,
        accessibility: a11yError
      },
      status: {
        lighthouse: hasLighthouse ? 'success' : 'error',
        accessibility: hasA11y ? 'success' : 'error'
      }
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return {
      success: false,
      error: 'Failed to analyze website',
      data: null,
      errors: {
        lighthouse: 'Failed to analyze website',
        accessibility: 'Failed to analyze website'
      },
      status: {
        lighthouse: 'error',
        accessibility: 'error'
      }
    }
  }
}) 