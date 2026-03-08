"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
});

export async function updateWorkoutAction(params: {
  workoutId: string;
  name: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const [workout] = await updateWorkout(userId, parsed.data.workoutId, parsed.data.name);
  return workout;
}
