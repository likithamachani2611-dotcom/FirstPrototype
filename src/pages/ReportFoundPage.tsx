import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  EyeOff
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

export const ReportFoundPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addItem, items } = useData();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  
  // Public Description vs Private Secret Marks
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [isDistinctivePrivate] = useState(true);

  // Safekeeping and Handover
  const [safekeepingStatus, setSafekeepingStatus] = useState('With Finder / Desk Staff');
  const [safeHandoverProcess, setSafeHandoverProcess] = useState('Claimant must state secret characteristics or prove ownership.');
  
  // Location
  const [community, setCommunity] = useState(currentUser?.community || 'Stanford University Campus');
  const [locationName, setLocationName] = useState('');
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('11:00');
  const [latitude, setLatitude] = useState<number>(37.4277);
  const [longitude, setLongitude] = useState<number>(-122.1695);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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
        type: 'found',
        title,
        category,
        description,
        primaryColor,
        secondaryColor: secondaryColor || undefined,
        brand: brand || undefined,
        model: model || undefined,
        distinctiveFeatures,
        isDistinctiveFeaturePrivate: isDistinctivePrivate,
        locationName: locationName || 'Campus Main Grounds',
        community,
        latitude,
        longitude,
        dateLostOrFound: dateFound,
        approximateTime,
        imageUrls: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600'
        ],
        status: 'open',
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        userAvatar: currentUser.avatarUrl,
        safekeepingStatus,
        safeHandoverProcess,
        contactPreference: 'platform_only'
      });

      // Immediate match check
      const matches = findMatchesForItem(createdItem, items);
      setDiscoveredMatches(matches);
      setSubmittedItemRef(createdItem.id);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Found Belonging Registration
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Found Item
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Help return a lost belonging. Keep sensitive identifying features private so legitimate owners can verify themselves.
        </p>

        {step < 5 && (
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s === step ? 'bg-teal-600' : s < step ? 'bg-teal-200' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: Found Item Basics */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 1: Item Category & Characteristics</h2>
              <p className="text-xs text-slate-500">Provide general, safe identification attributes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  General Title / Name <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Space Gray Apple Laptop with Stickers"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category <span className="text-teal-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Color <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="e.g. Black, Silver, Brown"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
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
                  placeholder="e.g. White, Red, Blue"
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Brand (If visible)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Bellroy, Bose, Toyota"
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Model (If visible)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. MacBook Pro, Hide & Seek"
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!title || !primaryColor}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue to Description</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Public Description vs Private Secret Marks */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 2: Public vs Private Information</h2>
              <p className="text-xs text-slate-500">
                Crucial for anti-fraud: conceal specific details so only the true owner can describe them.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Safe Public Description <span className="text-teal-600">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Safe overview (e.g. 'Found unattended on 2nd floor desk row B. Turned over to campus security counter.')..."
                rows={3}
                required
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-amber-600" />
                  Concealed Distinctive Features (Private to Finder/Authority)
                </label>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Hidden from Public
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Enter details only the true owner would know (e.g. "There is a personalized engraving saying 'To Sarah with love' on bottom", or "Monogram 'A.R.' stamped inside"). 
                Findora uses this to verify claims.
              </p>
              <textarea
                value={distinctiveFeatures}
                onChange={(e) => setDistinctiveFeatures(e.target.value)}
                placeholder="Enter private distinguishing characteristics here..."
                rows={3}
                className="w-full text-xs rounded-xl border border-amber-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
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
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location Found & Leaflet Map */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 3: Found Location & Time</h2>
              <p className="text-xs text-slate-500">Pin where the item was discovered.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Community / Organization <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="e.g. Stanford University Campus, Central Transit Hub"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  General Location Name <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Green Library 2nd Floor, Desks Row B"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Date Found <span className="text-teal-600">*</span>
                </label>
                <input
                  type="date"
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Approximate Time Found
                </label>
                <input
                  type="time"
                  value={approximateTime}
                  onChange={(e) => setApproximateTime(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pin Exact Discovery Location
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
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue to Safekeeping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Safekeeping, Handover & Photo */}
        {step === 4 && (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Step 4: Safekeeping & Handover Process</h2>
              <p className="text-xs text-slate-500">Where is the item currently kept and how will it be returned?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Safekeeping Status <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={safekeepingStatus}
                  onChange={(e) => setSafekeepingStatus(e.target.value)}
                  placeholder="e.g. Locked in Campus Police Desk #1, or In Office 302"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Safe Handover Location / Process <span className="text-teal-600">*</span>
                </label>
                <input
                  type="text"
                  value={safeHandoverProcess}
                  onChange={(e) => setSafeHandoverProcess(e.target.value)}
                  placeholder="e.g. Meet at Campus Security Desk with Photo ID"
                  required
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Public Item Photograph (Optional)
              </label>
              <label className="cursor-pointer block border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Click to upload a clear photo of the found belonging
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
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Registering...' : 'Register Found Item & Check Matches'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Success & Matches Found */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Found Item Successfully Logged!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Reference ID: <span className="font-mono font-bold text-slate-900">#{submittedItemRef?.slice(-8)}</span>. 
                Thank you for your honesty. The item is now discoverable by genuine claimants.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Open Lost Reports Matched ({discoveredMatches.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    The algorithm compared this item with recent open lost reports.
                  </p>
                </div>
              </div>

              {discoveredMatches.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No matching lost reports found yet. The item will remain active in the directory.
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
                View Matches Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
