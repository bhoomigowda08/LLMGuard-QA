import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShieldCheck, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setForgotMsg('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill in all credentials');
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setForgotMsg('');
    if (!forgotEmail) {
      setError('Please provide your email address');
      return;
    }

    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-darkbg flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-brandblue/5 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 text-brandblue/20 animate-pulse">
          <Sparkles size={64} />
        </div>

        <div className="glass-panel p-8 rounded-2xl shadow-2xl relative z-10 border border-darkborder/80">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 bg-brandblue/10 rounded-xl text-brandblue mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-slate-400 mt-1.5">Sign in to your LLMGuard QA portal</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotMsg && (
            <div className="flex items-center gap-2 p-3.5 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
              <span>{forgotMsg}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-5">
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
                    placeholder="Enter admin or tester username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200 text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setError(''); }}
                    className="text-xs font-medium text-brandblue hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200 text-sm transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg text-sm font-bold bg-brandblue hover:bg-blue-600 text-white shadow-lg shadow-brandblue/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Registered Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@llmguard.qa"
                  className="w-full px-4 py-3 rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200 text-sm transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg text-sm font-bold bg-brandblue hover:bg-blue-600 text-white transition-all duration-200"
              >
                Send Reset Instructions
              </button>

              <button
                type="button"
                onClick={() => { setShowForgot(false); setError(''); setForgotMsg(''); }}
                className="w-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Return to Login
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-darkborder/50 text-center">
            <span className="text-xs text-slate-400">
              New to the platform?{' '}
              <Link to="/register" className="font-bold text-brandblue hover:underline">
                Create an Account
              </Link>
            </span>
          </div>
        </div>
        
        {/* Fast login tips for sandbox testing */}
        <div className="mt-6 text-center text-xs text-slate-500 font-mono">
          Demo Admin: <span className="text-slate-300">admin</span> / password: <span className="text-slate-300">adminpassword</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
