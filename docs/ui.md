# UI Coding Standards

## Component Library

**ONLY shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, dialogs, cards, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- All UI primitives must come from shadcn/ui
- Install new shadcn/ui components via `npx shadcn@latest add <component>`

## Date Formatting

All dates must be formatted using **date-fns**. The standard date format for display is:

```
do MMM yyyy
```

Examples:
- `1st Sep 2025`
- `2nd Aug 2025`
- `3rd Jan 2026`
- `4th Jun 2024`

Usage:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
```
