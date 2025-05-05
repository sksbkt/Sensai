"use client";
import QuizResult from "@/app/(main)/interview/_components/quiz-result";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Assessment } from "@prisma/client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
interface QuizListProps {
  assessments: Assessment[] | undefined;
}
const QuizList = ({ assessments }: QuizListProps) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl gradient-title md:text-4xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>
              Preview your past quiz performance
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment, index) => {
              return (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <CardHeader>
                    <CardTitle>Quiz {index + 1}</CardTitle>
                    <CardDescription className="flex flex-row justify-between w-full">
                      <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                      <div>
                        {format(assessment.createdAt, "MMM dd yyyy HH:mm")}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={!!selectedQuiz}
        onOpenChange={() => setSelectedQuiz(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <ScrollArea className="max-h-[80vh] ">
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <QuizResult
              result={selectedQuiz}
              onStartNew={() => router.push("/interview/mock")}
              hideStartNew
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
