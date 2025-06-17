import { LocalityAura } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Award } from 'lucide-react';

interface LocalityAuraCardProps {
  aura: LocalityAura;
  className?: string;
  heading?: string;
}

export function LocalityAuraCard({ aura, className, heading }: LocalityAuraCardProps) {
  // Convert parameters object to array for RadarChart
  const data = [
    { subject: 'Safety', value: aura.parameters.safety, fullMark: 10 },
    { subject: 'Food Cost', value: aura.parameters.food_cost, fullMark: 10 },
    { subject: 'Student Friendly', value: aura.parameters.student_friendly, fullMark: 10 },
    { subject: 'Public Transport', value: aura.parameters.public_transport, fullMark: 10 },
    { subject: 'Evening Life', value: aura.parameters.evening_atmosphere, fullMark: 10 },
  ];

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-500 dark:text-green-400';
    if (score >= 7) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{heading || aura.locality}</CardTitle>
          <div className="flex items-center space-x-1">
            <Award className="h-5 w-5 text-primary" />
            <span className={`text-xl font-bold ${getScoreColor(aura.score)}`}>
              {aura.score.toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" fontSize={12} />
              <Radar
                name="Locality Stats"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Safety:</span>
            <span className="font-medium">{aura.parameters.safety}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Food Cost:</span>
            <span className="font-medium">{aura.parameters.food_cost}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Student Friendly:</span>
            <span className="font-medium">{aura.parameters.student_friendly}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Public Transport:</span>
            <span className="font-medium">{aura.parameters.public_transport}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Evening Life:</span>
            <span className="font-medium">{aura.parameters.evening_atmosphere}/10</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}