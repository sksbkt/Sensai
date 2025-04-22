/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry: string | null) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
  const results = await model.generateContent(prompt);
  const response = results.response;
  const text = response.text();
  const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanText);
};
export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });
  if (!user) throw new Error("User not found");
  //    TODO:
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);
    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
      },
    });
    return industryInsight;
  }

  return user.industryInsight;
}
