import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import ChartWidget from '../components/ChartWidget';
import { 
  Play, 
  HelpCircle, 
  ShieldAlert, 
  EyeOff, 
  Percent, 
  CheckCircle,
  Activity,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Could not connect to FastAPI server. Please check that the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandblue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-xl border-red-500/20 text-center space-y-3">
        <AlertCircle size={40} className="text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Connection Error</h3>
        <p className="text-sm text-slate-400">{error}</p>
        <div className="text-xs text-slate-500 font-mono">
          Run: <code className="bg-darkbg px-2 py-1 rounded">uvicorn main:app --reload</code> in backend folder
        </div>
      </div>
    );
  }

  // Format Doughnut Data (Pass vs Failure)
  const passFailData = {
    labels: ['Passed Tests', 'Failed Tests'],
    datasets: [
      {
        data: [data.pass_rate, data.failure_rate],
        backgroundColor: ['rgba(34, 197, 94, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#121824', '#121824'],
        borderWidth: 2,
      },
    ],
  };

  // Format Bar Data (Category Counts)
  const categories = Object.keys(data.category_counts);
  const categoryValues = Object.values(data.category_counts);
  const categoryChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Prompts Count',
        data: categoryValues,
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Format Line Data (Test Runs Over Time)
  const timelineDates = data.timeline.map((t) => t.date);
  const timelineCounts = data.timeline.map((t) => t.tests);
  const timelineChartData = {
    labels: timelineDates,
    datasets: [
      {
        fill: true,
        label: 'Runs Executed',
        data: timelineCounts,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6',
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">QA Metrics Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time non-deterministic quality assurance testing metrics for generative LLMs.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tests Run"
          value={data.total_tests}
          icon={Play}
          description="Total prompts submitted"
          trend="Aggregate"
          trendType="neutral"
        />
        <StatCard
          title="Hallucinations Found"
          value={data.hallucinations_found}
          icon={HelpCircle}
          description="Factual precision failures"
          trend={`${data.total_tests > 0 ? round((data.hallucinations_found / data.total_tests) * 100, 1) : 0}%`}
          trendType={data.hallucinations_found > 0 ? 'negative' : 'positive'}
        />
        <StatCard
          title="Safety Issues Alerted"
          value={data.safety_issues}
          icon={ShieldAlert}
          description="Toxicity/Harm filter failures"
          trend={`${data.safety_issues} cases`}
          trendType={data.safety_issues > 0 ? 'negative' : 'positive'}
        />
        <StatCard
          title="Context Leakage Detected"
          value={data.leakage_cases}
          icon={EyeOff}
          description="Privacy isolation leaks"
          trend="Compliance"
          trendType={data.leakage_cases > 0 ? 'negative' : 'positive'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartWidget
          type="doughnut"
          data={passFailData}
          title="Overall Pass vs Failure Rate"
        />
        <ChartWidget
          type="bar"
          data={categoryChartData}
          title="Prompt Counts by Category"
        />
        <ChartWidget
          type="line"
          data={timelineChartData}
          title="Test Executions Timeline"
        />
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-darkborder flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-200">Recent Automated Activities</h3>
          <span className="text-xs font-mono text-brandblue px-2 py-0.5 rounded-full bg-brandblue/10">
            Realtime Audit Log
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {data.recent_activity.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-darkborder/50 text-[10px] uppercase text-slate-400 font-mono tracking-wider bg-darkcard/30">
                  <th className="py-4 px-6">Prompt Preview</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Verdict Status</th>
                  <th className="py-4 px-6">Risk Factor</th>
                  <th className="py-4 px-6">Execution Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkborder/30 text-sm text-slate-300">
                {data.recent_activity.map((act, index) => (
                  <tr key={index} className="hover:bg-darkcard/25 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-200">{act.prompt_text}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-darkborder text-slate-300">
                        {act.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                        act.verdict === 'Passed' ? 'text-green-400' :
                        act.verdict === 'Unsafe' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        <CheckCircle size={12} className={act.verdict === 'Passed' ? '' : 'hidden'} />
                        {act.verdict}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        act.risk_level === 'High' ? 'text-red-400 bg-red-500/10' :
                        act.risk_level === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                        'text-green-400 bg-green-500/10'
                      }`}>
                        {act.risk_level} Risk
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                      {new Date(act.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              No tests executed yet. Go to <span className="text-brandblue font-semibold">Prompt Testing</span> to trigger evaluations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple math helper
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export default Dashboard;
