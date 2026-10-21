import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Lock, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { isSupabaseConnected } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Findora</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Findora is an intelligent lost-and-found network built for colleges, transit hubs, malls, and public spaces. 
              Safely matching lost belongings using explainable algorithmic signals and private ownership proof.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400' : 'bg-teal-400'}`}></span>
                {isSupabaseConnected ? 'Supabase Postgres Connected' : 'Local High-Speed Engine Active'}
              </span>
            </div>
          </div>

          {/* Safe Return Guidelines */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              Safe Handover Policy
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                <span>Meet at designated campus security desks or mall lost property counters.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                <span>Private distinguishing details are never revealed to unauthorized claimants.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                <span>Never pay money or exchange cash for item return claims.</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-100">
              Platform Links
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <Link to="/browse" className="hover:text-white transition-colors">
                  Search & Browse Reports
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-white transition-colors">
                  Intelligent Match Center
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-white transition-colors">
                  Submit Lost Report
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-white transition-colors">
                  Submit Found Report
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Community Recovery Analytics
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Matching Algorithm & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Anti-Fraud */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-100 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              Privacy & Anti-Fraud
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Findora uses double-blind ownership verification: distinctive features entered by finders are masked from public listing cards, ensuring only legitimate owners can describe them.
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              Supports college campuses, transit authorities, and municipal public spaces.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Findora Smart Lost-and-Found Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Built for Community Recovery
            </span>
            <Link to="/how-it-works" className="hover:text-slate-300">
              Privacy & Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
