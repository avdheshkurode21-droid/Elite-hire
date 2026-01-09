
import React, { useState, useEffect } from 'react';
import { CandidateResult, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { Search, Plus, Send, X, Loader2, CheckCircle, Database, Filter, ArrowUpRight, Activity, ChevronDown, ChevronUp, MessageSquare, Terminal, Clock, FileSpreadsheet } from 'lucide-react';
import { saveResultToCloud } from '../services/geminiService';
import { getDomainColor } from '../constants';

// Moved SkeletonRow outside of the main component for better reliability
const SkeletonRow = () => (
  <tr className="border-b border-white/5 animate-pulse">
    <td className="px-10 py-8">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 shimmer-bg" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-neutral-900 rounded shimmer-bg" />
          <div className="w-20 h-2 bg-neutral-900 rounded shimmer-bg" />
        </div>
      </div>
    </td>
    <td className="px-6 py-8">
      <div className="w-24 h-8 bg-neutral-900 rounded-xl shimmer-bg" />
    </td>
    <td className="px-6 py-8">
      <div className="w-12 h-10 bg-neutral-900 rounded shimmer-bg" />
    </td>
    <td className="px-6 py-8">
      <div className="w-28 h-8 rounded-full bg-neutral-900 shimmer-bg" />
    </td>
    <td className="px-10 py-8">
      <div className="space-y-3">
        <div className="w-16 h-2 bg-neutral-900 rounded shimmer-bg" />
        <div className="w-full h-12 bg-neutral-900/50 rounded-xl shimmer-bg" />
      </div>
    </td>
  </tr>
);

interface HRDashboardProps {
  results: CandidateResult[];
  language: Language;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ results, language }) => {
  const t = TRANSLATIONS[language].dashboard;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Recommended' | 'Not Recommended'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualData, setManualData] = useState({ name: '', score: 85 });
  const [successMsg, setSuccessMsg] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDataProcessing, setIsDataProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataProcessing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [filterStatus]);

  const filtered = results.filter(r => {
    const matchesSearch = r.userData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.userData.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.userData.idNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || r.recommendation === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const exportToExcel = () => {
    const headers = ["Full Name", "ID Number", "Phone", "Domain", "Score %", "Recommendation", "Technical Summary", "Timestamp"];
    
    // Prepare rows from filtered data
    const rows = filtered.map(r => [
      `"${r.userData.fullName}"`,
      `"${r.userData.idNo}"`,
      `"${r.userData.phone || ''}"`,
      `"${r.userData.domain || ''}"`,
      r.score,
      `"${r.recommendation}"`,
      `"${r.summary.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${new Date(r.timestamp).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EliteHire_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submitAssessment = async (name: string, score: number) => {
    setIsSubmitting(true);
    try {
      const success = await saveResultToCloud({ name, score });
      if (success) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          setIsModalOpen(false);
        }, 2000);
      } else {
        alert("Azure sync failed. Ensure local environment variables are configured.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Connectivity error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-12 pb-12 bg-neutral-950">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={20} className="text-indigo-500" />
            <h1 className="text-4xl font-bold tracking-tight text-white">{t.title}</h1>
          </div>
          <p className="text-neutral-500 font-medium">{t.sub}</p>
        </div>
        
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="hidden lg:flex items-center gap-8 mr-4 px-6 py-3 bg-neutral-900/40 rounded-2xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Dossiers</span>
              <span className="text-xl font-black text-white">{results.length}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Avg. Score</span>
              <span className="text-xl font-black text-indigo-400">
                {results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              disabled={filtered.length === 0}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 shadow-xl shadow-white/5 active:scale-95 group ${filtered.length > 0 ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-neutral-900/50 text-neutral-700 cursor-not-allowed'}`}
            >
              <FileSpreadsheet size={16} className={`transition-colors duration-300 ${filtered.length > 0 ? 'group-hover:text-emerald-400' : ''}`} />
              {t.export}
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-6 py-4 bg-white text-neutral-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 active:scale-95 group"
            >
              <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
              Manual Entry
            </button>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="p-8 border-b border-white/5 flex flex-col xl:flex-row gap-8 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-700" 
            />
          </div>

          <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {[
              { id: 'All', label: t.filterAll },
              { id: 'Recommended', label: t.filterRecommended },
              { id: 'Not Recommended', label: t.filterNotRecommended }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setFilterStatus(filter.id as any);
                  setIsDataProcessing(true);
                }}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filterStatus === filter.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-black text-neutral-500 tracking-[0.3em]">
                <th className="px-10 py-8">{t.table.details}</th>
                <th className="px-6 py-8">{t.table.domain}</th>
                <th className="px-6 py-8">{t.table.score}</th>
                <th className="px-6 py-8">{t.table.status}</th>
                <th className="px-10 py-8">{t.table.analysis}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isDataProcessing ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filtered.length > 0 ? filtered.map((result) => {
                const uniqueId = `${result.userData.idNo}_${result.timestamp}`;
                const isExpanded = expandedId === uniqueId;
                const dColor = getDomainColor(result.userData.domain || "");
                const nameColorClass = `text-${dColor === 'maroon' ? 'red' : dColor}-400`;
                const bgColorClass = `bg-${dColor === 'maroon' ? 'red' : dColor}-600`;
                
                return (
                  <React.Fragment key={uniqueId}>
                    <tr 
                      onClick={() => toggleExpand(uniqueId)}
                      className={`cursor-pointer transition-colors group ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-10 py-8 align-top">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center font-black transition-all duration-500 shadow-lg ${isExpanded ? `${bgColorClass} text-white scale-110` : 'bg-neutral-800 text-neutral-300 group-hover:bg-white/10'}`}>
                            {result.userData.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`font-bold text-lg leading-tight transition-colors duration-500 ${isExpanded ? nameColorClass : 'text-white'}`}>{result.userData.fullName}</div>
                              {isExpanded ? <ChevronUp size={14} className={nameColorClass} /> : <ChevronDown size={14} className="text-neutral-600" />}
                            </div>
                            <div className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">{result.userData.idNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 align-top">
                        <div className="pt-3">
                          <span className={`text-[10px] font-black px-4 py-2 bg-neutral-900 border border-white/10 rounded-xl uppercase tracking-widest transition-colors ${nameColorClass}`}>
                            {result.userData.domain}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8 align-top">
                        <div className="pt-2">
                          <div className="flex items-baseline gap-1">
                            <span className="font-black text-3xl text-white tracking-tighter">{result.score}</span>
                            <span className="text-xs text-neutral-600 font-black">%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 align-top">
                        <div className="pt-3">
                          <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] inline-flex items-center gap-3 ${result.recommendation === 'Recommended' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]'}`}>
                            <div className={`w-2 h-2 rounded-full ${result.recommendation === 'Recommended' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></div>
                            {result.recommendation}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 align-top max-w-lg">
                        <div className="pt-3 group-hover:translate-x-1 transition-transform duration-500">
                          <div className="flex items-center gap-2 mb-3">
                            <ArrowUpRight size={14} className={isExpanded ? nameColorClass : 'text-indigo-500'} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">Technical Diagnostic</span>
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed font-medium italic border-l-2 border-indigo-500/20 pl-4">
                            {result.summary}
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    {/* EXPANDED TRANSCRIPT SECTION */}
                    {isExpanded && (
                      <tr className="animate-in slide-in-from-top-4 duration-500 bg-neutral-950/60 border-b border-white/5">
                        <td colSpan={5} className="px-10 py-10">
                          <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-8">
                              <Terminal size={18} className={nameColorClass} />
                              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400">Full Assessment Transcript</h4>
                              <div className="flex-1 h-px bg-white/5"></div>
                            </div>
                            
                            <div className="space-y-6">
                              {result.responses && result.responses.length > 0 ? (
                                result.responses.map((resp, rIdx) => (
                                  <div key={rIdx} className="group/item">
                                    <div className="flex gap-6">
                                      <div className="w-12 shrink-0 flex flex-col items-center">
                                        <div className="text-[10px] font-mono text-neutral-700 font-black mb-2 uppercase tracking-tighter">Q-0{rIdx + 1}</div>
                                        <div className="w-px flex-1 bg-white/5 group-last/item:bg-transparent"></div>
                                      </div>
                                      <div className="flex-1 pb-8 border-b border-white/[0.03] group-last/item:border-none">
                                        <div className="mb-4 flex items-start justify-between">
                                          <div>
                                            <div className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${nameColorClass}`}>
                                              <div className={`w-1 h-1 rounded-full ${bgColorClass}`}></div>
                                              AI Inquiry
                                            </div>
                                            <p className="text-sm font-bold text-white leading-relaxed">{resp.question}</p>
                                          </div>
                                          {resp.startTime && (
                                            <div className="flex flex-col items-end shrink-0">
                                              <div className="flex items-center gap-1.5 text-neutral-600 mb-1">
                                                <Clock size={10} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">{resp.startTime}</span>
                                              </div>
                                              {resp.duration !== undefined && (
                                                <span className={`text-[8px] font-mono font-black uppercase tracking-widest opacity-60 ${nameColorClass}`}>Dur: {resp.duration}s</span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                                          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/item:opacity-20 transition-opacity">
                                            <MessageSquare size={32} className={nameColorClass} />
                                          </div>
                                          <div className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2">Candidate Response</div>
                                          <p className="text-xs text-neutral-300 leading-relaxed font-medium whitespace-pre-wrap">{resp.answer}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-10">
                                  <p className="text-xs text-neutral-600 uppercase font-black tracking-widest italic">No detailed transcript available for this record.</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-10 flex justify-end">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleExpand(uniqueId); }}
                                className="text-[9px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 border border-white/5 rounded-lg hover:bg-white/5"
                              >
                                <ChevronUp size={14} />
                                Collapse Record
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <Filter size={64} strokeWidth={1} className="mb-6 text-neutral-500" />
                      <p className="text-lg font-black uppercase tracking-[0.5em] text-neutral-500">Empty Dossier Set</p>
                      <p className="text-xs font-medium text-neutral-600 mt-2 uppercase tracking-widest">No candidates match current neural filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Manual Assessment Entry</h2>
              <p className="text-neutral-500 text-sm">Synchronize external assessment data with the recruitment dossier.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-3">Candidate Full Name</label>
                <input 
                  type="text" 
                  value={manualData.name}
                  onChange={(e) => setManualData({...manualData, name: e.target.value})}
                  className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-indigo-500 transition-all text-white font-medium"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase tracking-widest">Technical Assessment Score</label>
                  <span className="text-indigo-400 font-bold font-mono">{manualData.score}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={manualData.score}
                  onChange={(e) => setManualData({...manualData, score: parseInt(e.target.value)})}
                  className="w-full accent-indigo-500 h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer border border-white/5"
                />
              </div>

              <button 
                onClick={() => submitAssessment(manualData.name, manualData.score)}
                disabled={isSubmitting || !manualData.name.trim()}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isSubmitting || !manualData.name.trim() ? 'bg-neutral-800 text-neutral-600' : 'bg-white text-neutral-950 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Synchronizing...
                  </>
                ) : successMsg ? (
                  <>
                    <CheckCircle size={18} className="text-emerald-500" />
                    Entry Persisted
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Commit to Cloud
                  </>
                )}
              </button>
            </div>

            <div className="mt-10 flex items-center gap-3 justify-center">
              <Database size={14} className="text-neutral-700" />
              <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Azure Table Storage Node: East US</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shimmer-bg {
          position: relative;
          overflow: hidden;
        }
        .shimmer-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default HRDashboard;
