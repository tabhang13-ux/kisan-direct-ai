import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Search, Filter, MapPin, Calendar, Award, ShieldCheck, ShoppingCart, ArrowRight } from 'lucide-react';
import PriceBreakdownModal from '../components/PriceBreakdownModal';
import { useAuth } from '../context/AuthContext';

const MarketplacePage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

  // Price Breakdown Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Cash Crops'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (organicOnly) params.isOrganic = 'true';
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/marketplace', { params });
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [categoryFilter, organicOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleOpenBreakdown = (listing) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

  const handleBuyProduce = async (listing) => {
    if (!user) {
      alert('Please log in as a Buyer to place an order.');
      return;
    }

    try {
      const res = await api.post('/orders', {
        listingIds: [listing.id],
        quantities: { [listing.id]: listing.quantityKg },
        deliveryLocation: user.location || 'Pune Depot'
      });
      alert(`Order confirmed! ${listing.quantityKg} kg of ${listing.cropName} ordered successfully.`);
      fetchListings();
    } catch (err) {
      alert('Order creation failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <ShoppingBag className="w-4 h-4" /> Direct Farmer Produce Catalog
          </div>
          <h1 className="text-3xl font-black text-slate-900">AgriTech Marketplace</h1>
          <p className="text-xs text-slate-500">Buy directly from verified farmers and FPOs with zero middleman commissions.</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by crop name (e.g. Tomato, Onion, Wheat)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Pills & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === '' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)}
                className="accent-emerald-600 rounded w-4 h-4 cursor-pointer"
              />
              <span>Organic Only 🌿</span>
            </label>
          </div>
        </div>

      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 mt-4">Loading direct farmer listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-700">No produce listings found matching your search.</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or searching for another crop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Crop Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'}
                    alt={item.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.isOrganic && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      Organic Certified 🌿
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-slate-200">
                    {item.qualityGrade}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                        {item.cropName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-700">₹{item.askingPricePerKg}/kg</p>
                      <p className="text-[10px] text-slate-400 font-medium">Direct Payout</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Available</span>
                      <span className="font-extrabold text-slate-800">{item.quantityKg.toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Harvest Date</span>
                      <span className="font-bold text-slate-700">{item.harvestDate}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Seller:</span>
                    <span className="font-bold text-slate-900">
                      {item.fpo ? item.fpo.fpoName : item.farmer ? item.farmer.user.name : 'Verified Farmer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                <button
                  onClick={() => handleOpenBreakdown(item)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Price Breakdown
                </button>
                <button
                  onClick={() => handleBuyProduce(item)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> Order Produce
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Price Breakdown Modal */}
      {selectedListing && (
        <PriceBreakdownModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          cropName={selectedListing.cropName}
          buyerPrice={selectedListing.askingPricePerKg * 1.15}
          farmerPayout={selectedListing.askingPricePerKg}
        />
      )}

    </div>
  );
};

export default MarketplacePage;
