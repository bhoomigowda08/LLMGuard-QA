import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { EyeOff, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

const ContextLeakage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeakage = async () => {
      try {
        const res = await api.get('/evaluations/leakage');
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeakage();
  }, []);

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case 'Safe':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Potential Leakage':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Leakage Detected':
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const avgPrivacy = records.length > 0
    ? Math.round((records.reduce((acc, r) => acc + r.privacy_score, 0) / records.length) * 100)
    : 96;

  const leakageCases = records.filter(r => r.evaluation_result !== 'Safe').length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Context Leakage Detector</h1>
        <p className="text-sm text-slate-400 mt-1">
          Scans outputs for system instructions, conversation logs, or private cryptographic tokens that bleed into subsequent generations.
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandblue"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Privacy Isolation Score</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{avgPrivacy}%</span>
          <span className="text-[10px] text-slate-500 block mt-2">Overall guardrail privacy consistency</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Detected Bleed Incidents</span>
          <span className="text-3xl font-extrabold text-red-400 block mt-2">{leakageCases}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Leaks requiring prompt re-tuning</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandpurple"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Audited Prompt Runs</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{records.length}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Total privacy audits stored</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-darkborder flex justify-between items-center bg-darkcard/20">
          <h3 className="text-sm font-bold text-slate-200">Context Leakage Log History</h3>
          <span className="text-xs text-slate-500 font-mono">Bleed trace logs</span>
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
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getVerdictStyle(rec.evaluation_result)}`}>
                      {rec.evaluation_result}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">
                      Privacy Index: <strong className="text-slate-200">{Math.round(rec.privacy_score * 100)}%</strong>
                    </span>
                    <span className="text-slate-500 pl-4 border-l border-darkborder">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-darkbg/50 p-3 rounded-lg border border-darkborder">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Injected System Context:</div>
                    <p className="text-xs text-slate-400 mt-1 italic font-mono">"{rec.system_context}"</p>
                  </div>
                  <div className="bg-darkbg/50 p-3 rounded-lg border border-darkborder">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Isolation Audit Verdict:</div>
                    <p className="text-xs text-slate-300 mt-1">{rec.reasoning}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              No context leakage checks performed yet. Submit a prompt with custom system context triggers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextLeakage;
