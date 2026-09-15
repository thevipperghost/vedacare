import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Check } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useStore } from '../store/useStore.js';

const SYMPTOM_KW = {
  pain: ['pain','ache','hurts','sore','throbbing'],
  digestive: ['stomach','nausea','vomit','bloating','gas','acidity','constipation'],
  respiratory: ['cough','breath','cold','congestion'],
  neurological: ['headache','migraine','dizziness','numbness'],
  musculoskeletal: ['joint','back','neck','stiff','swelling'],
  skin: ['rash','itch','dry skin'],
  general: ['fatigue','tired','weak','fever','sweat'],
};

function extract(text) {
  const lower = text.toLowerCase();
  const found = [];
  Object.values(SYMPTOM_KW).flat().forEach(kw => {
    if (lower.includes(kw)) found.push(kw);
  });
  lower.split(/[.,;!?]+/).forEach(p => {
    const t = p.trim();
    if (t.length > 3 && !found.includes(t)) found.push(t);
  });
  return found;
}

export default function VoiceAssistant() {
  const { t } = useLang();
  const { voiceTranscript, setVoiceTranscript, extractedSymptoms, setExtractedSymptoms, applySymptoms } = useStore();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState('');
  const recog = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = 'en-IN';
    r.onresult = (e) => {
      let txt = '';
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setVoiceTranscript(txt);
      if (e.results[e.resultIndex].isFinal) setExtractedSymptoms(extract(txt));
    };
    r.onerror = (e) => { setError(e.error === 'no-speech' ? t('voice.noSpeech') : e.error); setListening(false); };
    r.onend = () => setListening(false);
    recog.current = r;
  }, []);

  const start = () => { setError(''); setListening(true); setVoiceTranscript(''); setExtractedSymptoms([]); try { recog.current?.start(); } catch {} };
  const stop = () => { try { recog.current?.stop(); } catch {} setListening(false); };

  if (!supported) return null;

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-110 duration-300 ${
          open
            ? 'bg-white/50 backdrop-blur-xl text-emerald-700 shadow-xl'
            : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40'
        }`}>
        {open ? <X size={24} /> : <Mic size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl bg-white/60 backdrop-blur-2xl shadow-2xl animate-slide-up">
          <div className="px-4 py-3">
            <h3 className="font-bold text-emerald-900 text-sm">{t('voice.title')}</h3>
            <p className="text-xs text-emerald-700/60">{t('voice.subtitle')}</p>
          </div>
          <div className="p-4">
            {error && <div className="mb-3 rounded-xl bg-red-50/60 p-3 text-xs text-red-600">{error}</div>}

            {voiceTranscript && (
              <div className="mb-3 rounded-xl bg-emerald-50/60 p-3">
                <p className="text-xs font-semibold text-emerald-600">{t('voice.heard')}</p>
                <p className="mt-1 text-sm text-emerald-900">{voiceTranscript}</p>
              </div>
            )}

            {extractedSymptoms.length > 0 && (
              <div className="mb-3">
                <p className="mb-1.5 text-xs font-semibold text-emerald-700/60">Detected:</p>
                <div className="flex flex-wrap gap-1.5">
                  {extractedSymptoms.map((s, i) => (
                    <span key={i} className="badge bg-emerald-100/60 text-emerald-700">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {listening && (
              <div className="mb-3 flex items-center gap-2 text-emerald-600">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                <span className="text-sm font-medium">{t('voice.listening')}</span>
              </div>
            )}

            <div className="flex gap-2">
              {!listening ? (
                <button className="btn-primary flex-1" onClick={start}><Mic size={16} /> Start</button>
              ) : (
                <button className="btn-danger flex-1" onClick={stop}><MicOff size={16} /> {t('voice.stop')}</button>
              )}
              {extractedSymptoms.length > 0 && (
                <button className="btn-primary" onClick={applySymptoms}><Check size={16} /> {t('voice.autoFill')}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
