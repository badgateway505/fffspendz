import { useEffect, useRef, useState, useCallback } from 'react';

// TYPES:
export type SpeechRecognitionStatus = 'idle' | 'listening' | 'error' | 'unavailable';

export interface SpeechRecognitionState {
  status: SpeechRecognitionStatus;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string) => void;
}

export interface UseSpeechRecognitionReturn {
  state: SpeechRecognitionState;
  start: () => void;
  stop: () => void;
  reset: () => void;
  isSupported: boolean;
}

// HELPERS:
function getSpeechRecognition(): typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  return (
    window.SpeechRecognition ||
    (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition ||
    null
  );
}

// API:
/**
 * React hook for Web Speech API speech recognition.
 * Provides live transcripts, status, and control functions.
 *
 * @param options - Configuration options for speech recognition
 * @returns Speech recognition state and control functions
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
    onTranscript,
  } = options;

  const [state, setState] = useState<SpeechRecognitionState>({
    status: 'idle',
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const isSupportedRef = useRef<boolean>(false);

  // Check support on mount
  useEffect(() => {
    const Recognition = getSpeechRecognition();
    isSupportedRef.current = Recognition !== null;
    if (!isSupportedRef.current) {
      setState((prev) => ({
        ...prev,
        status: 'unavailable',
        error: 'Speech recognition is not supported in this browser.',
      }));
    }
  }, []);

  // Initialize recognition instance
  useEffect(() => {
    const Recognition = getSpeechRecognition();
    if (!Recognition || !isSupportedRef.current) return;

    const recognition = new Recognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setState((prev) => ({
        ...prev,
        status: 'listening',
        error: null,
      }));
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setState((prev) => {
        const newTranscript = prev.transcript + final;
        const newState = {
          ...prev,
          transcript: newTranscript,
          interimTranscript: interim,
        };
        // Call optional callback with final transcript when available
        if (final.trim() && onTranscript) {
          onTranscript(newTranscript.trim());
        }
        return newState;
      });
    };

    recognition.onerror = (event) => {
      let errorMessage = 'Speech recognition error occurred.';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not available.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error during recognition.';
      } else if (event.error === 'aborted') {
        // User or system aborted, not necessarily an error
        return;
      }

      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
    };

    recognition.onend = () => {
      setState((prev) => {
        // Only change status if we're still in listening state (not manually stopped)
        if (prev.status === 'listening') {
          return {
            ...prev,
            status: 'idle',
          };
        }
        return prev;
      });
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore errors during cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, [language, continuous, interimResults, onTranscript]);

  const start = useCallback(() => {
    if (!isSupportedRef.current || !recognitionRef.current) {
      setState((prev) => ({
        ...prev,
        status: 'unavailable',
        error: 'Speech recognition is not available.',
      }));
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      // Recognition might already be running
      if (error instanceof Error && error.name === 'InvalidStateError') {
        // Already started, ignore
        return;
      }
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Failed to start speech recognition.',
      }));
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setState((prev) => ({
          ...prev,
          status: 'idle',
        }));
      } catch {
        // Ignore errors when stopping
      }
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setState({
      status: 'idle',
      transcript: '',
      interimTranscript: '',
      error: null,
    });
  }, [stop]);

  return {
    state,
    start,
    stop,
    reset,
    isSupported: isSupportedRef.current,
  };
}

