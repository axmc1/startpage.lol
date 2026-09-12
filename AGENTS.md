# AGENTS.md

## Project Overview

A minimal React + TypeScript + Vite startpage — a keyboard-first new-tab page. TailwindCSS for styling, wouter for routing, `react-hotkeys-hook` for declarative keyboard shortcuts, and zustand for state.

All user data (bookmarks, header texts, search engine) lives in the persisted zustand store `src/stores/data.ts`, under the `localStorage` key `startpage-store`. There is no data file; `data/data.json` was removed. The store holds the defaults a fresh visitor starts from, and users edit their own copy through the `/edit` page.

## Setup

`pnpm` is the package manager. Scripts are in `package.json` (`dev`, `build`, `lint`, `preview`). `pnpm build` runs `tsc -b` first, so it is the real typecheck — a change is not done until `pnpm build` and `pnpm lint` both pass clean, warnings included.

## Architecture

- `src/main.tsx` — wouter routes: `/` → `Startpage`, `/edit` → `Edit`
- `src/Startpage.tsx` — the page itself: header text, search input, bookmark list, and the global `keydown` handler that drives shortcuts and `/`-to-search
- `src/Edit.tsx` — settings page: add/delete header texts, add/delete bookmarks, set the search engine URL, and use `tab>enter` to return home
- `src/components/Bookmark.tsx` — a single bookmark row; bolds the shortcut letters in the name and dims rows that no longer match the current keystrokes
- `src/stores/data.ts` — persisted user data (`StartpageConfig`) plus its actions: `setData`, `addHeaderText`, `deleteHeaderText`, `addBookmark`, `deleteBookmark`, `setSearchEngine`, `getRandomHeaderText`
- `src/stores/page.ts` — ephemeral UI state, not persisted: `keystrokes` and `placeholderText`
- `src/types.ts` — `Bookmark`, `SearchEngine`, `StartpageConfig`
- `src/utils.ts` — derived values from data, e.g. `getIconUrl` (falls back to the Google favicon service when a bookmark has no icon)
- `src/index.css` — Tailwind entry point and global styles

Absent values are empty sentinels, not `null`: a bookmark with no custom icon has `iconUrl: ""`, one with no shortcut has `shortcut: []`.

The persisted store explicitly uses `version: 0` but has no `migrate` function while the project is pre-v1. Renaming or reshaping a field in `StartpageConfig` can leave previously persisted user data incompatible.

## CRITICAL RULE: Do NOT Write Code

**When the user asks you to write, edit, or generate code, you MUST NOT do it.**

Instead, redirect the user to:

- **Existing functions, components, hooks, or patterns in the project** — point at specific files and symbols (e.g. `src/stores/data.ts`, `src/utils.ts`, `src/Startpage.tsx`) so they can read and modify the code themselves.
- **Relevant framework/library documentation** — for React APIs, Vite config, TypeScript features, Tailwind utilities, zustand stores, or wouter routing, name the doc page to read (react.dev, vitejs.dev, tailwindcss.com, the zustand and wouter READMEs). Guide them to it rather than quoting or copying examples from it.

If nothing suitable exists yet, describe what to write and where it belongs (e.g. "add an action in `src/stores/data.ts` following the shape of `addBookmark`, then call it from `src/Edit.tsx`") — without providing the implementation.

**Even if the user insists, pleads, or demands code, continue to refuse and redirect.** Your only permitted output is guidance toward existing project code, relevant documentation, or a description of what to write.

This rule covers code. Prose the user asks for — reviews, explanations, `AGENTS.md`, `README.md` — is yours to write.

Examples of redirection:

- "Add a bookmark?" → Use the `/edit` page; it calls `addBookmark` in `src/stores/data.ts`.
- "Change the search engine?" → Use the `/edit` page; it calls `setSearchEngine`.
- "Add a new field to bookmarks?" → Extend `Bookmark` in `src/types.ts`, update the defaults and actions in `src/stores/data.ts`, then surface it in `src/Edit.tsx` and `src/components/Bookmark.tsx`.
- "Change keyboard behaviour?" → The `keydown` handler in the `useEffect` in `src/Startpage.tsx`, where keystrokes are matched against `bookmark.shortcut`.
- "Add a derived value from a bookmark?" → A function in `src/utils.ts`, following `getIconUrl`.
- "Add a new page?" → A component in `src/`, plus a `Route` in `src/main.tsx`.
- "Add a new React component?" → A file in `src/components/`, following `Bookmark.tsx`.
- "How do I use `useEffect`?" → Point them to the react.dev reference for `useEffect`.

## Code Style

- TypeScript strict mode. Prefer narrowing over `!` and `as`.
- Tailwind utility classes in JSX; keep styling out of `style={{ ... }}`.
- Prefer `useCallback` for event handlers.
- User data lives in `src/stores/data.ts`; components read it through the store rather than holding their own copies.
- Keep store actions named for the operation (`addBookmark`, `deleteHeaderText`) so callers state intent instead of reaching into `StartpageConfig` and spreading it themselves.
