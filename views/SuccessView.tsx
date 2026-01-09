
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('revealing');
      setTimeout(() => setStage('final'), 600);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Shared Logo Component
  const OrbionLogo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 px-6 py-2.5 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl inline-flex ${className}`}>
      <span className="text-[10px] font-black tracking-[0.4em] text-neutral-600 uppercase">{common.poweredBy}</span>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-orb-slow"></div>
        <span className="text-xs font-black tracking-[0.2em] text-white">ORBION</span>
      </div>
    </div>
  );

  if (stage === 'analyzing' || stage === 'revealing') {
    return (
      <div className={`h-screen flex flex-col items-center justify-center bg-neutral-950 transition-all duration-700 ${stage === 'revealing' ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100'}`}>
        <div className="flex flex-col items-center max-w-xs w-full">
          <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-loading-bar shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 animate-pulse">Syncing Evaluation Matrix</p>
        </div>
        <style>{`
          @keyframes loading-bar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-loading-bar {
            animation: loading-bar 2.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 animate-in fade-in zoom-in-95 duration-1000">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8 flex justify-center animate-bounce-subtle">
          <CheckCircle2 className="text-emerald-500" size={72} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white">
          {t.title}
        </h1>
        <p className="text-neutral-500 text-lg mb-12 leading-relaxed">
          {t.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="p-6 bg-neutral-900/40 border border-white/5 rounded-[2rem] text-left hover:border-white/10 transition-colors">
            <Calendar className="text-indigo-400 mb-4" size={24} />
            <h4 className="font-bold text-neutral-200 mb-2">{t.timelineTitle}</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">{t.timelineDesc}</p>
          </div>
          <div className="p-6 bg-neutral-900/40 border border-white/5 rounded-[2rem] text-left hover:border-white/10 transition-colors">
            <ShieldCheck className="text-emerald-400 mb-4" size={24} />
            <h4 className="font-bold text-neutral-200 mb-2">{t.storageTitle}</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">{t.storageDesc}</p>
          </div>
        </div>

        <button 
          onClick={onFinish} 
          className="px-12 py-5 bg-white text-neutral-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl flex items-center gap-3 mx-auto shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all mb-12"
        >
          {t.button}
          <ArrowRight size={18} />
        </button>

        {/* Shifted Logo Below Button */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <OrbionLogo />
        </div>
      </div>
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes orb-slow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-orb-slow {
          animation: orb-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SuccessView;
