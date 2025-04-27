/* eslint-disable @typescript-eslint/no-unused-vars */
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JsonValue } from "@prisma/client/runtime/library";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import React from "react";
interface QuizResultProps {
  result: {
    id: string;
    userId: string;
    quizScore: number;
    questions: JsonValue[];
    category: string;
    improvementTip: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  hideStartNew?: boolean;
  onStartNew?: () => void;
}
const QuizResult = ({ result, hideStartNew, onStartNew }: QuizResultProps) => {
  if (!result) {
    return null;
  }
  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Result
      </h1>
      <CardContent>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress
            value={result.quizScore}
            className="w-full"
          />
        </div>
        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="font-medium">Question review</h3>
          {result.questions.map((q, index) => (
            <div key={index}>
              <div>
                {(q as { isCorrect: boolean }).isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500  flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500  flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default QuizResult;
