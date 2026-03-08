import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

export async function createWorkout(userId: string, name: string) {
  return db.insert(workouts).values({ userId, name }).returning();
}

export async function getWorkoutById(userId: string, workoutId: string) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .then((rows) => rows[0] ?? null);
}

export async function updateWorkout(userId: string, workoutId: string, name: string) {
  return db
    .update(workouts)
    .set({ name, updatedAt: new Date() })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
}
