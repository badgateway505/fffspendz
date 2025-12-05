
# Smart Spends Tracker – Specification

## 1) Goal & Vision
Voice-first spend tracker that lets me quickly add expenses, review recent history, and see light analytics without friction; built mobile-first so it’s always ready on the phone.

## 2) User & Context
- Primary user: single individual tracking personal spending.
- Platform: mobile-first PWA in Chrome; later wrapped for iOS. Desktop web should still work.
- Connectivity: no offline requirements for MVP.
- Locale: English speech for MVP; THB as primary currency initially, with EUR/THB recognition planned.

## 3) Phases & Scope
- MVP:
  - Quick add flow with voice (Web Speech API) and text fallback.
  - Live speech recognition preview card that auto-detects amount, currency (THB for MVP), and group; merchant/note editable.
  - Editable fields on preview (amount, currency, merchant/note, group). Save or cancel draft.
  - Last 5 spends on main screen; full history list ordered latest → oldest.
  - Basic analytics (totals and totals by group for recent window).
  - Settings: main currency (THB default), preset groups (food/fun/bills); applied to parsing/analytics defaults.
  - Responsive, playful UI with pleasant animations; PWA-ready shell.
- Pre-release/Beta:
  - History item edit/delete; improved NLP (EUR/THB, better entity parsing, RU speech).
  - Custom groups/categories; richer analytics (range filters, charts).
  - PWA install polish, iOS wrap, tighter animations/visuals.
- Production 1.0:
  - Cloud sync with backend (e.g., PostgreSQL), auth, sharing/export flows, durability and monitoring.

## 4) Core Flows (MVP)
- Open app → mic button → speak phrase (e.g., “bbq hogfather 1200 baht ribs with Dasha”) → live transcript → preview card shows amount, currency, merchant/note, group guess → user edits if needed → save or cancel.
- Text fallback: type a phrase and parse into draft; same preview/edit/save flow.
- Main screen shows last 5 spends; tap to view details in history.
- History page lists all spends latest-first; prep for future edit/delete.
- Analytics card(s): quick totals and totals by group over recent period (current: last 7-day window in main currency only).
- Settings: set main currency (THB default), review preset groups.

## 5) Tech Stack
- Frontend: React + TypeScript + Vite.
- State: Zustand stores for expenses, categories, settings, draft/voice state.
- Styling: TailwindCSS with custom playful theme; basic motion via Tailwind/Framer-like light usage (no heavy UI kit).
- Storage: local JSON-style persistence via IndexedDB (localForage/Dexie-style wrapper) for MVP; future-ready for PostgreSQL sync.
- Speech: Web Speech API for live recognition (English MVP).
- Parsing: lightweight in-app NLP heuristic to extract amount, currency (THB MVP), merchant/note, group guess.

## 6) Constraints & Non-Goals
- No heavy backend/auth in MVP; local storage only.
- Avoid large NLP/ML dependencies; keep parsing heuristic/simple.
- Keep architecture flat per rules (UI → state → services → domain/util).
- Playful responsive UI with minimal dependencies; no new UI frameworks without approval.

## 7) Repo & Workflow
- Preferred commands: `npm run dev`, `npm run lint` (run lint after each task), tests on request.
- Commit after task completion when lint passes and any requested tests are green.
- PWA-friendly structure; later iOS wrap expected.
