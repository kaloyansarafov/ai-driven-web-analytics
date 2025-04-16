
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ScoreCircle from '@/components/ScoreCircle';
import { mockAnalysis } from '@/lib/mock-data';
import { SEOIssuesTable } from '@/components/IssuesTable';
import { Download, Search, Globe, BookOpen, HardDrive } from 'lucide-react';
import { SEOIssue } from '@/lib/types';

const SEOPage = () => {
  const analysis = mockAnalysis;

  // Group issues by category
  const metaIssues = analysis.seoIssues.filter(issue => issue.category === 'meta');
  const contentIssues = analysis.seoIssues.filter(issue => issue.category === 'content');
  const technicalIssues = analysis.seoIssues.filter(issue => issue.category === 'technical');
  const structureIssues = analysis.seoIssues.filter(issue => issue.category === 'structure');

  // Group issues by impact
  const highImpactIssues = analysis.seoIssues.filter(issue => issue.impact === 'high');
  const mediumImpactIssues = analysis.seoIssues.filter(issue => issue.impact === 'medium');
  const lowImpactIssues = analysis.seoIssues.filter(issue => issue.impact === 'low');

  const renderIssueCard = (issues: SEOIssue[], title: string, icon: React.ReactNode) => {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center pb-2">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {icon}
              {title} ({issues.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <SEOIssuesTable issues={issues} />
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">SEO Analysis</h2>
            <p className="text-muted-foreground">
              Detailed SEO issues and recommendations
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Overview stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overall SEO Score</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ScoreCircle score={analysis.seoScore.overall} size="lg" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Issues by Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Impact</span>
                    <span className="text-sm font-bold">{highImpactIssues.length}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive" 
                      style={{ width: `${(highImpactIssues.length / analysis.seoIssues.length) * 100}%` }} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Impact</span>
                    <span className="text-sm font-bold">{mediumImpactIssues.length}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-warning" 
                      style={{ width: `${(mediumImpactIssues.length / analysis.seoIssues.length) * 100}%` }} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Impact</span>
                    <span className="text-sm font-bold">{lowImpactIssues.length}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-info" 
                      style={{ width: `${(lowImpactIssues.length / analysis.seoIssues.length) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">SEO Categories Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <ScoreCircle score={analysis.seoScore.meta} size="sm" />
                  <span className="mt-2 text-sm font-medium">Meta Data</span>
                </div>
                <div className="flex flex-col items-center">
                  <ScoreCircle score={analysis.seoScore.content} size="sm" />
                  <span className="mt-2 text-sm font-medium">Content</span>
                </div>
                <div className="flex flex-col items-center">
                  <ScoreCircle score={analysis.seoScore.technical} size="sm" />
                  <span className="mt-2 text-sm font-medium">Technical</span>
                </div>
                <div className="flex flex-col items-center">
                  <ScoreCircle score={analysis.seoScore.structure} size="sm" />
                  <span className="mt-2 text-sm font-medium">Structure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High Impact Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              High Impact Issues
            </CardTitle>
            <CardDescription>
              These issues significantly affect your search engine rankings and should be fixed immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SEOIssuesTable issues={highImpactIssues} />
          </CardContent>
        </Card>

        {/* Category issues */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Issues by Category</h3>
          
          {renderIssueCard(metaIssues, "Meta Data Issues", <Search className="h-4 w-4" />)}
          {renderIssueCard(contentIssues, "Content Issues", <BookOpen className="h-4 w-4" />)}
          {renderIssueCard(technicalIssues, "Technical Issues", <HardDrive className="h-4 w-4" />)}
          {renderIssueCard(structureIssues, "Structure Issues", <Globe className="h-4 w-4" />)}
        </div>
        
        {/* SEO Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Improvement Recommendations</CardTitle>
            <CardDescription>
              Actionable steps to improve your site's search engine visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Meta Improvements:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create unique, descriptive title tags (50-60 characters) for each page</li>
                  <li>Write compelling meta descriptions (120-158 characters)</li>
                  <li>Implement schema markup for rich results in search</li>
                  <li>Use canonical tags to prevent duplicate content issues</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Content Improvements:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create high-quality, original content with proper keyword density (1-2%)</li>
                  <li>Use heading tags (H1-H6) to create a logical content structure</li>
                  <li>Add alt text to all images with relevant keywords</li>
                  <li>Include internal links to other relevant pages on your site</li>
                  <li>Ensure content is comprehensive and answers user search intent</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Technical Improvements:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Improve page load speed (aim for under 3 seconds)</li>
                  <li>Ensure your site is mobile-friendly and responsive</li>
                  <li>Fix all broken links and redirects</li>
                  <li>Create and submit an XML sitemap</li>
                  <li>Implement HTTPS security</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SEOPage;
