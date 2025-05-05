import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assessment } from "@prisma/client";
import { Brain, CircleDot, Trophy } from "lucide-react";
import React from "react";
interface statsCardsProps {
  assessments: Assessment[] | undefined;
}
const StatsCard = ({ assessments }: statsCardsProps) => {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };
  const getLatestAssessment = () => {
    if (!assessments?.length) return null;

    return assessments[0];
  };
  const getTotalQuestion = () => {
    if (!assessments?.length) return null;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Trophy className={"w-4 h-4 text-muted-foreground"} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Questions Practiced
          </CardTitle>
          <Brain className={"w-4 h-4 text-muted-foreground"} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalQuestion()}</div>
          <p className="text-xs text-muted-foreground">
            total questions practiced
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          <CircleDot className={"w-4 h-4 text-muted-foreground"} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getLatestAssessment()?.quizScore}%
          </div>
          <p className="text-xs text-muted-foreground">
            Most recent assessment score
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
