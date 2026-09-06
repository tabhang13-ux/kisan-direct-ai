import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sprout, Plus, TrendingUp, DollarSign, Package, AlertCircle, Trash2, Edit3, CheckCircle, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [produceListings, setProduceListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [priceRec, setPriceRec] = useState(null);

  // Add Produce Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    cropName: 'Tomato',
    category: 'Vegetables',
    quantityKg: '1500',
    askingPricePerKg: '24',
    harvestDate: new Date().toISOString().split('T')[0],
    isOrganic: false,
    qualityGrade: 'GRADE_A'
  });

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/farmers/produce');
      setProduceListings(res.data);

      // Fetch AI Demand Forecast for primary crop
      const fcRes = await api.post('/forecast/demand', {
        crop: 'Tomato',
        location: user?.village || 'Pune'
      });
      setForecast(fcRes.data);

      // Fetch AI Price Recommendation
      const prRes = await api.post('/forecast/price', {
        crop: 'Tomato',
        location: user?.village || 'Pune',
        quantity: 1500
      });
      setPriceRec(prRes.data);
    } catch (err) {
      console.error('Error fetching farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const handleAddProduceSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farmers/produce', newCrop);
      alert('Produce listed successfully! Buyers and FPOs can now view your supply.');
      setAddModalOpen(false);
      fetchFarmerData();
    } catch (err) {
      alert('Failed to list produce: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteProduce = async (id) => {
    if (!confirm('Are you sure you want to remove this produce listing?')) return;
    try {
      await api.delete(`/farmers/produce/${id}`);
      fetchFarmerData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const totalQuantity = produceListings.reduce((sum, item) => sum + item.quantityKg, 0);
  const totalValuation = produceListings.reduce((sum, item) => sum + (item.askingPricePerKg * item.quantityKg), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-2">
            🌾 Farmer Direct Portal • Simplified UX
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name || 'Farmer'}</h1>
          <p className="text-xs text-emerald-200 mt-1">Location: {user?.village || 'Manchar'}, {user?.district || 'Pune'} District</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Available Produce
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Available Produce</p>
            <p className="text-2xl font-black text-slate-900">{totalQuantity.toLocaleString()} kg</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Listed Inventory Value</p>
            <p className="text-2xl font-black text-slate-900">₹{totalValuation.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Direct Farmer Payout</p>
            <p className="text-2xl font-black text-emerald-700">+50% vs Mandi</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">FPO Member Status</p>
            <p className="text-2xl font-black text-slate-900">Pune Sahakari</p>
          </div>
        </div>
      </div>

      {/* AI DEMAND FORECAST & PRICE RECOMMENDATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Demand Alert Widget */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/50 space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" /> AI Demand Forecast (Pune District)
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Scikit-Learn ML
            </span>
          </div>

          {forecast && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-white">{forecast.crop} Demand is <span className="text-emerald-400">{forecast.demand_level}</span></h3>
                  <p className="text-xs text-slate-300 mt-1">Predicted Regional Demand: {forecast.predicted_demand.toLocaleString()} kg</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
                    Deficit: {forecast.demand_gap.toLocaleString()} kg
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-2">
                <p className="font-bold text-emerald-300">Why is demand high?</p>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {forecast.explanations.map((exp, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {exp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Price Recommendation Widget */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-emerald-600" /> AI Recommended Listing Price
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Fair Value Engine
            </span>
          </div>

          {priceRec && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Estimated Market Range</p>
                  <p className="text-lg font-bold text-slate-800">{priceRec.market_range}</p>
                </div>
                <div className="text-right bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-extrabold">Recommended Price</p>
                  <p className="text-2xl font-black text-emerald-700">₹{priceRec.recommended_price}/kg</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-800">Recommendation Drivers:</p>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {priceRec.explainability.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* MY PRODUCE LISTINGS TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">My Produce Inventory</h3>
            <p className="text-xs text-slate-500">Active produce listed directly to buyers and FPO collection hubs.</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Produce
          </button>
        </div>

        {produceListings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            No produce listings added yet. Click "Add Available Produce" to start selling.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4">Crop</th>
                  <th className="p-4">Quantity (kg)</th>
                  <th className="p-4">Expected Harvest</th>
                  <th className="p-4">Asking Price</th>
                  <th className="p-4">Quality Grade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {produceListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      {item.cropName} {item.isOrganic && <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Organic</span>}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{item.quantityKg.toLocaleString()} kg</td>
                    <td className="p-4 text-slate-600">{item.harvestDate}</td>
                    <td className="p-4 font-extrabold text-emerald-700">₹{item.askingPricePerKg}/kg</td>
                    <td className="p-4"><span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold">{item.qualityGrade}</span></td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduce(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD PRODUCE MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">Add Available Produce</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddProduceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name</label>
                  <select
                    value={newCrop.cropName} onChange={(e) => setNewCrop({ ...newCrop, cropName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Onion">Onion</option>
                    <option value="Potato">Potato</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice (Basmati)">Rice (Basmati)</option>
                    <option value="Grapes">Grapes</option>
                    <option value="Pomegranate">Pomegranate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (kg)</label>
                  <input
                    type="number" required value={newCrop.quantityKg} onChange={(e) => setNewCrop({ ...newCrop, quantityKg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asking Price (₹/kg)</label>
                  <input
                    type="number" required value={newCrop.askingPricePerKg} onChange={(e) => setNewCrop({ ...newCrop, askingPricePerKg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Harvest Date</label>
                  <input
                    type="date" value={newCrop.harvestDate} onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox" checked={newCrop.isOrganic} onChange={(e) => setNewCrop({ ...newCrop, isOrganic: e.target.checked })}
                    className="accent-emerald-600 rounded w-4 h-4 cursor-pointer"
                  />
                  <span>Organic Farm Produce 🌿</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button" onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  Confirm Produce Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;
