import { getResume } from "@/actions/resume";
import ResumeBuilder from "@/app/(main)/resume/_components/resume-builder";
import React from "react";

const ResumePage = async () => {
  const resume = await getResume();
  console.log(resume);

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
};

export default ResumePage;
