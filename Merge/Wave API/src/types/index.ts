// src/types/index.ts

// More refined structure based on WAVE API JSON (reporttype=3)

interface WaveStatus {
  success: boolean;
  error?: string; // Error message if success is false
  // May contain other status info
  [key: string]: any;
}

interface WaveStatistics {
  pageurl: string;
  time: number; // Scan time in seconds
  creditsremaining: number;
  allitemcount: number;
  totalelements: number;
  waveurl: string; // URL to the visual report

  // Specific issue counts (might vary slightly based on WAVE version)
  error: number;
  contrast: number;
  alert: number;
  feature: number;
  structure: number;
  aria: number;
  // Optional, but often present
  totalkeyboardaccessissues?: number;
  [key: string]: any; // Allow other statistics properties
}

interface WaveIssueItem {
  id: string; // e.g., "alt_missing", "label_missing"
  description: string; // User-friendly description
  count: number; // How many instances on the page
  xpaths?: string[]; // Array of XPath strings to locate the element(s)
  selectors?: string[]; // Array of CSS selectors
  contrastdata?: Array<{
    // Specific to contrast errors
    fg_color: string;
    bg_color: string;
    contrast_ratio: number;
    required_ratio: number;
    message: string;
    xpath: string;
  }>;
  // May contain other item-specific data
  [key: string]: any;
}

interface WaveCategory {
  description: string; // e.g., "Errors", "Contrast Errors", "Alerts"
  count: number; // Total count of items in this category
  items: {
    // Items are keyed by their ID
    [id: string]: WaveIssueItem;
  };
}

export interface WaveApiResponse {
  status: WaveStatus;
  statistics: WaveStatistics;
  categories: {
    error: WaveCategory;
    contrast: WaveCategory;
    alert: WaveCategory;
    feature: WaveCategory;
    structure: WaveCategory;
    aria: WaveCategory;
    // Potentially others depending on results
    [key: string]: WaveCategory | undefined;
  };
  pageanalysis?: any; // Can be detailed, keep as any for now
}
