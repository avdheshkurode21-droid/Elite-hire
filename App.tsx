
import React, { useState, useEffect } from 'react';
import { AppView, UserData, CandidateResult, Language } from './types';
import LoginView from './views/LoginView';
import DomainSelectionView from './views/DomainSelectionView';
import InterviewRoom from './views/InterviewRoom';
import SuccessView from './views/SuccessView';
import HRDashboard from './views/HRDashboard';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { TRANSLATIONS } from './translations';
import { saveResultToCloud } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [language, setLanguage] = useState<Language>(Language.EN);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const saved = localStorage.getItem('elitehire_results');
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const saveResultLocal = (result: CandidateResult) => {
    const updated = [...results, result];
    setResults(updated);
    localStorage.setItem('elitehire_results', JSON.stringify(updated));
  };

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setCurrentView(AppView.DOMAIN_SELECTION);
  };

  const handleDomainSelect = (domain: string, color?: string) => {
    if (userData) {
      setUserData({ ...userData, domain, domainColor: color });
      setCurrentView(AppView.INTERVIEW);
    }
  };

  const handleInterviewComplete = async (finalResult: any, responses: any[]) => {
    if (userData) {
      const fullResult: CandidateResult = {
        userData,
        responses,
        score: finalResult.score,
        recommendation: finalResult.recommendation,
        summary: finalResult.summary,
        timestamp: new Date().toISOString(),
      };
      
      // Save locally for immediate feedback
      saveResultLocal(fullResult);
      
      // Trigger cloud sync in background to avoid blocking the UI
      saveResultToCloud(fullResult).catch(err => console.warn("Cloud sync deferred:", err));
      
      // Move to success view immediately
      setCurrentView(AppView.SUCCESS);
    }
  };

  const resetFlow = () => {
    setUserData(null);
    setCurrentView(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      <nav className="fixed top-6 right-6 p-0 z-50 flex items-center gap-4">
        <div className="flex bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-1 rounded-full shadow-lg">
          {(Object.keys(Language) as Array<keyof typeof Language>).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(Language[lang])}
              className={`
                px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300
                ${language === Language[lang] 
                  ? 'bg-white text-neutral-950 shadow-md scale-105' 
                  : 'text-neutral-500 hover:text-neutral-300'}
              `}
            >
              {lang}
            </button>
          ))}
        </div>

        {currentView !== AppView.DASHBOARD && (
          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors shadow-lg"
          >
            <LayoutDashboard size={14} />
            {t.common.hrPanel}
          </button>
        )}
        {currentView === AppView.DASHBOARD && (
          <button 
            onClick={() => setCurrentView(AppView.LOGIN)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors shadow-lg"
          >
            <LogOut size={14} />
            {t.common.candidatePortal}
          </button>
        )}
      </nav>

      <main className="min-h-screen">
        {currentView === AppView.LOGIN && <LoginView onLogin={handleLogin} language={language} />}
        {currentView === AppView.DOMAIN_SELECTION && (
          <DomainSelectionView onSelect={handleDomainSelect} userName={userData?.fullName || ''} language={language} />
        )}
        {currentView === AppView.INTERVIEW && userData && (
          <InterviewRoom userData={userData} onComplete={handleInterviewComplete} language={language} />
        )}
        {currentView === AppView.SUCCESS && <SuccessView onFinish={resetFlow} language={language} />}
        {currentView === AppView.DASHBOARD && <HRDashboard results={results} language={language} />}
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[40] group">
        <div className="flex items-center gap-3 px-6 py-2 bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 cursor-default">
          <span className="text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase">{t.common.poweredBy}</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-transform duration-500 group-hover:scale-125"></div>
              <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-ping"></div>
            </div>
            <span className="text-xs font-black tracking-[0.1em] text-white">ORBION</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
