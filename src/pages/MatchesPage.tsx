import React, { useState } from 'react';
import { 
  Sparkles, 
  Filter, 
  RotateCw, 
  Info
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MatchCard } from '../components/common/MatchCard';
import { VerificationModal } from '../components/common/VerificationModal';
import { MatchRecord } from '../types';

export const MatchesPage: React.FC = () => {
  const { matches, regenerateMatches, getItemById } = useData();
  const { currentUser } = useAuth();

  const [filterConfidence, setFilterConfidence] = useState<string>('all');
  const [filterUserOnly, setFilterUserOnly] = useState<boolean>(true);
  const [activeClaimItem, setActiveClaimItem] = useState<{ foundId: string; lostId?: string } | null>(null);

  // Filter matches
  const filteredMatches = matches.filter((m: MatchRecord) => {
    if (m.status !== 'active') return false;

    // Filter by user's items
    if (filterUserOnly && currentUser) {
      const isUserLost = m.lostItem?.userId === currentUser.id;
      const isUserFound = m.foundItem?.userId === currentUser.id;
      if (!isUserLost && !isUserFound) return false;
    }

    // Filter by confidence
    if (filterConfidence !== 'all' && m.confidenceLevel !== filterConfidence) {
      return false;
    }

    return true;
  });

  const claimItem = activeClaimItem ? getItemById(activeClaimItem.foundId) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Core Platform Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Intelligent Match Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Algorithmic correlation of lost and found belongings across categories, descriptions, locations, colors, and timestamps.
          </p>
        </div>

        <button
          onClick={regenerateMatches}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5 text-teal-600" />
          Re-evaluate Signals
        </button>
      </div>

      {/* Heuristic Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Algorithmic Heuristic Notice:</span> Match scores represent weighted mathematical similarities across 10 distinct features. A high match score indicates a strong candidate for investigation, not verified ownership. Ownership is established via private claim proof.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Confidence:
          </span>

          {['all', 'Strong Candidate', 'Possible Match', 'Weak Candidate'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterConfidence(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterConfidence === lvl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lvl === 'all' ? 'All Confidences' : lvl}
            </button>
          ))}
        </div>

        {/* Toggle User Only */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
          <input
            type="checkbox"
            checked={filterUserOnly}
            onChange={(e) => setFilterUserOnly(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
          />
          <span>Show My Reports Only ({currentUser?.fullName.split(' ')[0]})</span>
        </label>
      </div>

      {/* Match Cards List */}
      <div>
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800">No active matches found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {filterUserOnly
                ? "No matching found items found for your reports yet, or toggle 'Show My Reports Only' to see community matches."
                : 'No candidate pairs meet the current filter criteria.'}
            </p>
            {filterUserOnly && (
              <button
                onClick={() => setFilterUserOnly(false)}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 underline"
              >
                View all community matches
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map((match: MatchRecord) => (
              <MatchCard
                key={match.id}
                match={match}
                onClaimClick={(foundId: string, lostId?: string) => setActiveClaimItem({ foundId, lostId })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Verification Claim Modal if started */}
      {claimItem && (
        <VerificationModal
          item={claimItem}
          lostItemId={activeClaimItem?.lostId}
          isOpen={Boolean(activeClaimItem)}
          onClose={() => setActiveClaimItem(null)}
          onSuccess={() => setActiveClaimItem(null)}
        />
      )}
    </div>
  );
};
