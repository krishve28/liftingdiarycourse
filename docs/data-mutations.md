# Data Mutations

## CRITICAL: Server Actions Only

ALL data mutations in this application MUST be done via **Server Actions**.

**NEVER mutate data via:**
- Route handlers (`src/app/api/`)
- Client components directly calling the database
- Any other mechanism

## Database Mutations: /data Directory

All database mutation calls MUST go through helper functions in the `/data` directory — the same directory used for queries.

- Create a file per domain (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Each file exports async functions that wrap Drizzle ORM calls
- These functions are called from Server Actions only

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Server Actions: actions.ts

All Server Actions MUST live in colocated `actions.ts` files next to the route they serve.

```
src/
  app/
    dashboard/
      page.tsx
      actions.ts      ← server actions for the dashboard route
    workouts/
      [id]/
        page.tsx
        actions.ts    ← server actions for the workout detail route
```

### Rules

- Every `actions.ts` file MUST have `"use server"` at the top
- Action parameters MUST be explicitly typed — **never use `FormData` as a parameter type**
- Every action MUST validate its arguments with **Zod** before doing anything else
- After validation, call the appropriate `/data` helper function — do not call the database directly
- **NEVER call `redirect()` inside a Server Action.** Redirects MUST be handled client-side after the action resolves (e.g. using `useRouter().push()` in the calling component)

### Example Server Action

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: Date;
}) {
  const session = await auth();

  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  return createWorkout(session.user.id, parsed.data.name, parsed.data.date);
}
```

## CRITICAL: Use Drizzle ORM — No Raw SQL

All mutations MUST use **Drizzle ORM**. Raw SQL is forbidden.

## CRITICAL: Users Can Only Mutate Their Own Data

Every mutation MUST be scoped to the authenticated user. Always retrieve the current user's ID from the auth session inside the Server Action and pass it to the `/data` helper.

- **Never** trust a `userId` passed in from the client — always read it from the server-side session
- Always include a `userId` condition in the Drizzle `where` clause for updates and deletes

## Summary

| Rule | Requirement |
|---|---|
| Where to mutate data | Server Actions only |
| Where to put DB calls | `/data` helper functions |
| Server Action file name | `actions.ts`, colocated with the route |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod — validate before any DB call |
| ORM | Drizzle ORM (no raw SQL) |
| Data access scope | Logged-in user's own data only, always scoped by `userId` from session |
| Redirects | Client-side only (e.g. `useRouter().push()`), never `redirect()` in a Server Action |
