"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function createWorkoutAction(params: { name: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const [workout] = await createWorkout(userId, parsed.data.name);
  return workout;
}
