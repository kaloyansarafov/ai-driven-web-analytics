import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Filter, MoreHorizontal, ChevronDown, Upload, FileSearch, Globe, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Report {
  id: string;
  name: string;
  url: string;
  date: string;
  a11yScore: number;
  seoScore: number;
  issues: number;
}

const reportsData: Report[] = [
  {
    id: '456',
    name: 'Homepage Analysis',
    url: 'https://example.com',
    date: 'Apr 7, 2025, 2:30 PM',
    a11yScore: 78,
    seoScore: 85,
    issues: 20,
  },
  {
    id: '2',
    name: 'Product Page Analysis',
    url: 'https://example.com/products',
    date: 'Apr 6, 2025, 10:15 AM',
    a11yScore: 65,
    seoScore: 72,
    issues: 31,
  },
  {
    id: '3',
    name: 'Blog Analysis',
    url: 'https://example.com/blog',
    date: 'Apr 5, 2025, 4:45 PM',
    a11yScore: 92,
    seoScore: 88,
    issues: 7,
  },
  {
    id: '4',
    name: 'Contact Page',
    url: 'https://example.com/contact',
    date: 'Apr 4, 2025, 9:20 AM',
    a11yScore: 88,
    seoScore: 90,
    issues: 9,
  },
  {
    id: '5',
    name: 'About Us Page',
    url: 'https://example.com/about',
    date: 'Apr 3, 2025, 11:10 AM',
    a11yScore: 95,
    seoScore: 92,
    issues: 4,
  },
];

const ReportsPage: React.FC = () => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const analysisStatus = localStorage.getItem("hasAnalysis");
    setHasAnalysis(analysisStatus === "true");
  }, []);

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId) 
        : [...prev, reportId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reportsData.map(report => report.id));
    } else {
      setSelectedReports([]);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Reports</h1>
          </div>

          {!hasAnalysis ? (
            <Card className="bg-white shadow-sm border-0 p-8 text-center">
              <div className="max-w-md mx-auto py-12 space-y-8">
                <div className="bg-gray-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800">No Reports Available</h3>
                  <p className="text-gray-500">
                    You need to scan a website first before you can view reports. Start by uploading a file or entering a URL to analyze.
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
              </div>
            </Card>
          ) : (
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="flex flex-col space-y-4 bg-[#f1f2f6] p-4 rounded-lg min-w-56">
                  <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-[#f1f2f6] hover:bg-[#e6e7eb] text-gray-800 font-medium cursor-pointer">
                    <span className="material-icons">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>All Reports</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-[#e6e7eb] text-gray-600 cursor-pointer">
                    <span className="material-icons">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Scheduled</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-[#e6e7eb] text-gray-600 cursor-pointer">
                    <span className="material-icons">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>History</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-[#e6e7eb] text-gray-600 cursor-pointer">
                    <span className="material-icons">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-[#e6e7eb] text-gray-600 cursor-pointer">
                    <span className="material-icons">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>Accessibility</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-[#e6e7eb] text-gray-600 cursor-pointer">
                    <span className="material-icons">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span>SEO</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 px-6">
                <div className="flex items-center mb-6 space-x-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search reports..." 
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        Newest First
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('a11y-high')}>
                        Highest A11y Score
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('seo-high')}>
                        Highest SEO Score
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox 
                            checked={selectedReports.length === reportsData.length && reportsData.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Report</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>A11y Score</TableHead>
                        <TableHead>SEO Score</TableHead>
                        <TableHead>Issues</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportsData.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Checkbox 
                              checked={selectedReports.includes(report.id)}
                              onCheckedChange={() => toggleReportSelection(report.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <Link to={`/reports/${report.id}`} className="font-medium hover:underline">{report.name}</Link>
                              <div className="text-sm text-gray-500">{report.url}</div>
                            </div>
                          </TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell className={getScoreColor(report.a11yScore)}>
                            {report.a11yScore}
                          </TableCell>
                          <TableCell className={getScoreColor(report.seoScore)}>
                            {report.seoScore}
                          </TableCell>
                          <TableCell>{report.issues}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/reports/${report.id}`}>View Report</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                <DropdownMenuItem>Share Report</DropdownMenuItem>
                                <DropdownMenuItem>Compare With...</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
