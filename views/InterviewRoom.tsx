
import React, { useState, useEffect } from 'react';
import { UserData, InterviewResponse } from '../types';
import { getDomainQuestions, evaluateFullAssessment } from '../services/geminiService';
import { 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ClipboardCheck, 
  Cpu,
  ShieldCheck,
  Code2,
  Layers,
  Activity
} from 'lucide-react';

interface InterviewRoomProps {
  userData: UserData;
  onComplete: (result: any, history: InterviewResponse[]) => void;
}

const InterviewRoom: React.FC<InterviewRoomProps> = ({ userData, onComplete }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    setIsLoading(true);
    try {
      const qSet = await getDomainQuestions(userData.domain || "");
      setQuestions(qSet);
    } catch (err) {
      setError("System failed to load local domain questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: val }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentAnswer = answers[currentStep] || '';
  const canProceed = currentAnswer.trim().length >= 10;
  const isFinalStep = currentStep === questions.length - 1;

  const handleSubmit = async () => {
    if (!canProceed || isSubmitting) return;

    setIsSubmitting(true);
    const formattedHistory: InterviewResponse[] = questions.map((q, i) => ({
      question: q,
      answer: answers[i] || ''
    }));

    try {
      const result = await evaluateFullAssessment(userData, formattedHistory);
      onComplete(result, formattedHistory);
    } catch (err) {
      setError("Assessment engine encountered a processing error.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center">
        <Cpu className="text-indigo-500 animate-pulse mb-6" size={48} />
        <h2 className="text-xl font-bold uppercase tracking-widest text-neutral-200">Retrieving Domain Matrix</h2>
        <p className="text-neutral-600 text-[10px] mt-2 font-mono uppercase tracking-[0.3em]">Accessing Local Storage: {userData.domain}</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full animate-pulse"></div>
          <Activity size={80} className="text-indigo-500 relative z-10" />
        </div>
        <h2 className="text-2xl font-black mb-4 tracking-tighter uppercase">Compiling Linguistic Data</h2>
        <div className="max-w-xs w-full space-y-4">
          <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
          <div className="flex justify-between text-[9px] uppercase font-black text-neutral-700 tracking-[0.2em]">
            <span>Keyword Verification</span>
            <span>Calculating Final Rank</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden text-neutral-300">
      {/* Header Bar */}
      <nav className="h-16 shrink-0 border-b border-white/5 bg-neutral-900/40 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-neutral-800 border border-white/5 rounded-md text-[10px] font-black uppercase tracking-tighter text-neutral-400">
            Secure Session
          </div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
            {userData.domain} Assessment
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 mr-4">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-6 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-neutral-800'}`} 
              />
            ))}
          </div>
          <div className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-md border border-white/5">
            STEP {currentStep + 1}/{questions.length}
          </div>
        </div>
      </nav>

      {/* Main Workspace: Side-by-Side Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Question Context */}
        <div className="w-1/3 border-r border-white/5 bg-neutral-900/20 p-12 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent opacity-30"></div>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Layers size={14} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Inquiry {currentStep + 1}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
              {questions[currentStep]}
            </h2>
          </div>

          <div className="mt-auto space-y-4">
             <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-2xl">
               <div className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Subject Details</div>
               <div className="text-sm font-bold text-neutral-400">{userData.fullName}</div>
               <div className="text-[10px] font-mono text-neutral-700 mt-1">ID: {userData.idNo}</div>
             </div>
          </div>
        </div>

        {/* Right Pane: Editor / Workspace */}
        <div className="flex-1 bg-neutral-950 p-12 flex flex-col">
          <div className="flex items-center gap-3 mb-6 text-neutral-600">
            <Code2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Response Input Area</span>
          </div>

          <div className="flex-1 relative group">
            <textarea
              autoFocus
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Structure your professional response here. Be detailed to improve your score..."
              className="w-full h-full bg-transparent text-xl md:text-2xl font-medium outline-none resize-none text-neutral-200 placeholder:text-neutral-800 leading-relaxed custom-scrollbar"
            />
            
            {/* Status Feedback Overlay */}
            {!canProceed && (
              <div className="absolute bottom-0 right-0 p-4 animate-pulse">
                <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Minimum length required</span>
              </div>
            )}
            {canProceed && (
              <div className="absolute bottom-0 right-0 p-4 animate-in zoom-in">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <CheckCircle2 size={12} className="text-indigo-500" />
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Input Saved</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls Bar */}
      <footer className="h-20 shrink-0 border-t border-white/5 bg-neutral-900/60 backdrop-blur-xl flex items-center justify-between px-12">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="flex items-center gap-4">
          {isFinalStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${canProceed ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}
            >
              Analyze & Submit
              <ClipboardCheck size={16} />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed}
              className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${canProceed ? 'bg-white text-neutral-950 hover:scale-105 active:scale-95' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}
            >
              Next Question
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.03); border-radius: 10px; }
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>

      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-md text-white px-6 py-2 rounded-full flex items-center gap-3 shadow-2xl z-[100] animate-in slide-in-from-top-4">
          <AlertCircle size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
