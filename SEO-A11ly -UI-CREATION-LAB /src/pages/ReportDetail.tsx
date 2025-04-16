
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ScoreCircle from '@/components/ScoreCircle';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Share, MoreHorizontal, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Mock data for a specific report
const mockReportData = {
  id: '456',
  url: 'https://example.com',
  dateAnalyzed: 'April 7, 2025',
  pageType: 'Homepage',
  totalIssues: 20,
  screenshot: '/lovable-uploads/bb5b0914-a86d-42ad-9742-38be5af0ecf8.png',
  scores: {
    accessibility: {
      score: 78,
      rating: 'Good',
      compliance: 'WCAG 2.1 AA compliance'
    },
    seo: {
      score: 85,
      rating: 'Good',
      description: 'Search engine optimization'
    },
    performance: {
      score: 92,
      rating: 'Excellent',
      description: 'Page load and rendering speed'
    }
  },
  accessibility: {
    overallScore: 78,
    issuesFound: 12,
    errors: 5,
    warnings: 4,
    info: 3,
    passed: 15,
    wcagCompliance: {
      level: 'AA',
      aFailed: 3,
      aaFailed: 2,
      passed: 23
    },
    issues: [
      {
        id: '1',
        title: 'Missing alt text on images',
        description: '5 images are missing alternative text descriptions',
        impact: 'Screen readers cannot describe images to users',
        priority: 'High',
        type: 'error',
        wcagCriterion: '1.1.1 Non-text Content (Level A)'
      },
      {
        id: '2',
        title: 'Insufficient color contrast',
        description: 'Text elements with ratio below 4.5:1',
        impact: 'Content may be difficult to read for users with low vision',
        priority: 'Medium',
        type: 'warning',
        wcagCriterion: '1.4.3 Contrast (Minimum) (Level AA)'
      },
      {
        id: '3',
        title: 'Form inputs without labels',
        description: '3 form fields lack properly associated labels',
        impact: 'Screen reader users cannot identify form field purpose',
        priority: 'High',
        type: 'error',
        wcagCriterion: '3.3.2 Labels or Instructions (Level A)'
      },
      {
        id: '4',
        title: 'Skip navigation link missing',
        description: 'No mechanism to bypass repeated blocks',
        impact: 'Keyboard users must tab through all navigation items on every page',
        priority: 'Low',
        type: 'info',
        wcagCriterion: '2.4.1 Bypass Blocks (Level A)'
      }
    ]
  }
};

const ReportDetail = () => {
  const { id } = useParams();
  // In a real app, you'd fetch the report data based on the ID
  const report = mockReportData;

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getIssueTypeBadge = (type: string) => {
    switch (type) {
      case 'error': return <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-800 font-medium">Error</span>;
      case 'warning': return <span className="px-2 py-1 text-xs rounded-md bg-amber-100 text-amber-800 font-medium">Warning</span>;
      case 'info': return <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 font-medium">Info</span>;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Report Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Report #{report.id}</h1>
            <p className="text-gray-500">Detailed analysis of accessibility and SEO issues.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Report Summary and Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Report Summary */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-1">Report Summary</h2>
            <p className="text-gray-600 mb-4">Analysis of {report.url}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">URL</p>
                  <div className="flex items-center">
                    <span className="material-icons text-gray-400 mr-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 17H7C5.61929 17 4.89893 17 4.4 16.8 3.17157 16.3 2.7 15.8284 2.2 14.6 2 14.1011 2 13.3807 2 12 2 10.6193 2 9.89893 2.2 9.4 2.7 8.17157 3.17157 7.7 4.4 7.2 4.89893 7 5.61929 7 7 7H11M13 7H17C18.3807 7 19.1011 7 19.6 7.2 20.8284 7.7 21.3 8.17157 21.8 9.4 22 9.89893 22 10.6193 22 12 22 13.3807 22 14.1011 21.8 14.6 21.3 15.8284 20.8284 16.3 19.6 16.8 19.1011 17 18.3807 17 17 17H13M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <p className="font-medium">{report.url}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date Analyzed</p>
                  <div className="flex items-center">
                    <span className="material-icons text-gray-400 mr-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V8.5C3 6.29086 4.79086 4.5 7 4.5H17C19.2091 4.5 21 6.29086 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <p className="font-medium">{report.dateAnalyzed}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Page Type</p>
                  <div className="flex items-center">
                    <span className="material-icons text-gray-400 mr-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 17H19C20.1046 17 21 16.1046 21 15V7C21 5.89543 20.1046 5 19 5H12L10 7H5C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H7M13 19L17 15M17 15L13 11M17 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <p className="font-medium">{report.pageType}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Issues</p>
                  <div className="flex items-center">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      {report.totalIssues} requiring attention
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                <p className="text-center text-gray-500 text-sm">Screenshot of analyzed page</p>
              </div>
            </div>
          </div>
          
          {/* Score Breakdown */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-1">Score Breakdown</h2>
            <p className="text-gray-600 mb-4">Detailed analysis scores</p>
            
            <div className="space-y-6">
              {/* Accessibility Score */}
              <div className="flex items-center gap-4">
                <ScoreCircle score={report.scores.accessibility.score} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Accessibility</p>
                    <span className="text-amber-500 font-medium">{report.scores.accessibility.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{report.scores.accessibility.compliance}</p>
                </div>
              </div>
              
              {/* SEO Score */}
              <div className="flex items-center gap-4">
                <ScoreCircle score={report.scores.seo.score} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">SEO</p>
                    <span className="text-amber-500 font-medium">{report.scores.seo.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{report.scores.seo.description}</p>
                </div>
              </div>
              
              {/* Performance Score */}
              <div className="flex items-center gap-4">
                <ScoreCircle score={report.scores.performance.score} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Performance</p>
                    <span className="text-green-500 font-medium">{report.scores.performance.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{report.scores.performance.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="accessibility" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="issue-tracker">Issue Tracker</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accessibility" className="space-y-6">
            {/* Accessibility Overview */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-1">Accessibility Overview</h2>
              <p className="text-gray-600 mb-6">WCAG 2.1 AA compliance assessment</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="space-y-2">
                  <p className="font-medium">Overall Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={report.accessibility.overallScore} className="h-2 flex-1" />
                    <span className="font-semibold">{report.accessibility.overallScore}/100</span>
                  </div>
                </div>
                
                {/* Issues Found */}
                <div className="space-y-2">
                  <p className="font-medium">Issues Found</p>
                  <div className="flex gap-1">
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-800 font-medium rounded">{report.accessibility.errors} Errors</span>
                    <span className="px-3 py-1 text-xs bg-amber-100 text-amber-800 font-medium rounded">{report.accessibility.warnings} Warnings</span>
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 font-medium rounded">{report.accessibility.info} Info</span>
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 font-medium rounded">{report.accessibility.passed} Passed</span>
                  </div>
                </div>
                
                {/* WCAG Compliance */}
                <div className="space-y-2">
                  <p className="font-medium">WCAG Compliance</p>
                  <div className="flex gap-1">
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-800 font-medium rounded">{report.accessibility.wcagCompliance.aFailed} A Failed</span>
                    <span className="px-3 py-1 text-xs bg-amber-100 text-amber-800 font-medium rounded">{report.accessibility.wcagCompliance.aaFailed} AA Failed</span>
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 font-medium rounded">{report.accessibility.wcagCompliance.passed} Passed</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Accessibility Issues */}
            <h2 className="text-xl font-bold">Accessibility Issues</h2>
            <div className="space-y-4">
              {report.accessibility.issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {getIssueIcon(issue.type)}
                        <div>
                          <h3 className="text-lg font-semibold">{issue.title}</h3>
                          <p className="text-gray-600">{issue.description}</p>
                        </div>
                      </div>
                      {getIssueTypeBadge(issue.type)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Impact:</p>
                        <p className="text-gray-700">{issue.impact}</p>
                      </div>
                      <div className="md:text-right">
                        <div>
                          <p className="text-sm text-gray-500">WCAG Criterion:</p>
                          <p className="text-gray-700">{issue.wcagCriterion}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Priority:</p>
                          <span className="font-medium">{issue.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <div className="p-10 text-center text-gray-500">
              SEO analysis content will appear here
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="p-10 text-center text-gray-500">
              Performance analysis content will appear here
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="p-10 text-center text-gray-500">
              Recommendations content will appear here
            </div>
          </TabsContent>

          <TabsContent value="issue-tracker">
            <div className="p-10 text-center text-gray-500">
              Issue tracker content will appear here
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="p-10 text-center text-gray-500">
              Comparison content will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetail;
