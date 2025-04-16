import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScoreCircle from "@/components/ScoreCircle";
import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { mockAnalysis } from "@/lib/mock-data";
import { AccessibilityIssuesTable, SEOIssuesTable } from "@/components/IssuesTable";
import { 
  ArrowRight, 
  BarChart3, 
  FileSearch, 
  Info, 
  ChevronDown, 
  Activity, 
  Link as LinkIcon, 
  Globe,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";

const Dashboard = () => {
  const analysis = mockAnalysis;
  const [hasAnalysis, setHasAnalysis] = useState(false);
  
  useEffect(() => {
    const analysisStatus = localStorage.getItem("hasAnalysis");
    setHasAnalysis(analysisStatus === "true");
  }, []);
  
  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    setHasAnalysis(true);
    localStorage.setItem("hasAnalysis", "true");
  };
  
  const resetAnalysisState = () => {
    setHasAnalysis(false);
    localStorage.removeItem("hasAnalysis");
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
            <p className="text-gray-500">
              Overview of your site's accessibility and SEO health
            </p>
          </div>
          <Link to="/upload">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white">
              New Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {!hasAnalysis ? (
          <Card className="bg-white shadow-sm border-0 p-8 text-center">
            <div className="max-w-md mx-auto py-12 space-y-8">
              <div className="bg-gray-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <Upload className="h-10 w-10 text-gray-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Welcome to cre8tion lab</h3>
                <p className="text-gray-500">
                  Upload your website or enter a URL to get started with your analysis. You'll see a detailed report here after your first scan.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/upload">
                  <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 h-auto text-lg">
                    Start Your First Analysis
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <FileSearch className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Analyze files</p>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <Globe className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Scan websites</p>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <BarChart3 className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Get reports</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 pt-8">
                <button onClick={resetAnalysisState} className="underline">
                  Reset analysis state (development only)
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard 
                title="Metric 1" 
                className="bg-white rounded-xl"
                action={
                  <div className="flex items-center text-gray-500 text-sm">
                    This week <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                }
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-400 opacity-20"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">30</div>
                        <div className="text-sm text-gray-500">Issues</div>
                      </div>
                    </div>
                  </div>
                </div>
              </MetricCard>
              
              <MetricCard 
                title="Metric 2" 
                className="bg-white rounded-xl"
                action={
                  <div className="flex items-center text-gray-500 text-sm">
                    This week <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                }
              >
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Attacks</span>
                    <div className="flex gap-4">
                      <span className="font-medium">36</span>
                      <span className="text-gray-400">19</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-2/3"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Shoots</span>
                    <div className="flex gap-4">
                      <span className="font-medium">24</span>
                      <span className="text-gray-400">32</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-1/2"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Passes</span>
                    <div className="flex gap-4">
                      <span className="font-medium">310</span>
                      <span className="text-gray-400">270</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                  </div>
                </div>
              </MetricCard>
              
              <div className="md:col-span-2">
                <MetricCard 
                  title="Analysis overview" 
                  className="bg-white rounded-xl h-full"
                >
                  <div className="space-y-6">
                    <div className="flex border-l-4 border-red-500 pl-3 py-1">
                      <div className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </div>
                    </div>
                    
                    <div className="flex border-l-4 border-red-500 pl-3 py-1">
                      <div className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      </div>
                    </div>
                    
                    <div className="flex border-l-4 border-yellow-400 pl-3 py-1">
                      <div className="text-sm">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </div>
                    </div>
                    
                    <div className="flex border-l-4 border-yellow-400 pl-3 py-1">
                      <div className="text-sm">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                      </div>
                    </div>
                    
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-auto ml-auto block">
                      Get Report
                    </Button>
                  </div>
                </MetricCard>
              </div>
            </div>
            
            <MetricCard 
              title="Metric 3" 
              className="bg-white rounded-xl"
              action={
                <div className="flex items-center text-gray-500 text-sm">
                  This week <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              }
            >
              <div className="h-48 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center z-10">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 800 200">
                  <path 
                    d="M0,100 C100,90 150,140 200,100 C250,60 300,80 400,100 C500,120 600,80 700,100 C750,110 800,90 800,100" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3"
                  />
                  <path 
                    d="M0,100 C100,90 150,140 200,100 C250,60 300,80 400,100 C500,120 600,80 700,100 C750,110 800,90 800,100" 
                    fill="none" 
                    stroke="#dbeafe" 
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeOpacity="0.3"
                  />
                </svg>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <div>01</div>
                  <div>02</div>
                  <div>03</div>
                  <div>04</div>
                  <div>05</div>
                  <div>06</div>
                  <div>07</div>
                  <div>08</div>
                  <div>09</div>
                  <div>10</div>
                </div>
              </div>
            </MetricCard>
            
            <div className="grid grid-cols-4 gap-6">
              <MetricCard 
                title="Domain" 
                className="bg-white rounded-xl"
                icon={<Globe className="h-4 w-4" />}
              >
                <div className="text-4xl font-bold">72</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-800 h-2 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </MetricCard>
              
              <MetricCard 
                title="Backlinks" 
                className="bg-white rounded-xl"
                icon={<LinkIcon className="h-4 w-4" />}
              >
                <div className="text-4xl font-bold">1,234</div>
                <div className="text-sm text-green-500">+12% from last month</div>
              </MetricCard>
              
              <MetricCard 
                title="Keywords" 
                className="bg-white rounded-xl"
                icon={<FileSearch className="h-4 w-4" />}
              >
                <div className="text-4xl font-bold">5,234</div>
                <div className="text-sm text-gray-500">Top 10 positions</div>
              </MetricCard>
              
              <MetricCard 
                title="Score" 
                className="bg-white rounded-xl"
                icon={<Activity className="h-4 w-4" />}
              >
                <div className="text-4xl font-bold">89/100</div>
                <div className="text-sm text-green-500">+3% improvement</div>
              </MetricCard>
            </div>

            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl">Website Performance</CardTitle>
                <CardDescription>
                  Key metrics for your website's performance and user experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="accessibility" className="space-y-4">
                  <div className="flex items-center">
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="accessibility" className="data-[state=active]:bg-white">Accessibility</TabsTrigger>
                      <TabsTrigger value="seo" className="data-[state=active]:bg-white">SEO</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto">
                      <Button variant="outline" size="sm" className="bg-white">
                        Export Report
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="accessibility" className="space-y-6 mt-4">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            Accessibility Score
                          </CardTitle>
                          <FileSearch className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center py-2">
                            <ScoreCircle score={analysis.accessibilityScore.overall} />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            SEO Score
                          </CardTitle>
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center py-2">
                            <ScoreCircle score={analysis.seoScore.overall} />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            WCAG Compliance
                          </CardTitle>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center py-2">
                            <span className="text-2xl font-bold">
                              {analysis.wcagCompliance.conformanceLevel}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Level Conformance
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            Critical Issues
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center py-2">
                            <span className="text-2xl font-bold">
                              {analysis.accessibilityIssues.filter(i => i.impact === 'critical').length}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Require immediate attention
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Accessibility Issues</CardTitle>
                        <CardDescription>
                          Issues that require immediate attention to improve compliance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AccessibilityIssuesTable issues={analysis.accessibilityIssues.slice(0, 5)} />
                        <div className="mt-4 text-center">
                          <Link to="/accessibility">
                            <Button variant="outline">
                              View All Issues
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="seo" className="space-y-6 mt-4">
                    <div className="grid gap-6 md:grid-cols-4">
                      <MetricCard title="Meta Data">
                        <div className="flex items-center gap-4">
                          <ScoreCircle score={analysis.seoScore.meta} size="sm" />
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Meta Tags</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Title, description, etc.
                            </p>
                          </div>
                        </div>
                      </MetricCard>
                      
                      <MetricCard title="Content Quality">
                        <div className="flex items-center gap-4">
                          <ScoreCircle score={analysis.seoScore.content} size="sm" />
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Content Score</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Readability and keywords
                            </p>
                          </div>
                        </div>
                      </MetricCard>
                      
                      <MetricCard title="Technical SEO">
                        <div className="flex items-center gap-4">
                          <ScoreCircle score={analysis.seoScore.technical} size="sm" />
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Technical Factors</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Speed, mobile-friendly
                            </p>
                          </div>
                        </div>
                      </MetricCard>
                      
                      <MetricCard title="Structure">
                        <div className="flex items-center gap-4">
                          <ScoreCircle score={analysis.seoScore.structure} size="sm" />
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Site Structure</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              URLs, headings, links
                            </p>
                          </div>
                        </div>
                      </MetricCard>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top SEO Issues</CardTitle>
                        <CardDescription>
                          Issues that are affecting your search engine visibility
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SEOIssuesTable issues={analysis.seoIssues.slice(0, 5)} />
                        <div className="mt-4 text-center">
                          <Link to="/seo">
                            <Button variant="outline">
                              View All Issues
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
