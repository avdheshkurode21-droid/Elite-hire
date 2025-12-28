
import React from 'react';
import { DOMAINS, getIcon } from '../constants';

interface DomainSelectionViewProps {
  onSelect: (domain: string) => void;
  userName: string;
}

const DomainSelectionView: React.FC<DomainSelectionViewProps> = ({ onSelect, userName }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome, <span className="text-indigo-400">{userName.split(' ')[0]}</span>.
        </h1>
        <p className="text-neutral-400 text-lg">
          Select your expertise domain to begin the AI-assisted technical evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {DOMAINS.map((domain) => (
          <button
            key={domain.id}
            onClick={() => onSelect(domain.label)}
            className="group relative flex flex-col text-left p-6 bg-neutral-900 border border-neutral-800 rounded-2xl transition-all duration-300 hover:bg-neutral-800 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="mb-6 p-3 bg-neutral-950 border border-neutral-800 rounded-xl w-fit group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-colors">
              <div className="text-indigo-400 group-hover:text-white transition-colors">
                {getIcon(domain.icon)}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
              {domain.label}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors">
              {domain.description}
            </p>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-indigo-600 rounded-full p-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DomainSelectionView;
