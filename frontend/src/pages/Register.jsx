import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tester');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password) {
      setError('Please fill in all registration fields');
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password, role);
      // Navigate to login with success parameter
      navigate('/login');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbg flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] right-[20%] w-[60%] h-[60%] rounded-full bg-brandpurple/5 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl relative z-10 border border-darkborder/85">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 bg-brandpurple/10 rounded-xl text-brandpurple mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-sm text-slate-400 mt-1.5">Join the LLMGuard QA testing pool</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandpurple focus:outline-none text-slate-200 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@llmguard.qa"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandpurple focus:outline-none text-slate-200 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandpurple focus:outline-none text-slate-200 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Assign Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Shield size={18} />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandpurple focus:outline-none text-slate-300 text-sm transition-colors appearance-none"
                >
                  <option value="tester">QA Tester (Standard Permissions)</option>
                  <option value="admin">QA Administrator (Full Privileges)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg text-sm font-bold bg-brandpurple hover:bg-purple-600 text-white shadow-lg shadow-brandpurple/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-darkborder/50 text-center">
            <span className="text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-brandpurple hover:underline">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
