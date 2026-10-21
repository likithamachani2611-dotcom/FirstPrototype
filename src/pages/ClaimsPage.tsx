import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  Lock, 
  Sparkles,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ClaimStatus } from '../types';
import { formatDate, formatRelativeTime } from '../lib/utils';

const CLAIM_STATUS_MAP: Record<ClaimStatus, { label: string; badge: string; desc: string }> = {
  submitted: {
    label: 'Submitted',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    desc: 'Waiting for initial review by finder / desk staff.'
  },
  under_review: {
    label: 'Under Review',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    desc: 'Authority is verifying secret characteristics against item.'
  },
  info_requested: {
    label: 'Info Requested',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    desc: 'Additional ownership proof or receipt requested.'
  },
  approved: {
    label: 'Claim Approved',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    desc: 'Ownership established. Ready for safe physical handover.'
  },
  rejected: {
    label: 'Claim Rejected',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    desc: 'Distinguishing features did not match or failed verification.'
  },
  returned_completed: {
    label: 'Returned & Completed',
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    desc: 'Item successfully reunited with rightful owner.'
  },
  withdrawn: {
    label: 'Claim Withdrawn',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    desc: 'Withdrawn by claimant.'
  }
};

export const ClaimsPage: React.FC = () => {
  const { claims, getItemById, updateClaimStatus, addClaimMessage } = useData();
  const { currentUser } = useAuth();

  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || '');
  const [chatInput, setChatInput] = useState('');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  const selectedClaim = claims.find(c => c.id === selectedClaimId);
  const claimedItem = selectedClaim ? getItemById(selectedClaim.itemId) : null;

  // Check roles
  const isReporter = selectedClaim?.reporterId === currentUser?.id;
  const isStaff = currentUser?.role === 'moderator' || currentUser?.role === 'admin';
  const canManageStatus = isReporter || isStaff;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser || !selectedClaim) return;

    addClaimMessage(
      selectedClaim.id,
      currentUser.id,
      currentUser.fullName,
      chatInput.trim()
    );
    setChatInput('');
  };

  const handleStatusChange = (newStatus: ClaimStatus) => {
    if (!selectedClaim) return;

    updateClaimStatus(
      selectedClaim.id,
      newStatus,
      statusUpdateNote || undefined
    );
    setStatusUpdateNote('');

    if (newStatus === 'returned_completed') {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
          <ShieldCheck className="w-4 h-4" />
          Verification Center
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ownership Claims & Safe Return Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage private ownership challenges, inspect secret identifying marks, coordinate handovers, and conclude recoveries.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No active ownership claims</h3>
          <p className="text-xs text-slate-500">
            Claims appear here when a user verifies secret details on a found belonging.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Claims Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
                All Active Claims ({claims.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {claims.map(claim => {
                const item = getItemById(claim.itemId);
                const statusMeta = CLAIM_STATUS_MAP[claim.status];
                const isSelected = claim.id === selectedClaimId;

                return (
                  <button
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                    className={`w-full p-4 text-left transition-colors flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50/70 border-l-4 border-teal-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {item?.title || 'Claimed Belonging'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badge}`}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Claimant: {claim.claimantName}</span>
                      <span>{formatRelativeTime(claim.createdAt)}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic mt-0.5">
                      "{claim.ownershipExplanation}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Claim Details & In-App Coordination (8 cols) */}
          {selectedClaim && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Claim Overview Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${CLAIM_STATUS_MAP[selectedClaim.status].badge}`}>
                        {CLAIM_STATUS_MAP[selectedClaim.status].label}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Claim #{selectedClaim.id.slice(-8)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Claim for: {claimedItem?.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted by <span className="font-semibold text-slate-800">{selectedClaim.claimantName}</span> on {formatDate(selectedClaim.createdAt)}
                    </p>
                  </div>

                  {claimedItem && claimedItem.imageUrls.length > 0 && (
                    <img
                      src={claimedItem.imageUrls[0]}
                      alt={claimedItem.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  )}
                </div>

                {/* 7-Step Workflow Progress Bar */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Workflow Progress: {CLAIM_STATUS_MAP[selectedClaim.status].label}</span>
                    <span className="text-[11px] text-slate-500">{CLAIM_STATUS_MAP[selectedClaim.status].desc}</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {(['submitted', 'under_review', 'info_requested', 'approved', 'returned_completed'] as ClaimStatus[]).map((st, i) => {
                      const isPast = ['submitted', 'under_review', 'info_requested', 'approved', 'returned_completed'].indexOf(selectedClaim.status) >= i;
                      const isCurrent = selectedClaim.status === st;

                      return (
                        <div key={st} className="space-y-1 text-center">
                          <div
                            className={`h-2 rounded-full ${
                              isPast ? 'bg-teal-600' : 'bg-slate-200'
                            }`}
                          />
                          <span className={`text-[10px] block truncate font-medium ${isCurrent ? 'text-teal-800 font-bold' : 'text-slate-400'}`}>
                            {st.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Secret Distinguishing Characteristics (Verified Inspection) */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-600" />
                      Claimant's Secret Distinguishing Proof
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                      Private Evidence
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium bg-white p-3 rounded-xl border border-amber-200/80">
                    "{selectedClaim.secretCharacteristicsProof}"
                  </p>
                  
                  {claimedItem?.distinctiveFeatures && (
                    <div className="pt-2 text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800">Finder's Logged Note for Comparison: </span>
                      <span className="italic">{claimedItem.distinctiveFeatures}</span>
                    </div>
                  )}
                </div>

                {/* Ownership Context & Supporting Documents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Ownership Story / How Lost
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedClaim.ownershipExplanation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Preferred Coordination Method
                    </span>
                    <p className="text-slate-700 font-medium">
                      {selectedClaim.preferredContact}
                    </p>
                    {claimedItem?.safeHandoverProcess && (
                      <p className="text-[11px] text-teal-700 mt-2">
                        <span className="font-bold">Desk Process: </span>
                        {claimedItem.safeHandoverProcess}
                      </p>
                    )}
                  </div>
                </div>

                {/* Supporting Proof Evidence Photos */}
                {selectedClaim.evidenceUrls && selectedClaim.evidenceUrls.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                      Attached Proof Documents ({selectedClaim.evidenceUrls.length})
                    </span>
                    <div className="flex gap-2">
                      {selectedClaim.evidenceUrls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Evidence document"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Authority Status Transition Controls */}
                {canManageStatus && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Authority / Finder Status Actions
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {selectedClaim.status === 'submitted' && (
                        <button
                          onClick={() => handleStatusChange('under_review')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200"
                        >
                          Mark Under Review
                        </button>
                      )}

                      {selectedClaim.status !== 'approved' && selectedClaim.status !== 'returned_completed' && (
                        <button
                          onClick={() => handleStatusChange('approved')}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Claim
                        </button>
                      )}

                      {selectedClaim.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange('returned_completed')}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          Confirm Physical Handover (Mark Recovered)
                        </button>
                      )}

                      {selectedClaim.status !== 'rejected' && selectedClaim.status !== 'returned_completed' && (
                        <button
                          onClick={() => handleStatusChange('rejected')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                        >
                          Reject Claim
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Secure In-App Communication Box */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Secure Private Coordination Channel
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Never shares your personal phone number or email
                  </span>
                </div>

                {/* Messages feed */}
                <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                  {selectedClaim.messages.map(msg => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                          <span className="font-semibold text-slate-700">{msg.senderName}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(msg.timestamp)}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs max-w-sm sm:max-w-md leading-relaxed ${
                            isMe
                              ? 'bg-teal-600 text-white rounded-tr-none'
                              : 'bg-slate-100 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Coordinate safe pickup time or provide clarification..."
                    className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
