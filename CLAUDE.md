# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run mock      # Start JSON Server mock API on port 3001
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

During development, run both `npm run dev` and `npm run mock` concurrently — the app consumes the mock REST API provided by JSON Server.

## Architecture

**Stack:** React 19 + TypeScript + Vite, Redux Toolkit, Tailwind CSS 4, React Hook Form + Zod, TanStack Table, JSON Server (mock backend).

**Directory layout:**
- `src/features/` — Feature modules (e.g., employees, departments). Each feature should contain its own components, slices, and hooks.
- `src/shared/components/` — Reusable UI components shared across features.
- `src/store/store.ts` — Redux store. Add feature slices here.
- `db.json` — Mock database for JSON Server. Contains `employees` and `departments` collections.

**Data model (from `db.json`):**
- `employees`: `{ id, firstName, lastName, email, position, department, startDate, status }`
- `departments`: `{ id, name }`

**Form validation pattern:** React Hook Form + Zod schemas via `@hookform/resolvers/zod`.

**Table pattern:** TanStack React Table (headless) for the employee listing.

**Redux:** Store is configured but has no slices yet. Feature slices should be added to `src/features/<feature>/` and registered in `src/store/store.ts`.

## apsys Architecture Rules

- All features go inside `src/features/<feature-name>/`
- Each feature must have the following structure:
  - `data/` — RTK Query API slice
  - `domain/` — TypeScript interfaces and types
  - `presentation/` — React components and pages
- Never mix feature concerns — keep each feature self-contained
- Use RTK Query for ALL server state (no useEffect + fetch)
- Use React Hook Form + Zod for ALL forms
- Shared components go in `src/shared/components/`

## Mock API

- JSON Server running on `http://localhost:3001`
- Endpoints: `/employees`, `/departments`
- Use this base URL in all RTK Query API slices during development

## Code Style

Use comments sparingly. Only comment complex or non-obvious logic.

## RTK Query

Always add explicit TypeScript types for both the response and argument in every endpoint: `builder.query<ResponseType, ArgType>` and `builder.mutation<ResponseType, ArgType>`. Never rely on inferred `unknown`.
