import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { ShieldAlert, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

const SafetyAnalysis = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafety = async () => {
      try {
        const res = await api.get('/evaluations/safety');
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSafety();
  }, []);

  const getRiskStyle = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'High':
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const avgSafety = records.length > 0
    ? Math.round((records.reduce((acc, r) => acc + r.safety_score, 0) / records.length) * 100)
    : 97;

  const highRisks = records.filter(r => r.risk_level === 'High').length;
  const mediumRisks = records.filter(r => r.risk_level === 'Medium').length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Safety & Content Moderation</h1>
        <p className="text-sm text-slate-400 mt-1">
          Scans generated responses for toxicity, hate speech, biased reasoning, or unsafe advice, assigning risk classification markers.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandblue"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Safety Index Rating</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{avgSafety}%</span>
          <span className="text-[10px] text-slate-500 block mt-2">Overall model alignment score</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">High Risk Breaches</span>
          <span className="text-3xl font-extrabold text-red-400 block mt-2">{highRisks}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Severe safety boundary violations</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Medium Risk Alerts</span>
          <span className="text-3xl font-extrabold text-amber-400 block mt-2">{mediumRisks}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Suspect/biased phrasing alerts</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Audits Ran</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{records.length}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Model response checks stored</span>
        </div>
      </div>

      {/* Safety Logs Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-darkborder flex justify-between items-center bg-darkcard/20">
          <h3 className="text-sm font-bold text-slate-200">Safety Verification Records</h3>
          <span className="text-xs text-slate-500 font-mono">Real-time moderation feeds</span>
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
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRiskStyle(rec.risk_level)}`}>
                      {rec.risk_level} Risk
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">
                      Safety Index: <strong className="text-slate-200">{Math.round(rec.safety_score * 100)}%</strong>
                    </span>
                    <span className="text-slate-500 pl-4 border-l border-darkborder">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-darkbg/40 p-3 rounded-lg border border-darkborder">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Toxicity Index:</span>
                      <span className={`font-mono font-bold ${rec.toxicity_score > 0.3 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(rec.toxicity_score * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-darkborder rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${rec.toxicity_score * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-darkbg/40 p-3 rounded-lg border border-darkborder">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Harmful Content:</span>
                      <span className={`font-mono font-bold ${rec.harmful_score > 0.3 ? 'text-red-400' : 'text-slate-300'}`}>
                        {Math.round(rec.harmful_score * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-darkborder rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${rec.harmful_score * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-darkbg/40 p-3 rounded-lg border border-darkborder">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Bias / Opinion drift:</span>
                      <span className={`font-mono font-bold ${rec.bias_score > 0.3 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {Math.round(rec.bias_score * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-darkborder rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${rec.bias_score * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              No safety records logged. Run tests to perform automatic safety and content moderation checks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyAnalysis;
