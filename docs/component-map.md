# Component Map: SmartSpends Web App (MVP)

## App Shell
- AppRoot (routing/layout)
- MobileNavBar

## Main Screen
- QuickAddCard
  - VoiceInputButton
  - TextInput
  - DraftPreviewCard (editable fields: amount, currency, merchant, group)
  - SaveButton
  - CancelButton
- LastSpendsList (shows last 5 spends)

## History Page
- ExpenseHistoryList (all spends)
- ExpenseItem (edit/delete)

## Settings Page
- SettingsForm (currency, group presets)

## State & Storage
- useExpensesStore (Zustand)
- useCategoriesStore
- useSettingsStore
- storage/ (localForage helpers)

## Speech
- useSpeechRecognition hook (Web Speech API)

## Shared
- Modal
- Button
- InputField
- Card
- Loader