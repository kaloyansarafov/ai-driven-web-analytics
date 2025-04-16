import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.url) {
      return {
        statusCode: 400,
        error: "URL is required",
      };
    }

    // Return mock data for quick testing
    return {
      documentTitle: "Test Page for " + body.url,
      pageUrl: body.url,
      issues: [
        {
          code: "WCAG2AA.Principle1.Guideline1_1.1_1_1.H37",
          context: '<img src="test.jpg">',
          message: "Image missing alternative text",
          selector: "html > body > img",
          type: "error",
          typeCode: 1,
          impact: "critical",
          wcag: "WCAG2AA 1.1.1 A",
        },
        {
          code: "WCAG2AA.Principle1.Guideline1_3.1_3_1.H48",
          context: "<h1>Test</h1><h3>Subheading</h3>",
          message: "Heading levels should only increase by one",
          selector: "html > body > h3",
          type: "warning",
          typeCode: 2,
          impact: "moderate",
          wcag: "WCAG2AA 1.3.1 A",
        },
        {
          code: "WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1",
          context: '<body><div id="main">...</div></body>',
          message: "Page should contain a skip link",
          selector: "html > body",
          type: "notice",
          typeCode: 3,
          impact: "minor",
          wcag: "WCAG2AA 2.4.1 A",
        },
        {
          code: "WCAG2AA.Principle1.Guideline1_4.1_4_3.G145",
          context:
            '<div style="color: #999; background-color: #fff;">Low contrast text</div>',
          message: "Contrast ratio should be at least 4.5:1 for normal text",
          selector: "html > body > div",
          type: "error",
          typeCode: 1,
          impact: "serious",
          wcag: "WCAG2AA 1.4.3 AA",
        },
        {
          code: "WCAG2AA.Principle2.Guideline2_4.2_4_4.H77,H78,H79,H80,H81",
          context: '<a href="#">Click here</a>',
          message: "Link text should be descriptive",
          selector: "html > body > a",
          type: "warning",
          typeCode: 2,
          impact: "moderate",
          wcag: "WCAG2AA 2.4.4 A",
        },
        {
          code: "WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.NoContent",
          context: '<a href="page.html"></a>',
          message: "Link has no content",
          selector: "html > body > a:nth-child(2)",
          type: "error",
          typeCode: 1,
          impact: "serious",
          wcag: "WCAG2AA 4.1.2 A",
        },
        {
          code: "WCAG2AA.Principle1.Guideline1_3.1_3_1.H42",
          context: "<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>",
          message: "Table markup should include headers",
          selector: "html > body > table",
          type: "warning",
          typeCode: 2,
          impact: "moderate",
          wcag: "WCAG2AA 1.3.1 A",
        },
        {
          code: "WCAG2AA.Principle3.Guideline3_1.3_1_1.H57.2",
          context: "<html><head><title>Test</title></head>",
          message: "Document language not specified",
          selector: "html",
          type: "warning",
          typeCode: 2,
          impact: "moderate",
          wcag: "WCAG2AA 3.1.1 A",
        },
      ],
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Pa11y API error:", error);

    return {
      statusCode: 500,
      error: error.message || "An error occurred running the Pa11y test",
    };
  }
});
