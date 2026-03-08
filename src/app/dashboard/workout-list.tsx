"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
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
import type { Workout } from "@/db/schema";

interface WorkoutListProps {
  workouts: Workout[];
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const workoutsForDate = workouts.filter((w) => {
    const workoutDate = w.createdAt;
    return isSameDay(workoutDate, date);
  });

  return (
    <>
      <div className="mb-8">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="inline-flex h-9 w-56 items-center justify-start gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900">
            <CalendarIcon className="h-4 w-4 text-zinc-500" />
            {format(date, "do MMM yyyy")}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => { if (d) { setDate(d); setOpen(false); } }}
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
                    {format(workout.createdAt, "do MMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
