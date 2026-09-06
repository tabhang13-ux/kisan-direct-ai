import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus, Sparkles, CheckCircle2, MapPin, Search, ArrowRight, ShieldCheck, DollarSign, Layers } from 'lucide-react';
import PriceBreakdownModal from '../components/PriceBreakdownModal';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Requirement Form Modal
  const [reqModalOpen, setReqModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({
    cropName: 'Tomato',
    quantityKg: '1500',
    maxPricePerKg: '27',
    requiredByDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    deliveryLocation: 'Hadapsar Wholesale Hub, Pune'
  });

  const [activeMatches, setActiveMatches] = useState(null);

  const fetchBuyerData = async () => {
    setLoading(true);
    try {
      const [reqRes, ordRes] = await Promise.all([
        api.get('/buyers/requirements'),
        api.get('/orders')
      ]);
      setRequirements(reqRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error('Error fetching buyer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const handleCreateRequirement = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/buyers/requirements', newReq);
      setActiveMatches(res.data.matchResults);
      setReqModalOpen(false);
      fetchBuyerData();
      alert(`Requirement posted! ${res.data.matchResults.rankedMatches.length} matching suppliers found.`);
    } catch (err) {
      alert('Failed to post requirement: ' + (err.response?.data?.error || err.message));
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalSavings = Math.round(totalSpent * 0.15); // ~15% savings compared to traditional retail mandi

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 border border-white/30 text-xs font-bold mb-2">
            🛒 Bulk Buyer Direct Hub • Smart Procurement
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{user?.name || 'FreshBasket Supermarkets'}</h1>
          <p className="text-xs text-amber-100 mt-1">Procurement Hub: {user?.location || 'Hadapsar, Pune'}</p>
        </div>
        <button
          onClick={() => setReqModalOpen(true)}
          className="bg-white hover:bg-amber-50 text-slate-950 text-xs font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Post Crop Requirement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Active Orders</p>
            <p className="text-2xl font-black text-slate-900">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Purchases</p>
            <p className="text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Estimated Cost Savings</p>
            <p className="text-2xl font-black text-emerald-700">₹{totalSavings.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Open Requirements</p>
            <p className="text-2xl font-black text-slate-900">{requirements.length}</p>
          </div>
        </div>
      </div>

      {/* MATCHED SUPPLIERS RESULTS WIDGET */}
      {activeMatches && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-200 space-y-5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Smart Matching Algorithm
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Matched Suppliers for {activeMatches.requestedQuantityKg} kg {activeMatches.cropName}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Max Budget: ₹{activeMatches.maxPricePerKg}/kg
            </span>
          </div>

          {/* Aggregation Banner */}
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-950 font-semibold">{activeMatches.aggregationStatus.message}</p>
          </div>

          {/* Ranked Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeMatches.rankedMatches.map((m, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Rank #{idx + 1}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{m.supplierName}</h4>
                  </div>
                  <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-full">
                    {m.matchScore}% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Available</span>
                    <span className="font-bold text-slate-800">{m.availableQuantityKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Price</span>
                    <span className="font-bold text-emerald-700">₹{m.askingPricePerKg}/kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Distance</span>
                    <span className="font-bold text-slate-700">{m.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Delivery</span>
                    <span className="font-bold text-slate-700">Tomorrow</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUIREMENTS LIST TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">My Posted Requirements</h3>
            <p className="text-xs text-slate-500">Active crop requirements matched with regional farmers and FPOs.</p>
          </div>
          <button
            onClick={() => setReqModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post Requirement
          </button>
        </div>

        {requirements.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            No active requirements posted yet. Click "Post Crop Requirement" to search suppliers.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4">Crop</th>
                  <th className="p-4">Requested Qty</th>
                  <th className="p-4">Max Budget</th>
                  <th className="p-4">Required Date</th>
                  <th className="p-4">Delivery Location</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900">{req.cropName}</td>
                    <td className="p-4 font-bold text-slate-800">{req.quantityKg.toLocaleString()} kg</td>
                    <td className="p-4 font-extrabold text-emerald-700">₹{req.maxPricePerKg}/kg</td>
                    <td className="p-4 text-slate-600">{req.requiredByDate}</td>
                    <td className="p-4 text-slate-500">{req.deliveryLocation}</td>
                    <td className="p-4">
                      <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE REQUIREMENT MODAL */}
      {reqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">Post Buyer Requirement</h3>
              <button onClick={() => setReqModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name</label>
                  <input
                    type="text" required value={newReq.cropName} onChange={(e) => setNewReq({ ...newReq, cropName: e.target.value })}
                    placeholder="e.g. Tomato"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Quantity (kg)</label>
                  <input
                    type="number" required value={newReq.quantityKg} onChange={(e) => setNewReq({ ...newReq, quantityKg: e.target.value })}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Price Limit (₹/kg)</label>
                  <input
                    type="number" required value={newReq.maxPricePerKg} onChange={(e) => setNewReq({ ...newReq, maxPricePerKg: e.target.value })}
                    placeholder="27"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Within</label>
                  <input
                    type="date" value={newReq.requiredByDate} onChange={(e) => setNewReq({ ...newReq, requiredByDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Depot Location</label>
                <input
                  type="text" value={newReq.deliveryLocation} onChange={(e) => setNewReq({ ...newReq, deliveryLocation: e.target.value })}
                  placeholder="Hadapsar Wholesale Hub, Pune"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button" onClick={() => setReqModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Run Smart Matching
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BuyerDashboard;
