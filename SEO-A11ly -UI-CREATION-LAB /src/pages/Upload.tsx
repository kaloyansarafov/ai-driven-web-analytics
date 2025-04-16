
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowUpFromLine, Smartphone, Tablet, Monitor, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/FileUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const UploadPage = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scanType, setScanType] = useState('single');
  const [deviceType, setDeviceType] = useState('all');
  const navigate = useNavigate();

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    
    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Set the analysis status in localStorage
      localStorage.setItem('hasAnalysis', 'true');
      toast.success('Analysis completed successfully!');
      navigate('/');
    }, 3000);
  };

  const handleUrlAnalysis = () => {
    if (!url) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl(`https://${url}`);
    }
    
    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Set the analysis status in localStorage
      localStorage.setItem('hasAnalysis', 'true');
      toast.success('Analysis completed successfully!');
      navigate('/');
    }, 3000);
  };

  const handleAnalyze = () => {
    // Determine if it's URL or file analysis based on active tab
    // For this demo, just simulate the analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Set the analysis status in localStorage
      localStorage.setItem('hasAnalysis', 'true');
      toast.success('Analysis completed successfully!');
      navigate('/accessibility');
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-xl text-gray-500 mt-2">
            Upload files or enter URLs to analyze accessibility and SEO issues.
          </p>
        </div>

        <Card className="shadow-sm bg-white rounded-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Analyze Your Website</h2>
                <p className="text-gray-500 mt-1">
                  Upload an file  or enter a URL to analyze accessibility and SEO issues
                </p>
              </div>

              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg bg-gray-100">
                  <TabsTrigger value="file" className="text-base py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">File Upload</TabsTrigger>
                  <TabsTrigger value="url" className="text-base py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-700"> File or Doc</label>
                    <FileUploader 
                      onFileUpload={handleFileUpload}
                      acceptedFileTypes=".html,.htm"
                      maxFileSizeMB={10}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-700">URL</label>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full text-base py-6 rounded-lg bg-white"
                    />
                    <div className="pt-4">
                      <Button 
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white text-lg py-6 h-auto rounded-lg"
                        onClick={handleUrlAnalysis}
                        disabled={isAnalyzing || !url}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze URL'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <div className="mt-6 flex items-center space-x-2">
                  <Switch 
                    id="advanced-options" 
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                  <Label htmlFor="advanced-options" className="text-lg font-medium text-gray-700">
                    Advanced Options
                  </Label>
                </div>
                
                {showAdvanced && (
                  <div className="mt-6 space-y-6 border rounded-lg p-6 bg-white">
                    {/* Scan Type Selection */}
                    <div className="space-y-3">
                      <label className="text-lg font-medium text-gray-700">Scan Type</label>
                      <RadioGroup 
                        value={scanType} 
                        onValueChange={setScanType}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="scan-single" />
                          <Label htmlFor="scan-single" className="text-base text-gray-700">Single Page (Current URL only)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multi" id="scan-multi" />
                          <Label htmlFor="scan-multi" className="text-base text-gray-700">Multi-Page (Crawl entire website)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Device Selection */}
                    <div className="space-y-3">
                      <label className="text-lg font-medium text-gray-700">Device Analysis</label>
                      <RadioGroup 
                        value={deviceType} 
                        onValueChange={setDeviceType}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="device-all" />
                          <Label htmlFor="device-all" className="text-base text-gray-700 flex items-center">
                            All Devices
                            <Scan className="ml-2 h-5 w-5 text-gray-500" />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobile" id="device-mobile" />
                          <Label htmlFor="device-mobile" className="text-base text-gray-700 flex items-center">
                            Mobile
                            <Smartphone className="ml-2 h-5 w-5 text-gray-500" />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tablet" id="device-tablet" />
                          <Label htmlFor="device-tablet" className="text-base text-gray-700 flex items-center">
                            Tablet
                            <Tablet className="ml-2 h-5 w-5 text-gray-500" />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="desktop" id="device-desktop" />
                          <Label htmlFor="device-desktop" className="text-base text-gray-700 flex items-center">
                            Desktop
                            <Monitor className="ml-2 h-5 w-5 text-gray-500" />
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="accessibility" defaultChecked />
                        <label htmlFor="accessibility" className="text-base text-gray-700">
                          Accessibility (WCAG 2.1 AA)
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox id="seo" defaultChecked />
                        <label htmlFor="seo" className="text-base text-gray-700">
                          SEO
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox id="performance" defaultChecked />
                        <label htmlFor="performance" className="text-base text-gray-700">
                          Performance
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox id="best-practices" defaultChecked />
                        <label htmlFor="best-practices" className="text-base text-gray-700">
                          Best Practices
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
