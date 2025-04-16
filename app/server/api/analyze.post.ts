import { defineEventHandler, readBody, createError } from 'h3'
import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getLighthouseReport } from '../utils/lighthouse'
import { getCompliance } from 'accessibility-checker'

dotenv.config()

interface AccessibilityResult {
  ruleId: string
  value: [string, string]
  message: string
  messageArgs: unknown[]
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
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    // Run Lighthouse audit
    const lighthouseReport = await getLighthouseReport(url, browser)

    // Run accessibility checker
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    
    const a11yResults = await getCompliance(page, 'memory-only')

    const filteredA11yReport: FilteredReport = {
      results: (a11yResults as Record<string, any>).report.results
        .filter((result: Record<string, any>) => result.level === 'violation' || result.level === 'potentialviolation')
        .map((result: Record<string, any>) => ({
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
          violation: (a11yResults as Record<string, any>).report.summary.counts.violation,
          potentialviolation: (a11yResults as Record<string, any>).report.summary.counts.potentialviolation
        },
        scanTime: (a11yResults as Record<string, any>).report.summary.scanTime,
        ruleArchive: (a11yResults as Record<string, any>).report.summary.ruleArchive,
        policies: (a11yResults as Record<string, any>).report.summary.policies,
        reportLevels: (a11yResults as Record<string, any>).report.summary.reportLevels,
        URL: (a11yResults as Record<string, any>).report.summary.URL
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    // Prepare prompts
    const lighthousePrompt = `You are an SEO and performance expert explaining a lighthouse analysis to a marketing manager and developer team. 

Analyze the attached JSON report and provide:

1. OVERVIEW:
   - Summarize overall performance with key metrics and scores
   - Identify the 3 most critical issues affecting user experience
   - Estimate potential business impact of performance issues (e.g., conversion rate, bounce rate effects)

2. DETAILED ANALYSIS BY CATEGORY:
   - Performance: Analyze core web vitals and loading metrics
   - SEO: Evaluate search engine optimization factors
   - Best Practices: Review adherence to web development standards
   - Accessibility: Assess basic accessibility compliance

3. ACTIONABLE RECOMMENDATIONS:
   - Prioritize fixes based on impact/effort matrix
   - Include specific technical solutions with code examples where applicable
   - Provide estimated improvement potential for each recommendation
   - Suggest testing methodologies to verify improvements

4. TECHNICAL CONTEXT:
   - Explain how each issue affects different user segments (mobile vs desktop, slow connections)
   - Define technical terms in plain language
   - Reference industry standards and benchmarks

Format as JSON with the following structure:
{
  "overview": {
    "summary": "Concise overall assessment",
    "critical_issues": [{"issue": "Issue name", "impact": "Business impact description"}],
    "performance_snapshot": {"score": "X/100", "interpretation": "What this means"}
  },
  "category_analysis": [
    {
      "category": "Category name",
      "score": "X/100",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "technical_details": "Technical explanation"
    }
  ],
  "recommendations": [
    {
      "issue": "Issue name",
      "description": "Issue description",
      "solution": "Detailed solution",
      "code_example": "Example code if applicable",
      "priority": "High/Medium/Low",
      "effort": "Easy/Medium/Complex",
      "potential_improvement": "Estimated improvement"
    }
  ],
  "technical_glossary": [
    {"term": "Technical term", "definition": "Plain language definition"}
  ]
}

IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text. Here is the report to analyze: ${JSON.stringify(lighthouseReport)}`

    const a11yPrompt = `You are an accessibility expert helping a development team improve their website's accessibility. The attached JSON contains an accessibility audit report.

Analyze this report and provide:

1. COMPLIANCE OVERVIEW:
   - Summarize WCAG compliance status and overall accessibility
   - Identify patterns of recurring issues
   - Assess legal risk exposure based on common accessibility regulations (ADA, EAA, Section 508)

2. ISSUE ANALYSIS:
   - Group issues by both severity and category
   - Provide context on how each issue affects users with different disabilities
   - Include specific examples from the code with line references

3. REMEDIATION PLAN:
   - Provide step-by-step fixes for each issue type with code examples
   - Suggest testing procedures with assistive technologies
   - Recommend automated and manual testing tools for ongoing monitoring

4. EDUCATIONAL CONTENT:
   - Explain accessibility principles relevant to the identified issues
   - Include best practices for preventing similar issues
   - Provide resources for further learning on each topic

Format as JSON with the following structure:
{
  "compliance_summary": {
    "wcag_status": "Current compliance level assessment",
    "violation_count": {"critical": X, "serious": Y, "moderate": Z, "minor": W},
    "risk_assessment": "Legal and user experience risk evaluation",
    "affected_user_groups": ["Screen reader users", "Keyboard-only users", etc.]
  },
  "issue_categories": [
    {
      "category": "Issue category name",
      "description": "What this category means for accessibility",
      "impact": "How these issues affect users with disabilities",
      "violations": [
        {
          "rule_id": "Technical rule identifier",
          "description": "Plain language description",
          "severity": "Critical/Serious/Moderate/Minor",
          "affected_elements": ["Specific elements with this issue"],
          "code_snippet": "Example of problematic code"
        }
      ]
    }
  ],
  "remediation_steps": [
    {
      "issue_type": "Type of issue to fix",
      "fix_description": "Detailed explanation of the fix",
      "code_before": "Problematic code",
      "code_after": "Fixed code example",
      "testing_procedure": "How to verify the fix works",
      "priority": "High/Medium/Low",
      "estimated_effort": "Hours/story points estimate"
    }
  ],
  "accessibility_resources": [
    {
      "topic": "Accessibility topic",
      "best_practices": ["Best practice 1", "Best practice 2"],
      "learning_resources": ["Resource link/description"]
    }
  ]
}

IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text. Here is the report to analyze: ${JSON.stringify(filteredA11yReport)}`

    const seoPrompt = `You are an SEO specialist analyzing a website for a marketing team. The attached JSON contains Lighthouse SEO audit results.

Provide a comprehensive SEO analysis including:

1. SEARCH VISIBILITY ASSESSMENT:
   - Evaluate current SEO implementation quality
   - Identify critical SEO blockers and opportunities
   - Assess mobile vs desktop optimization differences

2. TECHNICAL SEO ANALYSIS:
   - Analyze metadata implementation (title tags, meta descriptions, etc.)
   - Evaluate structured data/schema markup
   - Review crawlability and indexability factors
   - Assess page speed impact on SEO

3. CONTENT OPTIMIZATION:
   - Evaluate heading structure and content hierarchy
   - Assess keyword optimization opportunities
   - Review internal linking structure
   - Identify thin content issues

4. COMPETITIVE POSITIONING:
   - Compare performance against industry benchmarks
   - Suggest unique SEO opportunities based on niche

Format as JSON with the following structure:
{
  "seo_health_score": "Overall SEO score with interpretation",
  "critical_issues": [
    {
      "issue": "Issue name",
      "impact": "How this affects search rankings",
      "fix_priority": "High/Medium/Low"
    }
  ],
  "technical_seo": {
    "metadata_analysis": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]},
    "structured_data": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]},
    "crawlability": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]},
    "mobile_optimization": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]}
  },
  "content_optimization": {
    "heading_structure": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]},
    "keyword_usage": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]},
    "internal_linking": {"status": "Good/Needs Improvement/Poor", "findings": ["Finding 1", "Finding 2"]}
  },
  "action_plan": [
    {
      "recommendation": "Specific recommendation",
      "implementation": "How to implement",
      "expected_impact": "Potential ranking/traffic improvement",
      "difficulty": "Easy/Medium/Hard",
      "timeframe": "Immediate/Short-term/Long-term"
    }
  ]
}

IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text. Here is the report to analyze: ${JSON.stringify(lighthouseReport.categories.seo)}`

    const uxPrompt = `You are a UX expert analyzing a website's user experience based on performance and accessibility data. The attached JSON contains audit results.

Provide a UX-focused analysis including:

1. USER EXPERIENCE IMPACT:
   - Translate technical metrics into user experience implications
   - Identify friction points in the user journey
   - Assess cognitive load and usability issues

2. MOBILE VS DESKTOP EXPERIENCE:
   - Compare performance and usability across devices
   - Identify responsive design issues
   - Evaluate touch interface optimization

3. CONVERSION OPTIMIZATION:
   - Analyze how performance issues may impact conversion rates
   - Identify accessibility barriers to conversion
   - Suggest UX improvements for key conversion paths

4. COMPETITIVE UX COMPARISON:
   - Compare against industry UX benchmarks
   - Identify unique UX opportunities

Format as JSON with the following structure:
{
  "ux_assessment": {
    "overall_rating": "Excellent/Good/Average/Poor",
    "key_strengths": ["Strength 1", "Strength 2"],
    "critical_issues": ["Issue 1", "Issue 2"]
  },
  "user_journey_analysis": [
    {
      "journey_stage": "Stage name",
      "friction_points": ["Friction 1", "Friction 2"],
      "improvement_opportunities": ["Opportunity 1", "Opportunity 2"]
    }
  ],
  "device_experience": {
    "mobile": {"rating": "Good/Average/Poor", "issues": ["Issue 1", "Issue 2"]},
    "desktop": {"rating": "Good/Average/Poor", "issues": ["Issue 1", "Issue 2"]},
    "responsive_design": {"rating": "Good/Average/Poor", "issues": ["Issue 1", "Issue 2"]}
  },
  "conversion_optimization": [
    {
      "conversion_point": "Specific conversion point",
      "current_barriers": ["Barrier 1", "Barrier 2"],
      "optimization_suggestions": ["Suggestion 1", "Suggestion 2"],
      "expected_impact": "High/Medium/Low"
    }
  ]
}

IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or additional text. Here is the report to analyze: ${JSON.stringify({lighthouse: lighthouseReport, accessibility: filteredA11yReport})}`

    // Run all Gemini API calls in parallel
    let lighthouseAnalysis = null
    let lighthouseError = null
    let a11yAnalysis = null
    let a11yError = null
    let seoAnalysis = null
    let seoError = null
    let uxAnalysis = null
    let uxError = null

    try {
      const [
        lighthouseResult,
        a11yResult,
        seoResult,
        uxResult
      ] = await Promise.all([
        model.generateContent(lighthousePrompt),
        model.generateContent(a11yPrompt),
        model.generateContent(seoPrompt),
        model.generateContent(uxPrompt)
      ]);

      // Parse results
      try {
        const lighthouseResponse = lighthouseResult.response
        const lighthouseText = lighthouseResponse.text().replace(/```json\n?|\n?```/g, '').trim()
        lighthouseAnalysis = JSON.parse(lighthouseText)
      } catch (error) {
        console.error('Lighthouse analysis error:', error)
        lighthouseError = 'Failed to analyze Lighthouse report'
      }

      try {
        const a11yResponse = a11yResult.response
        const a11yText = a11yResponse.text().replace(/```json\n?|\n?```/g, '').trim()
        a11yAnalysis = JSON.parse(a11yText)
      } catch (error) {
        console.error('Accessibility analysis error:', error)
        a11yError = 'Failed to analyze accessibility report'
      }

      try {
        const seoResponse = seoResult.response
        const seoText = seoResponse.text().replace(/```json\n?|\n?```/g, '').trim()
        seoAnalysis = JSON.parse(seoText)
      } catch (error) {
        console.error('SEO analysis error:', error)
        seoError = 'Failed to analyze SEO report'
      }

      try {
        const uxResponse = uxResult.response
        const uxText = uxResponse.text().replace(/```json\n?|\n?```/g, '').trim()
        uxAnalysis = JSON.parse(uxText)
      } catch (error) {
        console.error('UX analysis error:', error)
        uxError = 'Failed to analyze UX aspects'
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      lighthouseError = lighthouseError || 'Failed to analyze Lighthouse report'
      a11yError = a11yError || 'Failed to analyze accessibility report'
      seoError = seoError || 'Failed to analyze SEO report'
      uxError = uxError || 'Failed to analyze UX aspects'
    }

    await browser.close()

    const hasLighthouse = lighthouseAnalysis !== null
    const hasA11y = a11yAnalysis !== null
    const hasSeo = seoAnalysis !== null
    const hasUx = uxAnalysis !== null

    return {
      success: hasLighthouse || hasA11y || hasSeo || hasUx,
      data: {
        lighthouse: lighthouseAnalysis,
        accessibility: a11yAnalysis,
        seo: seoAnalysis,
        ux: uxAnalysis,
        raw: {
          lighthouse: lighthouseReport,
          accessibility: filteredA11yReport
        }
      },
      errors: {
        lighthouse: lighthouseError,
        accessibility: a11yError,
        seo: seoError,
        ux: uxError
      },
      status: {
        lighthouse: hasLighthouse ? 'success' : 'error',
        accessibility: hasA11y ? 'success' : 'error',
        seo: hasSeo ? 'success' : 'error',
        ux: hasUx ? 'success' : 'error'
      }
    }
  } catch (error) {
    // Improved error logging
    if (error instanceof Error) {
      console.error('Analysis error:', error.message)
      if (error.stack) {
        console.error(error.stack)
      }
    } else {
      console.error('Analysis error:', error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze website',
      data: null,
      errors: {
        lighthouse: error instanceof Error ? error.message : 'Failed to analyze website',
        accessibility: error instanceof Error ? error.message : 'Failed to analyze website'
      },
      status: {
        lighthouse: 'error',
        accessibility: 'error'
      }
    }
  }
})
