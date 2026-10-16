import { useState, useEffect, useRef } from 'react';
import { Language } from '../services/types';

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  setTranscript: (text: string) => void;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(language: Language): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      rec.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied.');
        } else if (event.error === 'no-speech') {
          setError('No speech was detected. Please try again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Update speech recognition language locale hint whenever language changes
  useEffect(() => {
    if (recognitionRef.current) {
      const localeMap: Record<Language, string> = {
        mr: 'mr-IN',
        hi: 'hi-IN',
        en: 'en-IN'
      };
      recognitionRef.current.lang = localeMap[language] || 'en-IN';
    }
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started, stop and start cleanly
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (err: any) {
          setError('Could not start speech recognition.');
        }
      }, 100);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
    setError(null);
  };

  return {
    isSupported,
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}
