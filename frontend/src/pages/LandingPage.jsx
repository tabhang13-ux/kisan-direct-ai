import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, TrendingUp, Cpu, Truck, BarChart3, Users, Zap, CheckCircle2 } from 'lucide-react';
import ImpactCalculator from '../components/ImpactCalculator';

const LandingPage = ({ onOpenDemoModal }) => {
  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold tracking-wide uppercase shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Department of Consumer Affairs (DoCA) • SIH 26033
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-none">
            Connect Farmers Directly <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              With Buyers & FPOs
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            AI-powered marketplace that predicts demand, connects supply, aggregates smallholder produce, and optimizes agricultural logistics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Explore Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=FARMER"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-7 py-4 rounded-xl border border-white/20 backdrop-blur-sm transition-all"
            >
              Join as Farmer
            </Link>
            <Link
              to="/register?role=BUYER"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-7 py-4 rounded-xl shadow-lg transition-all"
            >
              Join as Buyer
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-emerald-700/50">
            <div>
              <p className="text-3xl font-black text-emerald-300">50%</p>
              <p className="text-xs text-emerald-200/80 font-medium">Farmer Income Boost</p>
            </div>
            <div>
              <p className="text-3xl font-black text-amber-300">35 km</p>
              <p className="text-xs text-emerald-200/80 font-medium">Avg Route Saved</p>
            </div>
            <div>
              <p className="text-3xl font-black text-teal-300">0</p>
              <p className="text-xs text-emerald-200/80 font-medium">Middleman Layers</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-xs text-emerald-200/80 font-medium">Direct Settlement</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TRADITIONAL VS KISANDIRECT PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase">The Problem</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Why Traditional Supply Chains Fail Farmers</h3>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Multiple intermediaries extract up to 60% of produce value while adding transport inefficiencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Chain Card */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <h4 className="font-extrabold text-rose-900 text-sm uppercase">Traditional 5-Tier Supply Chain</h4>
              <span className="text-xs font-bold text-rose-700 bg-rose-200/60 px-2.5 py-0.5 rounded-full">High Inefficiency</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
              <span>Farmer (₹18)</span> →
              <span>Trader</span> →
              <span>Wholesaler</span> →
              <span>Retailer</span> →
              <span className="text-rose-700">Consumer (₹30)</span>
            </div>

            <ul className="space-y-2 text-xs text-rose-950 font-medium">
              <li className="flex items-center gap-2">❌ Farmer receives only 40-50% of ultimate consumer price</li>
              <li className="flex items-center gap-2">❌ 4 commission layers inflate consumer costs</li>
              <li className="flex items-center gap-2">❌ Unoptimized multi-point transportation causes 25% wastage</li>
            </ul>
          </div>

          {/* KisanDirect AI Solution Card */}
          <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <h4 className="font-extrabold text-emerald-900 text-sm uppercase">KisanDirect AI Direct Platform</h4>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">Fair & Optimal</span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-emerald-800 font-extrabold">Farmer / FPO (₹27)</span>
              <span className="text-xs text-slate-400 font-normal">→ Direct Logistics (₹3) →</span>
              <span className="text-slate-900 font-extrabold">Buyer (₹30)</span>
            </div>

            <ul className="space-y-2 text-xs text-emerald-950 font-medium">
              <li className="flex items-center gap-2">✅ Farmer receives 90% of price payout (₹27 vs ₹18/kg)</li>
              <li className="flex items-center gap-2">✅ AI demand forecasting reduces market gluts</li>
              <li className="flex items-center gap-2">✅ OR-Tools route optimization saves fuel and transport time</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. CORE CONCEPT: PREDICT -> MATCH -> AGGREGATE -> OPTIMIZE -> DELIVER */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">Platform Workflow</span>
            <h2 className="text-3xl font-extrabold">PREDICT → MATCH → AGGREGATE → OPTIMIZE → DELIVER</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
            
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-black mb-3">1</div>
              <h4 className="font-bold text-sm text-white">PREDICT</h4>
              <p className="text-[11px] text-slate-400 mt-1">FastAPI scikit-learn model forecasts regional demand & pricing.</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-sky-600/30 text-sky-400 flex items-center justify-center font-black mb-3">2</div>
              <h4 className="font-bold text-sm text-white">MATCH</h4>
              <p className="text-[11px] text-slate-400 mt-1">Weighted engine ranks suppliers based on price, distance & quality.</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center font-black mb-3">3</div>
              <h4 className="font-bold text-sm text-white">AGGREGATE</h4>
              <p className="text-[11px] text-slate-400 mt-1">Combines produce across smallholder farmers to satisfy bulk orders.</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center font-black mb-3">4</div>
              <h4 className="font-bold text-sm text-white">OPTIMIZE</h4>
              <p className="text-[11px] text-slate-400 mt-1">Google OR-Tools calculates optimal pickup & delivery route.</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-teal-600/30 text-teal-400 flex items-center justify-center font-black mb-3">5</div>
              <h4 className="font-bold text-sm text-white">DELIVER</h4>
              <p className="text-[11px] text-slate-400 mt-1">Fleet vehicle delivers with real-time OpenStreetMap tracking.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE IMPACT CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImpactCalculator />
      </section>

      {/* 5. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-10 text-white text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black">Start Selling & Buying Direct Today</h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Join thousands of farmers, FPOs, and bulk buyers transforming the Indian agricultural supply chain.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="bg-white text-emerald-900 font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Start Selling Directly
            </Link>
            <button
              onClick={onOpenDemoModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-7 py-4 rounded-xl shadow-lg transition-colors"
            >
              Launch Demo Mode
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
