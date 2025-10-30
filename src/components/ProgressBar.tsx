import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar = ({ current, total, className = "" }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium text-foreground">
          {current} of {total} movies
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default ProgressBar;
