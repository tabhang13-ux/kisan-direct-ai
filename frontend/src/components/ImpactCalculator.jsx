import React, { useState } from 'react';
import { Calculator, TrendingUp, ShieldCheck, Truck, Coins, ArrowRight } from 'lucide-react';

const ImpactCalculator = () => {
  const [numFarmers, setNumFarmers] = useState(25);
  const [produceQtyKg, setProduceQtyKg] = useState(15000);
  const [tradPrice, setTradPrice] = useState(18);
  const [directPrice, setDirectPrice] = useState(24);
  const [tradDistance, setTradDistance] = useState(142);
  const [optDistance, setOptDistance] = useState(91);

  // Calculations
  const totalTradIncome = produceQtyKg * tradPrice;
  const totalDirectIncome = produceQtyKg * directPrice;
  const farmerIncomeBoost = totalDirectIncome - totalTradIncome;
  const farmerBoostPct = Math.round(((directPrice - tradPrice) / tradPrice) * 100);

  const distanceSaved = Math.max(0, tradDistance - optDistance);
  const fuelCostPerKm = 11.5;
  const transportCostSaved = Math.round(distanceSaved * fuelCostPerKm);

  // Buyer savings assuming retail market price is ₹30/kg while direct price is ₹27/kg
  const buyerSaving = Math.round(produceQtyKg * 3.0);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Calculator className="w-4 h-4" /> Real-Time Impact Calculator
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">Simulate Supply Chain Savings & Profit</h3>
          <p className="text-xs text-slate-500">Adjust sliders to calculate farmer income improvement and transport savings.</p>
        </div>
        <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
          Prototype Simulation
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sliders Control Panel */}
        <div className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
          
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Number of Farmers</span>
              <span className="text-emerald-700 font-extrabold">{numFarmers} Farmers</span>
            </div>
            <input
              type="range" min="1" max="500" value={numFarmers}
              onChange={(e) => setNumFarmers(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Total Produce Harvested</span>
              <span className="text-emerald-700 font-extrabold">{produceQtyKg.toLocaleString()} kg</span>
            </div>
            <input
              type="range" min="500" max="100000" step="500" value={produceQtyKg}
              onChange={(e) => setProduceQtyKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Traditional Price</span>
                <span className="text-rose-600 font-extrabold">₹{tradPrice}/kg</span>
              </div>
              <input
                type="range" min="5" max="100" value={tradPrice}
                onChange={(e) => setTradPrice(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Direct Marketplace Price</span>
                <span className="text-emerald-700 font-extrabold">₹{directPrice}/kg</span>
              </div>
              <input
                type="range" min="5" max="120" value={directPrice}
                onChange={(e) => setDirectPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Traditional Route</span>
                <span className="text-slate-700 font-extrabold">{tradDistance} km</span>
              </div>
              <input
                type="range" min="10" max="500" value={tradDistance}
                onChange={(e) => setTradDistance(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Optimized CVRP Route</span>
                <span className="text-emerald-700 font-extrabold">{optDistance} km</span>
              </div>
              <input
                type="range" min="5" max="400" value={optDistance}
                onChange={(e) => setOptDistance(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Live Calculation Cards */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-semibold mb-2">
                <Coins className="w-4 h-4" /> Farmer Income Boost
              </div>
              <p className="text-3xl font-black">₹{farmerIncomeBoost.toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-400/30 flex justify-between items-center text-xs">
              <span>Income Gain</span>
              <span className="bg-white/20 font-extrabold px-2 py-0.5 rounded text-white">+{farmerBoostPct}%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-blue-100 font-semibold mb-2">
                <TrendingUp className="w-4 h-4" /> Buyer Procurement Saving
              </div>
              <p className="text-3xl font-black">₹{buyerSaving.toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-400/30 flex justify-between items-center text-xs">
              <span>Saved vs Retail Mandi</span>
              <span className="bg-white/20 font-extrabold px-2 py-0.5 rounded text-white">~10% Saved</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-100 font-semibold mb-2">
                <Truck className="w-4 h-4" /> Distance Saved
              </div>
              <p className="text-3xl font-black">{distanceSaved} km</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-400/30 flex justify-between items-center text-xs">
              <span>Optimized Reduction</span>
              <span className="bg-white/20 font-extrabold px-2 py-0.5 rounded text-white">OR-Tools Route</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-2">
                <Coins className="w-4 h-4" /> Transport Cost Saved
              </div>
              <p className="text-3xl font-black">₹{transportCostSaved.toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center text-xs">
              <span>Fuel & Fleet Efficiency</span>
              <span className="bg-white/20 font-extrabold px-2 py-0.5 rounded text-white">Diesel Saved</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ImpactCalculator;
