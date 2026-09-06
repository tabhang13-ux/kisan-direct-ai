import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleRoutes = {
    FARMER: '/dashboard/farmer',
    FPO: '/dashboard/fpo',
    BUYER: '/dashboard/buyer',
    LOGISTICS: '/dashboard/logistics',
    ADMIN: '/dashboard/admin'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await login(email, password);
      navigate(roleRoutes[user.role] || '/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleEmail, targetRoute) => {
    setLoading(true);
    try {
      await demoLogin(roleEmail);
      navigate(targetRoute);
    } catch (err) {
      setErrorMsg('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to KisanDirect AI</h2>
          <p className="text-xs text-slate-500 font-medium">Department of Consumer Affairs (DoCA) Platform</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3 rounded-xl border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> One-Click SIH Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleQuickDemo('farmer@demo.com', '/dashboard/farmer')}
              className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 p-2 rounded-xl border border-slate-200 shadow-sm text-left flex items-center justify-between transition-colors"
            >
              <span>🌾 Farmer</span>
              <span className="text-[10px] text-slate-400">Ramesh</span>
            </button>
            <button
              onClick={() => handleQuickDemo('fpo@demo.com', '/dashboard/fpo')}
              className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 p-2 rounded-xl border border-slate-200 shadow-sm text-left flex items-center justify-between transition-colors"
            >
              <span>🏢 FPO</span>
              <span className="text-[10px] text-slate-400">Pune Co.</span>
            </button>
            <button
              onClick={() => handleQuickDemo('buyer@demo.com', '/dashboard/buyer')}
              className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 p-2 rounded-xl border border-slate-200 shadow-sm text-left flex items-center justify-between transition-colors"
            >
              <span>🛒 Buyer</span>
              <span className="text-[10px] text-slate-400">FreshBasket</span>
            </button>
            <button
              onClick={() => handleQuickDemo('logistics@demo.com', '/dashboard/logistics')}
              className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 p-2 rounded-xl border border-slate-200 shadow-sm text-left flex items-center justify-between transition-colors"
            >
              <span>🚚 Logistics</span>
              <span className="text-[10px] text-slate-400">Express Fleet</span>
            </button>
          </div>
          <button
            onClick={() => handleQuickDemo('admin@demo.com', '/dashboard/admin')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl text-xs font-bold text-center transition-colors"
          >
            🏛️ DoCA Government Officer (Admin)
          </button>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. farmer@demo.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-bold hover:underline">
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
