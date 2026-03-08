# Authentication Coding Standards

## Provider: Clerk

**This application uses [Clerk](https://clerk.com) for all authentication.**

- Do NOT implement custom auth logic, JWT handling, or session management
- Do NOT use NextAuth, Auth.js, or any other auth library
- All auth must go through Clerk's SDK and components

## Getting the Current User

In Server Components, retrieve the authenticated user via Clerk's `auth()` helper:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

Never read user identity from the client or from a custom session. Always use Clerk server-side helpers.

## Protecting Pages

Use Clerk's middleware to protect routes. Configure `clerkMiddleware` in `middleware.ts` at the project root:

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jinja2|ttf|woff2?|ico|gif|svg|png|jpg|jpeg|webp)).*)", "/(api|trpc)(.*)"],
};
```

## Sign In / Sign Up UI

Use Clerk's pre-built components. Do NOT build custom auth forms.

```tsx
import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
```

Place sign-in/sign-up pages at:

```
src/app/sign-in/[[...sign-in]]/page.tsx
src/app/sign-up/[[...sign-up]]/page.tsx
```

## Accessing userId in Data Helpers

Always pass `userId` from the Server Component into `/data` helper functions. Never call `auth()` inside a `/data` helper — keep auth concerns in the component layer.

```tsx
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return null; // Should not happen on a protected route

  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

## Summary

| Concern | Solution |
|---|---|
| Auth provider | Clerk |
| Get current user (server) | `auth()` from `@clerk/nextjs/server` |
| Route protection | `clerkMiddleware` in `middleware.ts` |
| Sign in / sign up UI | Clerk pre-built components |
| Custom auth logic | Forbidden |
