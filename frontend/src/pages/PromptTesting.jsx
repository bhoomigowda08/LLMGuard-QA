import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { 
  Play, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Bug,
  HelpCircle,
  Clock,
  Settings
} from 'lucide-react';

const PromptTesting = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptCategory, setNewPromptCategory] = useState('Factual');
  const [csvFile, setCsvFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [error, setError] = useState('');
  const [executingPromptId, setExecutingPromptId] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [temperature, setTemperature] = useState(0.7);

  const categories = ["Factual", "Creative", "Reasoning", "Coding", "Summarization", "Translation", "Sensitive", "Safety"];

  const fetchPrompts = async () => {
    try {
      const res = await api.get('/prompts', {
        params: {
          q: search || undefined,
          category: selectedCategory || undefined
        }
      });
      setPrompts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve prompts library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [search, selectedCategory]);

  const handleAddPrompt = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPromptText.trim()) return;

    try {
      const res = await api.post('/prompts', {
        prompt_text: newPromptText,
        category: newPromptCategory
      });
      setPrompts([res.data, ...prompts]);
      setNewPromptText('');
      setUploadMsg('Prompt successfully saved.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create prompt');
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    setError('');
    setUploadMsg('');
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await api.post('/prompts/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadMsg(res.data.message);
      setCsvFile(null);
      fetchPrompts();
    } catch (err) {
      setError(err.response?.data?.detail || 'CSV upload failed');
    }
  };

  const handleRunPipeline = async (promptId) => {
    setExecutingPromptId(promptId);
    setRunResult(null);
    setError('');
    try {
      const res = await api.post(`/prompts/${promptId}/run`, null, {
        params: { temperature }
      });
      setRunResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'QA pipeline execution failed.');
    } finally {
      setExecutingPromptId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Prompt Execution & Testing</h1>
        <p className="text-sm text-slate-400 mt-1">Submit manual prompts or upload datasets, configure hyper-parameters, and trigger the evaluation pipeline.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{uploadMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Create / Upload Prompt Forms */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Manual creation */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Submit New Prompt</h3>
            
            <form onSubmit={handleAddPrompt} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Prompt Content</label>
                <textarea
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="Explain the differences between REST and gRPC..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200 resize-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Category</label>
                <select
                  value={newPromptCategory}
                  onChange={(e) => setNewPromptCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-brandblue hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} /> Add to Library
              </button>
            </form>
          </div>

          {/* Batch upload */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Batch Upload via CSV</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              File must contain header <code className="bg-darkbg px-1 py-0.5 rounded">prompt</code> and optionally <code className="bg-darkbg px-1 py-0.5 rounded">category</code>.
            </p>

            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div className="border border-dashed border-darkborder rounded-lg p-6 text-center hover:border-brandblue/50 transition-colors relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-500 mb-2" size={24} />
                <span className="text-xs text-slate-400 font-medium block">
                  {csvFile ? csvFile.name : 'Select or drop CSV file'}
                </span>
              </div>

              <button
                type="submit"
                disabled={!csvFile}
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-darkborder hover:bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Upload size={16} /> Upload Dataset
              </button>
            </form>
          </div>

          {/* Prompt configs */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Settings size={16} className="text-brandblue" /> Configuration Settings
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase">Temperature</span>
                <span className="font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-brandblue"
              />
              <span className="text-[10px] text-slate-500 block">Lower temperature values force deterministic answers. Higher values encourage creative drift.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Prompts Library Table & Running results */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Run output panel */}
          {runResult && (
            <div className="glass-panel p-6 rounded-xl border-brandblue/30 space-y-4 bg-brandblue/5 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-darkborder/50">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" /> Pipeline Evaluation Complete
                </h3>
                <span className="text-xs font-mono text-slate-500">Model: {runResult.response.model_name}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-semibold uppercase">Response:</span>
                <p className="bg-darkbg p-4 rounded-lg text-sm text-slate-200 whitespace-pre-line border border-darkborder">
                  {runResult.response.response_text}
                </p>
              </div>

              {/* Evaluation score summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-darkbg/50 p-3 rounded-lg border border-darkborder">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Hallucination Accuracy</span>
                  <div className="text-lg font-bold text-white mt-1 flex justify-between">
                    <span>{runResult.hallucination.accuracy_score * 100}%</span>
                    <span className={`text-xs ${runResult.hallucination.evaluation === 'Correct' ? 'text-green-400' : 'text-red-400'}`}>
                      {runResult.hallucination.evaluation}
                    </span>
                  </div>
                </div>

                <div className="bg-darkbg/50 p-3 rounded-lg border border-darkborder">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Safety Score</span>
                  <div className="text-lg font-bold text-white mt-1 flex justify-between">
                    <span>{runResult.safety.safety_score * 100}%</span>
                    <span className={`text-xs ${runResult.safety.risk_level === 'Low' ? 'text-green-400' : 'text-red-400'}`}>
                      {runResult.safety.risk_level} Risk
                    </span>
                  </div>
                </div>

                <div className="bg-darkbg/50 p-3 rounded-lg border border-darkborder">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Privacy Score</span>
                  <div className="text-lg font-bold text-white mt-1 flex justify-between">
                    <span>{runResult.leakage.privacy_score * 100}%</span>
                    <span className={`text-xs ${runResult.leakage.evaluation_result === 'Safe' ? 'text-green-400' : 'text-amber-400'}`}>
                      {runResult.leakage.evaluation_result}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bug Created Notice */}
              {runResult.bug_created && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <div className="flex items-center gap-2">
                    <Bug size={16} />
                    <span>Quality failures detected. Automatically created bug ticket: <strong>{runResult.bug_uuid}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompts table list */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-darkborder flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-sm font-bold text-slate-200">Prompts Library</h3>
              
              {/* Search & filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search prompts..."
                    className="pl-8 pr-3 py-1.5 w-40 sm:w-48 text-xs rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[480px]">
              {loading ? (
                <div className="py-20 text-center text-slate-400">Loading library...</div>
              ) : prompts.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-darkborder/50 text-[10px] uppercase text-slate-400 font-mono tracking-wider bg-darkcard/30">
                      <th className="py-3 px-6">Prompt Text</th>
                      <th className="py-3 px-6">Category</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-darkborder/30 text-sm text-slate-300">
                    {prompts.map((p) => (
                      <tr key={p.id} className="hover:bg-darkcard/10 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-200 truncate max-w-xs">{p.prompt_text}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-darkborder text-slate-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleRunPipeline(p.id)}
                            disabled={executingPromptId === p.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brandblue/10 hover:bg-brandblue/20 text-brandblue transition-all disabled:opacity-50"
                          >
                            <Play size={12} className={executingPromptId === p.id ? 'animate-spin' : ''} />
                            {executingPromptId === p.id ? 'Running...' : 'Run Pipeline'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center text-slate-500 text-sm">
                  No prompts found in search criteria. Submit a new prompt using the forms.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptTesting;
