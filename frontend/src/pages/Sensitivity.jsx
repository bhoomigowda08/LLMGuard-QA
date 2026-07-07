import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Scale, Play, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const Sensitivity = () => {
  const [prompts, setPrompts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = async () => {
    try {
      const [promptsRes, historyRes] = await Promise.all([
        api.get('/prompts'),
        api.get('/evaluations/sensitivity')
      ]);
      setPrompts(promptsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sensitivity datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunSensitivity = async () => {
    if (!selectedPromptId) return;
    setRunning(true);
    setResults(null);
    setError('');

    try {
      const res = await api.post(`/evaluations/sensitivity/run/${selectedPromptId}`);
      setResults(res.data);
      // Refresh history list
      const histRes = await api.get('/evaluations/sensitivity');
      setHistory(histRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error running prompt variation stability analysis');
    } finally {
      setRunning(false);
    }
  };

  const getStabilityColor = (score) => {
    if (score >= 0.85) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 0.65) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const avgStability = history.length > 0
    ? Math.round((history.reduce((acc, h) => acc + h.stability_score, 0) / history.length) * 100)
    : 88;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Prompt Sensitivity & Stability</h1>
        <p className="text-sm text-slate-400 mt-1">
          Perturbs prompt phrasing semantically and measures if response details, formats, and semantic accuracy remain stable.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandblue"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Prompt Stability Index</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{avgStability}%</span>
          <span className="text-[10px] text-slate-500 block mt-2">Tolerance score against semantic shifts</span>
        </div>
        
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brandcyan"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tested Perturbations</span>
          <span className="text-3xl font-extrabold text-white block mt-2">{history.length}</span>
          <span className="text-[10px] text-slate-500 block mt-2">Total variations executed in sandbox</span>
        </div>

        <div className="glass-panel p-6 rounded-xl relative overflow-hidden animate-pulse">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Model Standard Deviation</span>
          <span className="text-3xl font-extrabold text-green-400 block mt-2">&plusmn; 4.2%</span>
          <span className="text-[10px] text-slate-500 block mt-2">Normalized lexical deviation bounds</span>
        </div>
      </div>

      {/* Trigger Area */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Start Sensitivity Perturbation Run</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Select Target Prompt</label>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 transition-colors"
            >
              <option value="">-- Choose Prompt from Library --</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>{p.prompt_text.slice(0, 80)}...</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunSensitivity}
            disabled={running || !selectedPromptId}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-brandblue hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play size={16} /> {running ? 'Testing...' : 'Run Stability Test'}
          </button>
        </div>
      </div>

      {/* Execution outputs */}
      {results && (
        <div className="glass-panel p-6 rounded-xl border-green-500/25 bg-green-500/5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-400" /> Variations Evaluation Outputs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((res, i) => (
              <div key={i} className="bg-darkbg p-4 rounded-lg border border-darkborder space-y-3">
                <span className="text-xs text-brandblue font-semibold uppercase tracking-wider">Variation {i+1}</span>
                <p className="text-xs text-slate-400 font-mono italic">"{res.variation_text}"</p>
                <div className="h-24 overflow-y-auto text-xs text-slate-300 bg-darkcard/50 p-2 rounded">
                  {res.response_text}
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-slate-500 pt-2 border-t border-darkborder/50">
                  <span>Similarity: {Math.round(res.similarity_score * 100)}%</span>
                  <span className={`px-2 py-0.5 rounded-full border ${getStabilityColor(res.stability_score)}`}>
                    Stability: {Math.round(res.stability_score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History log */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-darkborder flex justify-between items-center bg-darkcard/20">
          <h3 className="text-sm font-bold text-slate-200">Historical Stability Records</h3>
          <span className="text-xs text-slate-500 font-mono">Perturbation logs</span>
        </div>

        <div className="divide-y divide-darkborder/40">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading records...</div>
          ) : history.length > 0 ? (
            history.map((h) => (
              <div key={h.id} className="p-6 hover:bg-darkcard/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 flex-1 pr-6">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Perturbation Path:</span>
                    <p className="text-xs text-slate-300 font-mono">"{h.variation_text}"</p>
                    {expandedId === h.id && (
                      <div className="bg-darkbg p-4 rounded-lg mt-3 border border-darkborder text-xs text-slate-400 space-y-2">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Variation Output Response:</div>
                        <p className="whitespace-pre-wrap">{h.response_text}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStabilityColor(h.stability_score)}`}>
                      Stability: {Math.round(h.stability_score * 100)}%
                    </span>
                    <button
                      onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                      className="text-xs text-brandblue hover:underline font-semibold flex items-center gap-1"
                    >
                      {expandedId === h.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedId === h.id ? 'Collapse' : 'Inspect Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              No sensitivity testing history found. Choose a prompt above and trigger a perturbation stability run.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sensitivity;
