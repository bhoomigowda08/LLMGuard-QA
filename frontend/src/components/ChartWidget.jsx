import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartWidget = ({ type, data, title, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8', // Slate-400
          font: {
            family: 'Inter',
            size: 11
          },
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#121824',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: '#1f293d',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        bodyFont: {
          family: 'Inter'
        }
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          color: '#1f293d', // darkborder
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 10 }
        }
      },
      y: {
        grid: {
          color: '#1f293d',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 10 }
        }
      }
    } : undefined
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className="glass-panel p-6 rounded-xl relative h-80 flex flex-col justify-between transition-all duration-300 hover:border-brandblue/20">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-200 tracking-wide">{title}</h4>
      </div>
      <div className="flex-1 min-h-0 relative">
        {type === 'line' && <Line data={data} options={mergedOptions} />}
        {type === 'bar' && <Bar data={data} options={mergedOptions} />}
        {type === 'doughnut' && <Doughnut data={data} options={mergedOptions} />}
      </div>
    </div>
  );
};

export default ChartWidget;
