import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Activity, Play, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const Consistency = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [runs, setRuns] = useState(3);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await api.get('/prompts');
        setPrompts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load prompts list');
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleRunConsistency = async () => {
    if (!selectedPromptId) return;
    setRunning(true);
    setResults(null);
    setError('');

    try {
      const res = await api.post(`/evaluations/consistency/run/${selectedPromptId}`, null, {
        params: { runs }
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Consistency execution failed');
    } finally {
      setRunning(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Response Consistency Testing</h1>
        <p className="text-sm text-slate-400 mt-1">
          Executes the identical prompt in parallel loops (using high temperature levels) and calculates lexical consistency, output variability, and drift patterns.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Trigger Form */}
      <div className="glass-panel p-6 rounded-xl space-y-5">
        <h3 className="text-sm font-bold text-slate-200">Consistency Sandbox Runner</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Choose Prompt to Evaluate</label>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 transition-colors"
            >
              <option value="">-- Choose Prompt --</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>{p.prompt_text.slice(0, 90)}...</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Execution Loops (Runs)</label>
            <select
              value={runs}
              onChange={(e) => setRuns(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 transition-colors"
            >
              <option value="2">2 Runs</option>
              <option value="3">3 Runs (Recommended)</option>
              <option value="4">4 Runs</option>
              <option value="5">5 Runs</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRunConsistency}
          disabled={running || !selectedPromptId}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold bg-brandblue hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {running ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
          {running ? 'Executing Iterated Runs...' : 'Trigger Multi-Run Consistency Check'}
        </button>
      </div>

      {/* Results output */}
      {results && (
        <div className="space-y-6">
          
          {/* Summary scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-brandblue/5 p-6 rounded-xl border border-brandblue/20">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Consistency Score</span>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-extrabold px-3 py-1 rounded-lg border ${getScoreColor(results.consistency_score)}`}>
                  {results.consistency_score}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Average Semantic Similarity</span>
              <span className="text-3xl font-extrabold text-white block mt-2">{Math.round(results.similarity * 100)}%</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase block">System Variability Ratio</span>
              <span className="text-3xl font-extrabold text-slate-300 block mt-2">{Math.round(results.variability * 100)}%</span>
            </div>
          </div>

          {/* Loop response blocks */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Iterated Generations Output Outputs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.responses.map((resp, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-xl border-darkborder/80 flex flex-col justify-between space-y-3 relative">
                  <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-slate-500 uppercase">RUN #{idx + 1}</span>
                  <div className="space-y-2 flex-1">
                    <span className="text-xs text-brandblue font-semibold uppercase">Output Data</span>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed h-48 overflow-y-auto bg-darkbg/40 p-3 rounded-lg border border-darkborder/50">
                      {resp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consistency;
