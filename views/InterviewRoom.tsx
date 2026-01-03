
import React, { useState, useEffect, useRef } from 'react';
import { UserData, InterviewResponse, Language } from '../types';
import { getDomainQuestions, evaluateFullAssessment } from '../services/geminiService';
import { TRANSLATIONS } from '../translations';
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, ClipboardCheck, Cpu, Code2, Layers, Zap, Loader2 } from 'lucide-react';

interface InterviewRoomProps {
  userData: UserData;
  onComplete: (result: any, history: InterviewResponse[]) => void;
  language: Language;
}

const InterviewRoom: React.FC<InterviewRoomProps> = ({ userData, onComplete, language }) => {
  const t = TRANSLATIONS[language].interview;
  const common = TRANSLATIONS[language].common;
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingStep, setIsProcessingStep] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const themeColor = userData.domainColor || 'indigo';
  const themeText = `text-${themeColor}-500`;
  const themeTextLight = `text-${themeColor}-400`;
  const themeBg = `bg-${themeColor}-500`;
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { 
    loadAssessment(); 
  }, []);

  useEffect(() => {
    if (!isProcessingStep && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentStep, isProcessingStep, isLoading]);

  const loadAssessment = async () => {
    setIsLoading(true);
    try {
      const qSet = await getDomainQuestions(userData.domain || "");
      setQuestions(qSet);
    } catch (err) { 
      setError("System failure during neural map acquisition."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleNextTransition = () => {
    if (currentStep < questions.length - 1) {
      setIsFadingOut(true);
      // Wait for exit animation
      setTimeout(() => {
        setIsProcessingStep(true);
        setIsFadingOut(false);
        // Artificial processing delay for "thoughtful" AI feel
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsProcessingStep(false);
        }, 1000);
      }, 300);
    }
  };

  const handlePrevTransition = () => {
    if (currentStep > 0) {
      setIsFadingOut(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsFadingOut(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Construct full history
    const history: InterviewResponse[] = questions.map((q, i) => ({ 
      question: q, 
      answer: answers[i] || '' 
    }));

    try {
      const result = await evaluateFullAssessment(userData, history);
      onComplete(result, history);
    } catch (err) { 
      setError("Dossier finalization encountered a critical interrupt."); 
      setIsSubmitting(false); 
    }
  };

  if (isLoading) return (
    <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="relative mb-8">
        <div className={`absolute inset-0 blur-3xl opacity-20 bg-${themeColor}-500`}></div>
        <Cpu className={`${themeTextLight} relative z-10`} size={64} />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-neutral-200">{t.status}</h2>
      <p className="mt-4 text-neutral-600 font-mono text-[10px] uppercase tracking-widest">Acquiring domain-specific technical matrices...</p>
    </div>
  );

  const currentAnswer = answers[currentStep] || '';
  const canProceed = currentAnswer.trim().length >= 6;
  const isFinalStep = currentStep === questions.length - 1;

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden text-neutral-300 relative">
      {/* Global Processing Overlays */}
      {(isProcessingStep || isSubmitting) && (
        <div className="absolute inset-0 z-50 bg-neutral-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-8">
            <div className={`absolute inset-0 animate-ping opacity-20 rounded-full bg-${themeColor}-500`}></div>
            {isSubmitting ? (
              <Loader2 size={48} className={`${themeTextLight} animate-spin`} />
            ) : (
              <Zap size={48} className={`${themeTextLight} animate-pulse`} />
            )}
          </div>
          <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">
            {isSubmitting ? t.finalize : t.processing}
          </h2>
          <p className="text-neutral-500 text-[10px] mt-3 font-mono uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            {isSubmitting ? "Generating high-fidelity evaluation dossier via neural reasoning..." : t.integrating}
          </p>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] bg-rose-500/10 border border-rose-500/20 px-6 py-3 rounded-full flex items-center gap-3 animate-in slide-in-from-top-4">
          <AlertCircle size={16} className="text-rose-500" />
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500/50 hover:text-rose-500 text-[10px] font-black underline uppercase">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <nav className="h-16 shrink-0 border-b border-white/5 bg-neutral-900/40 flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-neutral-800 border border-white/5 rounded-md text-[10px] font-black uppercase tracking-tighter text-neutral-400">
            {common.secure}
          </div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{userData.domain}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-8 rounded-full transition-all duration-700 ${i <= currentStep ? `${themeBg} shadow-[0_0_12px_rgba(var(--theme-rgb),0.5)]` : 'bg-neutral-800'}`} 
              />
            ))}
          </div>
          <div className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-3 py-1 rounded-md border border-white/5 uppercase">
            {currentStep + 1} / {questions.length}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Question */}
        <div key={`q-${currentStep}`} className={`w-2/5 border-r border-white/5 bg-neutral-900/10 p-12 md:p-20 flex flex-col justify-center relative transition-all duration-700 ${isFadingOut ? 'opacity-0 -translate-x-12 blur-md' : 'opacity-100 translate-x-0'}`}>
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <Layers size={16} className={themeText} />
              <span className={`text-[11px] font-black uppercase tracking-[0.5em] ${themeText}`}>
                {t.inquiry} {currentStep + 1}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-[1.15] tracking-tight">
              {questions[currentStep]}
            </h2>
          </div>
        </div>

        {/* Right Side: Answer Input */}
        <div key={`a-${currentStep}`} className={`flex-1 bg-neutral-950 p-12 md:p-20 flex flex-col transition-all duration-700 delay-75 ${isFadingOut ? 'opacity-0 translate-y-8 blur-md' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center justify-between mb-8 text-neutral-600">
            <div className="flex items-center gap-3">
              <Code2 size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">{t.inputArea}</span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-40">
              {currentAnswer.length} chars
            </div>
          </div>
          
          <div className="flex-1 relative group">
            <textarea 
              ref={textareaRef}
              value={currentAnswer} 
              onChange={(e) => setAnswers(prev => ({...prev, [currentStep]: e.target.value}))} 
              placeholder={t.placeholder} 
              className="w-full h-full bg-transparent text-xl md:text-2xl font-medium outline-none resize-none text-neutral-200 placeholder:text-neutral-800/30 leading-relaxed scrollbar-hide"
            />
            
            <div className="absolute bottom-0 right-0 flex items-center gap-4">
              {!canProceed && !isFadingOut && (
                <div className="animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">{t.minChars}</span>
                </div>
              )}
              {canProceed && !isFadingOut && (
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-right-4">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{t.inputSecure}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="h-24 shrink-0 border-t border-white/5 bg-neutral-900/60 backdrop-blur-3xl flex items-center justify-between px-12 z-20">
        <button 
          onClick={handlePrevTransition} 
          disabled={currentStep === 0 || isFadingOut || isProcessingStep || isSubmitting} 
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0 invisible' : 'text-neutral-500 hover:text-white hover:bg-white/5 active:scale-95'}`}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {common.back}
        </button>

        <button 
          onClick={isFinalStep ? handleSubmit : handleNextTransition} 
          disabled={!canProceed || isSubmitting || isProcessingStep || isFadingOut} 
          className={`
            px-12 py-5 rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.25em] flex items-center gap-4 transition-all relative overflow-hidden
            ${canProceed 
              ? 'bg-white text-neutral-950 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95' 
              : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }
          `}
        >
          {isFinalStep ? t.finalize : t.nextInquiry}
          {isFinalStep ? <ClipboardCheck size={18} /> : <ArrowRight size={18} className="animate-pulse" />}
        </button>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InterviewRoom;
