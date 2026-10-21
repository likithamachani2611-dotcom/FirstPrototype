import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid
} from 'recharts';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  FileText, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { calculatePlatformStats, formatDate } from '../lib/utils';
import { ItemCard } from '../components/common/ItemCard';
import { Item, Claim } from '../types';

const COLORS = ['#0D9488', '#F59E0B', '#6366F1', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'];

export const DashboardPage: React.FC = () => {
  const { items, matches, claims } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-reports' | 'my-claims'>('overview');

  const stats = calculatePlatformStats(items);

  // User's own items
  const myItems = useMemo(() => {
    return items.filter((i: Item) => i.userId === currentUser?.id);
  }, [items, currentUser]);

  const myClaims = useMemo(() => {
    return claims.filter((c: Claim) => c.claimantId === currentUser?.id || c.reporterId === currentUser?.id);
  }, [claims, currentUser]);

  // Aggregate Category Chart Data
  const categoryData = useMemo(() => {
    const map: Record<string, { lost: number; found: number; resolved: number }> = {};
    items.forEach((item: Item) => {
      if (!map[item.category]) {
        map[item.category] = { lost: 0, found: 0, resolved: 0 };
      }
      if (item.status === 'resolved') {
        map[item.category].resolved += 1;
      } else if (item.type === 'lost') {
        map[item.category].lost += 1;
      } else {
        map[item.category].found += 1;
      }
    });

    return Object.entries(map).map(([name, counts]) => ({
      name: name.split(' ')[0], // abbreviation
      Lost: counts.lost,
      Found: counts.found,
      Recovered: counts.resolved
    }));
  }, [items]);

  // Aggregate Community Data
  const communityData = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i: Item) => {
      const comm = i.community.split(' ')[0];
      map[comm] = (map[comm] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <Layers className="w-4 h-4" />
            Network Intelligence & Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Findora Analytics & User Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time recovery metrics, algorithmic performance data, and personal report tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report-lost"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Report Lost
          </Link>
          <Link
            to="/report-found"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 hover:bg-teal-100 shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Report Found
          </Link>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Network Overview & Charts
        </button>
        <button
          onClick={() => setActiveTab('my-reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'my-reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Reports ({myItems.length})
        </button>
        <button
          onClick={() => setActiveTab('my-claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'my-claims'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Ownership Claims ({myClaims.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & RECHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Network Reports
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {stats.totalReports}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {stats.lostCount} Lost • {stats.foundCount} Found
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Algorithmic Matches
              </span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {matches.filter((m: any) => m.status === 'active').length}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                10-Signal Mathematical Score
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Verified Recoveries
              </span>
              <div className="text-3xl font-extrabold text-teal-700 mt-1">
                {stats.recoveredCount}
              </div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                {stats.recoveryRate}% Recovery Rate
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Communities
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {stats.communities}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Colleges, Malls & Transit Hubs
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Distribution BarChart (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Item Distribution by Category
                </h3>
                <p className="text-xs text-slate-500">
                  Comparison of Lost, Found, and Successfully Recovered belongings.
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="Lost" fill="#E11D48" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Found" fill="#0D9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Recovered" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Community Share PieChart (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Activity by Community
                </h3>
                <p className="text-xs text-slate-500">
                  Proportion of reports across local partner hubs.
                </p>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={communityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {communityData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY REPORTS */}
      {activeTab === 'my-reports' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Reports Logged by {currentUser?.fullName}
              </h2>
              <p className="text-xs text-slate-500">
                You have filed {myItems.length} lost or found report(s).
              </p>
            </div>
          </div>

          {myItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No reports filed yet</h3>
              <p className="text-xs text-slate-500">
                Switch users in the top bar or file a lost or found report to see it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item: Item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY CLAIMS */}
      {activeTab === 'my-claims' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your Ownership Claims & Handover Requests
            </h2>
            <p className="text-xs text-slate-500">
              Claims you have submitted or received as finder.
            </p>
          </div>

          {myClaims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No active claims</h3>
              <p className="text-xs text-slate-500">
                Submit an ownership claim on a found item to track its verification here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myClaims.map((c: Claim) => (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        Status: {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{c.id.slice(-8)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Ownership Proof: "{c.secretCharacteristicsProof}"
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Submitted on {formatDate(c.createdAt)} • Preferred: {c.preferredContact}
                    </p>
                  </div>

                  <Link
                    to="/claims"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 shrink-0"
                  >
                    <span>Open in Claims Manager</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
