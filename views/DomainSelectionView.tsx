
import React, { useState } from 'react';
import { DOMAINS, getIcon } from '../constants';
import { Cpu } from 'lucide-react';

interface DomainSelectionViewProps {
  onSelect: (domain: string, color?: string) => void;
  userName: string;
}

const DomainSelectionView: React.FC<DomainSelectionViewProps> = ({ onSelect, userName }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleSelect = (domain: string, id: string, color: string) => {
    setSelectedId(id);
    // 2 Second Delay to simulate AI Environment setup
    setTimeout(() => {
      onSelect(domain, color);
    }, 2000);
  };

  const getThemeRgb = (color: string) => {
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
    return map[color] || map.indigo;
  };

  if (selectedId) {
    const domainObj = DOMAINS.find(d => d.id === selectedId);
    const themeColor = domainObj?.color || 'indigo';
    const rgb = getThemeRgb(themeColor);
    
    return (
      <div 
        className="h-screen w-full flex flex-col items-center justify-center p-8 text-center transition-colors duration-1000 overflow-hidden relative"
        style={{ backgroundColor: '#050505' }}
      >
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle at center, rgba(${rgb}, 0.15) 0%, transparent 70%)`,
            animation: 'pulse-glow 4s ease-in-out infinite'
          }}
        />

        <div className="relative mb-8">
          <div 
            className="absolute inset-0 blur-[120px] rounded-full animate-pulse transition-all duration-1000"
            style={{ backgroundColor: `rgba(${rgb}, 0.3)` }}
          />
          <Cpu 
            size={72} 
            className="animate-spin-slow relative z-10 transition-colors duration-1000" 
            style={{ color: `rgb(${rgb})` }} 
          />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-[0.4em] text-white mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Initializing Neural Map
          </h2>
          <p className="text-neutral-500 text-sm font-mono uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
            Constructing <span style={{ color: `rgb(${rgb})` }} className="font-bold">{domainObj?.label}</span> Architecture...
          </p>
        </div>
        
        <div className="mt-16 w-80 h-1 bg-neutral-900 rounded-full overflow-hidden relative">
          <div 
            className="h-full animate-[loading_2s_ease-in-out_forwards] transition-all duration-1000"
            style={{ backgroundColor: `rgb(${rgb})`, boxShadow: `0 0 20px rgba(${rgb}, 0.5)` }}
          />
        </div>

        <style>{`
          @keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }
          @keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.1); opacity: 0.25; } }
          .animate-spin-slow { animation: spin 8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const currentRgb = getThemeRgb(hoveredColor || 'neutral');

  return (
    <div className="h-screen w-full flex flex-col items-center relative transition-all duration-1000 overflow-hidden bg-neutral-950">
      <div 
        className="fixed inset-0 -z-10 transition-all duration-1000 opacity-20 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% -20%, rgba(${currentRgb}, 0.1), transparent 50%),
                       radial-gradient(circle at 0% 100%, rgba(${currentRgb}, 0.05), transparent 40%)`
        }}
      />

      <div className="max-w-4xl w-full text-center mt-auto py-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
          Welcome, <span className="transition-colors duration-1000" style={{ color: hoveredColor ? `rgb(${currentRgb})` : 'rgb(129, 140, 248)' }}>{userName.split(' ')[0]}</span>.
        </h1>
        <p className="text-neutral-500 text-base font-medium max-w-xl mx-auto leading-relaxed">
          Select your expertise sector to begin the high-fidelity technical evaluation.
        </p>
      </div>

      <div className="flex-1 w-full max-w-6xl px-6 mb-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh]">
        {DOMAINS.map((domain, index) => {
          const rgb = getThemeRgb(domain.color);
          const isActive = hoveredColor === domain.color;

          return (
            <button
              key={domain.id}
              onMouseEnter={() => setHoveredColor(domain.color)}
              onMouseLeave={() => setHoveredColor(null)}
              onClick={() => handleSelect(domain.label, domain.id, domain.color)}
              className={`
                group relative flex flex-col justify-center items-center text-center p-8 bg-neutral-900/30 border-2 rounded-[2rem] transition-all duration-500 backdrop-blur-md
                hover:bg-neutral-800/60 hover:-translate-y-2
                animate-in fade-in zoom-in-95 duration-700
              `}
              style={{ 
                borderColor: isActive ? `rgba(${rgb}, 0.6)` : 'rgba(255,255,255,0.05)',
                boxShadow: isActive ? `0 25px 50px -12px rgba(${rgb}, 0.3)` : 'none',
                animationDelay: `${index * 40}ms`
              }}
            >
              <div 
                className="p-5 rounded-2xl transition-all duration-500 border mb-4 relative"
                style={{ 
                  backgroundColor: isActive ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.02)',
                  borderColor: isActive ? `rgba(${rgb}, 0.4)` : 'rgba(255,255,255,0.05)',
                  color: isActive ? `rgb(${rgb})` : '#666'
                }}
              >
                {getIcon(domain.icon, 32)}
                {isActive && (
                   <div className="absolute inset-0 blur-xl opacity-40 animate-pulse" style={{ backgroundColor: `rgb(${rgb})` }} />
                )}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black transition-colors duration-500 mb-2" style={{ color: isActive ? '#fff' : '#d4d4d4' }}>
                  {domain.label}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors duration-500 max-w-[200px] mx-auto line-clamp-2">
                  {domain.description}
                </p>
              </div>

              {/* Decorative Corner Elements */}
              <div 
                className="absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-500 opacity-20 group-hover:opacity-100 group-hover:scale-150"
                style={{ backgroundColor: `rgb(${rgb})` }}
              />
              <div 
                className="absolute bottom-4 left-4 w-8 h-1 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: `rgba(${rgb}, 0.3)` }}
              />

              {/* Grid Numbering */}
              <span className="absolute top-6 left-6 text-[10px] font-mono text-neutral-800 font-bold group-hover:text-neutral-700 transition-colors">
                IDX-0{index + 1}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }
        .animate-progress { animation: progress 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default DomainSelectionView;
