import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, Target, EyeOff, ShieldAlert } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-darkbg text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brandblue/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brandpurple/10 blur-[120px] pointer-events-none"></div>

      {/* Header bar */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-darkborder/40 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brandblue/10 rounded-lg text-brandblue">
            <ShieldCheck size={26} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">LLMGuard QA</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 rounded-lg text-sm font-bold bg-brandblue hover:bg-blue-600 text-white shadow-lg shadow-brandblue/20 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="container mx-auto px-6 py-20 relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brandblue/10 border border-brandblue/20 text-brandblue text-xs font-semibold uppercase tracking-wider">
            <Zap size={14} /> Production-Grade AI testing
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Testing Framework for <br />
            <span className="bg-gradient-to-r from-brandblue via-brandcyan to-brandpurple bg-clip-text text-transparent">
              Generative AI Applications
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Validate non-deterministic LLM responses. Evaluate safety thresholds, semantic variations, context leaks, 
            hallucinations, and regression risks automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-brandblue hover:bg-blue-600 text-white shadow-xl shadow-brandblue/25 hover:shadow-brandblue/40 flex items-center justify-center gap-2 group transition-all duration-200"
            >
              Access QA Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-darkcard border border-darkborder hover:border-slate-600 text-slate-200 hover:text-white transition-all duration-200"
            >
              Create Tester Account
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl mt-24">
          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-2.5 bg-brandblue/10 text-brandblue rounded-lg w-fit">
              <Target size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Hallucination Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify accuracy and reliability percentages using embedding distances and token matching.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-2.5 bg-brandcyan/10 text-brandcyan rounded-lg w-fit">
              <EyeOff size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Context Leakage Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure system-level instructions and private transaction logs never leak into later chat sessions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-2.5 bg-brandpurple/10 text-brandpurple rounded-lg w-fit">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Safety Safeguards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically screen outputs for toxic phrasing, biased suggestions, or harmful requests.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-2.5 bg-green-500/10 text-green-400 rounded-lg w-fit">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Jira Bug Generation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-generate Jira bug logs whenever prompt quality drops below the pass mark.
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="container mx-auto px-6 py-8 border-t border-darkborder/25 relative z-10 text-center text-xs text-slate-500 font-mono">
        &copy; {new Date().getFullYear()} LLMGuard QA. All rights reserved. Designed for Advanced Agentic Testing.
      </footer>
    </div>
  );
};

export default Home;
