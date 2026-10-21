import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Tag, 
  Share2, 
  EyeOff
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatDate, getStatusBadge, getTypeBadge } from '../lib/utils';
import { VerificationModal } from '../components/common/VerificationModal';
import { ItemCard } from '../components/common/ItemCard';
import { MatchCard } from '../components/common/MatchCard';
import { Item, MatchRecord } from '../types';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById, items, matches } = useData();
  const { currentUser } = useAuth();

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const item = getItemById(id || '');

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Tag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested lost or found report does not exist or has been removed.</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Browse Items
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === item.userId;
  const isLost = item.type === 'lost';
  const statusBadge = getStatusBadge(item.status);
  const typeBadge = getTypeBadge(item.type);

  // Relevant matches for this specific item
  const relevantMatches = matches.filter((m: MatchRecord) => 
    (m.lostItemId === item.id || m.foundItemId === item.id) && m.status === 'active'
  );

  // Similar items (same category, different item)
  const similarItems = items
    .filter((i: Item) => i.id !== item.id && i.category === item.category)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Directory
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copiedLink ? 'Link Copied!' : 'Share Report'}
        </button>
      </div>

      {/* Main Grid: Details & Media */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Media Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden border border-slate-200/90 shadow-xs relative">
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Tag className="w-12 h-12 mb-2 opacity-30" />
                <span className="text-xs font-semibold">No photograph uploaded</span>
              </div>
            )}

            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${typeBadge.bg}`}>
                {typeBadge.label}
              </span>
            </div>
          </div>

          {/* Safe Privacy Notice */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-teal-800">
              <Lock className="w-4 h-4 text-teal-600" />
              Findora Privacy & Security Shield
            </div>
            <p className="text-[11px] text-teal-700 leading-relaxed">
              Phone numbers, email addresses, and secret distinctive characteristics are kept strictly private. Handover coordination is handled through verified safe channels.
            </p>
          </div>
        </div>

        {/* Right Column: Information & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {item.category}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                {statusBadge.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ref #{item.id.slice(-8)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.title}
            </h1>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Reported in {item.community}</span>
              <span>•</span>
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{isLost ? 'Lost on' : 'Found on'} {formatDate(item.dateLostOrFound)}</span>
              {item.approximateTime && <span>at ~{item.approximateTime}</span>}
            </p>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Public Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Attributes Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Primary Color</span>
              <span className="text-xs font-bold text-slate-800">{item.primaryColor}</span>
            </div>
            {item.brand && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Brand</span>
                <span className="text-xs font-bold text-slate-800">{item.brand}</span>
              </div>
            )}
            {item.model && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Model</span>
                <span className="text-xs font-bold text-slate-800">{item.model}</span>
              </div>
            )}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Location Reported</span>
              <span className="text-xs font-bold text-slate-800 truncate block">{item.locationName}</span>
            </div>
            {item.safekeepingStatus && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Safekeeping Status</span>
                <span className="text-xs font-bold text-teal-800">{item.safekeepingStatus}</span>
              </div>
            )}
          </div>

          {/* Distinctive Features */}
          {item.distinctiveFeatures && (!item.isDistinctiveFeaturePrivate || isOwner || currentUser?.role === 'moderator') && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Distinctive Identifying Details
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                {item.distinctiveFeatures}
              </p>
            </div>
          )}

          {/* If Concealed */}
          {item.isDistinctiveFeaturePrivate && !isOwner && currentUser?.role !== 'moderator' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-slate-400" />
                Special identifying marks concealed by finder to challenge false claims.
              </span>
              <span className="text-[11px] font-bold text-teal-700">Protected</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!isOwner && !isLost && item.status !== 'resolved' && (
              <button
                onClick={() => setClaimModalOpen(true)}
                className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                This is My Item — Submit Claim
              </button>
            )}

            {isOwner && (
              <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                You are the registered reporter of this item
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Relevant Potential Matches Section */}
      {relevantMatches.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Intelligent Algorithm Discovery
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Potential Matches for this Item ({relevantMatches.length})
            </h2>
          </div>

          <div className="space-y-4">
            {relevantMatches.map((m: MatchRecord) => (
              <MatchCard
                key={m.id}
                match={m}
                onClaimClick={() => setClaimModalOpen(true)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Similar Items Section */}
      {similarItems.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-900">
            Other {item.category} Reports in this Community
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarItems.map((sim: Item) => (
              <ItemCard key={sim.id} item={sim} />
            ))}
          </div>
        </section>
      )}

      {/* Claim Modal */}
      <VerificationModal
        item={item}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
      />
    </div>
  );
};
