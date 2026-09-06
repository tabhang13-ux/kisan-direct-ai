import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Phone, Mail, Lock, MapPin, Building, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'FARMER';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '+91 ',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    district: 'Pune',
    village: '',
    produceTypes: 'Tomato, Onion',
    landSizeAcres: '2.5',
    organizationName: '',
    buyerType: 'Supermarket Chain',
    companyName: '',
    serviceArea: 'Pune Region'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await register({ ...formData, role });
      const roleRoutes = {
        FARMER: '/dashboard/farmer',
        FPO: '/dashboard/fpo',
        BUYER: '/dashboard/buyer',
        LOGISTICS: '/dashboard/logistics',
        ADMIN: '/dashboard/admin'
      };
      navigate(roleRoutes[user.role] || '/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Join KisanDirect AI</h2>
          <p className="text-xs text-slate-500 font-medium">Select your role to register on the platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          {[
            { id: 'FARMER', label: '🌾 Farmer' },
            { id: 'FPO', label: '🏢 FPO' },
            { id: 'BUYER', label: '🛒 Buyer' },
            { id: 'LOGISTICS', label: '🚚 Logistics' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === r.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3 rounded-xl border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Organization</label>
              <input
                type="text" name="name" required value={formData.name} onChange={handleChange}
                placeholder="e.g. Ramesh Kulkarni"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text" name="phone" required value={formData.phone} onChange={handleChange}
                placeholder="+91 98220 12345"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password" name="password" required value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
              <input
                type="text" name="state" value={formData.state} onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <input
                type="text" name="district" value={formData.district} onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village/Location</label>
              <input
                type="text" name="village" value={formData.village} onChange={handleChange}
                placeholder="e.g. Manchar"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'FARMER' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Primary Produce Types</label>
                <input
                  type="text" name="produceTypes" value={formData.produceTypes} onChange={handleChange}
                  placeholder="Tomato, Onion, Potato"
                  className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Land Size (Acres)</label>
                <input
                  type="number" name="landSizeAcres" value={formData.landSizeAcres} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>
            </div>
          )}

          {role === 'BUYER' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">Organization Name</label>
                <input
                  type="text" name="organizationName" value={formData.organizationName} onChange={handleChange}
                  placeholder="FreshBasket Supermarket"
                  className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">Buyer Category</label>
                <select
                  name="buyerType" value={formData.buyerType} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="Supermarket Chain">Supermarket Chain</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Hotel Chain">Hotel & Hospitality</option>
                  <option value="Institutional Buyer">Institutional Buyer</option>
                </select>
              </div>
            </div>
          )}

          {role === 'LOGISTICS' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-purple-50/70 border border-purple-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Company / Fleet Name</label>
                <input
                  type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                  placeholder="Express Fleet Logistics"
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Service Region</label>
                <input
                  type="text" name="serviceArea" value={formData.serviceArea} onChange={handleChange}
                  placeholder="Western Maharashtra"
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Profile...' : `Register as ${role}`} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
