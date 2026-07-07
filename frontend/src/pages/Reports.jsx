import React, { useState } from 'react';
import api from '../utils/api';
import { FileText, Table, AlertCircle, Download, CheckCircle2 } from 'lucide-react';

const Reports = () => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get('/reports/pdf', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'llmguard_qa_audit_report.pdf');
      document.body.appendChild(link);
      link.click();
      
      // cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccess('PDF Summary Report generated and downloaded successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch PDF report stream from API server.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloadingCsv(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get('/reports/csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'llmguard_qa_raw_data.csv');
      document.body.appendChild(link);
      link.click();
      
      // cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccess('CSV Dataset Report generated and downloaded successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch CSV spreadsheet stream from API server.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Export QA Audit Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          Export aggregated metrics, average safety benchmarks, hallucination frequencies, and regression scores as professional PDFs or CSVs.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Download Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PDF Block */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-brandblue/20 transition-all duration-300">
          <div className="space-y-3">
            <div className="p-4 bg-brandblue/10 text-brandblue rounded-2xl w-fit">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">PDF Summary Report</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generates a highly structured PDF compiling overall testing pass/fail rates, safety ratings, stability progress indicators, and prompt category distributions. Ideal for team reviews and audit logging.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="w-full py-4 rounded-xl text-sm font-bold bg-brandblue hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-brandblue/10 disabled:opacity-50"
          >
            <Download size={18} />
            {downloadingPdf ? 'Generating PDF...' : 'Download PDF Summary'}
          </button>
        </div>

        {/* CSV Block */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-brandpurple/20 transition-all duration-300">
          <div className="space-y-3">
            <div className="p-4 bg-brandpurple/10 text-brandpurple rounded-2xl w-fit">
              <Table size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">CSV Datasets Export</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Exports the full history of prompts, generations, temperature configurations, token lengths, accuracy verdicts, safety numbers, and timestamps in tabular CSV formatting. Designed for analytical spreadsheet tools.
            </p>
          </div>

          <button
            onClick={handleDownloadCSV}
            disabled={downloadingCsv}
            className="w-full py-4 rounded-xl text-sm font-bold bg-brandpurple hover:bg-purple-600 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-brandpurple/10 disabled:opacity-50"
          >
            <Download size={18} />
            {downloadingCsv ? 'Structuring CSV...' : 'Download CSV Dataset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
