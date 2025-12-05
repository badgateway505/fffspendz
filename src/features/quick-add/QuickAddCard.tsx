import { useState, useEffect, useMemo } from 'react';
import { useSpeechRecognition } from '../../services/speech/useSpeechRecognition';
import { parseSpend } from '../../services/parsing/parseSpend';
import { VoiceInputButton } from './VoiceInputButton';
import { TextInput } from './TextInput';
import { DraftPreviewCard } from './DraftPreviewCard';
import { DebugModal } from '../../components/debug/DebugModal';
import { useExpenses } from '../../state/expenses.store';
import { useCategoriesStore } from '../../state/categories.store';
import type { ParsedSpend, Currency, CategoryKey } from '../../domain/expense.types';
import RecordingBadge from '../../components/ui/RecordingBadge';

// SECTION: rendering
export function QuickAddCard() {
  // SECTION: state
  const [textInput, setTextInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  const {
    state: speechState,
    start: startSpeech,
    stop: stopSpeech,
    reset: resetSpeech,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition({
    onTranscript: (finalTranscript) => {
      setTranscript(finalTranscript);
      setTextInput(finalTranscript);
    },
  });

  // SECTION: effects
  // Sync transcript to text input when speech recognition updates
  useEffect(() => {
    const fullTranscript = speechState.transcript + speechState.interimTranscript;
    if (fullTranscript) {
      setTextInput(fullTranscript);
      setTranscript(fullTranscript);
    }
  }, [speechState.transcript, speechState.interimTranscript]);

  // SECTION: events
  const handleTextChange = (value: string) => {
    setTextInput(value);
    setTranscript(value);
    // Stop speech if user starts typing
    if (speechState.status === 'listening') {
      stopSpeech();
    }
  };

  const handleStartSpeech = () => {
    console.info('[quick-add] mic start requested');
    resetSpeech();
    setTextInput('');
    setTranscript('');
    startSpeech();
  };

  const handleStopSpeech = () => {
    console.info('[quick-add] mic stop requested');
    stopSpeech();
  };

  const displayText = textInput || transcript;
  const isListening = speechState.status === 'listening';

  // Parse the input text when it changes (only when not actively listening)
  const parsed: ParsedSpend | null = useMemo(() => {
    if (!displayText || isListening) {
      return null;
    }
    const result = parseSpend(displayText);
    // Only show preview if we have at least an amount or merchant
    if (result.amount || result.merchant) {
      return result;
    }
    return null;
  }, [displayText, isListening]);

  // SECTION: state (stores)
  const { addExpense } = useExpenses();
  const getCategoryByKey = useCategoriesStore((state) => state.getCategoryByKey);

  // SECTION: events (save/cancel handlers)
  const handleSave = async (data: {
    amount: number;
    currency: Currency;
    merchant: string;
    note?: string;
    categoryKey?: CategoryKey | string;
  }) => {
    // Convert categoryKey to categoryId
    let categoryId: string | undefined;
    if (data.categoryKey) {
      const category = getCategoryByKey(data.categoryKey);
      categoryId = category?.id;
    }

    // Create expense input
    const expenseInput = {
      amount: data.amount,
      currency: data.currency,
      merchant: data.merchant,
      note: data.note,
      categoryId,
    };

    // Save to store (which persists to storage)
    await addExpense(expenseInput);

    // Clear input after save
    setTextInput('');
    setTranscript('');
    resetSpeech();
  };

  const handleCancel = () => {
    setTextInput('');
    setTranscript('');
    resetSpeech();
  };

  return (
    <>
      <div className="rounded-2xl bg-ink-700/80 p-6 shadow-xl shadow-ink-900/40 backdrop-blur">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Quick add</h2>
            <p className="text-ink-200/80">
              Voice and text input with live parsing into amount, currency, merchant, and group.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RecordingBadge active={isListening} label={isListening ? 'Recording' : 'Mic off'} />
            <button
              type="button"
              onClick={() => setIsDebugModalOpen(true)}
              className="rounded-lg border border-white/20 bg-ink-800/50 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:bg-ink-800/70"
              title="Submit debug feedback"
            >
              Debug
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Input section */}
          <div className="flex gap-3">
            <div className="flex-1">
              <TextInput
                value={textInput}
                onChange={handleTextChange}
                placeholder="Tap mic or type your expense..."
                disabled={isListening}
              />
            </div>
            <VoiceInputButton
              isListening={isListening}
              isSupported={isSpeechSupported}
              error={speechState.error}
              onStart={handleStartSpeech}
              onStop={handleStopSpeech}
            />
          </div>

          {/* Transcript/Status display */}
          {displayText && (
            <div className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-mint">
                  {isListening ? 'Listening...' : 'Transcript'}
                </p>
              </div>
              <p className="whitespace-pre-wrap break-words text-ink-200">
                {displayText}
                {isListening && speechState.interimTranscript && (
                  <span className="italic text-ink-500">{speechState.interimTranscript}</span>
                )}
              </p>
            </div>
          )}

          {/* Error display */}
          {speechState.error && speechState.status === 'error' && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">{speechState.error}</p>
            </div>
          )}

          {/* Draft Preview */}
          {parsed && !isListening && (
            <DraftPreviewCard parsed={parsed} onSave={handleSave} onCancel={handleCancel} />
          )}

          {/* Help text when empty */}
          {!displayText && !isListening && !parsed && (
            <div className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
              <p className="text-sm text-ink-400">
                <span className="font-semibold text-sunshine">Tip:</span>{' '}
                Tap the mic and say "bbq hogfather 1200 baht ribs with Dasha" or type your expense.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Modal */}
      <DebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        recognizedPhrase={displayText}
        parsed={parsed}
      />
    </>
  );
}
