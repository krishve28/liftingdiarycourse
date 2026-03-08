# Routing Standards

This document defines the routing conventions and protection standards for this Next.js App Router application.

## Route Structure

All application routes must be nested under `/dashboard`. There should be no authenticated or app-specific pages outside of this prefix.

```
/                        # Public landing/home page
/dashboard               # Main dashboard (protected)
/dashboard/[feature]/    # All app sub-pages (protected)
```

### Examples

```
/dashboard                        # Dashboard home
/dashboard/workout/[workoutId]    # Individual workout page
/dashboard/workout/create         # Create workout page
```

## Protected Routes

The `/dashboard` page and all sub-pages are **protected routes**. They must only be accessible to authenticated (logged in) users.

- Any unauthenticated request to `/dashboard` or any path beginning with `/dashboard/` must be redirected to the login page.
- Never rely solely on client-side checks for route protection — always enforce access at the middleware layer.

## Route Protection via Middleware

Route protection must be implemented using **Next.js middleware** (`src/middleware.ts`). Do not use per-page redirects or layout-level auth checks as the primary protection mechanism.

### Middleware File Location

```
src/middleware.ts
```

### Middleware Responsibilities

1. Intercept all requests to `/dashboard` and `/dashboard/*`.
2. Check for a valid authenticated session (e.g., read and verify a session cookie or token).
3. Redirect unauthenticated users to the login page (e.g., `/login` or `/`).
4. Allow authenticated users to proceed to the requested route.

### Matcher Configuration

Use the `config` export with a `matcher` to scope the middleware only to protected paths, keeping public routes unaffected:

```ts
export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Example Middleware Structure

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session"); // adjust to your auth implementation

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

Refer to `/docs/auth.md` for details on how sessions and authentication are managed in this project.

## Summary of Rules

| Rule | Detail |
|------|--------|
| All app routes live under | `/dashboard` |
| `/dashboard` and sub-pages are | Protected (authenticated users only) |
| Protection is enforced via | Next.js middleware (`src/middleware.ts`) |
| Unauthenticated users are redirected to | `/` (or the login page) |
| Per-page auth checks | Not to be used as the primary protection mechanism |
