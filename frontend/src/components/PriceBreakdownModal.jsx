import React from 'react';
import { X, ArrowRight, ShieldCheck, TrendingUp, DollarSign } from 'lucide-react';

const PriceBreakdownModal = ({ isOpen, onClose, cropName = "Tomato", buyerPrice = 30.0, farmerPayout = 27.0 }) => {
  if (!isOpen) return null;

  const platformFee = buyerPrice - farmerPayout;
  const traditionalFarmerPrice = Math.round(buyerPrice * 0.6 * 10) / 10;
  const traderCommission = Math.round(buyerPrice * 0.1 * 10) / 10;
  const wholesalerMargin = Math.round(buyerPrice * 0.1 * 10) / 10;
  const retailerMargin = Math.round(buyerPrice * 0.2 * 10) / 10;

  const farmerGainPct = Math.round(((farmerPayout - traditionalFarmerPrice) / traditionalFarmerPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Direct Farm Payout Transparency
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Price Breakdown for {cropName}</h3>
            <p className="text-xs text-slate-500">Comparing KisanDirect AI against traditional 5-tier middleman supply chain</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* KisanDirect Direct Chain */}
          <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">KisanDirect AI Supply Chain (Direct)</span>
              <span className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +{farmerGainPct}% Farmer Income
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                <p className="text-[10px] text-slate-500 font-medium uppercase">Buyer Pays</p>
                <p className="text-lg font-extrabold text-slate-900">₹{buyerPrice.toFixed(2)}/kg</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                <p className="text-[10px] text-slate-500 font-medium uppercase">Logistics & Tech</p>
                <p className="text-lg font-extrabold text-amber-600">₹{platformFee.toFixed(2)}/kg</p>
              </div>
              <div className="bg-emerald-600 text-white rounded-lg p-3 shadow-sm">
                <p className="text-[10px] text-emerald-100 font-medium uppercase">Farmer Receives</p>
                <p className="text-lg font-extrabold">₹{farmerPayout.toFixed(2)}/kg</p>
              </div>
            </div>
          </div>

          {/* Traditional Supply Chain Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Traditional 5-Tier Supply Chain (Middlemen)</p>
            
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
              <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg">
                <p className="text-rose-700 font-bold">Farmer</p>
                <p className="font-extrabold text-rose-900">₹{traditionalFarmerPrice.toFixed(2)}</p>
              </div>
              <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg">
                <p className="text-slate-600 font-medium">Trader</p>
                <p className="font-bold text-slate-800">+₹{traderCommission.toFixed(2)}</p>
              </div>
              <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg">
                <p className="text-slate-600 font-medium">Wholesaler</p>
                <p className="font-bold text-slate-800">+₹{wholesalerMargin.toFixed(2)}</p>
              </div>
              <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg">
                <p className="text-slate-600 font-medium">Retailer</p>
                <p className="font-bold text-slate-800">+₹{retailerMargin.toFixed(2)}</p>
              </div>
              <div className="bg-slate-200 border border-slate-300 p-2 rounded-lg">
                <p className="text-slate-800 font-bold">Consumer</p>
                <p className="font-extrabold text-slate-900">₹{buyerPrice.toFixed(2)}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 text-center italic">
              * Note: Illustrative prototype price breakdown comparison based on mandi benchmark studies.
            </p>
          </div>

        </div>

        {/* Footer button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};

export default PriceBreakdownModal;
