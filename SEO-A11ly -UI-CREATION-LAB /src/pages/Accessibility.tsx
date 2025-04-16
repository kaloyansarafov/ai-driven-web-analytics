
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ScoreCircle from '@/components/ScoreCircle';
import { mockAnalysis } from '@/lib/mock-data';
import { AccessibilityIssuesTable } from '@/components/IssuesTable';
import { Download, Filter, AlignLeft, Accessibility } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WCAGIssue } from '@/lib/types';
import WCAGBadge from '@/components/WCAGBadge';

const AccessibilityPage = () => {
  const analysis = mockAnalysis;

  // Group issues by WCAG level
  const levelAIssues = analysis.accessibilityIssues.filter(issue => issue.level === 'A');
  const levelAAIssues = analysis.accessibilityIssues.filter(issue => issue.level === 'AA');
  const levelAAAIssues = analysis.accessibilityIssues.filter(issue => issue.level === 'AAA');

  // Group issues by impact
  const criticalIssues = analysis.accessibilityIssues.filter(issue => issue.impact === 'critical');
  const seriousIssues = analysis.accessibilityIssues.filter(issue => issue.impact === 'serious');
  const moderateIssues = analysis.accessibilityIssues.filter(issue => issue.impact === 'moderate');
  const minorIssues = analysis.accessibilityIssues.filter(issue => issue.impact === 'minor');

  const totalIssues = analysis.accessibilityIssues.length;

  const renderIssueCards = (issues: WCAGIssue[], title: string) => {
    if (issues.length === 0) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title} ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AccessibilityIssuesTable issues={issues} />
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Accessibility Analysis</h2>
            <p className="text-muted-foreground">
              Detailed accessibility issues and compliance status
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Overview stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ScoreCircle score={analysis.accessibilityScore.overall} size="lg" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">WCAG Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl font-bold flex items-center gap-2">
                  Level <WCAGBadge level={analysis.wcagCompliance.conformanceLevel} />
                </span>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {analysis.wcagCompliance.conformanceLevel === 'A' 
                    ? 'Basic level of conformance' 
                    : analysis.wcagCompliance.conformanceLevel === 'AA'
                      ? 'Mid-range level of conformance'
                      : 'Highest level of conformance'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Issues Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Critical Issues</span>
                  <span className="text-sm font-bold">{criticalIssues.length}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-destructive" 
                    style={{ width: `${(criticalIssues.length / totalIssues) * 100}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Serious Issues</span>
                  <span className="text-sm font-bold">{seriousIssues.length}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning" 
                    style={{ width: `${(seriousIssues.length / totalIssues) * 100}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Moderate Issues</span>
                  <span className="text-sm font-bold">{moderateIssues.length}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-info" 
                    style={{ width: `${(moderateIssues.length / totalIssues) * 100}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WCAG Score breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>WCAG Conformance Levels</CardTitle>
            <CardDescription>
              Web Content Accessibility Guidelines conformance by level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <WCAGBadge level="A" className="mr-2" />
                    <span className="font-medium">Level A</span>
                  </div>
                  <ScoreCircle score={analysis.accessibilityScore.wcagA} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Minimum level of conformance: addresses the most basic web accessibility features.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Issues:</span>
                  <span className="font-medium">{levelAIssues.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <WCAGBadge level="AA" className="mr-2" />
                    <span className="font-medium">Level AA</span>
                  </div>
                  <ScoreCircle score={analysis.accessibilityScore.wcagAA} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Deal with the biggest and most common barriers for disabled users. Government standard.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Issues:</span>
                  <span className="font-medium">{levelAAIssues.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <WCAGBadge level="AAA" className="mr-2" />
                    <span className="font-medium">Level AAA</span>
                  </div>
                  <ScoreCircle score={analysis.accessibilityScore.wcagAAA} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Highest level of conformance: the most robust accessibility support.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Issues:</span>
                  <span className="font-medium">{levelAAAIssues.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues list */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Accessibility Issues</h3>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All issues</SelectItem>
                  <SelectItem value="critical">Critical issues</SelectItem>
                  <SelectItem value="serious">Serious issues</SelectItem>
                  <SelectItem value="moderate">Moderate issues</SelectItem>
                  <SelectItem value="minor">Minor issues</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Issues</TabsTrigger>
              <TabsTrigger value="a">WCAG A</TabsTrigger>
              <TabsTrigger value="aa">WCAG AA</TabsTrigger>
              <TabsTrigger value="aaa">WCAG AAA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderIssueCards(criticalIssues, "Critical Issues")}
              {renderIssueCards(seriousIssues, "Serious Issues")}
              {renderIssueCards(moderateIssues, "Moderate Issues")}
              {renderIssueCards(minorIssues, "Minor Issues")}
            </TabsContent>
            
            <TabsContent value="a">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>Level A Issues</CardTitle>
                    <CardDescription>
                      Required for WCAG 2.1 Level A compliance
                    </CardDescription>
                  </div>
                  <WCAGBadge level="A" className="ml-2" />
                </CardHeader>
                <CardContent>
                  <AccessibilityIssuesTable issues={levelAIssues} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="aa">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>Level AA Issues</CardTitle>
                    <CardDescription>
                      Required for WCAG 2.1 Level AA compliance
                    </CardDescription>
                  </div>
                  <WCAGBadge level="AA" className="ml-2" />
                </CardHeader>
                <CardContent>
                  <AccessibilityIssuesTable issues={levelAAIssues} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="aaa">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>Level AAA Issues</CardTitle>
                    <CardDescription>
                      Required for WCAG 2.1 Level AAA compliance
                    </CardDescription>
                  </div>
                  <WCAGBadge level="AAA" className="ml-2" />
                </CardHeader>
                <CardContent>
                  <AccessibilityIssuesTable issues={levelAAAIssues} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Assistive Technologies Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" /> 
              Assistive Technologies Compatibility
            </CardTitle>
            <CardDescription>
              Compatibility with various assistive technologies based on our analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${analysis.assistiveTechnologies.screenReaders ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="font-medium">Screen Readers</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {analysis.assistiveTechnologies.screenReaders 
                    ? 'Compatible with screen readers' 
                    : 'Not fully compatible with screen readers'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${analysis.assistiveTechnologies.keyboardNavigation ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="font-medium">Keyboard Navigation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {analysis.assistiveTechnologies.keyboardNavigation 
                    ? 'Fully keyboard navigable' 
                    : 'Not fully keyboard navigable'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${analysis.assistiveTechnologies.voiceControl ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="font-medium">Voice Control</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {analysis.assistiveTechnologies.voiceControl 
                    ? 'Works with voice control software' 
                    : 'Limited voice control support'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${analysis.assistiveTechnologies.magnification ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="font-medium">Magnification</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {analysis.assistiveTechnologies.magnification 
                    ? 'Works well with zoom/magnification' 
                    : 'Issues with magnification'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resources Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlignLeft className="h-5 w-5" />
              Remediation Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">WCAG Guidelines</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Official Web Content Accessibility Guidelines documentation
                  </p>
                  <a 
                    href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Visit WCAG Website →
                  </a>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">WebAIM</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Articles and resources on implementing accessible websites
                  </p>
                  <a 
                    href="https://webaim.org/techniques/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Visit WebAIM →
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AccessibilityPage;
