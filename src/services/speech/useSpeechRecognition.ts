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
  } = options;

  const [state, setState] = useState<SpeechRecognitionState>({
    status: 'idle',
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const isSupportedRef = useRef<boolean>(false);
  const [isSupported, setIsSupported] = useState(false);
  const statusRef = useRef<SpeechRecognitionStatus>('idle');
  const hasInstanceRef = useRef(false);
  const onTranscriptRef = useRef<UseSpeechRecognitionOptions['onTranscript']>(options.onTranscript);

  useEffect(() => {
    onTranscriptRef.current = options.onTranscript;
  }, [options.onTranscript]);

  // Check support on mount
  useEffect(() => {
    const Recognition = getSpeechRecognition();
    isSupportedRef.current = Recognition !== null;
    setIsSupported(isSupportedRef.current);
    if (!isSupportedRef.current) {
      console.warn('[speech] Speech recognition not supported in this browser');
      setState((prev) => ({
        ...prev,
        status: 'unavailable',
        error: 'Speech recognition is not supported in this browser.',
      }));
    }
  }, []);

  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);

  // Initialize recognition instance
  useEffect(() => {
    const Recognition = getSpeechRecognition();
    if (!Recognition || !isSupportedRef.current) {
      console.warn('[speech] Recognition not initialized: supported?', isSupportedRef.current, 'ctor?', !!Recognition);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    hasInstanceRef.current = true;
    console.info('[speech] recognition instance created', { language, continuous, interimResults });

    recognition.onstart = () => {
      console.info('[speech] recognition started');
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

      if (final || interim) {
        console.debug('[speech] onresult', { final, interim });
      }

      setState((prev) => {
        const newTranscript = prev.transcript + final;
        const newState = {
          ...prev,
          transcript: newTranscript,
          interimTranscript: interim,
        };
        // Call optional callback with final transcript when available
        if (final.trim() && onTranscriptRef.current) {
          onTranscriptRef.current(newTranscript.trim());
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
        console.info('[speech] recognition aborted');
        return;
      }

      console.error('[speech] onerror', event.error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
    };

    recognition.onend = () => {
      console.info('[speech] recognition ended (last status)', statusRef.current);
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
  }, [language, continuous, interimResults]);

  const start = useCallback(() => {
    if (!isSupportedRef.current || !recognitionRef.current) {
      console.warn('[speech] start blocked; supported?', isSupportedRef.current, 'instance?', !!recognitionRef.current);
      setState((prev) => ({
        ...prev,
        status: 'unavailable',
        error: 'Speech recognition is not available.',
      }));
      return;
    }

    try {
      console.info('[speech] start called');
      recognitionRef.current.start();
    } catch (error) {
      // Recognition might already be running
      if (error instanceof Error && error.name === 'InvalidStateError') {
        // Already started, ignore
        console.warn('[speech] start ignored: already started');
        return;
      }
      console.error('[speech] start failed', error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Failed to start speech recognition.',
      }));
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current && statusRef.current === 'listening') {
      try {
        console.info('[speech] stop called');
        recognitionRef.current.stop();
        setState((prev) => ({
          ...prev,
          status: 'idle',
        }));
      } catch {
        // Ignore errors when stopping
      }
    } else {
      console.warn('[speech] stop ignored; status', statusRef.current, 'instance?', !!recognitionRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    console.info('[speech] reset called');
    if (statusRef.current === 'listening') {
      stop();
    }
    if (!hasInstanceRef.current) {
      console.warn('[speech] reset with no instance available');
    }
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
    isSupported,
  };
}
