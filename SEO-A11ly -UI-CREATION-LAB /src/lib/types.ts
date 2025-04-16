
// Define the types for our accessibility and SEO data

export interface WCAGIssue {
  id: string;
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  element?: string;
  location?: string;
  remediation: string;
}

export interface SEOIssue {
  id: string;
  category: 'meta' | 'content' | 'technical' | 'structure';
  description: string;
  impact: 'high' | 'medium' | 'low';
  remediation: string;
}

export interface AccessibilityScore {
  overall: number;
  wcagA: number;
  wcagAA: number;
  wcagAAA: number;
  issuesByImpact: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}

export interface SEOScore {
  overall: number;
  meta: number;
  content: number;
  technical: number;
  structure: number;
}

export interface SiteAnalysis {
  url: string;
  scanDate: string;
  accessibilityScore: AccessibilityScore;
  seoScore: SEOScore;
  accessibilityIssues: WCAGIssue[];
  seoIssues: SEOIssue[];
  assistiveTechnologies: {
    screenReaders: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
    magnification: boolean;
  };
  wcagCompliance: {
    conformanceLevel: 'A' | 'AA' | 'AAA' | 'None';
    passedCriteria: string[];
    failedCriteria: string[];
  };
}
