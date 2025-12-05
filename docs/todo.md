# MVP Tasks

1) Project setup ✅
- Scaffold React + TypeScript + Vite with TailwindCSS and Zustand.

2) Storage layer ✅
- Add IndexedDB/localForage-style helper for JSON persistence and hydration.

3) Domain models ✅
- Define expense, category, settings types and parsing result types.

4) Speech recognition ✅
- Implement Web Speech API hook/controller for live transcripts and status.

5) Parsing ✅
- Implement heuristic parser to extract amount, currency (THB), merchant/note, and group guess from free text.

6) Quick add UI ✅
- Build quick add card with voice button and text fallback input; wire to speech/transcript state.

7) Draft preview ✅
- Show editable preview card (amount, currency, merchant/note, group) with save and cancel actions.

8) Save flow ✅
- Persist new expense to storage/state; apply defaults (THB, group presets).

9) Last 5 spends ✅
- Render latest 5 expenses on main screen.

10) History page ✅
- Build history list (latest-first) page and navigation from main screen.

11) Analytics ✅
- Add lightweight analytics summary (totals and totals by group over recent window).

12) Settings page ✅
- Manage main currency (THB default) and preset groups (food/fun/bills).

13) Responsive & motion
- Apply playful responsive styling and subtle animations.

14) PWA shell
- Add PWA manifest/service worker basics for mobile install readiness.

15) QA
- Run `npm run lint`; run tests on request.

# Beta Tasks

- History item edit/delete.
- Improved NLP (EUR/THB, RU speech), smarter entity parsing.
- Custom groups/categories and richer analytics (ranges/charts).
- PWA install polish and iOS wrap.
- Data export/sync (CSV/JSON, PostgreSQL backend), auth if needed.
