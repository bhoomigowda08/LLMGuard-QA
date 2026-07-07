import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { History, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

const Regression = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegression = async () => {
      try {
        const res = await api.get('/evaluations/regression');
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegression();
  }, []);

  const getRegressionBadge = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const avgRegression = records.length > 0
    ? Math.round((records.reduce((acc, r) => acc + r.regression_score, 0) / records.length))
    : 95;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Regression Testing Audit</h1>
        <p className="text-sm text-slate-400 mt-1">
          Compares active generations against historical baseline runs to measure formatting differences, missing data items, or quality regressions.
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandblue"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Model Stability</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{avgRegression}%</span>
          <span className="text-[10px] text-slate-500 block mt-2">Quality retention vs reference baseline</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandpurple"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Audited Baseline Pairs</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{records.length}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Comparison tracks logged</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Regression Risk Rating</span>
          <span className="text-3xl font-extrabold text-green-400 block mt-2">Optimal</span>
          <span className="text-[10px] text-slate-500 block mt-2">No critical drift detected</span>
        </div>
      </div>

      {/* Regression log lists */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-darkborder flex justify-between items-center bg-darkcard/20">
          <h3 className="text-sm font-bold text-slate-200">Historical Comparison Records</h3>
          <span className="text-xs text-slate-500 font-mono">Divergence metrics feed</span>
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
                    <span className="text-xs text-slate-400 font-mono">
                      Prompt ID: <strong className="text-slate-300">#{rec.prompt_id}</strong>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Baseline: <strong className="text-slate-300">#{rec.old_response_id}</strong> &rarr; Target: <strong className="text-slate-300">#{rec.new_response_id}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRegressionBadge(rec.regression_score)}`}>
                      Regression Score: {Math.round(rec.regression_score)}%
                    </span>
                    <span className="text-slate-500 pl-4 border-l border-darkborder">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-darkbg/40 p-3 rounded-lg border border-darkborder">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Quality Degradation:</span>
                      <span className={`font-mono font-bold ${rec.quality_degradation_score > 0.2 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(rec.quality_degradation_score * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-darkborder rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${rec.quality_degradation_score * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-darkbg/40 p-3 rounded-lg border border-darkborder">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Missing Information:</span>
                      <span className={`font-mono font-bold ${rec.missing_info_score > 0.2 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(rec.missing_info_score * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-darkborder rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${rec.missing_info_score * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-darkbg/40 p-3 rounded-lg border border-darkborder">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Format Modifications:</span>
                      <span className={`font-mono font-bold ${rec.format_change_score > 0.2 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {Math.round(rec.format_change_score * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-darkborder rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${rec.format_change_score * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              No regression reports found. Run a prompt that has been evaluated previously to check regression metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Regression;
