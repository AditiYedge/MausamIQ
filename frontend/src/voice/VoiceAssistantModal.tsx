import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Square, X, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { parseVoiceIntent } from '../services/api';
import { VoiceIntentResponse } from '../services/types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (intentResult: VoiceIntentResponse) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const { language, t } = useLanguage();
  const { isSupported, isListening, transcript, setTranscript, startListening, stopListening, error } = useSpeechRecognition(language);
  const { speak, stop: stopSpeech, isPlaying } = useSpeechSynthesis();
  const [isProcessing, setIsProcessing] = useState(false);
  const [intentResult, setIntentResult] = useState<VoiceIntentResponse | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const result = await parseVoiceIntent(transcript, language);
      setIntentResult(result);
      if (result.clarification) {
        speak(result.clarification, language);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActionExecute = () => {
    if (intentResult && onSelectAction) {
      onSelectAction(intentResult);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-brand-dark)' }}>
              {t('btn_voice_assistant')}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          {t('voice_hint')}
        </p>

        {/* Microphone Button Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          {isSupported ? (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`btn ${isListening ? 'btn-voice listening' : 'btn-primary'}`}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}
            >
              {isListening ? <MicOff size={30} /> : <Mic size={30} />}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B7791F', fontSize: '13px', background: '#FEF3C7', padding: '10px 14px', borderRadius: '6px' }}>
              <AlertCircle size={18} />
              <span>{t('toast_mic_denied')}</span>
            </div>
          )}

          <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: 600, color: isListening ? '#C53030' : 'var(--color-text-muted)' }}>
            {isListening ? t('voice_listening') : (isSupported ? 'Click microphone to speak' : 'Text query mode')}
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* Editable Transcript Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Transcribed / Typed Query:</span>
              <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '12px' }}>Editable</span>
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={t('voice_transcript_placeholder')}
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setTranscript('');
                setIntentResult(null);
              }}
              style={{ fontSize: '13px' }}
            >
              {t('btn_reset')}
            </button>
            <button
              type="submit"
              disabled={isProcessing || !transcript.trim()}
              className="btn btn-primary"
              style={{ fontSize: '14px' }}
            >
              {isProcessing ? 'Analyzing Query...' : t('btn_submit')}
            </button>
          </div>
        </form>

        {/* Intent Routing Result Box */}
        {intentResult && (
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-brand-primary)', textTransform: 'uppercase' }}>
                <Sparkles size={14} />
                <span>Intent: {intentResult.intent.replace('_', ' ')}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Confidence: {Math.round(intentResult.confidence * 100)}%</span>
            </div>

            <div style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-text-main)' }}>
              {intentResult.clarification ? (
                <div style={{ color: '#B7791F' }}>{intentResult.clarification}</div>
              ) : (
                <div>
                  <strong>Target Parameters:</strong> District: <em>{intentResult.entities.district_id || 'Any'}</em> | Crop: <em>{intentResult.entities.crop_id || 'Any'}</em> | Season: <em>{intentResult.entities.season}</em>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleActionExecute}
                style={{ flex: '1 1 180px', padding: '8px 12px', fontSize: '13px' }}
              >
                <span>Execute In Assessment View</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => isPlaying ? stopSpeech() : speak(intentResult.clarification || `Evaluating ${intentResult.entities.crop_id || 'crop'} risk in ${intentResult.entities.district_id || 'district'}`, language)}
                style={{ flex: '0 1 auto', padding: '8px 12px', fontSize: '13px' }}
              >
                {isPlaying ? <Square size={14} /> : <Volume2 size={14} />}
                <span>{isPlaying ? 'Stop' : 'Read'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
