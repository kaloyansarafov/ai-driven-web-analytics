import { ref, computed } from "vue";
import type {
  UnifiedScanResults,
  UnifiedResultItem,
  WaveApiResponse,
  Pa11yResult,
  WaveIssue,
} from "../types";

export function useUnifiedResults() {
  const unifiedResults = ref<UnifiedScanResults>({
    url: "",
    title: "",
    scanTime: "",
    statistics: {
      total: 0,
      errors: 0,
      warnings: 0,
      notices: 0,
      wcagACount: 0,
      wcagAACount: 0,
      wcagAAACount: 0,
    },
    issues: [],
  });

  // Process WAVE results
  const processWaveResults = (waveData: WaveApiResponse) => {
    if (!waveData || !waveData.status.success) return;

    // Update basic info
    unifiedResults.value.url = waveData.statistics.pageurl;
    unifiedResults.value.title = waveData.statistics.pagetitle;
    unifiedResults.value.scanTime = new Date().toISOString();

    // Store original results
    if (!unifiedResults.value.originalResults) {
      unifiedResults.value.originalResults = {};
    }
    unifiedResults.value.originalResults.wave = waveData;

    // Process errors
    processWaveCategory(waveData.categories.error, "error");

    // Process contrast issues as errors
    processWaveCategory(waveData.categories.contrast, "error");

    // Process alerts as warnings
    processWaveCategory(waveData.categories.alert, "warning");

    // Process features as notices
    processWaveCategory(waveData.categories.feature, "notice");

    // Process structure as notices
    processWaveCategory(waveData.categories.structure, "notice");

    // Process ARIA as notices
    processWaveCategory(waveData.categories.aria, "notice");

    // Update statistics
    updateStatistics();
  };

  // Process a WAVE category
  const processWaveCategory = (
    category: { count: number; items: Record<string, WaveIssue> },
    type: "error" | "warning" | "notice"
  ) => {
    if (!category || !category.items) return;

    Object.entries(category.items).forEach(([key, item]) => {
      const impactMap: Record<
        string,
        "critical" | "serious" | "moderate" | "minor"
      > = {
        error: "critical",
        contrast: "serious",
        alert: "moderate",
        feature: "minor",
        structure: "minor",
        aria: "moderate",
      };

      const wcagLevel = item.wcag ? extractWcagLevel(item.wcag) : undefined;

      const unifiedItem: UnifiedResultItem = {
        code: key,
        message: item.description,
        type: type,
        source: "wave",
        occurrences: item.count,
        details: item.detail,
        selectors: item.selectors,
        contexts: item.context,
        impact: impactMap[key.split(".")[0]] || "moderate",
        wcagGuideline: item.wcag,
      };

      unifiedResults.value.issues.push(unifiedItem);
    });
  };

  // Process Pa11y results
  const processPa11yResults = (pa11yData: Pa11yResult) => {
    if (!pa11yData || !pa11yData.issues) return;

    // Update basic info if not already set
    if (!unifiedResults.value.url) {
      unifiedResults.value.url = pa11yData.pageUrl;
      unifiedResults.value.title = pa11yData.documentTitle;
      unifiedResults.value.scanTime = pa11yData.date;
    }

    // Store original results
    if (!unifiedResults.value.originalResults) {
      unifiedResults.value.originalResults = {};
    }
    unifiedResults.value.originalResults.pa11y = pa11yData;

    // Group issues by code to count occurrences
    const issueGroups = new Map<string, any[]>();

    pa11yData.issues.forEach((issue) => {
      if (!issueGroups.has(issue.code)) {
        issueGroups.set(issue.code, []);
      }
      issueGroups.get(issue.code)?.push(issue);
    });

    // Create unified items
    issueGroups.forEach((issues, code) => {
      const firstIssue = issues[0];
      const wcagLevel = firstIssue.wcag
        ? extractWcagLevel(firstIssue.wcag)
        : undefined;

      // Map Pa11y impact or derive from type
      let impact: "critical" | "serious" | "moderate" | "minor";
      if (firstIssue.impact) {
        impact = firstIssue.impact;
      } else {
        impact =
          firstIssue.type === "error"
            ? "serious"
            : firstIssue.type === "warning"
            ? "moderate"
            : "minor";
      }

      const unifiedItem: UnifiedResultItem = {
        code: firstIssue.code,
        message: firstIssue.message,
        type: firstIssue.type,
        source: "pa11y",
        occurrences: issues.length,
        selectors: issues.map((i) => i.selector),
        contexts: issues.map((i) => i.context),
        impact,
        wcagGuideline: firstIssue.wcag,
      };

      unifiedResults.value.issues.push(unifiedItem);
    });

    // Update statistics
    updateStatistics();
  };

  // Extract WCAG level (A, AA, AAA) from a guideline string
  const extractWcagLevel = (
    wcagString?: string
  ): "A" | "AA" | "AAA" | undefined => {
    if (!wcagString) return undefined;

    if (wcagString.includes("AAA")) return "AAA";
    if (wcagString.includes("AA")) return "AA";
    if (wcagString.includes("A")) return "A";

    return undefined;
  };

  // Update the overall statistics
  const updateStatistics = () => {
    const stats = unifiedResults.value.statistics;

    // Reset counts
    stats.errors = 0;
    stats.warnings = 0;
    stats.notices = 0;
    stats.wcagACount = 0;
    stats.wcagAACount = 0;
    stats.wcagAAACount = 0;

    // Count by type and WCAG level
    unifiedResults.value.issues.forEach((issue) => {
      if (issue.type === "error") stats.errors++;
      else if (issue.type === "warning") stats.warnings++;
      else if (issue.type === "notice") stats.notices++;

      if (issue.wcagGuideline) {
        const level = extractWcagLevel(issue.wcagGuideline);
        if (level === "A") stats.wcagACount++;
        else if (level === "AA") stats.wcagAACount++;
        else if (level === "AAA") stats.wcagAAACount++;
      }
    });

    stats.total = stats.errors + stats.warnings + stats.notices;
  };

  // Reset all results
  const resetResults = () => {
    unifiedResults.value = {
      url: "",
      title: "",
      scanTime: "",
      statistics: {
        total: 0,
        errors: 0,
        warnings: 0,
        notices: 0,
        wcagACount: 0,
        wcagAACount: 0,
        wcagAAACount: 0,
      },
      issues: [],
    };
  };

  // Sort and filter issues
  const filteredIssues = computed(() => {
    // By default, sort by:
    // 1. Type (errors first, then warnings, then notices)
    // 2. Impact (critical, serious, moderate, minor)
    // 3. Occurrences (most occurrences first)
    return [...unifiedResults.value.issues].sort((a, b) => {
      // Sort by type
      const typeOrder = { error: 0, warning: 1, notice: 2 };
      if (typeOrder[a.type] !== typeOrder[b.type]) {
        return typeOrder[a.type] - typeOrder[b.type];
      }

      // Sort by impact
      const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
      const aImpact = a.impact ? impactOrder[a.impact] : 4;
      const bImpact = b.impact ? impactOrder[b.impact] : 4;

      if (aImpact !== bImpact) {
        return aImpact - bImpact;
      }

      // Sort by occurrences
      return b.occurrences - a.occurrences;
    });
  });

  return {
    unifiedResults,
    filteredIssues,
    processWaveResults,
    processPa11yResults,
    resetResults,
  };
}
