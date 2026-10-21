import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ItemCategory, MatchRecord } from '../types';
import { LocationPicker } from '../components/common/LocationPicker';
import { uploadItemPhoto } from '../lib/supabase';
import { MatchCard } from '../components/common/MatchCard';
import { findMatchesForItem } from '../lib/matchingEngine';

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

export const ReportLostPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addItem, items } = useData();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [community, setCommunity] = useState(currentUser?.community || 'Stanford University Campus');
  const [locationName, setLocationName] = useState('');
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('14:00');
  const [latitude, setLatitude] = useState<number>(37.4275);
  const [longitude, setLongitude] = useState<number>(-122.1697);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [contactPreference, setContactPreference] = useState<'platform_only' | 'email_safe' | 'phone_masked'>('platform_only');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItemRef, setSubmittedItemRef] = useState<string | null>(null);
  const [discoveredMatches, setDiscoveredMatches] = useState<MatchRecord[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadItemPhoto(file, 'item-photos');
      setImageUrls(prev => [...prev, url]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      const createdItem = addItem({
        type: 'lost',
        title,
        category,
        description,
        primaryColor,
        secondaryColor: secondaryColor || undefined,
        brand: brand || undefined,
        model: model || undefined,
        distinctiveFeatures,
        locationName: locationName || 'General Campus Area',
        community,
        latitude,
        longitude,
        dateLostOrFound: dateLost,
        approximateTime,
        imageUrls: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'
        ],
        status: 'open',
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        userAvatar: currentUser.avatarUrl,
        contactPreference
      });

      // Run immediate matching engine against found items
      const candidateMatches = findMatchesForItem(createdItem, items);
      setDiscoveredMatches(candidateMatches);
      setSubmittedItemRef(createdItem.id);
      setStep(5); // Confirmation & Matches step
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
          <PlusCircle className="w-4 h-4" />
          Lost Item Registration
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Lost Belonging
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide accurate details. Findora's matching engine automatically scans found-item reports and alerts you of potential matches.
        </p>

        {step < 5 && (
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s === step ? 'bg-rose-600' : s < step ? 'bg-rose-200' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* FORM BODY */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 1: Item Identity</h2>
              <p className="text-xs text-slate-500">What item did you lose?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Item Title / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Space Gray MacBook Pro 14-inch"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 font-medium"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Color <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="e.g. Black, Silver, Navy Blue"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Secondary Color (Optional)
                </label>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="e.g. Black, Silver, White"
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Brand (If known)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Sony, Bellroy, Nike"
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Model / Series (If known)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. M2 Pro, WH-1000XM4"
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!title || !primaryColor}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue to Description</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Description & Distinctive Features */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 2: Description & Distinguishing Marks</h2>
              <p className="text-xs text-slate-500">Provide details that help confirm ownership.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Public Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what the item looks like, condition, where it was left..."
                rows={4}
                required
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Secret Distinctive Features (Critical for Claim Verification)
                </label>
                <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Used for Anti-Fraud
                </span>
              </div>
              <textarea
                value={distinctiveFeatures}
                onChange={(e) => setDistinctiveFeatures(e.target.value)}
                placeholder="Mention specific stickers, engravings, scratches, lock screen picture, or inside card names that only the real owner knows..."
                rows={3}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 bg-amber-50/20 leading-relaxed"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="button"
                disabled={!description}
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location, Time & Map Pin */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 3: Location & Time Lost</h2>
              <p className="text-xs text-slate-500">Pin where you last saw the item.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Community / Campus <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="e.g. Stanford University Campus, Central Station"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Specific Place / Room Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Green Library 2nd Floor Quiet Area"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Date Lost <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateLost}
                  onChange={(e) => setDateLost(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Approximate Time
                </label>
                <input
                  type="time"
                  value={approximateTime}
                  onChange={(e) => setApproximateTime(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>
            </div>

            {/* Interactive Leaflet Location Picker */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pin Location on Map
              </label>
              <LocationPicker
                initialLat={latitude}
                initialLng={longitude}
                onLocationSelect={(lat: number, lng: number, address?: string) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  if (address && !locationName) {
                    setLocationName(address);
                  }
                }}
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="button"
                disabled={!locationName}
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue to Photos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Photos, Contact & Submission */}
        {step === 4 && (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 4: Photographs & Verification Preferences</h2>
              <p className="text-xs text-slate-500">Add an optional reference photo or previous receipt.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Item Photo (Optional but recommended)
              </label>
              <label className="cursor-pointer block border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Click to upload a photo of your item or similar model
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  PNG, JPG, WEBP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imageUrls.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {imageUrls.map((u, i) => (
                    <img
                      key={i}
                      src={u}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Preferred Safe Contact Method
              </label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              >
                <option value="platform_only">In-app private notifications only (Recommended)</option>
                <option value="email_safe">Relay via verified campus email (Masked)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                By submitting, your report will be encrypted and indexed in Findora. The algorithm will immediately check across all active found items.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                {isSubmitting ? 'Registering & Matching...' : 'Submit Report & Scan Matches'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Success & Immediate AI Matches */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Lost Report Registered Successfully!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Reference ID: <span className="font-mono font-bold text-slate-900">#{submittedItemRef?.slice(-8)}</span>. 
                Your item is now live and monitored across our community network.
              </p>
            </div>

            {/* Instant matching results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Instant Matches Discovered ({discoveredMatches.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Findora compared your report against current active found belongings.
                  </p>
                </div>
              </div>

              {discoveredMatches.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No immediate high-confidence matches found yet. We will notify you automatically as soon as a matching item is reported.
                </div>
              ) : (
                <div className="space-y-4">
                  {discoveredMatches.map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Link
                to="/browse"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Browse All Reports
              </Link>
              <Link
                to="/matches"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
              >
                Go to Match Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
