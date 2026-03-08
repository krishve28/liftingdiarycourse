import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params;
  const { userId } = await auth();
  if (!userId) return notFound();

  const workout = await getWorkoutById(userId, workoutId);
  if (!workout) return notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Edit workout
        </h1>
        <EditWorkoutForm workoutId={workout.id} initialName={workout.name} />
      </main>
    </div>
  );
}
