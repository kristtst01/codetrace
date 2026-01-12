import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Code } from 'lucide-react';
import type { Algorithm } from '../types';

interface AlgorithmInfoCardProps {
  algorithm: Algorithm;
  currentMessage?: string;
}

export const AlgorithmInfoCard = ({ algorithm, currentMessage }: AlgorithmInfoCardProps) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{algorithm.name}</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
          <Code className="mr-2 h-4 w-4" />
          {showCode ? 'Hide Code' : 'View Code'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium">Time: </span>
            <span className="text-muted-foreground">{algorithm.timeComplexity}</span>
          </div>
          <div>
            <span className="font-medium">Space: </span>
            <span className="text-muted-foreground">{algorithm.spaceComplexity}</span>
          </div>
        </div>

        {showCode && (
          <div className="mt-4">
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                <code>{algorithm.code}</code>
              </pre>
            </div>
          </div>
        )}

        {currentMessage && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm font-mono">{currentMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
