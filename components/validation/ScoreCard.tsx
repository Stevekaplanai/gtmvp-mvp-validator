import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: string;
  description: string;
  color: 'green' | 'yellow' | 'red';
}

export function ScoreCard({ title, score, icon, description, color }: ScoreCardProps) {
  const colorClasses = {
    green: 'bg-green-500/20 border-green-500/50 text-green-400',
    yellow: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    red: 'bg-red-500/20 border-red-500/50 text-red-400',
  };

  const progressColor = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className={`glass border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <Badge variant="secondary" className="text-lg font-bold">
          {score}/100
        </Badge>
      </div>

      <Progress value={score} className="h-2 mb-2" />

      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}
