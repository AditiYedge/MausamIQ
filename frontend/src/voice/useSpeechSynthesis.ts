import { useState, useEffect, useRef } from 'react';
import { Language } from '../services/types';

interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isPlaying: boolean;
  speak: (text: string, lang?: Language) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speak = (text: string, lang: Language = 'mr') => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    const localeMap: Record<Language, string> = {
      mr: 'mr-IN',
      hi: 'hi-IN',
      en: 'en-IN'
    };
    utterance.lang = localeMap[lang] || 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clarity in agricultural advisories
    utterance.pitch = 1.0;

    // Attempt to locate a matching natural voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(localeMap[lang]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return {
    isSupported,
    isPlaying,
    speak,
    stop
  };
}
