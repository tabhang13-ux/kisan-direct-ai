import React, { useState } from 'react';
import api from '../services/api';
import { X, Play, CheckCircle2, Sparkles, ArrowRight, RefreshCw, Cpu, Truck, Coins, ShieldCheck } from 'lucide-react';
import RouteMap from './RouteMap';

const SihDemoModal = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoData, setDemoData] = useState(null);

  if (!isOpen) return null;

  const handleStartDemo = async () => {
    setRunning(true);
    setCurrentStep(1);

    try {
      const res = await api.post('/demo/scenario');
      setDemoData(res.data);

      // Step-by-step timeline animation timer
      for (let s = 1; s <= 8; s++) {
        setCurrentStep(s);
        await new Promise(r => setTimeout(r, 900));
      }
    } catch (error) {
      console.error('Demo error:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 relative flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" /> SIH 2026 Judge Presentation Mode
            </div>
            <h2 className="text-2xl font-black tracking-tight">KisanDirect AI — 3-Minute Live Scenario</h2>
            <p className="text-xs text-slate-300 mt-1">Demonstrating: PREDICT → MATCH → AGGREGATE → OPTIMIZE → DELIVER</p>
          </div>
          
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Trigger Control */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Automated 8-Step Supply Chain Execution</h4>
              <p className="text-xs text-slate-500">Executes real Python ML forecasting & OR-Tools route optimization endpoints live.</p>
            </div>
            <button
              onClick={handleStartDemo}
              disabled={running}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              {running ? 'Executing Scenario...' : 'Launch Demo Scenario'}
            </button>
          </div>

          {/* 8 Step Animated Timeline Progress */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 1, title: '1. Produce Listed', desc: '2,000 kg Tomato' },
              { id: 2, title: '2. Demand Forecast', desc: 'HIGH (18,400 kg)' },
              { id: 3, title: '3. Price AI', desc: '₹24/kg Recommended' },
              { id: 4, title: '4. Buyer Requirement', desc: '1,500 kg Requested' },
              { id: 5, title: '5. Smart Matching', desc: 'Aggregated FPO' },
              { id: 6, title: '6. Route Optimized', desc: 'OR-Tools 51km Saved' },
              { id: 7, title: '7. Order Shipment', desc: 'Dispatched Fleet' },
              { id: 8, title: '8. Impact Realized', desc: '+50% Farmer Gain' }
            ].map((step) => {
              const isDone = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all text-xs ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{step.title}</span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-white" />}
                  </div>
                  <p className={`text-[10px] ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Results Visualizer */}
          {demoData && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-fade-in">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                    <Coins className="w-4 h-4" /> Transparent Pricing
                  </div>
                  <p className="text-xl font-extrabold text-emerald-900">Farmer: ₹27/kg</p>
                  <p className="text-[11px] text-emerald-700 mt-1">vs ₹18/kg traditional mandi (+50% payout gain)</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                    <Cpu className="w-4 h-4" /> AI Demand Engine
                  </div>
                  <p className="text-xl font-extrabold text-amber-900">{demoData.forecast.demand_level} Demand</p>
                  <p className="text-[11px] text-amber-700 mt-1">Gap: {demoData.forecast.demand_gap.toLocaleString()} kg in Pune</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 mb-1">
                    <Truck className="w-4 h-4" /> Route Optimization
                  </div>
                  <p className="text-xl font-extrabold text-indigo-900">{demoData.routeOptimization.distance_saved_km} km Saved</p>
                  <p className="text-[11px] text-indigo-700 mt-1">Cost saved: ₹{demoData.routeOptimization.estimated_cost_saved}</p>
                </div>
              </div>

              {/* Map Preview of Optimized Route */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Optimized Pickup & Delivery Map (Pune Region)</h4>
                <RouteMap waypoints={demoData.routeOptimization.route_waypoints} height="280px" />
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">Smart India Hackathon • Problem Statement 26033</span>
          <button
            onClick={onClose}
            className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Presentation
          </button>
        </div>

      </div>
    </div>
  );
};

export default SihDemoModal;
