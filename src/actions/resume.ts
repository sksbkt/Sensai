"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Resume } from "@prisma/client";
import { revalidatePath } from "next/cache";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getLoggedInUser = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
};

export async function saveResume(content: string) {
  const user = await getLoggedInUser();
  try {
    console.log({ userID: user.id, content: content });
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Failed to save resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  try {
    const resume = await db.resume.findUnique({
      where: { userId: user.id },
    });

    return resume;
  } catch (error) {
    console.error("Failed to get resume:", error);
    throw new Error("Failed to get resume");
  }
}

export async function improveWithAi(current: string, type: string) {
  const user = await getLoggedInUser();

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;
  try {
    const results = await model.generateContent(prompt);
    const response = results.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Failed to generate improved content", error);
    throw new Error("Failed to generate improved content");
  }
}
