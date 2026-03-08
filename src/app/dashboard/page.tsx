"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Morning Push",
    date: new Date(2026, 2, 8),
    exercises: 5,
    duration: "45 min",
  },
  {
    id: 2,
    name: "Upper Body Strength",
    date: new Date(2026, 2, 8),
    exercises: 7,
    duration: "60 min",
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date(2026, 2, 8));

  const workoutsForDate = MOCK_WORKOUTS.filter(
    (w) => format(w.date, "do MMM yyyy") === format(date, "do MMM yyyy")
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>

        <div className="mb-8">
          <Popover>
            <PopoverTrigger className="inline-flex h-9 w-56 items-center justify-start gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900">
              <CalendarIcon className="h-4 w-4 text-zinc-500" />
              {format(date, "do MMM yyyy")}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}

              />
            </PopoverContent>
          </Popover>
        </div>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
            Workouts — {format(date, "do MMM yyyy")}
          </h2>

          {workoutsForDate.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No workouts logged for this date.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {workoutsForDate.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                    <CardDescription>
                      {workout.exercises} exercises · {workout.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
