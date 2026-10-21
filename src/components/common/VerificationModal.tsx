import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Upload, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Item } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { uploadItemPhoto } from '../../lib/supabase';

interface VerificationModalProps {
  item: Item;
  lostItemId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  item,
  lostItemId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const { submitClaim } = useData();

  const [ownershipExplanation, setOwnershipExplanation] = useState('');
  const [secretProof, setSecretProof] = useState('');
  const [preferredContact, setPreferredContact] = useState('In-app secure messaging');
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadItemPhoto(file, 'claim-evidence');
      setEvidenceFiles(prev => [...prev, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('You must be signed in to submit an ownership claim.');
      return;
    }

    if (!ownershipExplanation.trim() || !secretProof.trim()) {
      setErrorMsg('Please complete all verification fields to prove ownership.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      submitClaim({
        itemId: item.id,
        lostItemId: lostItemId,
        claimantId: currentUser.id,
        claimantName: currentUser.fullName,
        claimantAvatar: currentUser.avatarUrl,
        reporterId: item.userId,
        ownershipExplanation,
        secretCharacteristicsProof: secretProof,
        evidenceUrls: evidenceFiles,
        preferredContact,
        status: 'submitted'
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Submit Ownership Verification</h3>
              <p className="text-xs text-teal-200/80">Private proof for: {item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Claim Submitted Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your private proof and secret characteristics have been securely submitted to the holding authority / finder. You will receive an in-app notification once reviewed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Privacy notice banner */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-900">
              <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Zero Public Exposure Guarantee:</span> The details you provide here are strictly confidential and will only be reviewed by the verified finder or holding facility staff to prevent fraudulent claims.
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Field 1: Ownership explanation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                How and when did you lose this item? <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={ownershipExplanation}
                onChange={(e) => setOwnershipExplanation(e.target.value)}
                placeholder="Describe where and when you last had it, what you were doing, or any context..."
                rows={3}
                required
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>

            {/* Field 2: Secret distinguishing characteristics */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Secret Distinguishing Details <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hidden from Public
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Describe private features not mentioned in the public listing (e.g., specific stickers, lock screen photo, internal contents, engravings, serial number, scratch location).
              </p>
              <textarea
                value={secretProof}
                onChange={(e) => setSecretProof(e.target.value)}
                placeholder="e.g. My lock screen has a picture of my Golden Retriever; there is an engraving on the bottom left corner with initials..."
                rows={3}
                required
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all bg-amber-50/20"
              />
            </div>

            {/* Field 3: Supporting Evidence / Photos */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Optional Supporting Proof / Evidence
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Upload receipts, previous selfies with the item, original purchase boxes, or proof of serial number.
              </p>
              
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document / Photo
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {evidenceFiles.length > 0 && (
                  <span className="text-xs text-teal-700 font-semibold">
                    {evidenceFiles.length} proof file(s) attached
                  </span>
                )}
              </div>

              {evidenceFiles.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {evidenceFiles.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Proof"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Field 4: Preferred Contact & Handover */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Preferred Handover & Coordination Method
              </label>
              <select
                value={preferredContact}
                onChange={(e) => setPreferredContact(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all bg-white"
              >
                <option value="In-app secure messaging">In-app secure messaging (Recommended - private)</option>
                <option value="Campus Security Desk / Lost Property Counter">Meet at Campus Security Desk</option>
                <option value="Official Mall Guest Services Center">Meet at Mall Guest Services Center</option>
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Verifying...' : 'Submit Claim Privately'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
