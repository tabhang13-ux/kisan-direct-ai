import React from 'react';
import ImpactCalculator from '../components/ImpactCalculator';
import { BarChart3, TrendingUp, Cpu, Truck, Coins, ShieldCheck, Layers, Award } from 'lucide-react';

const ImpactIntelligencePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-600" /> SIH 26033 Executive Intelligence
        </div>
        <h1 className="text-4xl font-black text-slate-900">Impact & Intelligence Hub</h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Comprehensive performance metrics evaluating middleman elimination, farmer income gain, and OR-Tools logistics efficiency.
        </p>
      </div>

      {/* 4 CORE IMPACT COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. AI Insights */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">1. AI Insights</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>High Demand Crop:</span> <strong className="text-slate-900">Tomato (Pune)</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Supply-Demand Gap:</span> <strong className="text-emerald-700">5,200 kg</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Price Rec Accuracy:</span> <strong className="text-slate-900">91% Confidence</strong>
            </li>
          </ul>
        </div>

        {/* 2. Supply Chain Impact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">2. Supply Chain Impact</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Intermediaries Cut:</span> <strong className="text-rose-600">4 Layers Removed</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Produce Matched:</span> <strong className="text-slate-900">84,500 kg</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Orders Fulfilled:</span> <strong className="text-emerald-700">100% Direct</strong>
            </li>
          </ul>
        </div>

        {/* 3. Logistics Impact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">3. Logistics Efficiency</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Distance Saved:</span> <strong className="text-purple-700">1,420 km</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Fuel Cost Saved:</span> <strong className="text-slate-900">₹16,330</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Fleet Utilization:</span> <strong className="text-emerald-700">88.5% Capacity</strong>
            </li>
          </ul>
        </div>

        {/* 4. Farmer & Buyer Impact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">4. Financial Payout Gain</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Farmer Realization:</span> <strong className="text-emerald-700">₹27/kg (90%)</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Income Increase:</span> <strong className="text-emerald-700">+50% vs Mandi</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1.5">
              <span>Buyer Savings:</span> <strong className="text-blue-700">~15% Discount</strong>
            </li>
          </ul>
        </div>

      </div>

      {/* Embedded Impact Calculator */}
      <section className="pt-6">
        <ImpactCalculator />
      </section>

    </div>
  );
};

export default ImpactIntelligencePage;
