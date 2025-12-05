# Component Map: Smart Spends Web App (MVP)

> **Note**: This map includes both implemented components and planned components for MVP. Components marked with ✅ are implemented; others are planned.

## App Shell
- src/App.tsx ✅ – Root layout, routes, global providers.
- src/app/routes.tsx – Route definitions (main, history, settings).
- src/components/NavBar/MobileNavBar.tsx – Mobile-first nav.

## Main Screen
- src/features/quick-add/QuickAddCard.tsx ✅ – Entry point combining voice/text input and draft preview. Wires speech recognition and text input, displays transcript.
- src/features/quick-add/VoiceInputButton.tsx ✅ – Mic control, shows listening status. Displays mic icon with visual feedback for listening/error states.
- src/features/quick-add/TextInput.tsx ✅ – Text fallback for spend phrase. Simple text input with disabled state during speech recognition.
- src/features/quick-add/DraftPreviewCard.tsx ✅ – Editable fields: amount, currency, merchant/note, group; save/cancel buttons. Shows parsed expense data with editable form fields.
- src/features/overview/LastSpendsList.tsx – Shows latest 5 spends.
- src/features/analytics/AnalyticsSummary.tsx – Totals and totals-by-group for recent window.

## History Page
- src/features/history/HistoryPage.tsx – Lists all spends latest-first.
- src/features/history/ExpenseItem.tsx – Row/item component (prep for edit/delete later).

## Settings Page
- src/features/settings/SettingsPage.tsx – Main currency, preset groups management.

## State & Controllers
- src/state/expenses.store.ts ✅ – Expenses store (Zustand) with add/list utilities. Persists to IndexedDB, applies defaults (THB currency), converts categoryKey to categoryId.
- src/state/categories.store.ts ✅ – Categories/groups store with defaults (food, fun, bills). Provides lookup utilities.
- src/state/settings.store.ts ✅ – Main currency, preferences. Persists to IndexedDB, defaults to THB.
- src/state/draft.store.ts – (Not needed: draft state managed locally in QuickAddCard component)

## Services
- src/services/storage/localStore.ts ✅ – IndexedDB/localForage-style helper for JSON persistence.
- src/services/speech/useSpeechRecognition.ts ✅ – Web Speech API hook for live transcripts/status. Exports `useSpeechRecognition` hook with start/stop/reset controls and state (status, transcript, error).
- src/services/parsing/parseSpend.ts ✅ – Heuristic parser for amount, currency, merchant/note, group guess. Exports `parseSpend()` function that extracts expense data from free-form text.
- src/services/debug/debugLogger.ts ✅ – Debug logging service. Saves debug entries to IndexedDB and exports debug.json file. Collects user prompts, recognized phrases, parsed parameters, and confidence scores.

## Domain & Utilities
- src/domain/expense.types.ts ✅ – Expense, category, settings, parser result types.
- src/vite-env.d.ts ✅ – Global TypeScript declarations (Web Speech API types, etc.).
- src/utils/formatters.ts – Currency/date/amount formatting helpers.

## Shared UI
- src/components/ui/Button.tsx
- src/components/ui/InputField.tsx
- src/components/ui/Card.tsx
- src/components/ui/Loader.tsx
- src/components/ui/Modal.tsx (if needed for confirmations)
- src/components/ui/Badge.tsx (for groups/status)
- src/components/ui/AnimationWrappers.tsx (light motion wrappers if needed)
- src/components/ui/RecordingBadge.tsx (mic/listening indicator)

## Debug
- src/components/debug/DebugModal.tsx ✅ – Modal for submitting debug feedback. Collects user prompt, displays current recognition state, saves to IndexedDB and exports debug.json.
