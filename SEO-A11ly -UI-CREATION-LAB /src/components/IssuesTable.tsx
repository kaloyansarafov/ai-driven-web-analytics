
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import WCAGBadge from './WCAGBadge';
import { WCAGIssue, SEOIssue } from '@/lib/types';

interface AccessibilityIssuesTableProps {
  issues: WCAGIssue[];
}

interface SEOIssuesTableProps {
  issues: SEOIssue[];
}

export const AccessibilityIssuesTable = ({ issues }: AccessibilityIssuesTableProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'serious': return 'bg-warning text-warning-foreground';
      case 'moderate': return 'bg-info text-info-foreground';
      case 'minor': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>WCAG Criterion</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead className="hidden md:table-cell">Element</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{issue.criterion}</span>
                  <WCAGBadge level={issue.level} className="mt-1" />
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getImpactColor(issue.impact)}>
                  {issue.impact}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <code className="text-xs bg-muted p-1 rounded">
                  {issue.element || 'N/A'}
                </code>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{issue.description}</span>
                  <span className="text-xs text-muted-foreground">{issue.location || 'N/A'}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const SEOIssuesTable = ({ issues }: SEOIssuesTableProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-info text-info-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'meta': return 'Meta Data';
      case 'content': return 'Content';
      case 'technical': return 'Technical';
      case 'structure': return 'Structure';
      default: return category;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>
                <Badge variant="outline">{getCategoryLabel(issue.category)}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getImpactColor(issue.impact)}>
                  {issue.impact}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{issue.description}</span>
                  <span className="text-xs text-muted-foreground">{issue.remediation}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
