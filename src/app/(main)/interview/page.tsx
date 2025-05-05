import { getAssessments } from "@/actions/interview";
import PerformanceChart from "@/app/(main)/interview/_components/performance-chart";
import QuizList from "@/app/(main)/interview/_components/quiz-list";
import StatsCard from "@/app/(main)/interview/_components/stats-cards";
import React from "react";

const InterviewPage = async () => {
  const assessments = await getAssessments();
  return (
    <div>
      <div>
        <h1 className="text-6xl font-bold gradient-title mb-5">
          Interview Preparation
        </h1>
        <div className="space-y-4">
          <StatsCard assessments={assessments} />
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
