import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building, Users, Layers, ShoppingBag, CheckCircle2, ArrowRight, ShieldCheck, Plus, Package } from 'lucide-react';

const FpoDashboard = () => {
  const { user } = useAuth();
  const [fpoData, setFpoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Produce Aggregation State
  const [selectedListings, setSelectedListings] = useState([]);
  const [aggregationResult, setAggregationResult] = useState(null);

  const fetchFpoDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fpo/dashboard');
      setFpoData(res.data);
    } catch (err) {
      console.error('Error fetching FPO dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFpoDashboard();
  }, []);

  const handleToggleListingSelect = (listingId) => {
    if (selectedListings.includes(listingId)) {
      setSelectedListings(selectedListings.filter(id => id !== listingId));
    } else {
      setSelectedListings([...selectedListings, listingId]);
    }
  };

  const handleRunAggregation = async () => {
    if (selectedListings.length === 0) {
      alert('Please select at least 2 farmer produce listings to aggregate.');
      return;
    }

    try {
      const res = await api.post('/fpo/aggregate', {
        listingIds: selectedListings
      });
      setAggregationResult(res.data);
    } catch (err) {
      alert('Aggregation failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold mb-2">
            🏢 FPO Aggregation Hub • Collective Marketing
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{fpoData?.fpoProfile?.fpoName || 'Pune Farmers Producer Co.'}</h1>
          <p className="text-xs text-sky-200 mt-1">Registration No: {fpoData?.fpoProfile?.registrationNo || 'FPO-MH-PUN-2023-089'}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
          <p className="text-[10px] text-sky-200 uppercase font-bold">Active Members</p>
          <p className="text-2xl font-black text-white">{fpoData?.memberCount || 45} Farmers</p>
        </div>
      </div>

      {/* PRODUCE AGGREGATION TOOL SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-1">
              <Layers className="w-3.5 h-3.5" /> Smallholder Aggregation Engine
            </div>
            <h2 className="text-2xl font-black text-slate-900">Multi-Farmer Produce Aggregation</h2>
            <p className="text-xs text-slate-500">Combine small lots from individual farmers to satisfy large 1,000+ kg bulk buyer requirements.</p>
          </div>
          <button
            onClick={handleRunAggregation}
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Layers className="w-4 h-4" /> Aggregate Selected Supply
          </button>
        </div>

        {/* Aggregation Result Alert Box */}
        {aggregationResult && (
          <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              {aggregationResult.message}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-emerald-200">
              <div>
                <span className="text-slate-400 block">Total Aggregated</span>
                <span className="font-black text-emerald-800 text-base">{aggregationResult.totalAggregatedQty.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block">Participating Farmers</span>
                <span className="font-extrabold text-slate-900">{aggregationResult.participatingFarmersCount} Member Farmers</span>
              </div>
              <div>
                <span className="text-slate-400 block">Weighted Avg Price</span>
                <span className="font-black text-emerald-700 text-base">₹{aggregationResult.weightedAvgPricePerKg}/kg</span>
              </div>
            </div>

            {/* Farmers Contribution Breakdown */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-700 mb-2">Member Contribution Breakdown:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {aggregationResult.farmersBreakdown.map((f, idx) => (
                  <span key={idx} className="bg-white border border-emerald-300 text-emerald-900 px-3 py-1 rounded-lg font-semibold shadow-sm">
                    {f.farmerName}: <strong>{f.quantityKg} kg</strong> @ ₹{f.askingPricePerKg}/kg
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selectable Member Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Select</th>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {fpoData?.fpoListings?.map((item) => {
                const isSelected = selectedListings.includes(item.id);
                return (
                  <tr key={item.id} className={isSelected ? 'bg-sky-50/80 font-bold' : 'hover:bg-slate-50'}>
                    <td className="p-3">
                      <input
                        type="checkbox" checked={isSelected} onChange={() => handleToggleListingSelect(item.id)}
                        className="accent-sky-600 rounded w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-900">{item.farmer?.user?.name || 'Member Farmer'}</td>
                    <td className="p-3 text-emerald-700 font-bold">{item.cropName}</td>
                    <td className="p-3">{item.quantityKg} kg</td>
                    <td className="p-3 text-slate-900 font-bold">₹{item.askingPricePerKg}/kg</td>
                    <td className="p-3 text-slate-500">{item.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLLECTIVE INVENTORY OVERVIEW */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Collective FPO Inventory</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fpoData?.collectiveInventory?.map((inv, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 text-sm">{inv.cropName}</span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{inv.farmerCount} Farmers</span>
              </div>
              <p className="text-2xl font-black text-emerald-700">{inv.totalQuantityKg.toLocaleString()} kg</p>
              <p className="text-xs text-slate-500">Avg asking price: ₹{inv.avgAskingPrice}/kg</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FpoDashboard;
