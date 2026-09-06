import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Play, User, LogOut, LayoutDashboard, ShoppingBag, BarChart3, Shield, Menu, X, Sparkles } from 'lucide-react';

const Navbar = ({ onOpenDemoModal }) => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickRoleOpen, setQuickRoleOpen] = useState(false);

  const roleDashboardMap = {
    FARMER: '/dashboard/farmer',
    FPO: '/dashboard/fpo',
    BUYER: '/dashboard/buyer',
    LOGISTICS: '/dashboard/logistics',
    ADMIN: '/dashboard/admin'
  };

  const handleRoleSwitch = async (roleEmail, route) => {
    await demoLogin(roleEmail);
    setQuickRoleOpen(false);
    navigate(route);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & DoCA Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">KisanDirect</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2 py-0.5 rounded-full border border-emerald-300">AI</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">DoCA • SIH PS 26033</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Marketplace
            </Link>
            <Link to="/impact" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Impact & Intelligence
            </Link>

            {user && (
              <Link to={roleDashboardMap[user.role] || '/'} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                {user.role} Dashboard
              </Link>
            )}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* SIH Demo Scenario Button */}
            <button
              onClick={onOpenDemoModal}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 fill-white animate-pulse" />
              Launch Demo Scenario
            </button>

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setQuickRoleOpen(!quickRoleOpen)}
                className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-2 rounded-lg border border-slate-200 flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                Switch Demo Role
              </button>

              {quickRoleOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Demo Login</div>
                  <button onClick={() => handleRoleSwitch('farmer@demo.com', '/dashboard/farmer')} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between">
                    <span>🌾 Farmer</span> <span className="text-[10px] text-slate-400">Ramesh</span>
                  </button>
                  <button onClick={() => handleRoleSwitch('fpo@demo.com', '/dashboard/fpo')} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between">
                    <span>🏢 FPO Manager</span> <span className="text-[10px] text-slate-400">Pune Sahakari</span>
                  </button>
                  <button onClick={() => handleRoleSwitch('buyer@demo.com', '/dashboard/buyer')} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between">
                    <span>🛒 Bulk Buyer</span> <span className="text-[10px] text-slate-400">FreshBasket</span>
                  </button>
                  <button onClick={() => handleRoleSwitch('logistics@demo.com', '/dashboard/logistics')} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between">
                    <span>🚚 Logistics Fleet</span> <span className="text-[10px] text-slate-400">Express Fleet</span>
                  </button>
                  <button onClick={() => handleRoleSwitch('admin@demo.com', '/dashboard/admin')} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between">
                    <span>🏛️ Admin (DoCA)</span> <span className="text-[10px] text-slate-400">Govt Officer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">
                  Join Platform
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenDemoModal}
              className="bg-amber-500 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-700 py-2">
            🛒 Marketplace
          </Link>
          <Link to="/impact" onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-slate-700 py-2">
            📊 Impact & Intelligence
          </Link>
          {user ? (
            <>
              <Link to={roleDashboardMap[user.role]} onClick={() => setMobileMenuOpen(false)} className="block font-semibold text-emerald-700 py-2">
                📌 My {user.role} Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left font-semibold text-rose-600 py-2">
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 border rounded-lg font-semibold text-slate-700">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 bg-emerald-600 text-white rounded-lg font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
