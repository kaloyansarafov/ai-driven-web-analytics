
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Bug, Play, Pause, RefreshCw, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CrawlResult {
  id: string;
  url: string;
  status: 'completed' | 'in-progress' | 'failed';
  pagesScanned: number;
  issuesFound: number;
  dateStarted: string;
}

const Crawler = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([
    {
      id: '1',
      url: 'https://example.com',
      status: 'completed',
      pagesScanned: 42,
      issuesFound: 7,
      dateStarted: '2025-04-09T08:30:00Z'
    },
    {
      id: '2',
      url: 'https://mywebsite.org',
      status: 'in-progress',
      pagesScanned: 15,
      issuesFound: 3,
      dateStarted: '2025-04-09T09:15:00Z'
    },
    {
      id: '3',
      url: 'https://testsite.net',
      status: 'failed',
      pagesScanned: 2,
      issuesFound: 0,
      dateStarted: '2025-04-09T07:45:00Z'
    }
  ]);

  const handleStartCrawl = () => {
    if (!url) return;
    
    setIsScanning(true);
    
    // In a real app, this would be an API call
    const newCrawl: CrawlResult = {
      id: Date.now().toString(),
      url: url,
      status: 'in-progress',
      pagesScanned: 0,
      issuesFound: 0,
      dateStarted: new Date().toISOString()
    };
    
    setCrawlResults([newCrawl, ...crawlResults]);
    setUrl('');
    
    // Simulate completing after some time
    setTimeout(() => {
      setCrawlResults(prev => 
        prev.map(item => 
          item.id === newCrawl.id 
            ? {...item, status: 'completed', pagesScanned: Math.floor(Math.random() * 50) + 5, issuesFound: Math.floor(Math.random() * 10)}
            : item
        )
      );
      setIsScanning(false);
    }, 5000);
  };

  const handleDeleteCrawl = (id: string) => {
    setCrawlResults(crawlResults.filter(result => result.id !== id));
  };

  const handlePauseCrawl = (id: string) => {
    // In a real app, this would pause the crawler via API
    console.log(`Pausing crawl ${id}`);
  };

  const handleResumeCrawl = (id: string) => {
    // In a real app, this would resume the crawler via API
    console.log(`Resuming crawl ${id}`);
  };

  const getStatusBadge = (status: CrawlResult['status']) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Web Crawler</h2>
          <p className="text-muted-foreground">Scan websites for accessibility and SEO issues.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start New Crawl</CardTitle>
            <CardDescription>Enter a URL to start scanning for issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="https://example.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleStartCrawl} 
                disabled={!url || isScanning}
                className="gap-2"
              >
                <Bug className="h-4 w-4" />
                Start Crawl
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crawl History</CardTitle>
            <CardDescription>Recent website scans and their results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pages Scanned</TableHead>
                    <TableHead>Issues Found</TableHead>
                    <TableHead>Date Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crawlResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No crawl history yet. Start a new crawl above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    crawlResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.url}</TableCell>
                        <TableCell>{getStatusBadge(result.status)}</TableCell>
                        <TableCell>{result.pagesScanned}</TableCell>
                        <TableCell>{result.issuesFound}</TableCell>
                        <TableCell>{new Date(result.dateStarted).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {result.status === 'in-progress' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePauseCrawl(result.id)}
                                title="Pause"
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : result.status === 'failed' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleResumeCrawl(result.id)}
                                title="Retry"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            ) : null}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCrawl(result.id)}
                              title="Delete"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Crawler;
