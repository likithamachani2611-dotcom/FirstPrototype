import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate } from '../lib/utils';
import { Item, Claim, UserProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const { currentUser, switchUser, availableProfiles, isSupabaseConnected } = useAuth();
  const { items, claims } = useData();

  if (!currentUser) return null;

  const myItems = items.filter((i: Item) => i.userId === currentUser.id);
  const myClaims = claims.filter((c: Claim) => c.claimantId === currentUser.id || c.reporterId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
          alt={currentUser.fullName}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-teal-500/20 shadow-md shrink-0"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentUser.fullName}
            </h1>
            {currentUser.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Verified Community Member
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
              Role: {currentUser.role}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.email}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.community}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Member since {formatDate(currentUser.createdAt)}
            </span>
          </div>
        </div>

        {/* Trust Score Badge */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center shrink-0 w-32">
          <div className="text-2xl font-extrabold text-teal-700">
            {currentUser.trustScore}%
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mt-0.5">
            Trust Rating
          </span>
          <span className="text-[10px] text-teal-600">Zero false claims</span>
        </div>
      </div>

      {/* Stats Counter Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Reports Filed</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{myItems.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Claims</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{myClaims.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Successful Returns</span>
          <span className="text-2xl font-extrabold text-teal-700 mt-0.5 block">{currentUser.recoveredCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Database Status</span>
          <span className="text-xs font-bold text-slate-800 mt-1.5 block">
            {isSupabaseConnected ? 'Postgres Live' : 'High-Speed Local'}
          </span>
        </div>
      </div>

      {/* Persona Switcher Showcase for Testing */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Switch Active Demo Persona
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test the complete end-to-end lifecycle from different perspectives (Student, Campus Officer, Commuter, Mall Desk).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {availableProfiles.map((p: UserProfile) => (
            <button
              key={p.id}
              onClick={() => switchUser(p.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                currentUser.id === p.id
                  ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <img
                src={p.avatarUrl}
                alt={p.fullName}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{p.fullName}</h4>
                  {currentUser.id === p.id && (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate">{p.community}</p>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide capitalize">
                  {p.role} • Trust: {p.trustScore}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
