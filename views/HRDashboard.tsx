
import React, { useState } from 'react';
import { CandidateResult, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { Search, Plus, Send, X, Loader2, CheckCircle } from 'lucide-react';

interface HRDashboardProps {
  results: CandidateResult[];
  language: Language;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ results, language }) => {
  const t = TRANSLATIONS[language].dashboard;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualData, setManualData] = useState({ name: '', score: 85 });
  const [successMsg, setSuccessMsg] = useState(false);

  const filtered = results.filter(r => 
    r.userData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userData.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Directly implements the logic requested by the user:
   * Submit an assessment (name, score) to the Azure endpoint.
   */
  const submitAssessment = async (name: string, score: number) => {
    setIsSubmitting(true);
    try {
      // Note: We use the relative /api path which maps to the azurewebsites.net endpoint 
      // when deployed or proxies to local azure functions in dev.
      const response = await fetch("/api/saveResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, score })
      });

      if (response.ok) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          setIsModalOpen(false);
        }, 2000);
      } else {
        alert("Failed to save assessment to Azure.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Connectivity error during Azure sync.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-12 pb-12 bg-neutral-950">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-neutral-500">{t.sub}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white text-neutral-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Manual Assessment
          </button>
          
          <div className="flex gap-4">
            <div className="bg-neutral-900 p-4 rounded-2xl min-w-[140px] border border-white/5">
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-[10px] text-neutral-500 font-bold uppercase">{t.total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-black mb-2">Manual Submission</h2>
            <p className="text-neutral-500 text-sm mb-8">Direct sync to Azure Table Storage via Cloud Function.</p>

            {successMsg ? (
              <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-50">
                <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                  <CheckCircle className="text-emerald-500" size={48} />
                </div>
                <p className="font-bold text-white">Assessment Saved!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Candidate Name</label>
                  <input 
                    type="text" 
                    value={manualData.name} 
                    onChange={e => setManualData({...manualData, name: e.target.value})}
                    placeholder="e.g. Avdhesh" 
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-4 px-5 text-sm outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Score (0-100)</label>
                  <input 
                    type="number" 
                    value={manualData.score} 
                    onChange={e => setManualData({...manualData, score: parseInt(e.target.value)})}
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-4 px-5 text-sm outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <button 
                  onClick={() => submitAssessment(manualData.name, manualData.score)}
                  disabled={!manualData.name || isSubmitting}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Sync to Azure
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-neutral-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex gap-4 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-white/10" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                <th className="px-6 py-4">{t.table.details}</th>
                <th className="px-6 py-4">{t.table.domain}</th>
                <th className="px-6 py-4">{t.table.score}</th>
                <th className="px-6 py-4">{t.table.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length > 0 ? filtered.map((result, idx) => (
                <tr key={idx} className="hover:bg-white/5 cursor-pointer transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 group-hover:scale-110 transition-transform">
                      {result.userData.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{result.userData.fullName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-tighter">{result.userData.idNo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-neutral-800 border border-white/5 rounded-md uppercase tracking-widest">
                      {result.userData.domain}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{result.score}</span>
                      <span className="text-[10px] text-neutral-600 font-bold">%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${result.recommendation === 'Recommended' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {result.recommendation}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-600 text-sm italic">
                    No records matched the current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
