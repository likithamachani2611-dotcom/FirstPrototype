import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Tag,
  X
} from 'lucide-react';
import { MatchRecord } from '../../types';
import { formatDate, getConfidenceBadge } from '../../lib/utils';
import { useData } from '../../context/DataContext';

interface MatchCardProps {
  match: MatchRecord;
  onClaimClick?: (foundItemId: string, lostItemId?: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClaimClick }) => {
  const { dismissMatch } = useData();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const confidenceBadge = getConfidenceBadge(match.confidenceLevel);
  const signals = match.signalBreakdown;
  const lost = match.lostItem;
  const found = match.foundItem;

  if (!lost || !found) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 lg:p-6 mb-6">
      
      {/* Header: Score, Confidence, and Dismiss */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 font-extrabold text-lg">
            {match.matchScore}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${confidenceBadge.bg}`}>
                {confidenceBadge.label}
              </span>
              <span className="text-xs text-slate-400">Pair #{match.id.slice(-8)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Heuristic algorithm calculated from 10 item attributes
            </p>
          </div>
        </div>

        <button
          onClick={() => dismissMatch(match.id)}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 p-1 rounded-md hover:bg-slate-50 transition-colors"
          title="Dismiss this match suggestion"
        >
          <X className="w-4 h-4" />
          <span>Dismiss</span>
        </button>
      </div>

      {/* Side-by-side Items Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        
        {/* Left: Lost Item Report */}
        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                Lost Item Report
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-400" />
                Lost: {formatDate(lost.dateLostOrFound)}
              </span>
            </div>

            <div className="flex items-start gap-3 mt-3">
              {lost.imageUrls && lost.imageUrls.length > 0 ? (
                <img
                  src={lost.imageUrls[0]}
                  alt={lost.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Tag className="w-6 h-6 opacity-40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{lost.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {lost.description}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-rose-100/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Category & Brand</span>
                <span className="font-semibold text-slate-700">{lost.category} {lost.brand ? `• ${lost.brand}` : ''}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Reported Location</span>
                <span className="font-medium text-slate-700 truncate block">{lost.locationName}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-right">
            <Link
              to={`/item/${lost.id}`}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 inline-flex items-center gap-1"
            >
              View Lost Report
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right: Found Item Report */}
        <div className="p-4 rounded-xl border border-teal-100 bg-teal-50/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                Found Item Report
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-teal-500" />
                Found: {formatDate(found.dateLostOrFound)}
              </span>
            </div>

            <div className="flex items-start gap-3 mt-3">
              {found.imageUrls && found.imageUrls.length > 0 ? (
                <img
                  src={found.imageUrls[0]}
                  alt={found.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Tag className="w-6 h-6 opacity-40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{found.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {found.description}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-teal-100/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Safekeeping Status</span>
                <span className="font-semibold text-teal-800 truncate block">
                  {found.safekeepingStatus || 'With Finder / Safe Desk'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Found Location</span>
                <span className="font-medium text-slate-700 truncate block">{found.locationName}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-right">
            <Link
              to={`/item/${found.id}`}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1"
            >
              View Found Report
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Human-Readable Algorithmic Explanation */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900">Why this match: </span>
            {match.explanation}
          </div>
        </div>
      </div>

      {/* Accordion Toggle for Detailed Signal Breakdown */}
      <div className="mb-4">
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {detailsOpen ? 'Hide Signal Breakdown' : 'View Detailed Algorithmic Signal Breakdown (8 Weights)'}
        </button>

        {detailsOpen && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-2.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Category (15%)</span>
                  <span className="font-bold text-slate-800">{signals.categoryScore}/15</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.categoryScore / 15) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Title / Name (15%)</span>
                  <span className="font-bold text-slate-800">{signals.nameScore}/15</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.nameScore / 15) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Description (20%)</span>
                  <span className="font-bold text-slate-800">{signals.descriptionScore}/20</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.descriptionScore / 20) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Color Match (10%)</span>
                  <span className="font-bold text-slate-800">{signals.colorScore}/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.colorScore / 10) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Brand / Model (10%)</span>
                  <span className="font-bold text-slate-800">{signals.brandScore}/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.brandScore / 10) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Distinctive (15%)</span>
                  <span className="font-bold text-slate-800">{signals.distinctiveScore}/15</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.distinctiveScore / 15) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Date Proximity (5%)</span>
                  <span className="font-bold text-slate-800">{signals.dateScore}/5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.dateScore / 5) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Location (10%)</span>
                  <span className="font-bold text-slate-800">{signals.locationScore}/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(signals.locationScore / 10) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {signals.contradictionPenalty > 0 && (
              <p className="text-[11px] text-rose-600 font-semibold pt-1">
                Contradiction Penalty Applied: -{signals.contradictionPenalty}%
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 italic">
          Match scores are algorithmic heuristic estimations, not legal confirmation.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onClaimClick) {
                onClaimClick(found.id, lost.id);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Submit Ownership Claim
          </button>
        </div>
      </div>
    </div>
  );
};
