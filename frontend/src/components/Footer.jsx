import React from 'react';
import { Sprout, ShieldCheck, Cpu, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">KisanDirect <span className="text-emerald-400">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "From Farm to Buyer — Fairer, Faster, Smarter."<br />
              Eliminating intermediaries, boosting farmer income, and optimizing agricultural logistics across India.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-[11px] text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Prototype Simulation Data
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">SIH Problem Statement</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><strong className="text-slate-200">ID:</strong> 26033</li>
              <li><strong className="text-slate-200">Ministry:</strong> Consumer Affairs, Food & Public Distribution</li>
              <li><strong className="text-slate-200">Department:</strong> Department of Consumer Affairs (DoCA)</li>
              <li><strong className="text-slate-200">Category:</strong> Software</li>
              <li><strong className="text-slate-200">Theme:</strong> Agriculture & Rural Tech</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-400" /> Python FastAPI ML Engine</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-400" /> Google OR-Tools Routing</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-400" /> Express REST API & Prisma</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> OpenStreetMap & Leaflet</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Demonstration Roles</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>🌾 Farmer Dashboard</li>
              <li>🏢 FPO Aggregation Hub</li>
              <li>🛒 Bulk Buyer Procurement</li>
              <li>🚚 Logistics & Fleet Optimizer</li>
              <li>🏛️ DoCA Government Portal</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 KisanDirect AI. Developed for Smart India Hackathon (SIH 26033).</p>
          <p className="font-mono text-[11px] text-slate-400">PREDICT → MATCH → AGGREGATE → OPTIMIZE → DELIVER</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
