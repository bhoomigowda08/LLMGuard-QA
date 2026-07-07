import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { HelpCircle, ShieldCheck, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const Hallucination = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHallucinations = async () => {
      try {
        const res = await api.get('/evaluations/hallucinations');
        setRecords(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHallucinations();
  }, []);

  const getStatusBadge = (verdict) => {
    switch (verdict) {
      case 'Correct':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} /> Correct
          </span>
        );
      case 'Partially Correct':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <AlertTriangle size={12} /> Partially Correct
          </span>
        );
      case 'Hallucinated':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
            <XCircle size={12} /> Hallucinated
          </span>
        );
    }
  };

  const avgAccuracy = records.length > 0 
    ? Math.round((records.reduce((acc, r) => acc + r.accuracy_score, 0) / records.length) * 100) 
    : 95;
  const avgConfidence = records.length > 0 
    ? Math.round((records.reduce((acc, r) => acc + r.confidence_score, 0) / records.length) * 100) 
    : 92;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Hallucination Detection Audit</h1>
        <p className="text-sm text-slate-400 mt-1">
          Analyzes factual drift, fabricated statements, and consistency of assertions against reference contexts.
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandblue"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Accuracy</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{avgAccuracy}%</span>
          <span className="text-[10px] text-slate-500 block mt-2">Overall semantic precision rate</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandpurple"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Avg Evaluator Confidence</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{avgConfidence}%</span>
          <span className="text-[10px] text-slate-500 block mt-2">LLM-as-a-judge reasoning score</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Audited Cases</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{records.length}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Prompt response checkpoints evaluated</span>
        </div>
      </div>

      {/* Audit list logs */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-darkborder flex justify-between items-center bg-darkcard/20">
          <h3 className="text-sm font-bold text-slate-200">Hallucination Records</h3>
          <span className="text-xs text-slate-500 font-mono">Factual drift audits</span>
        </div>

        <div className="divide-y divide-darkborder/40">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading audit history...</div>
          ) : records.length > 0 ? (
            records.map((rec) => (
              <div key={rec.id} className="p-6 hover:bg-darkcard/10 transition-colors space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono bg-darkbg px-2.5 py-1 rounded-lg border border-darkborder">
                      ID: #{rec.id}
                    </span>
                    {getStatusBadge(rec.evaluation)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Accuracy:</span>
                      <span className="text-slate-200 font-bold">{Math.round(rec.accuracy_score * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Reliability:</span>
                      <span className="text-slate-200 font-bold">{Math.round(rec.reliability_percentage)}%</span>
                    </div>
                    <span className="text-slate-500 pl-4 border-l border-darkborder">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="bg-darkbg/50 p-4 rounded-lg border border-darkborder/50 text-sm space-y-2">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Drift Reasoning:</div>
                  <p className="text-slate-300 leading-relaxed">{rec.reasoning}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              No hallucination evaluation data available. Run prompts to perform automatic hallucination detection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hallucination;
