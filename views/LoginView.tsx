
import React, { useState } from 'react';
import { UserData, Language } from '../types';
import { CheckCircle2, ArrowRight, Zap, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface LoginViewProps {
  onLogin: (data: UserData) => void;
  language: Language;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, language }) => {
  const t = TRANSLATIONS[language].login;
  const common = TRANSLATIONS[language].common;
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idNo: ''
  });

  const [focusStates, setFocusStates] = useState({
    fullName: false,
    phone: false,
    idNo: false
  });

  const isValid = (field: keyof typeof formData) => {
    if (field === 'fullName') return formData.fullName.trim().length > 3;
    if (field === 'phone') return formData.phone.length >= 10;
    if (field === 'idNo') return formData.idNo.length >= 4;
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid('fullName') && isValid('phone') && isValid('idNo')) {
      onLogin(formData);
    }
  };

  const OrbionLogo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 px-6 py-2.5 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl inline-flex animate-in fade-in slide-in-from-top-4 duration-1000 ${className}`}>
      <span className="text-[10px] font-black tracking-[0.4em] text-neutral-600 uppercase">{common.poweredBy}</span>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
        <span className="text-xs font-black tracking-[0.2em] text-white">ORBION</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden relative bg-neutral-950">
      {/* Visual Accent Panel */}
      <div className="hidden md:flex w-1/4 p-12 flex-col justify-end relative overflow-hidden border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse"></div>
        </div>
        <div className="relative z-10">
          <div className="space-y-6">
            {[
              { icon: Zap, text: t.features[0], color: 'text-amber-400' },
              { icon: Globe, text: t.features[1], color: 'text-indigo-400' },
              { icon: CheckCircle2, text: t.features[2], color: 'text-emerald-400' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <item.icon className={item.color} size={16} />
                <span className="text-neutral-600 text-[9px] font-black uppercase tracking-[0.2em]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Registration Portal */}
      <div className="flex-1 p-8 md:p-24 flex flex-col justify-center bg-neutral-900/20 backdrop-blur-md">
        <div className="max-w-5xl w-full mx-auto">
          {/* Top Integrated Header Section */}
          <div className="mb-20 flex flex-col lg:flex-row lg:items-center gap-10 border-b border-white/5 pb-16">
            <div className="flex-1">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Professional<br/>
                Hiring,<br/>
                <span className="text-indigo-500">Redefined.</span>
              </h1>
            </div>
            
            <div className="lg:w-px lg:h-48 bg-white/10 hidden lg:block"></div>
            
            <div className="lg:max-w-xs shrink-0 pt-4">
               <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-4 flex items-center gap-3">
                 <div className="w-2 h-8 bg-indigo-500"></div>
                 {t.portalTitle}
               </h2>
               <p className="text-neutral-500 font-medium text-sm leading-relaxed max-w-xs">
                 {t.portalSub}
               </p>
            </div>
          </div>

          {/* Input Fields placed "downward" from the slogan and portal title */}
          <div className="max-w-xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="md:col-span-2 relative group">
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="fullName" className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] group-focus-within:text-indigo-500 transition-colors">
                    {t.fields.name}
                  </label>
                  {isValid('fullName') && <CheckCircle2 size={12} className="text-emerald-500" />}
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onFocus={() => setFocusStates(prev => ({ ...prev, fullName: true }))}
                  onBlur={() => setFocusStates(prev => ({ ...prev, fullName: false }))}
                  placeholder="e.g. MARCUS AURELIUS"
                  className={`
                    w-full bg-neutral-950 px-8 py-6 rounded-2xl border transition-all duration-500 outline-none font-bold text-sm
                    ${formData.fullName.length > 0 || focusStates.fullName
                      ? 'border-indigo-500/50 text-white shadow-[0_0_25px_rgba(99,102,241,0.08)]' 
                      : 'border-white/5 text-neutral-500 hover:border-white/10'
                    }
                  `}
                />
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="phone" className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] group-focus-within:text-indigo-500 transition-colors">
                    {t.fields.phone}
                  </label>
                  {isValid('phone') && <CheckCircle2 size={12} className="text-emerald-500" />}
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusStates(prev => ({ ...prev, phone: true }))}
                  onBlur={() => setFocusStates(prev => ({ ...prev, phone: false }))}
                  placeholder="+1 (555) 000-0000"
                  className={`
                    w-full bg-neutral-950 px-8 py-6 rounded-2xl border transition-all duration-500 outline-none font-bold text-sm
                    ${formData.phone.length > 0 || focusStates.phone
                      ? 'border-indigo-500/50 text-white shadow-[0_0_25px_rgba(99,102,241,0.08)]' 
                      : 'border-white/5 text-neutral-500 hover:border-white/10'
                    }
                  `}
                />
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="idNo" className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] group-focus-within:text-indigo-500 transition-colors">
                    {t.fields.id}
                  </label>
                  {isValid('idNo') && <CheckCircle2 size={12} className="text-emerald-500" />}
                </div>
                <input
                  id="idNo"
                  name="idNo"
                  type="text"
                  value={formData.idNo}
                  onChange={handleInputChange}
                  onFocus={() => setFocusStates(prev => ({ ...prev, idNo: true }))}
                  onBlur={() => setFocusStates(prev => ({ ...prev, idNo: false }))}
                  placeholder="ID-XXXX-XXXX"
                  className={`
                    w-full bg-neutral-950 px-8 py-6 rounded-2xl border transition-all duration-500 outline-none font-bold text-sm
                    ${formData.idNo.length > 0 || focusStates.idNo
                      ? 'border-indigo-500/50 text-white shadow-[0_0_25px_rgba(99,102,241,0.08)]' 
                      : 'border-white/5 text-neutral-500 hover:border-white/10'
                    }
                  `}
                />
              </div>

              <div className="md:col-span-2 pt-6">
                <button
                  type="submit"
                  disabled={!(isValid('fullName') && isValid('phone') && isValid('idNo'))}
                  className={`
                    w-full py-7 rounded-3xl font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-5 transition-all duration-700 relative overflow-hidden group
                    ${(isValid('fullName') && isValid('phone') && isValid('idNo'))
                      ? 'bg-white text-neutral-950 shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:scale-[1.01] active:scale-95'
                      : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="relative z-10">{t.button}</span>
                  <ArrowRight size={20} className={`relative z-10 transition-transform duration-500 ${isValid('fullName') && isValid('phone') && isValid('idNo') ? 'group-hover:translate-x-3' : ''}`} />
                  {isValid('fullName') && isValid('phone') && isValid('idNo') && (
                    <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-20 flex justify-start opacity-30">
              <OrbionLogo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
