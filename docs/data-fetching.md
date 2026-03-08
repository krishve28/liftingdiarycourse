# Data Fetching

## CRITICAL: Server Components Only

ALL data fetching in this application MUST be done via **Server Components**.

**NEVER fetch data via:**
- Route handlers (`src/app/api/`)
- Client components (`"use client"`)
- Any other mechanism

This is non-negotiable. If you are tempted to fetch data in a client component or route handler, stop and restructure to use a Server Component instead.

## Database Queries: /data Directory

All database queries MUST go through helper functions in the `/data` directory.

- Create a file per domain (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Each file exports async functions that query the database
- These functions are called from Server Components only

### Example structure

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## CRITICAL: Use Drizzle ORM — No Raw SQL

All queries MUST use **Drizzle ORM**. Raw SQL (`db.execute(sql\`...\``) is forbidden.

## CRITICAL: Users Can Only Access Their Own Data

Every query that returns user data MUST filter by the authenticated user's ID. A logged-in user must NEVER be able to read, modify, or delete another user's data.

- Always retrieve the current user's ID from the auth session inside the Server Component
- Always pass the `userId` into the `/data` helper function
- Always include a `.where(eq(table.userId, userId))` clause (or equivalent join condition) in every query

**Never** fetch all rows and filter in JS. Always filter at the database level.

### Example Server Component usage

```tsx
// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

## Summary

| Rule | Requirement |
|---|---|
| Where to fetch data | Server Components only |
| Where to put queries | `/data` helper functions |
| ORM | Drizzle ORM (no raw SQL) |
| Data access scope | Logged-in user's own data only, always filtered by `userId` |
