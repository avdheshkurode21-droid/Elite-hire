
import React from 'react';
import { CheckCircle2, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface SuccessViewProps {
  onFinish: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onFinish }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_50%)]">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
            <div className="relative bg-emerald-500 text-white p-6 rounded-full shadow-2xl shadow-emerald-500/50">
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Evaluation Completed!</h1>
        <p className="text-neutral-400 text-lg mb-12 leading-relaxed">
          Your professional assessment is being finalized. Our AI recruitment team will review the detailed transcripts and evaluation summary.
        </p>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 mb-12 text-left space-y-6">
          <div className="flex gap-4">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl h-fit">
              <Calendar className="text-indigo-400" size={20} />
            </div>
            <div>
              <h4 className="font-bold mb-1">Results Timeline</h4>
              <p className="text-sm text-neutral-500">Official results and detailed feedback will be announced within <span className="text-white font-medium">24 hours</span> via your registered phone number.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl h-fit">
              <ShieldCheck className="text-indigo-400" size={20} />
            </div>
            <div>
              <h4 className="font-bold mb-1">Data Verification</h4>
              <p className="text-sm text-neutral-500">Your performance metrics have been securely stored with your Registration ID in our global database for Imagine Cup eligibility.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="group px-10 py-4 bg-white text-neutral-950 font-bold rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-3 mx-auto shadow-xl"
        >
          Return to Candidate Portal
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SuccessView;
