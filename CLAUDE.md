# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Requirement

**Before generating any code, you MUST first check the `/docs` directory for relevant documentation.** If a docs file exists that relates to the feature, component, or area you are working on, read it and follow its guidance. Only proceed to write code after consulting the relevant docs.

- /docs/ui.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **TypeScript**

## Architecture

This is a fresh Next.js App Router project for a lifting diary course application. The `src/app/` directory uses the Next.js App Router conventions:

- `src/app/layout.tsx` — root layout with Geist fonts
- `src/app/page.tsx` — home page (currently the default Create Next App template)
- `src/app/globals.css` — global styles

New routes go in `src/app/` as folders with `page.tsx` files. Shared components should live in `src/components/` (to be created). Server Components are the default; add `"use client"` only when needed for interactivity.
