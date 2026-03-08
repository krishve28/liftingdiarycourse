import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          New workout
        </h1>
        <NewWorkoutForm />
      </main>
    </div>
  );
}
