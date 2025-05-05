"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { JsonValue } from "@prisma/client/runtime/library";
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");
  try {
    const prompt = `
        Generate 10 technical interview questions for a ${
          user.industry
        } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
                
                Each question should be multiple choice with 4 options.
                
                Return the response in this JSON format only, no additional text:
                {
                    "questions": [
                        {
                            "question": "string",
                            "options": ["string", "string", "string", "string"],
                            "correctAnswer": "string",
                            "explanation": "string"
                            }
                            ]
                            }
                            `;
    const results = await model.generateContent(prompt);
    const response = results.response;
    const text = response.text();
    const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();

    const quiz = JSON.parse(cleanText);

    return quiz.questions;
  } catch (error) {
    console.error("Failed to generate quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(
  questions: { question: string; correctAnswer: string; explanation: string }[],
  answers: string[],
  score: number
) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));
  let improvementTip = null;
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");
    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
    try {
      const results = await model.generateContent(improvementPrompt);
      const response = results.response;
      improvementTip = response.text().trim();
    } catch (error) {
      console.error("Failed to generate improvement tip:", error);
      throw new Error("Failed to generate improvement tip");
    }
  }
  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "technical",
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    console.error("Failed to save quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");
  try {
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      //? change ascending to descending to get the latest assessments first
      orderBy: { createdAt: "desc" },
    });
    return assessments;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching assessments", error.message);
      throw new Error("Failed to fetch assessments");
    }
  }
}
