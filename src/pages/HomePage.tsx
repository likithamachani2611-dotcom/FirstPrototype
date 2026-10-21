import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ItemCard } from '../components/common/ItemCard';
import { calculatePlatformStats } from '../lib/utils';
import { RECOVERY_STORIES } from '../lib/mockData';

const POPULAR_CATEGORIES = [
  'Electronics',
  'Bags & Wallets',
  'Keys',
  'Cards & Documents',
  'Clothing & Accessories',
  'Jewelry & Watches',
  'Water Bottles'
];

export const HomePage: React.FC = () => {
  const { items, matches } = useData();
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'lost' | 'found'>('all');

  const stats = calculatePlatformStats(items);
  const activeMatchesCount = matches.filter(m => m.status === 'active').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(searchKeyword)}`);
  };

  // Recent items
  const recentItems = items
    .filter(i => selectedTab === 'all' || i.type === selectedTab)
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-teal-400/10 via-emerald-400/10 to-amber-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200/90 text-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>Intelligent Lost-and-Found Network</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Explainable AI Matching
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Lost Something? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 bg-clip-text text-transparent">
              Let's Find It Together.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Findora intelligently compares lost-item reports with found-item reports across colleges, transit hubs, and public spaces using item attributes, colors, dates, and locations — with private proof to prevent false claims.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-2 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-600 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search lost or found items (e.g., 'MacBook Pro', 'Leather Wallet', 'Keys')..."
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-700 hover:bg-teal-800 shadow-md shadow-teal-700/20 transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
              <span className="text-xs font-semibold text-slate-400 mr-1">Popular:</span>
              {POPULAR_CATEGORIES.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/80 hover:bg-white text-slate-600 border border-slate-200 hover:border-slate-300 font-medium transition-colors shadow-2xs"
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/report-lost"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Report a Lost Item
            </Link>
            <Link
              to="/report-found"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-teal-900 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              I Found Something
            </Link>
          </div>
        </div>
      </section>

      {/* 2. REAL DATABASE METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.totalReports}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Total Reports Filed
              </p>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {stats.lostCount} Lost • {stats.foundCount} Found
              </span>
            </div>

            <div className="p-2 pt-6 lg:pt-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 tracking-tight flex items-center justify-center gap-1">
                <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
                {activeMatchesCount}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Active Algorithmic Matches
              </p>
              <span className="text-[11px] text-teal-600 font-medium mt-0.5 block">
                Explainable Signals
              </span>
            </div>

            <div className="p-2 pt-6 lg:pt-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 tracking-tight">
                {stats.recoveredCount}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Belongings Safely Recovered
              </p>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Verified Handover Process
              </span>
            </div>

            <div className="p-2 pt-6 lg:pt-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.communities}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Participating Communities
              </p>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Campuses, Hubs & Malls
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENTLY REPORTED ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
              <Clock className="w-3.5 h-3.5" />
              Live Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recently Reported Belongings
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setSelectedTab('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedTab === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({items.filter(i => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setSelectedTab('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedTab === 'found'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({items.filter(i => i.type === 'found').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
          >
            <span>Explore All {items.length} Reported Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              The Findora Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How Findora Recovers Belongings
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Combining algorithmic signal evaluation with double-blind ownership verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-extrabold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">1. Report Item</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log the item with category, colors, date, and map coordinates. Finders keep secret details hidden to challenge false claimants.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">2. Smart Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The engine weighs 10 attributes (name, category, colors, brand, proximity, dates) and generates an explainable confidence score.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-extrabold text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">3. Private Proof</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The claimant answers secret questions (stickers, engravings, serial number) without exposing personal phone numbers or emails.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">4. Safe Handover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet at campus security, transit master desk, or mall customer service to safely return the item and conclude the claim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUCCESSFUL RECOVERIES & STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Community Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Real Recovery Highlights
            </h2>
          </div>
          <Link
            to="/browse?status=resolved"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Recoveries</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECOVERY_STORIES.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-teal-700 font-semibold mb-2">
                    <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                      Recovered in {story.timeToRecover}
                    </span>
                    <span className="text-slate-400">{story.location}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{story.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{story.description}</p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Return & Handover</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
