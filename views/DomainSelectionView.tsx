
import React, { useState } from 'react';
import { DOMAINS, getIcon } from '../constants';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { Cpu, ChevronRight, LayoutGrid, Fingerprint, Activity, User, MousePointer2 } from 'lucide-react';

interface DomainSelectionViewProps {
  onSelect: (domain: string, id: string, color: string) => void;
  userName: string;
  language: Language;
}

const DomainSelectionView: React.FC<DomainSelectionViewProps> = ({ onSelect, userName, language }) => {
  const t = TRANSLATIONS[language].domains;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (domain: string, id: string, color: string) => {
    setSelectedId(id);
    setTimeout(() => {
      onSelect(domain, id, color);
    }, 2000);
  };

  const getThemeRgb = (color: string) => {
    const map: Record<string, string> = {
      indigo: '99, 102, 241', emerald: '16, 185, 129', amber: '245, 158, 11', rose: '244, 63, 94', 
      blue: '59, 130, 246', slate: '71, 85, 105', cyan: '6, 182, 212', fuchsia: '192, 38, 211', 
      violet: '139, 92, 246', maroon: '128, 0, 0', orange: '251, 146, 60'
    };
    return map[color] || map.indigo;
  };

  const activeHoveredDomain = DOMAINS.find(d => d.id === hoveredId);
  const activeRgb = activeHoveredDomain ? getThemeRgb(activeHoveredDomain.color) : '255, 255, 255'; // Default white
  const activeColorStyle = { color: `rgb(${activeRgb})` };

  if (selectedId) {
    const domainObj = DOMAINS.find(d => d.id === selectedId);
    const themeColor = domainObj?.color || 'indigo';
    const rgb = getThemeRgb(themeColor);
    
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-8 text-center bg-[#050505] overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-radial-gradient" style={{ background: `radial-gradient(circle at center, rgba(${rgb}, 0.15) 0%, transparent 70%)` }} />
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-[120px] rounded-full animate-pulse" style={{ backgroundColor: `rgba(${rgb}, 0.3)` }} />
          <Cpu size={72} className="animate-spin-slow relative z-10" style={{ color: `rgb(${rgb})` }} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-[0.4em] text-white mb-3 animate-in fade-in slide-in-from-bottom-2">{t.initializing}</h2>
          <p className="text-neutral-500 text-sm font-mono uppercase tracking-[0.2em]">
            {t.constructing.replace('{domain}', domainObj?.label || '')}
          </p>
        </div>
        <div className="mt-16 w-80 h-1 bg-neutral-900 rounded-full overflow-hidden relative">
          <div className="h-full animate-[loading_2s_ease-in-out_forwards]" style={{ backgroundColor: `rgb(${rgb})`, boxShadow: `0 0 20px rgba(${rgb}, 0.5)` }} />
        </div>
        <style>{`
          @keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }
          .animate-spin-slow { animation: spin 8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center relative overflow-hidden bg-neutral-950">
      {/* Background decoration */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-20 transition-all duration-1000"
        style={{ background: `radial-gradient(circle at 50% 0%, rgba(${activeRgb}, 0.1) 0%, transparent 70%)` }}
      />
      
      <div className="max-w-6xl w-full text-center pt-24 pb-12 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000 px-6">
        <div 
          className="inline-flex items-center gap-3 px-6 py-3 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-full mb-10 transition-all duration-500"
          style={{ borderColor: `rgba(${activeRgb}, 0.2)` }}
        >
          <MousePointer2 size={14} style={activeColorStyle} className="transition-all duration-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
            Dossier Identity: <span style={activeColorStyle} className="transition-all duration-500">{userName}</span>
          </span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight text-white">
          {t.welcome} <span style={activeColorStyle} className="transition-all duration-500 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{userName.split(' ')[0]}</span>.
        </h1>
        <p className="text-neutral-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          {t.sub}
        </p>
      </div>

      <div className="flex-1 w-full max-w-7xl px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pb-24 pt-4 scrollbar-hide">
        {DOMAINS.map((domain, index) => {
          const rgb = getThemeRgb(domain.color);
          const isHovered = hoveredId === domain.id;
          
          return (
            <button
              key={domain.id}
              onMouseEnter={() => setHoveredId(domain.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(domain.label, domain.id, domain.color)}
              className="group relative flex flex-col items-start p-10 bg-neutral-900/20 border-2 rounded-[3rem] transition-all duration-700 backdrop-blur-sm hover:bg-neutral-800/30 hover:-translate-y-2 animate-in fade-in zoom-in-95 text-left overflow-hidden"
              style={{ 
                borderColor: isHovered ? `rgba(${rgb}, 0.4)` : 'rgba(255,255,255,0.03)',
                boxShadow: isHovered ? `0 30px 60px -15px rgba(${rgb}, 0.15)` : 'none',
                animationDelay: `${index * 60}ms`
              }}
            >
              {/* Domain Icon */}
              <div className="flex items-center justify-between w-full mb-10 relative z-10">
                <div 
                  className="p-5 rounded-[1.5rem] border transition-all duration-700" 
                  style={{ 
                    backgroundColor: `rgba(${rgb}, 0.08)`, 
                    borderColor: isHovered ? `rgba(${rgb}, 0.3)` : 'rgba(255,255,255,0.05)',
                    color: isHovered ? `rgb(${rgb})` : 'rgba(255,255,255,0.4)'
                  }}
                >
                  {getIcon(domain.icon, 28)}
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-neutral-950/50 border border-white/5 text-[9px] font-black uppercase tracking-widest text-neutral-600">
                  REF-{domain.id.toUpperCase()}
                </div>
              </div>

              {/* DOMAIN NAME */}
              <div className="relative z-10 w-full mb-6">
                <span className="block text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-3 group-hover:text-neutral-400 transition-colors">
                  {t.cardLabel}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-white group-hover:text-white transition-colors leading-tight">
                    {domain.label}
                  </h3>
                  <ChevronRight 
                    size={28} 
                    className={`transition-all duration-700 transform ${isHovered ? 'translate-x-0 opacity-100 scale-110' : '-translate-x-4 opacity-0 scale-75'}`} 
                    style={{ color: `rgb(${rgb})` }} 
                  />
                </div>
              </div>
              
              <p className="text-neutral-500 text-sm leading-relaxed mb-10 relative z-10 font-medium group-hover:text-neutral-400 transition-colors">
                {domain.description}
              </p>

              {/* Bottom Decoration */}
              <div className="mt-auto w-full flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Activity size={14} style={{ color: isHovered ? `rgb(${rgb})` : 'rgba(255,255,255,0.1)' }} className="transition-all duration-700" />
                  <span className="text-[10px] font-mono text-neutral-700 font-bold uppercase tracking-wider">LATEST STACK</span>
                </div>
                <div className="h-1 w-16 rounded-full bg-neutral-800/50 overflow-hidden">
                  <div className="h-full transition-all duration-1000 w-0 group-hover:w-full" style={{ backgroundColor: `rgb(${rgb})` }} />
                </div>
              </div>

              {/* Background Accent Gradient */}
              <div 
                className="absolute top-0 right-0 w-48 h-48 blur-[100px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none"
                style={{ backgroundColor: `rgb(${rgb})` }}
              />
            </button>
          );
        })}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default DomainSelectionView;
