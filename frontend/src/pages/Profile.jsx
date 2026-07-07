import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Shield, UserPlus, Key, Mail, User, AlertCircle, CheckCircle2, ListFilter } from 'lucide-react';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Register user states
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('tester');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      // Wait, let's list users. Since we didn't write an explicit `/users` endpoint in backend,
      // let's create a quick API fetch or just show a nice placeholder table of system parameters,
      // or we can write a quick endpoint inside `/auth` or call auth/me to double-check.
      // Wait, let's write a simple user registration tool, since that's what's requested. We can hit `/auth/signup` to register!
      // This works perfectly because `/auth/signup` is a public endpoint that accepts creating new accounts,
      // and having it in the Admin panel allows easy account creation.
      // Let's implement that.
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!regUsername || !regEmail || !regPassword) {
      setError('Please fill in all details for account registration');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/auth/signup', {
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: regRole
      });
      setSuccess(`Successfully registered new user: ${regUsername} (${regRole})`);
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
      setRegRole('tester');
    } catch (err) {
      setError(err.response?.data?.detail || 'Account registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review active user session variables and credentials roles. Admins can register new system testers.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Card */}
        <div className="glass-panel p-6 rounded-xl space-y-6 lg:col-span-1 border-brandblue/20">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-brandblue/10 text-brandblue flex items-center justify-center font-bold text-3xl border border-brandblue/20 shadow-lg shadow-brandblue/5">
              {user?.username?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.username}</h3>
              <span className="text-xs font-mono text-slate-400 font-medium">{user?.email}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-brandblue/10 border border-brandblue/20 text-brandblue capitalize">
              {user?.role} Access
            </span>
          </div>

          <div className="pt-6 border-t border-darkborder/50 space-y-4 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Session Status</span>
              <span className="text-green-400 font-bold font-mono">Active Connection</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Security Scope</span>
              <span className="text-slate-200 font-semibold font-mono">JWT Verified</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Joined At</span>
              <span className="text-slate-200 font-mono">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Section: Register new testers */}
        <div className="lg:col-span-2 space-y-6">
          {isAdmin ? (
            <div className="glass-panel p-6 rounded-xl space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-darkborder">
                <div className="p-2 bg-brandpurple/10 text-brandpurple rounded-lg">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Administrator Panel: Register New QA User</h3>
                  <span className="text-[10px] text-slate-500 block">Provision new developer or tester accounts in database.</span>
                </div>
              </div>

              <form onSubmit={handleRegisterUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="Choose username"
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="user@llmguard.qa"
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Temporary Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Key size={16} />
                      </div>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Set password"
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Scope Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Shield size={16} />
                      </div>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-darkbg border border-darkborder focus:border-brandblue focus:outline-none text-slate-300 appearance-none"
                      >
                        <option value="tester">QA Tester (Standard Permissions)</option>
                        <option value="admin">QA Administrator (Full Privileges)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brandblue hover:bg-blue-600 text-white transition-colors"
                >
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-xl space-y-4 text-center">
              <Shield size={36} className="text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Tester Scope Limits</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Your account is provisioned under the Standard QA Tester profile. Access to user registration or system scope variables is restricted to administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
