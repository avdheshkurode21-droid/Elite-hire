
import React, { useState } from 'react';
import { UserData } from '../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

interface LoginViewProps {
  onLogin: (data: UserData) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
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

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* LEFT SIDE: Branding */}
      <div className="w-full md:w-1/2 bg-neutral-950 p-8 md:p-16 flex flex-col justify-center relative">
        <div className="absolute top-10 left-10">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            EliteHire AI
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Professional Hiring, <span className="text-indigo-500">Redefined.</span>
          </h1>
          <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
            Our AI-powered platform helps the world's leading companies identify top talent through dynamic, domain-specific intelligence.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, text: "Instant AI Evaluation" },
              { icon: Globe, text: "Global Recruitment Standards" },
              { icon: CheckCircle2, text: "Verified Domain Expertise" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl group-hover:border-indigo-500 transition-colors">
                  <item.icon className="text-indigo-400" size={20} />
                </div>
                <span className="text-neutral-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* RIGHT SIDE: Portal */}
      <div className="w-full md:w-1/2 bg-neutral-900/50 backdrop-blur-sm p-8 md:p-16 flex flex-col justify-center border-l border-neutral-800/50">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Candidate Portal</h2>
            <p className="text-neutral-500">Please enter your registration details to proceed to the evaluation.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Wrapper */}
            {[
              { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Alexander Pierce' },
              { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
              { id: 'idNo', label: 'Registration / ID Number', type: 'text', placeholder: 'ID-XXXX-XXXX' }
            ].map((field) => (
              <div key={field.id} className="relative group">
                <label htmlFor={field.id} className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-400">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleInputChange}
                    onFocus={() => setFocusStates(prev => ({ ...prev, [field.id]: true }))}
                    onBlur={() => setFocusStates(prev => ({ ...prev, [field.id]: false }))}
                    placeholder={field.placeholder}
                    className={`
                      w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 outline-none
                      ${formData[field.id as keyof typeof formData].length > 0 || focusStates[field.id as keyof typeof focusStates]
                        ? 'bg-white text-neutral-900 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                        : 'bg-neutral-950 text-white border-neutral-800 hover:border-neutral-700'
                      }
                    `}
                    required
                  />
                  
                  {/* Validation Tick Pop-up */}
                  <div className={`
                    absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-500 transform
                    ${isValid(field.id as keyof typeof formData) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                  `}>
                    <div className="bg-emerald-500 p-1 rounded-full shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={!(isValid('fullName') && isValid('phone') && isValid('idNo'))}
              className={`
                w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300
                ${(isValid('fullName') && isValid('phone') && isValid('idNo'))
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 translate-y-0 active:scale-95'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed translate-y-0'
                }
              `}
            >
              Proceed to Domain Selection
              <ArrowRight size={20} className={isValid('fullName') && isValid('phone') && isValid('idNo') ? 'animate-bounce-x' : ''} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-600">
            By proceeding, you agree to our Terms of Service and Data Handling policies for the Imagine Cup evaluation.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginView;
