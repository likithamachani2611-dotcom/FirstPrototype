import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { Item } from '../../types';
import { formatDate, getStatusBadge, getTypeBadge } from '../../lib/utils';

interface ItemCardProps {
  item: Item;
  matchScore?: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, matchScore }) => {
  const statusBadge = getStatusBadge(item.status);
  const typeBadge = getTypeBadge(item.type);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      
      {/* Image container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <img
            src={item.imageUrls[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <Tag className="w-10 h-10 mb-1 opacity-40" />
            <span className="text-xs font-medium">No photo provided</span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${typeBadge.bg}`}>
            {typeBadge.label}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 text-slate-700 border border-slate-200 shadow-sm">
            {item.category}
          </span>
        </div>

        {/* Match Score Badge if applicable */}
        {typeof matchScore === 'number' && (
          <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {matchScore}% Match
          </div>
        )}

        {/* Status pill bottom left */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border backdrop-blur-md ${statusBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
            {statusBadge.label}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-600 truncate max-w-[180px]">
              {item.community}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formatDate(item.dateLostOrFound)}
            </span>
          </div>

          <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-1.5">
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>

          {/* Color & Attributes tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.primaryColor && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                Color: {item.primaryColor}
              </span>
            )}
            {item.brand && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                {item.brand}
              </span>
            )}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 truncate mr-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.locationName}</span>
          </div>

          <Link
            to={`/item/${item.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 shrink-0"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
