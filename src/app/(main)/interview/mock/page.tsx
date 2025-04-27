import Quiz from "@/app/(main)/interview/_components/quiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const MockInterviewPage = () => {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href={"/interview"}>
          <Button
            variant={"link"}
            className="gap-2 pl-10"
          >
            <ArrowLeft className="h-4 w-4" />
            back to interview
          </Button>
        </Link>
        <div>
          <h1 className="text-6xl font-bold gradient-title">Mock interview</h1>
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>
      <Quiz />
    </div>
  );
};

export default MockInterviewPage;
