// Common types for the application

// Generic Accessibility Issue
export interface AccessibilityIssue {
  code: string;
  message: string;
  type: "error" | "warning" | "notice";
  context?: string;
  selector?: string;
  wcagGuideline?: string; // WCAG guideline reference
  impact?: "critical" | "serious" | "moderate" | "minor";
}

// WAVE API Types
export interface WaveApiResponse {
  status: {
    success: boolean;
    httpstatuscode: number;
    error?: string;
  };
  statistics: {
    pageurl: string;
    pagetitle: string;
    time: number;
    creditsremaining: number;
    allitemcount: number;
    totalelements: number;
  };
  categories: {
    error: {
      count: number;
      items: Record<string, WaveIssue>;
    };
    contrast: {
      count: number;
      items: Record<string, WaveIssue>;
    };
    alert: {
      count: number;
      items: Record<string, WaveIssue>;
    };
    feature: {
      count: number;
      items: Record<string, WaveIssue>;
    };
    structure: {
      count: number;
      items: Record<string, WaveIssue>;
    };
    aria: {
      count: number;
      items: Record<string, WaveIssue>;
    };
  };
}

export interface WaveIssue {
  id: string;
  count: number;
  description: string;
  detail: string;
  wcag?: string;
  selectors?: string[];
  context?: string[];
}

// Pa11y API Types
export interface Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: Pa11yIssue[];
  screenshotPath?: string;
  date: string;
}

export interface Pa11yIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: "error" | "warning" | "notice";
  typeCode: number;
  runner: string;
  impact?: "critical" | "serious" | "moderate" | "minor";
  wcag?: string; // WCAG guideline reference
}

// Unified Result Types
export interface UnifiedResultItem extends AccessibilityIssue {
  source: "wave" | "pa11y"; // Which tool detected this issue
  occurrences: number; // How many times this issue was found
  details?: string; // Additional details
  selectors?: string[]; // List of affected selectors
  contexts?: string[]; // HTML context for each occurrence
}

export interface UnifiedScanResults {
  url: string;
  title: string;
  scanTime: string;
  statistics: {
    total: number;
    errors: number;
    warnings: number;
    notices: number;
    wcagACount: number;
    wcagAACount: number;
    wcagAAACount: number;
  };
  issues: UnifiedResultItem[];
  originalResults?: {
    wave?: WaveApiResponse;
    pa11y?: Pa11yResult;
  };
}

// Scan history item
export interface ScanHistoryItem {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  toolsUsed: string[]; // e.g. ['wave', 'pa11y']
  summary: {
    errors: number;
    warnings: number;
    notices: number;
  };
}

// URL bookmark
export interface UrlBookmark {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  lastScanned?: string;
  tags?: string[];
}
