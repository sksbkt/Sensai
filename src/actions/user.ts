/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import db from "@/lib/prisma";
import type { User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "@/actions/dashboard";
import { getLoggedInUser } from "@/lib/auth";

export async function updateUser(data: Partial<User>) {
  const { user } = await getLoggedInUser();

  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry!,
          },
        });
        if (!industryInsight) {
          // industryInsight = await tx.industryInsight.create({
          //   data: {
          //     industry: data.industry!,
          //     salaryRanges: [],
          //     growthRate: 0,
          //     demandLevel: "Medium",
          //     topSkills: [],
          //     marketOutlook: "Neutral",
          //     keyTrends: [],
          //     recommendedSkills: [],
          //     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          //   },
          // });
          const insights = await generateAIInsights(data.industry!);
          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
            },
          });
        }
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updatedUser, industryInsight };
      },
      { timeout: 10000 }
    );
    return result.updatedUser;
    // return result.user;
  } catch (error) {
    console.error("error updating user and industry", (error as Error).message);
    throw new Error("failed to update profile");
  }
}
export type updateUserType = typeof updateUser;

export async function getUserOnboardingStatus() {
  const { userId } = await getLoggedInUser();

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });
    return { isOnboarded: !!user?.industry };
  } catch (error) {
    console.error(
      "Error checking onboarding status:",
      (error as Error).message
    );
    throw new Error("Failed to check onboarding status");
  }
}
