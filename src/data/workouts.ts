import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function createWorkout(userId: string, name: string) {
  return db.insert(workouts).values({ userId, name }).returning();
}
