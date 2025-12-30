
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface SuccessViewProps {
  onFinish: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onFinish }) => {
  const [stage, setStage] = useState<'analyzing' | 'revealing' | 'final'>('analyzing');
  const [analysisText, setAnalysisText] = useState('Initializing synthesis...');

  useEffect(() => {
    const texts = [
      'Synthesizing technical lexicon...',
      'Mapping domain competencies...',
      'Calibrating professional vectors...',
      'Finalizing neural dossier...'
    ];
    
    let textIdx = 0;
    const interval = setInterval(() => {
      if (textIdx < texts.length) {
        setAnalysisText(texts[textIdx]);
        textIdx++;
      }
    }, 800);

    const timer = setTimeout(() => {
      setStage('revealing');
      setTimeout(() => setStage('final'), 800);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (stage === 'analyzing' || stage === 'revealing') {
    return (
      <div className={`h-screen flex flex-col items-center justify-center bg-neutral-950 transition-opacity duration-1000 ${stage === 'revealing' ? 'opacity-0 scale-105' : 'opacity-100'}`}>
        {/* Central Orbion Branding */}
        <div className="group cursor-default flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="flex items-center gap-3 mb-6 px-6 py-2 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-full">
            <span className="text-[10px] font-black tracking-[0.4em] text-neutral-600 uppercase">Powered by</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="text-sm font-black tracking-[0.2em] text-white">ORBION</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-[1px] bg-neutral-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2 animate-[scan_2s_linear_infinite]" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 animate-pulse">
              {analysisText}
            </p>
          </div>
        </div>

        <style>{`
          @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.05),transparent_50%)] animate-in fade-in duration-1000">
      <div className="max-w-xl w-full text-center">
        <div className="mb-10 flex justify-center animate-in zoom-in-50 duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full scale-150 animate-pulse"></div>
            <div className="relative bg-emerald-500 text-neutral-950 p-6 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 size={56} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter animate-in slide-in-from-bottom-4 duration-700 delay-100">
          Analysis Complete.
        </h1>
        <p className="text-neutral-500 text-lg mb-12 leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Your technical profile has been successfully integrated into the EliteHire evaluation matrix. Our synthesis engine has identified high-value potential in your discourse.
        </p>

        <div className="space-y-4 mb-12 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="group flex gap-5 p-6 bg-neutral-900/30 border border-white/5 rounded-3xl text-left transition-all hover:bg-neutral-900/50 hover:border-white/10">
            <div className="p-3 bg-neutral-950 border border-white/5 rounded-2xl h-fit group-hover:scale-110 transition-transform">
              <Calendar className="text-indigo-400" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-200 mb-1">Results Timeline</h4>
              <p className="text-sm text-neutral-500 leading-snug">
                Official ranking and peer-benchmarked feedback will be released via your registered profile within <span className="text-indigo-400 font-bold">24 hours</span>.
              </p>
            </div>
          </div>

          <div className="group flex gap-5 p-6 bg-neutral-900/30 border border-white/5 rounded-3xl text-left transition-all hover:bg-neutral-900/50 hover:border-white/10">
            <div className="p-3 bg-neutral-950 border border-white/5 rounded-2xl h-fit group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-200 mb-1">Secure Storage</h4>
              <p className="text-sm text-neutral-500 leading-snug">
                All performance telemetry is encrypted and archived. You may reuse this validated token for subsequent Imagine Cup applications.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="group relative px-10 py-5 bg-white text-neutral-950 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-3 mx-auto shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] active:scale-95 animate-in slide-in-from-bottom-4 duration-700 delay-500"
        >
          Return to Hub
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Persistent subtle footer for ORBION in final view */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-100 transition-opacity duration-1000">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black tracking-widest text-neutral-600 uppercase">Engineered by</span>
          <span className="text-[10px] font-black tracking-[0.1em] text-neutral-400">ORBION AI</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessView;
