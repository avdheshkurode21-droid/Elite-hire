
import React, { useState, useEffect } from 'react';
import { AppView, UserData, CandidateResult } from './types';
import LoginView from './views/LoginView';
import DomainSelectionView from './views/DomainSelectionView';
import InterviewRoom from './views/InterviewRoom';
import SuccessView from './views/SuccessView';
import HRDashboard from './views/HRDashboard';
import { LayoutDashboard, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);

  // Load results from "mock database" (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('elitehire_results');
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const saveResult = (result: CandidateResult) => {
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

  const handleInterviewComplete = (finalResult: any, responses: any[]) => {
    if (userData) {
      const fullResult: CandidateResult = {
        userData,
        responses,
        score: finalResult.score,
        recommendation: finalResult.recommendation,
        summary: finalResult.summary,
        timestamp: new Date().toISOString(),
      };
      saveResult(fullResult);
      setCurrentView(AppView.SUCCESS);
    }
  };

  const resetFlow = () => {
    setUserData(null);
    setCurrentView(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      {/* Navigation Helper (For Demo/HR Purposes) */}
      <nav className="fixed top-6 right-6 p-0 z-50 flex gap-4">
        {currentView !== AppView.DASHBOARD && (
          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors shadow-lg"
          >
            <LayoutDashboard size={14} />
            HR Panel
          </button>
        )}
        {currentView === AppView.DASHBOARD && (
          <button 
            onClick={() => setCurrentView(AppView.LOGIN)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors shadow-lg"
          >
            <LogOut size={14} />
            Candidate Portal
          </button>
        )}
      </nav>

      {/* Main View Router */}
      <main className="min-h-screen">
        {currentView === AppView.LOGIN && <LoginView onLogin={handleLogin} />}
        {currentView === AppView.DOMAIN_SELECTION && (
          <DomainSelectionView onSelect={handleDomainSelect} userName={userData?.fullName || ''} />
        )}
        {currentView === AppView.INTERVIEW && userData && (
          <InterviewRoom userData={userData} onComplete={handleInterviewComplete} />
        )}
        {currentView === AppView.SUCCESS && <SuccessView onFinish={resetFlow} />}
        {currentView === AppView.DASHBOARD && <HRDashboard results={results} />}
      </main>

      {/* Powered by Orbion Attribution - Interactive Discovery */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[40] group">
        <div className="flex items-center gap-3 px-6 py-2 bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 cursor-default">
          <span className="text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase">Powered by</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-transform duration-500 group-hover:scale-125"></div>
              {/* Only animate when the group is hovered */}
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
