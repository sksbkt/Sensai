/* eslint-disable @typescript-eslint/no-unused-vars */
import OnboardingFrom from "@/app/(main)/onboarding/_components/onboarding-from";
import { industries } from "@/data/industries";
import React from "react";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";

const OnboardingPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingFrom industries={industries} />
    </main>
  );
};

export default OnboardingPage;
