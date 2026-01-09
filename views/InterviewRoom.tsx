
import React, { useState, useEffect, useRef } from 'react';
import { UserData, InterviewResponse, Language } from '../types';
import { getDomainQuestions, evaluateFullAssessment } from '../services/geminiService';
import { TRANSLATIONS } from '../translations';
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, ClipboardCheck, Cpu, Code2, Layers, Zap, Loader2, Sparkles, Clock, Database, BrainCircuit, UserCheck, GraduationCap, CalendarDays, User } from 'lucide-react';

interface InterviewRoomProps {
  userData: UserData;
  onComplete: (result: any, history: InterviewResponse[]) => void;
  language: Language;
}

const InterviewRoom: React.FC<InterviewRoomProps> = ({ userData: initialUserData, onComplete, language }) => {
  const t = TRANSLATIONS[language].interview;
  const ot = TRANSLATIONS[language].onboarding;
  const common = TRANSLATIONS[language].common;
  
  // App States
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  
  // Technical Assessment States
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [stepTimestamps, setStepTimestamps] = useState<Record<number, { start: number, duration: number }>>({});
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  
  // UX States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const themeColor = userData.domainColor || 'indigo';
  const baseColor = themeColor === 'maroon' ? 'red' : themeColor;
  
  const themeText = `text-${baseColor}-500`;
  const themeTextLight = `text-${baseColor}-400`;
  const themeBg = `bg-${baseColor}-500`;
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Technical questions only loaded after onboarding
    if (!isOnboarding && questions.length === 0) {
      loadAssessment();
    }
  }, [isOnboarding]);

  useEffect(() => {
    if (!isOnboarding && !isLoading && !isSubmitting && !isThinking) {
      const now = Date.now();
      setStepTimestamps(prev => ({
        ...prev,
        [currentStep]: prev[currentStep] || { start: now, duration: 0 }
      }));
      
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [currentStep, isOnboarding, isLoading, isSubmitting, isThinking]);

  const loadAssessment = async () => {
    setIsLoading(true);
    try {
      const qSet = await getDomainQuestions(userData.domain || "");
      setQuestions(qSet);
    } catch (err) { 
      setError("Sync failed: Unable to connect to the recruitment engine."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextTransition = () => {
    if (currentStep < questions.length - 1) {
      const duration = Date.now() - (stepTimestamps[currentStep]?.start || Date.now());
      setStepTimestamps(prev => ({
        ...prev,
        [currentStep]: { ...prev[currentStep], duration }
      }));

      setIsFadingOut(true);
      setIsThinking(true);
      
      const phrases = t.aiThinking || ["Neural processing...", "Calibrating context..."];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setAiStatus(randomPhrase);

      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsFadingOut(false);
        setIsThinking(false);
      }, 1800); 
    }
  };

  const handlePrevTransition = () => {
    if (currentStep > 0) {
      setIsFadingOut(true);
      setIsThinking(true);
      setAiStatus("Recalibrating previous workspace...");

      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsFadingOut(false);
        setIsThinking(false);
      }, 1200);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const finalStepDuration = Date.now() - (stepTimestamps[currentStep]?.start || Date.now());
    const updatedTimestamps = {
      ...stepTimestamps,
      [currentStep]: { ...stepTimestamps[currentStep], duration: finalStepDuration }
    };

    setIsSubmitting(true);
    setError(null);
    
    const history: InterviewResponse[] = questions.map((q, i) => ({ 
      question: q, 
      answer: answers[i] || '',
      startTime: new Date(updatedTimestamps[i]?.start || Date.now()).toLocaleTimeString(),
      duration: Math.floor((updatedTimestamps[i]?.duration || 0) / 1000)
    }));

    try {
      const result = await evaluateFullAssessment(userData, history);
      onComplete(result, history);
    } catch (err) { 
      console.error("Submission error:", err);
      setError("Evaluation pipeline interrupted. Please attempt to finalize again."); 
      setIsSubmitting(false); 
    }
  };

  // Onboarding Phase Content
  if (isOnboarding) {
    const nextStep = () => {
      setIsFadingOut(true);
      setTimeout(() => {
        setOnboardingStep(prev => prev + 1);
        setIsFadingOut(false);
      }, 400);
    };

    const prevStep = () => {
      setIsFadingOut(true);
      setTimeout(() => {
        setOnboardingStep(prev => prev - 1);
        setIsFadingOut(false);
      }, 400);
    };

    const isEducationComplete = userData.educationField && (userData.educationField !== 'Others' || (userData.otherEducationField?.trim().length || 0) > 2);
    const canContinue = 
      (onboardingStep === 0 && userData.experienceLevel) ||
      (onboardingStep === 1 && isEducationComplete) ||
      (onboardingStep === 2 && userData.graduationYear && userData.graduationYear.length === 4) ||
      (onboardingStep === 3);

    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute top-12 flex items-center gap-6">
          {[0, 1, 2, 3].map(step => (
            <div key={step} className={`h-1 transition-all duration-700 rounded-full ${step === onboardingStep ? `w-12 ${themeBg}` : step < onboardingStep ? `w-4 ${themeBg} opacity-30` : 'w-4 bg-neutral-900'}`} />
          ))}
        </div>

        <div className={`max-w-2xl w-full transition-all duration-500 ${isFadingOut ? 'opacity-0 translate-y-4 blur-xl' : 'opacity-100 translate-y-0'}`}>
          <div className="text-center mb-12">
            <div className={`inline-flex p-4 rounded-3xl bg-neutral-900/50 border border-white/5 mb-6 ${themeText}`}>
              {onboardingStep === 0 && <UserCheck size={32} />}
              {onboardingStep === 1 && <GraduationCap size={32} />}
              {onboardingStep === 2 && <CalendarDays size={32} />}
              {onboardingStep === 3 && <CheckCircle2 size={32} className="text-emerald-500" />}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">{ot.title}</h2>
            <div className="h-px w-12 bg-neutral-800 mx-auto" />
          </div>

          <div className="bg-neutral-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl">
            {onboardingStep === 0 && (
              <div className="space-y-6">
                <p className="text-neutral-400 text-lg text-center mb-8">{ot.experience}</p>
                <div className="grid grid-cols-2 gap-6">
                  {['Fresher', 'Experienced'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setUserData({...userData, experienceLevel: lvl as any})}
                      className={`py-6 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all ${userData.experienceLevel === lvl ? `bg-white text-black border-white shadow-xl` : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                    >
                      {lvl === 'Fresher' ? ot.fresher : ot.experienced}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="space-y-6">
                <p className="text-neutral-400 text-lg text-center mb-8">{ot.education}</p>
                <div className="grid grid-cols-2 gap-4">
                  {ot.fields.map((field: string) => (
                    <button
                      key={field}
                      onClick={() => setUserData({...userData, educationField: field})}
                      className={`py-4 px-6 rounded-xl border text-[11px] font-bold uppercase tracking-wider text-left transition-all ${userData.educationField === field ? `${themeBg} border-transparent text-white shadow-lg` : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700'}`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
                {userData.educationField === 'Others' && (
                  <div className="mt-8 animate-in slide-in-from-top-4">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-3">{ot.otherField}</label>
                    <input 
                      autoFocus
                      type="text"
                      value={userData.otherEducationField || ''}
                      onChange={e => setUserData({...userData, otherEducationField: e.target.value})}
                      placeholder="Enter field name..."
                      className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all text-white font-medium"
                    />
                  </div>
                )}
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-8 text-center">
                <p className="text-neutral-400 text-lg">{ot.gradYear}</p>
                <div className="flex justify-center">
                   <input 
                    autoFocus
                    type="number"
                    maxLength={4}
                    value={userData.graduationYear || ''}
                    onChange={e => setUserData({...userData, graduationYear: e.target.value.slice(0,4)})}
                    placeholder="YYYY"
                    className="bg-neutral-950 border border-white/5 rounded-3xl py-8 px-12 text-5xl font-black text-white outline-none focus:border-indigo-500 transition-all text-center w-64 tracking-widest shadow-inner placeholder:text-neutral-900"
                  />
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-8">
                <p className="text-neutral-400 text-lg text-center">{ot.confirm}</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { label: 'Role', val: userData.domain },
                     { label: 'Level', val: userData.experienceLevel },
                     { label: 'Field', val: userData.educationField === 'Others' ? userData.otherEducationField : userData.educationField },
                     { label: 'Year', val: userData.graduationYear }
                   ].map(item => (
                     <div key={item.label} className="p-5 bg-neutral-950 border border-white/5 rounded-2xl">
                       <span className="block text-[9px] font-black text-neutral-700 uppercase tracking-widest mb-1">{item.label}</span>
                       <span className="block text-sm font-bold text-white truncate">{item.val}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex items-center justify-between">
              <button 
                onClick={prevStep}
                disabled={onboardingStep === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${onboardingStep === 0 ? 'opacity-0' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
              >
                <ArrowLeft size={16} />
                {common.back}
              </button>
              
              <button 
                onClick={onboardingStep === 3 ? () => setIsOnboarding(false) : nextStep}
                disabled={!canContinue}
                className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${canContinue ? 'bg-white text-black shadow-xl hover:scale-105 active:scale-95' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-30'}`}
              >
                {onboardingStep === 3 ? "Start Technical Assessment" : common.next}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading technical assessment
  if (isLoading) return (
    <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center max-w-xs w-full">
        <div className="mb-6">
          <BrainCircuit className={`w-12 h-12 ${themeText} animate-pulse`} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-6">{t.status}</p>
        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
          <div className={`h-full ${themeBg} animate-loading-bar shadow-[0_0_10px_rgba(59,130,246,0.5)]`}></div>
        </div>
      </div>
    </div>
  );

  const currentAnswer = answers[currentStep] || '';
  const canProceed = currentAnswer.trim().length >= 6;
  const isFinalStep = currentStep === questions.length - 1;
  const elapsedMs = currentTime - (stepTimestamps[currentStep]?.start || currentTime);

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden text-neutral-300 relative">
      {isSubmitting && (
        <div className="absolute inset-0 z-[100] bg-neutral-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="flex flex-col items-center max-w-xs w-full">
            <div className="mb-6">
              <Database className={`w-12 h-12 ${themeText} animate-bounce`} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white mb-6 animate-pulse">
              Finalizing Domain Assessment & Syncing Dossier
            </p>
            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
              <div className={`h-full ${themeBg} animate-loading-bar shadow-[0_0_10px_rgba(59,130,246,0.5)]`}></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] bg-rose-500/10 border border-rose-500/30 px-8 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 shadow-2xl">
          <AlertCircle size={20} className="text-rose-500" />
          <span className="text-sm font-bold text-rose-500 uppercase tracking-widest">{error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-rose-500/60 hover:text-rose-500 uppercase text-[10px] font-black underline">Dismiss</button>
        </div>
      )}

      <nav className="h-20 shrink-0 border-b border-white/5 bg-neutral-900/40 flex items-center justify-between px-10 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-neutral-800 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
            <User size={12} className={themeTextLight} />
            <span className={themeTextLight}>{userData.fullName}</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <span className={`text-xs font-black uppercase tracking-[0.3em] ${themeTextLight}`}>{userData.domain}</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex bg-neutral-950/50 border border-white/5 rounded-full px-4 py-1.5 items-center gap-2">
            <Clock size={12} className="text-neutral-500" />
            <span className="text-[10px] font-mono text-white font-bold tracking-tighter w-8">{formatDuration(elapsedMs)}</span>
          </div>
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-700 ${i === currentStep ? `w-14 ${themeBg}` : i < currentStep ? `w-4 ${themeBg} opacity-40` : 'w-4 bg-neutral-800'}`} 
              />
            ))}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 bg-neutral-950 px-4 py-1.5 rounded-lg border border-white/5">
            <span className="text-white font-bold">{currentStep + 1}</span> / {questions.length}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        <div 
          key={`q-box-${currentStep}`}
          className={`w-2/5 border-r border-white/5 bg-neutral-900/5 p-12 md:p-14 flex flex-col justify-center relative transition-all duration-700 ${isFadingOut ? 'opacity-0 -translate-x-12 blur-xl' : 'opacity-100'}`}
        >
          {isThinking ? (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-start bg-neutral-900/40 p-8 rounded-[2rem] border border-white/5">
               <div className="flex items-center gap-3 mb-6">
                 <div className={`w-1.5 h-1.5 ${themeBg} rounded-full animate-ping`}></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">Cognitive Stream Active</span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-neutral-950 rounded-xl border border-white/5">
                    <Sparkles size={18} className={`${themeTextLight} animate-pulse`} />
                 </div>
                 <p className="text-sm font-mono font-bold text-white uppercase tracking-widest leading-relaxed">{aiStatus}</p>
               </div>
               <div className="mt-8 flex gap-1">
                 {[1,2,3].map(i => (
                   <div key={i} className={`h-0.5 w-4 rounded-full ${themeBg} opacity-${i * 20} animate-pulse`} style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
               </div>
            </div>
          ) : !isFadingOut && (
            <div className="max-w-md mx-auto question-container">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-8 h-px ${themeBg}`}></div>
                <span className={`text-[11px] font-black uppercase tracking-[0.6em] ${themeText}`}>
                  {t.inquiry} {currentStep + 1}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-[1.5] tracking-tight slope-slide-in">
                {questions[currentStep]}
              </h2>
              
              <div className="mt-8 flex items-center gap-2 opacity-40">
                <Clock size={12} />
                <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Response tracking active</span>
              </div>
            </div>
          )}
        </div>

        <div 
          key={`a-box-${currentStep}`}
          className={`flex-1 bg-neutral-950 p-12 md:p-14 flex flex-col transition-all duration-700 delay-100 ${isFadingOut ? 'opacity-0 translate-y-12 blur-xl' : 'opacity-100 translate-y-0 slide-in-up'}`}
        >
          <div className="flex items-center justify-between mb-8 text-neutral-600">
            <div className="flex items-center gap-4">
              <Code2 size={18} className={themeTextLight} />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">{t.inputArea}</span>
            </div>
          </div>
          
          <div className="flex-1 relative group">
            <textarea 
              ref={textareaRef}
              disabled={isThinking}
              value={currentAnswer} 
              onChange={(e) => setAnswers(prev => ({...prev, [currentStep]: e.target.value}))} 
              placeholder={isThinking ? "Preparing next workspace..." : t.placeholder} 
              className="w-full h-full bg-transparent text-lg md:text-xl font-medium outline-none resize-none text-neutral-100 placeholder:text-neutral-800/40 leading-[1.7] scrollbar-hide selection:bg-white/10"
            />
            
            <div className="absolute bottom-0 right-0 flex items-center gap-4">
              {!canProceed && !isFadingOut && !isThinking && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <span className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.3em] bg-neutral-900/40 px-5 py-2.5 rounded-xl border border-white/5">
                    {t.minChars}
                  </span>
                </div>
              )}
              {canProceed && !isFadingOut && !isThinking && (
                <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in slide-in-from-right-10 duration-500">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">{t.inputSecure}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="h-28 shrink-0 border-t border-white/5 bg-neutral-900/70 backdrop-blur-3xl flex items-center justify-between px-16 z-20">
        <button 
          onClick={handlePrevTransition} 
          disabled={currentStep === 0 || isFadingOut || isSubmitting || isThinking} 
          className={`group flex items-center gap-4 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all ${currentStep === 0 ? 'opacity-0 invisible' : 'text-neutral-500 hover:text-white hover:bg-white/5 active:scale-95'}`}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
          {common.back}
        </button>

        <button 
          onClick={isFinalStep ? handleSubmit : handleNextTransition} 
          disabled={!canProceed || isSubmitting || isFadingOut || isThinking} 
          className={`
            px-12 py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.4em] flex items-center gap-5 transition-all relative overflow-hidden group
            ${canProceed && !isThinking
              ? 'bg-white text-neutral-950 shadow-2xl hover:scale-[1.03] active:scale-95' 
              : 'bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-30'
            }
          `}
        >
          {isFinalStep ? t.finalize : t.nextInquiry}
          {isFinalStep ? <ClipboardCheck size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />}
          
          {canProceed && !isThinking && (
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes loading-bar { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-loading-bar { animation: loading-bar 3s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        @keyframes orb-slow { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.3); } }
        .animate-orb-slow { animation: orb-slow 2s ease-in-out infinite; }
        .question-container { perspective: 1200px; }
        .slope-slide-in { animation: slopeSlideIn 1.0s cubic-bezier(0.2, 0, 0, 1) forwards; opacity: 0; }
        @keyframes slopeSlideIn { 0% { opacity: 0; transform: translate(-100px, -100px) rotate(-4deg); } 100% { opacity: 1; transform: translate(0, 0) rotate(0deg); } }
        .slide-in-up { animation: slideInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
      `}</style>
    </div>
  );
};

export default InterviewRoom;
