import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Shield, Users, Building, ShoppingBag, TrendingUp, DollarSign, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/dashboard');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const metrics = analytics?.metrics || {
    totalFarmers: 24,
    totalFPOs: 3,
    totalBuyers: 11,
    totalOrders: 18,
    totalProduceMatchedKg: 84500,
    farmerRevenue: 1845000,
    estimatedBuyerSavings: 276750,
    transportDistanceSavedKm: 1420,
    transportCostSaved: 16330
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* DoCA Official Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold mb-2">
            🏛️ Department of Consumer Affairs (DoCA) • Ministry Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">KisanDirect AI Government Intelligence</h1>
          <p className="text-xs text-sky-200 mt-1">SIH Problem 26033 • National Agri-Market Oversight & Intermediary Reduction</p>
        </div>
        <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold px-4 py-2 rounded-2xl">
          {analytics?.simulationBadge || 'PROTOTYPE SIMULATION DATA'}
        </div>
      </div>

      {/* 8 Government KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Farmers Connected</span>
          <p className="text-3xl font-black text-slate-900">{metrics.totalFarmers}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% active growth</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved FPOs</span>
          <p className="text-3xl font-black text-slate-900">{metrics.totalFPOs}</p>
          <p className="text-[10px] text-sky-600 font-semibold">145 member farmers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bulk Buyers Onboarded</span>
          <p className="text-3xl font-black text-slate-900">{metrics.totalBuyers}</p>
          <p className="text-[10px] text-amber-600 font-semibold">Supermarket & Mandis</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Fulfilled</span>
          <p className="text-3xl font-black text-slate-900">{metrics.totalOrders}</p>
          <p className="text-[10px] text-purple-600 font-semibold">100% direct settlement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produce Matched</span>
          <p className="text-3xl font-black text-emerald-700">{metrics.totalProduceMatchedKg.toLocaleString()} kg</p>
          <p className="text-[10px] text-slate-500 font-medium">Across 8 major crops</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Farmer Revenue</span>
          <p className="text-3xl font-black text-slate-900">₹{(metrics.farmerRevenue / 100000).toFixed(2)} Lakh</p>
          <p className="text-[10px] text-emerald-600 font-bold">+33.3% income gain</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consumer / Buyer Savings</span>
          <p className="text-3xl font-black text-blue-700">₹{(metrics.estimatedBuyerSavings / 1000).toFixed(1)}k</p>
          <p className="text-[10px] text-blue-600 font-semibold">Middleman margins saved</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Logistics Distance Saved</span>
          <p className="text-3xl font-black text-amber-600">{metrics.transportDistanceSavedKm.toLocaleString()} km</p>
          <p className="text-[10px] text-amber-700 font-semibold">OR-Tools Route Optimization</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Supply vs Demand Line Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Regional Supply vs Demand Gap</h3>
            <p className="text-xs text-slate-500">AI prediction comparison across Maharashtra agricultural hubs.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.supplyVsDemandData || [
                { crop: 'Tomato', demand: 18400, supply: 13200 },
                { crop: 'Onion', demand: 22000, supply: 19500 },
                { crop: 'Potato', demand: 15000, supply: 14200 },
                { crop: 'Wheat', demand: 28000, supply: 25000 },
                { crop: 'Grapes', demand: 9000, supply: 6500 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="demand" name="Predicted Demand (kg)" stroke="#0284c7" strokeWidth={3} />
                <Line type="monotone" dataKey="supply" name="Current Supply (kg)" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farmer Price Realization Comparison Bar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Farmer Price Payout: Direct vs Traditional Mandi</h3>
            <p className="text-xs text-slate-500">Comparison of ₹/kg received by farmers before and after KisanDirect AI.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.farmerIncomeBeforeAfter || [
                { crop: 'Tomato', traditionalFarmerPrice: 18, kisandirectPrice: 24, consumerPrice: 30 },
                { crop: 'Onion', traditionalFarmerPrice: 21, kisandirectPrice: 28, consumerPrice: 34 },
                { crop: 'Potato', traditionalFarmerPrice: 14, kisandirectPrice: 19.5, consumerPrice: 24 },
                { crop: 'Wheat', traditionalFarmerPrice: 26, kisandirectPrice: 33, consumerPrice: 38 },
                { crop: 'Grapes', traditionalFarmerPrice: 62, kisandirectPrice: 88, consumerPrice: 110 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="traditionalFarmerPrice" name="Traditional Mandi (₹/kg)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="kisandirectPrice" name="KisanDirect Direct Payout (₹/kg)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
