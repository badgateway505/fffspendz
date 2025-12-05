# Component Map: Smart Spends Web App (MVP)

## App Shell
- src/app/App.tsx – Root layout, routes, global providers.
- src/app/routes.tsx – Route definitions (main, history, settings).
- src/components/NavBar/MobileNavBar.tsx – Mobile-first nav.

## Main Screen
- src/features/quick-add/QuickAddCard.tsx – Entry point combining voice/text input and draft preview.
- src/features/quick-add/VoiceInputButton.tsx – Mic control, shows listening status.
- src/features/quick-add/TextInput.tsx – Text fallback for spend phrase.
- src/features/quick-add/DraftPreviewCard.tsx – Editable fields: amount, currency, merchant/note, group; save/cancel buttons.
- src/features/overview/LastSpendsList.tsx – Shows latest 5 spends.
- src/features/analytics/AnalyticsSummary.tsx – Totals and totals-by-group for recent window.

## History Page
- src/features/history/HistoryPage.tsx – Lists all spends latest-first.
- src/features/history/ExpenseItem.tsx – Row/item component (prep for edit/delete later).

## Settings Page
- src/features/settings/SettingsPage.tsx – Main currency, preset groups management.

## State & Controllers
- src/state/expenses.store.ts – Expenses store (Zustand) with add/list utilities.
- src/state/categories.store.ts – Categories/groups store with defaults.
- src/state/settings.store.ts – Main currency, preferences.
- src/state/draft.store.ts – Current draft from speech/text, edit/save/cancel actions.

## Services
- src/services/storage/localStore.ts – IndexedDB/localForage-style helper for JSON persistence.
- src/services/speech/useSpeechRecognition.ts – Web Speech API hook for live transcripts/status.
- src/services/parsing/parseSpend.ts – Heuristic parser for amount, currency, merchant/note, group guess.

## Domain & Utilities
- src/domain/expense.types.ts – Expense, category, settings, parser result types.
- src/utils/formatters.ts – Currency/date/amount formatting helpers.

## Shared UI
- src/components/ui/Button.tsx
- src/components/ui/InputField.tsx
- src/components/ui/Card.tsx
- src/components/ui/Loader.tsx
- src/components/ui/Modal.tsx (if needed for confirmations)
- src/components/ui/Badge.tsx (for groups/status)
- src/components/ui/AnimationWrappers.tsx (light motion wrappers if needed)
