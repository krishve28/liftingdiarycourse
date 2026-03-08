# Server Components

## Params and SearchParams MUST Be Awaited

This is a **Next.js 15** project. `params` and `searchParams` are **Promises** and MUST be awaited before accessing their values.

**NEVER** access params synchronously:

```tsx
// ❌ WRONG — params is a Promise, this will not work
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id; // broken
}
```

**ALWAYS** await params first:

```tsx
// ✅ CORRECT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

The same applies to `searchParams`:

```tsx
// ✅ CORRECT
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
}
```

## Type the Props Correctly

Always type `params` and `searchParams` as `Promise<...>` in the component props interface:

```tsx
interface PageProps {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { workoutId } = await params;
  const { tab } = await searchParams;
}
```

## Summary

| Rule | Requirement |
|---|---|
| `params` type | `Promise<{ ... }>` |
| `searchParams` type | `Promise<{ ... }>` |
| Accessing values | Always `await` before destructuring |
