// SECTION: props
interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

// SECTION: rendering
export function VoiceInputButton({
  isListening,
  isSupported,
  error,
  onStart,
  onStop,
}: VoiceInputButtonProps) {
  // SECTION: events
  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-500/50 text-ink-200/50 cursor-not-allowed"
        title="Speech recognition not supported"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    );
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition hover:bg-red-500/30"
        title={error}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
        isListening
          ? 'bg-coral text-ink-900 shadow-lg shadow-coral/50 animate-pulse'
          : 'bg-mint text-ink-900 hover:bg-mint/90 hover:scale-105'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}
    </button>
  );
}

