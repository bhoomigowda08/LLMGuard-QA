import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Bug, 
  Trash2, 
  ExternalLink, 
  AlertCircle, 
  Copy, 
  X, 
  Check, 
  Filter, 
  ChevronDown 
} from 'lucide-react';

const BugReports = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [modalJiraContent, setModalJiraContent] = useState('');
  const [modalBugUuid, setModalBugUuid] = useState('');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const fetchBugs = async () => {
    try {
      const res = await api.get('/bug-reports', {
        params: {
          severity: selectedSeverity || undefined,
          status: selectedStatus || undefined
        }
      });
      setBugs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bug reports list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [selectedSeverity, selectedStatus]);

  const handleStatusChange = async (bugId, newStatus) => {
    try {
      await api.put(`/bug-reports/${bugId}`, { status: newStatus });
      setBugs(bugs.map(b => b.id === bugId ? { ...b, status: newStatus } : b));
    } catch (err) {
      setError('Failed to update bug status');
    }
  };

  const handleDeleteBug = async (bugId) => {
    if (!window.confirm("Are you sure you want to delete this bug ticket?")) return;
    try {
      await api.delete(`/bug-reports/${bugId}`);
      setBugs(bugs.filter(b => b.id !== bugId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete bug report');
    }
  };

  const handleExportJira = async (bugId, bugUuid) => {
    try {
      const res = await api.get(`/bug-reports/${bugId}/jira-export`);
      setModalJiraContent(res.data.jira_markdown);
      setModalBugUuid(bugUuid);
      setCopied(false);
    } catch (err) {
      setError('Jira export failed');
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(modalJiraContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (sev) => {
    const colors = {
      Low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
      Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      Critical: 'text-red-400 bg-red-500/10 border-red-500/20'
    }[sev] || 'text-slate-400';

    return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${colors}`}>{sev}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Bug Reports Generator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review automatically created tickets for quality deviations or manually file reports, with instant exports for Jira trackers.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview totals */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Reports</span>
          <span className="text-2xl font-extrabold text-white block mt-1">{bugs.length}</span>
        </div>
        <div className="glass-panel p-5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Open Tickets</span>
          <span className="text-2xl font-extrabold text-red-400 block mt-1">{bugs.filter(b=>b.status==='Open').length}</span>
        </div>
        <div className="glass-panel p-5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">In Progress</span>
          <span className="text-2xl font-extrabold text-amber-400 block mt-1">{bugs.filter(b=>b.status==='In Progress').length}</span>
        </div>
        <div className="glass-panel p-5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Resolved Tickets</span>
          <span className="text-2xl font-extrabold text-green-400 block mt-1">{bugs.filter(b=>b.status==='Resolved').length}</span>
        </div>
      </div>

      {/* Filter and Content list */}
      <div className="space-y-4">
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 transition-colors"
          >
            <option value="">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Bug list */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading bug records...</div>
        ) : bugs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bugs.map((bug) => (
              <div key={bug.id} className="glass-panel p-6 rounded-xl border-darkborder space-y-4 transition-all duration-300 hover:border-brandblue/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-darkborder/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                      <Bug size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">{bug.bug_uuid}</h4>
                      <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Reported on: {new Date(bug.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getSeverityBadge(bug.severity)}

                    {/* Status updater dropdown */}
                    <div className="relative">
                      <select
                        value={bug.status}
                        onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg bg-darkbg border border-darkborder focus:outline-none transition-colors ${
                          bug.status === 'Open' ? 'text-red-400' :
                          bug.status === 'In Progress' ? 'text-amber-400' : 'text-green-400'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleExportJira(bug.id, bug.bug_uuid)}
                      className="p-1.5 text-slate-400 hover:text-brandblue hover:bg-brandblue/10 rounded transition-colors"
                      title="Jira markdown export log"
                    >
                      <ExternalLink size={15} />
                    </button>

                    {/* Delete button (owner or admin) */}
                    {(user?.role === 'admin' || user?.id === bug.user_id) && (
                      <button
                        onClick={() => handleDeleteBug(bug.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete bug ticket"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-darkbg/40 p-3 rounded border border-darkborder">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Expected Output</span>
                    <p className="text-slate-300 leading-normal">{bug.expected_result}</p>
                  </div>
                  <div className="space-y-1 bg-darkbg/40 p-3 rounded border border-darkborder">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Actual Drift Output</span>
                    <p className="text-slate-300 leading-normal">{bug.actual_result}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] w-24">Steps:</span>
                    <span className="text-slate-300 font-mono flex-1 whitespace-pre-wrap">{bug.steps_to_reproduce}</span>
                  </div>
                  {bug.root_cause && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 font-semibold uppercase text-[10px] w-24">Root Cause:</span>
                      <span className="text-slate-300 flex-1">{bug.root_cause}</span>
                    </div>
                  )}
                  {bug.suggested_fix && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 font-semibold uppercase text-[10px] w-24">Remediation:</span>
                      <span className="text-green-400 flex-1">{bug.suggested_fix}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500 text-sm">
            No bug reports found in active filter criteria. Quality failures are auto-logged as bug tickets here.
          </div>
        )}
      </div>

      {/* Jira Modal Popup */}
      {modalJiraContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-darkcard border border-darkborder rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="px-6 py-4 border-b border-darkborder flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Jira Export Markup - {modalBugUuid}</h3>
              <button
                onClick={() => setModalJiraContent('')}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                readOnly
                value={modalJiraContent}
                className="w-full h-80 px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-300 font-mono focus:outline-none resize-none"
              />
            </div>

            <div className="px-6 py-4 border-t border-darkborder bg-darkcard/50 flex justify-end gap-3">
              <button
                onClick={() => setModalJiraContent('')}
                className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white font-medium"
              >
                Close
              </button>
              <button
                onClick={handleCopyClipboard}
                className="px-5 py-2 text-xs rounded-lg bg-brandblue hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugReports;
