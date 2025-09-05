import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface TaskDescriptionProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  expectedOutput?: string;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  title,
  difficulty,
  description,
  expectedOutput
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 text-sm">Task Description</h4>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {description}
          </p>
        </div>
        
        {expectedOutput && (
          <div>
            <h4 className="font-medium mb-2 text-sm">Expected Output</h4>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto font-mono">
              {expectedOutput}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskDescription;