
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { CheckCircle2, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface SuccessViewProps {
  onFinish: () => void;
  language: Language;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onFinish, language }) => {
  const t = TRANSLATIONS[language].success;
  const common = TRANSLATIONS[language].common;
  
  const [stage, setStage] = useState<'analyzing' | 'revealing' | 'final'>('analyzing');
  const [analysisText, setAnalysisText] = useState(t.synthesis[0]);

  useEffect(() => {
    let textIdx = 1;
    const interval = setInterval(() => {
      if (textIdx < t.synthesis.length) {
        setAnalysisText(t.synthesis[textIdx]);
        textIdx++;
      }
    }, 800);

    const timer = setTimeout(() => {
      setStage('revealing');
      setTimeout(() => setStage('final'), 800);
    }, 3500);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [t.synthesis]);

  if (stage === 'analyzing' || stage === 'revealing') {
    return (
      <div className={`h-screen flex flex-col items-center justify-center bg-neutral-950 transition-opacity duration-1000 ${stage === 'revealing' ? 'opacity-0 scale-105' : 'opacity-100'}`}>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6 px-6 py-2 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-full">
            <span className="text-[10px] font-black tracking-[0.4em] text-neutral-600 uppercase">{common.poweredBy}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
              <span className="text-sm font-black tracking-[0.2em] text-white">ORBION</span>
            </div>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 animate-pulse">{analysisText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 animate-in fade-in duration-1000">
      <div className="max-w-xl w-full text-center">
        <div className="mb-10 flex justify-center"><CheckCircle2 className="text-emerald-500" size={80} /></div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">{t.title}</h1>
        <p className="text-neutral-500 text-lg mb-12 leading-relaxed">{t.description}</p>
        <div className="space-y-4 mb-12">
          <div className="flex gap-5 p-6 bg-neutral-900/30 border border-white/5 rounded-3xl text-left">
            <Calendar className="text-indigo-400 shrink-0" size={24} />
            <div><h4 className="font-bold text-neutral-200">{t.timelineTitle}</h4><p className="text-sm text-neutral-500">{t.timelineDesc}</p></div>
          </div>
          <div className="flex gap-5 p-6 bg-neutral-900/30 border border-white/5 rounded-3xl text-left">
            <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
            <div><h4 className="font-bold text-neutral-200">{t.storageTitle}</h4><p className="text-sm text-neutral-500">{t.storageDesc}</p></div>
          </div>
        </div>
        <button onClick={onFinish} className="px-10 py-5 bg-white text-neutral-950 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 mx-auto">{t.button}<ArrowRight size={18} /></button>
      </div>
    </div>
  );
};

export default SuccessView;
