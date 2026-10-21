import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  LayoutGrid, 
  X,
  Map as MapIcon
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ItemCard } from '../components/common/ItemCard';
import { ItemsMap } from '../components/common/ItemsMap';
import { ItemCategory } from '../types';

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Bags & Wallets',
  'Keys',
  'Cards & Documents',
  'Books & Stationery',
  'Clothing & Accessories',
  'Jewelry & Watches',
  'Water Bottles',
  'Musical Instruments',
  'Sports Equipment',
  'Other'
];

export const BrowsePage: React.FC = () => {
  const { items } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from query params or state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCommunity, setSelectedCommunity] = useState(searchParams.get('community') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Extract distinct communities for filter dropdown
  const communities = useMemo(() => {
    return Array.from(new Set(items.map(i => i.community)));
  }, [items]);

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Keyword search (title, description, brand, color)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesBrand = (item.brand || '').toLowerCase().includes(q);
        const matchesColor = item.primaryColor.toLowerCase().includes(q);
        const matchesLoc = item.locationName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesColor && !matchesLoc) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Type (lost / found)
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // 4. Community
      if (selectedCommunity !== 'all' && item.community !== selectedCommunity) {
        return false;
      }

      // 5. Status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateLostOrFound).getTime() - new Date(a.dateLostOrFound).getTime();
      }
      return new Date(a.dateLostOrFound).getTime() - new Date(b.dateLostOrFound).getTime();
    });
  }, [items, searchQuery, selectedCategory, selectedType, selectedCommunity, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCommunity('all');
    setSelectedStatus('all');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || selectedCommunity !== 'all' || selectedStatus !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Reported Belongings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search active lost and found reports. Personal contact information and secret identifying marks are masked for privacy.
          </p>
        </div>

        {/* View Mode Toggle: Grid or Map */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-teal-600" />
            Interactive Map
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Top search input row */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, brand, color, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          
          {/* 1. Report Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost Belongings</option>
              <option value="found">Found Belongings</option>
            </select>
          </div>

          {/* 2. Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 3. Community / Campus */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Community / Location
            </label>
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="all">All Communities</option>
              {communities.map(comm => (
                <option key={comm} value={comm}>{comm}</option>
              ))}
            </select>
          </div>

          {/* 4. Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="all">All Statuses</option>
              <option value="open">Active Reports</option>
              <option value="claim_pending">Claim in Review</option>
              <option value="resolved">Recovered</option>
            </select>
          </div>

          {/* 5. Sort By */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="newest">Newest Date</option>
              <option value="oldest">Oldest Date</option>
            </select>
          </div>
        </div>

        {/* Clear Filters bar */}
        {hasActiveFilters && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Showing {filteredItems.length} matching reports</span>
            <button
              onClick={clearFilters}
              className="font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main View: Grid or Map */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <ItemsMap items={filteredItems} />
          <p className="text-xs text-slate-500 italic text-center">
            Click any pin to inspect item description and link to full details.
          </p>
        </div>
      ) : (
        <div>
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3 my-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No matching reports found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Try widening your search terms, changing the category, or clearing active filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
