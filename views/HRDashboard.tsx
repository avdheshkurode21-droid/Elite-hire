
import React, { useState } from 'react';
import { CandidateResult } from '../types';
import { 
  BarChart3, 
  Users, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Phone,
  Hash,
  Star,
  CheckCircle,
  XCircle,
  Info,
  MessageSquare,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';

interface HRDashboardProps {
  results: CandidateResult[];
}

const HRDashboard: React.FC<HRDashboardProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);

  const filteredResults = results.filter(r => 
    r.userData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userData.idNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userData.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getThemeColor = (colorName?: string) => {
    const map: Record<string, string> = {
      indigo: '99, 102, 241',
      emerald: '16, 185, 129',
      amber: '245, 158, 11',
      rose: '244, 63, 94',
      blue: '59, 130, 246',
      slate: '71, 85, 105',
      cyan: '6, 182, 212',
      fuchsia: '192, 38, 211',
      violet: '139, 92, 246'
    };
    return map[colorName || 'indigo'] || map.indigo;
  };

  return (
    <div className="min-h-screen pt-20 px-6 md:px-12 pb-12">
      {/* Dashboard Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Recruitment Dashboard</h1>
          <p className="text-neutral-500">Review candidate performances and AI recommendations.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4 min-w-[200px]">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-xs text-neutral-500 uppercase font-semibold">Total Candidates</div>
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4 min-w-[200px]">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {results.length > 0 ? (results.reduce((acc, r) => acc + r.score, 0) / results.length).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-neutral-500 uppercase font-semibold">Avg. Performance</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Candidate List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-neutral-400">
                  <Filter size={18} />
                </button>
                <button className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-neutral-400">
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/50">
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Candidate Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">AI Score</th>
                    <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredResults.length > 0 ? filteredResults.map((result, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedCandidate(result)}
                      className={`group hover:bg-neutral-800/30 transition-colors cursor-pointer ${selectedCandidate?.userData.idNo === result.userData.idNo ? 'bg-indigo-500/5' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                            {result.userData.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold">{result.userData.fullName}</div>
                            <div className="text-xs text-neutral-500 font-mono">{result.userData.idNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs font-medium text-neutral-300">
                          {result.userData.domain}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`text-lg font-bold ${result.score >= 80 ? 'text-emerald-400' : result.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                            {result.score}%
                          </div>
                          <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${result.score >= 80 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${result.score}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit
                          ${result.recommendation === 'Recommended' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
                        `}>
                          {result.recommendation === 'Recommended' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {result.recommendation}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <ChevronRight className="inline-block text-neutral-700 group-hover:text-indigo-400 transition-colors" />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-neutral-600">
                        No candidates found for the given criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            {selectedCandidate ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Profile Header */}
                <div className="flex justify-between items-start">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl transition-all duration-700"
                    style={{ 
                      backgroundColor: `rgb(${getThemeColor(selectedCandidate.userData.domainColor)})`,
                      boxShadow: `0 10px 30px -5px rgba(${getThemeColor(selectedCandidate.userData.domainColor)}, 0.4)`
                    }}
                  >
                    {selectedCandidate.userData.fullName.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-500">
                      <Download size={20} />
                    </button>
                    <button className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-500">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{selectedCandidate.userData.fullName}</h2>
                  <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: `rgb(${getThemeColor(selectedCandidate.userData.domainColor)})` }}>
                    {selectedCandidate.userData.domain} Expert
                  </p>
                </div>

                {/* Candidate Stats Block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                      <Phone size={12} /> Phone
                    </div>
                    <div className="text-sm font-medium">{selectedCandidate.userData.phone}</div>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                      <Hash size={12} /> ID No
                    </div>
                    <div className="text-sm font-medium truncate">{selectedCandidate.userData.idNo}</div>
                  </div>
                </div>

                {/* AI Audit Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Star size={18} className="text-amber-400" />
                      Technical Assessment Report
                    </h3>
                  </div>
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
                      <span className="text-neutral-400 text-sm">Competency Score</span>
                      <span className={`text-xl font-bold ${selectedCandidate.score >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>{selectedCandidate.score}%</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">
                        {selectedCandidate.score < 60 ? <ShieldAlert size={12} className="text-red-500" /> : <CheckCircle size={12} className="text-emerald-500" />}
                        AI Executive Opinion
                      </div>
                      <p className={`text-sm leading-relaxed italic ${selectedCandidate.score < 60 ? 'text-red-400/80' : 'text-neutral-300'}`}>
                        "{selectedCandidate.summary}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Interview Transcript Section */}
                <div className="pt-4">
                  <h3 className="font-bold mb-6 flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <ClipboardList size={18} style={{ color: `rgb(${getThemeColor(selectedCandidate.userData.domainColor)})` }} />
                    Full Interview Transcript
                  </h3>
                  <div className="space-y-6">
                    {selectedCandidate.responses.map((res, i) => (
                      <div key={i} className="relative pl-6 group/qa">
                        {/* Timeline Connector */}
                        <div 
                          className="absolute left-0 top-0 w-0.5 h-full transition-colors duration-500" 
                          style={{ backgroundColor: `rgba(${getThemeColor(selectedCandidate.userData.domainColor)}, 0.2)` }}
                        ></div>
                        <div 
                          className="absolute left-[-3.5px] top-0 w-2 h-2 rounded-full transition-colors duration-500 group-hover/qa:scale-125" 
                          style={{ backgroundColor: `rgb(${getThemeColor(selectedCandidate.userData.domainColor)})` }}
                        ></div>

                        <div className="space-y-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1">
                              Inquiry {String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="text-sm font-bold text-white leading-snug">
                              {res.question}
                            </div>
                          </div>
                          
                          <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-2 opacity-5">
                               <MessageSquare size={40} />
                             </div>
                             <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-2">Candidate Response</div>
                             <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                               {res.answer}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-700">
                  <Info size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-400">No Candidate Selected</h3>
                  <p className="text-neutral-600 text-sm">Select a candidate from the table to view their comprehensive evaluation dossier.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #404040;
        }
      `}</style>
    </div>
  );
};

export default HRDashboard;
