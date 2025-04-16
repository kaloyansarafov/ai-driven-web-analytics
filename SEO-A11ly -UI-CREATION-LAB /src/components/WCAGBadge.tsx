
import { cn } from "@/lib/utils";

interface WCAGBadgeProps {
  level: 'A' | 'AA' | 'AAA' | 'None';
  className?: string;
}

const WCAGBadge = ({ level, className }: WCAGBadgeProps) => {
  const badgeClass = level === 'None' 
    ? 'bg-gray-200 text-gray-600' 
    : {
      'A': 'bg-wcag-a-light text-wcag-a font-medium',
      'AA': 'bg-wcag-aa-light text-wcag-aa font-medium',
      'AAA': 'bg-wcag-aaa-light text-wcag-aaa font-medium'
    }[level];

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs inline-flex items-center justify-center", badgeClass, className)}>
      {level}
    </span>
  );
};

export default WCAGBadge;
