import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getLoggedInUser = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });
  if (!user) throw new Error("User not found");
  return { user, userId };
};
