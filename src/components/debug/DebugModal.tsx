import { useState } from 'react';
import type { ParsedSpend } from '../../domain/expense.types';
import { saveDebugEntry } from '../../services/debug/debugLogger';

// SECTION: props
interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  recognizedPhrase: string;
  parsed: ParsedSpend | null;
}

// SECTION: rendering
export function DebugModal({ isOpen, onClose, recognizedPhrase, parsed }: DebugModalProps) {
  // SECTION: state
  const [userPrompt, setUserPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // SECTION: events
  const handleSend = async () => {
    if (!userPrompt.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        userPrompt: userPrompt.trim(),
        recognizedPhrase: recognizedPhrase || '',
        parsedAmount: parsed?.amount,
        parsedCurrency: parsed?.currency,
        parsedMerchant: parsed?.merchant,
        parsedNote: parsed?.note,
        parsedCategory: parsed?.groupGuess,
        confidence: parsed?.confidence,
      };

      await saveDebugEntry(entry);
      
      // Reset and close
      setUserPrompt('');
      onClose();
    } catch (error) {
      console.error('Failed to save debug entry:', error);
      alert('Failed to save debug entry. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUserPrompt('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-ink-700 p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="font-display text-xl font-semibold text-white">Debug Entry</h3>
          <p className="text-sm text-ink-400">Help improve recognition by submitting feedback</p>
        </div>

        <div className="space-y-4">
          {/* User Prompt Input */}
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-300">
              What did you try to say/type?
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter the phrase you intended..."
              className="w-full rounded-lg border border-white/10 bg-ink-800/50 px-3 py-2 text-ink-200 placeholder:text-ink-500 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20 resize-none"
              rows={3}
              autoFocus
            />
          </div>

          {/* Current State Display */}
          <div className="rounded-lg border border-white/10 bg-ink-900/40 p-3">
            <p className="mb-2 text-xs font-medium text-ink-400">Current Recognition:</p>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-ink-500">Recognized:</span>{' '}
                <span className="text-ink-200">{recognizedPhrase || '(none)'}</span>
              </div>
              {parsed && (
                <>
                  {parsed.amount && (
                    <div>
                      <span className="text-ink-500">Amount:</span>{' '}
                      <span className="text-ink-200">{parsed.amount}</span>
                    </div>
                  )}
                  {parsed.currency && (
                    <div>
                      <span className="text-ink-500">Currency:</span>{' '}
                      <span className="text-ink-200">{parsed.currency}</span>
                    </div>
                  )}
                  {parsed.merchant && (
                    <div>
                      <span className="text-ink-500">Merchant:</span>{' '}
                      <span className="text-ink-200">{parsed.merchant}</span>
                    </div>
                  )}
                  {parsed.note && (
                    <div>
                      <span className="text-ink-500">Note:</span>{' '}
                      <span className="text-ink-200">{parsed.note}</span>
                    </div>
                  )}
                  {parsed.groupGuess && (
                    <div>
                      <span className="text-ink-500">Category:</span>{' '}
                      <span className="text-ink-200">{parsed.groupGuess}</span>
                    </div>
                  )}
                  {parsed.confidence !== undefined && (
                    <div>
                      <span className="text-ink-500">Confidence:</span>{' '}
                      <span className="text-ink-200">{Math.round(parsed.confidence * 100)}%</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-white/20 bg-ink-700/50 px-4 py-2 text-sm font-medium text-ink-200 transition hover:bg-ink-700/70 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!userPrompt.trim() || isSaving}
              className="flex-1 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-mint/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

