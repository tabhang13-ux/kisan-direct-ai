import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, Navigation, MapPin, Zap, CheckCircle2, ShieldCheck, Clock, Fuel, ArrowRight } from 'lucide-react';
import RouteMap from '../components/RouteMap';

const LogisticsDashboard = () => {
  const { user } = useAuth();
  const [routesData, setRoutesData] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Manual Optimization Trigger State
  const [optimizing, setOptimizing] = useState(false);
  const [optResult, setOptResult] = useState(null);

  const fetchLogisticsData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/routes');
      setRoutesData(res.data.routes || []);
      setVehicles(res.data.vehicles || []);
      if (res.data.routes && res.data.routes.length > 0) {
        setSelectedRoute(res.data.routes[0]);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  const handleRunRouteOptimizer = async () => {
    setOptimizing(true);
    try {
      const samplePickups = [
        { name: 'Farmer A (Manchar Farm)', lat: 19.0039, lng: 73.9431, quantity_kg: 400 },
        { name: 'Farmer B (Khed Farm)', lat: 18.8475, lng: 73.9105, quantity_kg: 300 },
        { name: 'Farmer C (Junnar Farm)', lat: 19.2064, lng: 73.8762, quantity_kg: 300 },
        { name: 'Pune FPO Collection Hub', lat: 18.7606, lng: 73.8596, quantity_kg: 500 }
      ];

      const sampleDelivery = {
        name: 'FreshBasket Hadapsar Depot (Buyer)',
        lat: 18.5089,
        lng: 73.9260
      };

      const res = await api.post('/routes/optimize', {
        pickupPoints: samplePickups,
        deliveryPoint: sampleDelivery,
        vehicleCapacityKg: 3500
      });

      setOptResult(res.data);
    } catch (err) {
      alert('Route optimization failed: ' + err.message);
    } finally {
      setOptimizing(false);
    }
  };

  const parseWaypoints = (waypointsJson) => {
    try {
      return typeof waypointsJson === 'string' ? JSON.parse(waypointsJson) : waypointsJson;
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold mb-2">
            🚚 OR-Tools Capacitated Vehicle Routing (CVRP)
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Logistics & Fleet Optimization</h1>
          <p className="text-xs text-purple-200 mt-1">Multi-pickup aggregation & route distance minimization</p>
        </div>
        <button
          onClick={handleRunRouteOptimizer}
          disabled={optimizing}
          className="bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Zap className="w-4 h-4 fill-slate-950" /> {optimizing ? 'Calculating OR-Tools Route...' : 'Run Route Optimizer'}
        </button>
      </div>

      {/* BEFORE / AFTER OPTIMIZATION METRICS CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive OpenStreetMap */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-600" /> Active Route Map (OpenStreetMap / Leaflet)
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {optResult ? optResult.solver_used : 'OR-Tools Routing Engine'}
            </span>
          </div>

          <RouteMap
            waypoints={optResult ? optResult.route_waypoints : (selectedRoute ? parseWaypoints(selectedRoute.waypointsJson) : [])}
            height="360px"
          />
        </div>

        {/* Live Optimization Comparison Panel */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Optimization Impact</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded">CVRP Solved</span>
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Traditional Distance</span>
                  <span className="font-bold text-rose-400 line-through">{optResult ? optResult.traditional_distance_km : 142} km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Optimized Distance</span>
                  <span className="font-extrabold text-emerald-400">{optResult ? optResult.total_distance_km : 91} km</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-bold text-white">Distance Saved</span>
                  <span className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                    {optResult ? optResult.distance_saved_km : 51} km Saved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Estimated Fuel Saved</span>
                  <span className="text-base font-black text-amber-400">₹{optResult ? optResult.estimated_cost_saved : 570}</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Vehicle Utilization</span>
                  <span className="text-base font-black text-purple-300">{optResult ? optResult.vehicle_utilization_pct : 88.5}%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 italic text-center">
            * Benchmark simulation based on CVRP road distance matrices around Pune agricultural zone.
          </p>
        </div>

      </div>

      {/* VEHICLES & ACTIVE SHIPMENTS TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Vehicles Fleet */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-600" /> Active Vehicle Fleet
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3">Vehicle No</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Hub Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3 font-extrabold text-slate-900">{v.vehicleNumber}</td>
                    <td className="p-3 text-slate-700">{v.driverName}</td>
                    <td className="p-3 font-bold text-emerald-700">{v.capacityKg} kg</td>
                    <td className="p-3 text-slate-500">{v.currentLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Shipments */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" /> Active Orders & Shipments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Saved</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {routesData.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRoute(r)}
                    className={`cursor-pointer ${selectedRoute?.id === r.id ? 'bg-purple-50 font-bold' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-3 font-extrabold text-slate-900">#ORD-{r.orderId.slice(0, 8)}</td>
                    <td className="p-3">{r.totalDistanceKm} km</td>
                    <td className="p-3 font-bold text-emerald-700">+{r.distanceSavedKm} km</td>
                    <td className="p-3">
                      <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LogisticsDashboard;
