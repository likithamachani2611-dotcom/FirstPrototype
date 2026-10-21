import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Scale
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Algorithmic Architecture & Privacy Guarantees
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Findora Works
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Findora replaces unstructured bulletin boards with an explainable, 10-signal heuristic matching engine and double-blind ownership verification.
        </p>
      </div>

      {/* 1. THE 10-SIGNAL MATCHING ALGORITHM */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1. The 10-Signal Explainable Scoring Algorithm
            </h2>
            <p className="text-xs text-slate-500">
              Mathematical attribute weights and heuristic signal correlation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Category Compatibility</span>
              <span className="text-teal-700">15% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Exact category taxonomy matches score 15%. Incompatible categories receive a contradiction penalty.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Item Title & Name Match</span>
              <span className="text-teal-700">15% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Levenshtein distance and token similarity evaluate title lemmas (e.g., "MacBook Pro" vs "Apple Laptop").
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Description Similarity</span>
              <span className="text-teal-700">20% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Jaccard token set intersection filters out common stop words to compare contextual vocabulary and specifics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Color Signature Alignment</span>
              <span className="text-teal-700">10% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Normalizes synonyms (e.g. "Space Gray", "Charcoal", and "Dark Silver" map to the canonical Gray family).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Brand / Model Compatibility</span>
              <span className="text-teal-700">10% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Detects brand mentions. Normalized if neither report specifies a brand so missing data doesn't unfairly penalize.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Distinctive Feature Matching</span>
              <span className="text-teal-700">15% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Detects specific mentions of stickers, engravings, serial number patterns, or unique cosmetic marks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Date Proximity & Timeline</span>
              <span className="text-teal-700">5% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Found date must be on or after lost date. 0-2 days scores 100%; decreases gradually over 30 days.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Geographic Proximity</span>
              <span className="text-teal-700">10% Weight</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Calculates Haversine distance between coordinates and checks community/place name token overlap.
            </p>
          </div>
        </div>

        {/* Explainability note */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 leading-relaxed">
          <span className="font-bold">Transparent Explainability:</span> Findora never outputs a black-box percentage. Every match card generates a natural language breakdown of exactly why the two reports were correlated, empowering both finders and owners to make informed decisions.
        </div>
      </section>

      {/* 2. DOUBLE-BLIND VERIFICATION & PRIVACY */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              2. Anti-Fraud & Double-Blind Ownership Verification
            </h2>
            <p className="text-xs text-slate-500">
              How Findora eliminates false claims, spam, and stalking risks.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Concealed Distinguishing Marks:</span> When a good samaritan or desk officer logs a found item, specific identifying attributes (e.g. customized stickers, inside initials, lock-screen wallpaper) can be marked as concealed. These are withheld from the public card so genuine claimants must state them during verification.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Zero Public Contact Exposure:</span> Personal phone numbers and email addresses are never displayed in public listings. All claim coordination is conducted via masked, authenticated in-app communication channels.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Official Safe Handover Locations:</span> The network partners with campus police substations, transit station master desks, and mall guest services counters so returns take place in supervised, secure public environments.
            </div>
          </div>
        </div>
      </section>

      {/* 3. 7-STATE CLAIM WORKFLOW */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              3. The 7-Stage Claim Lifecycle
            </h2>
            <p className="text-xs text-slate-500">
              Strict state machine governing ownership validation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { step: '1. Submitted', desc: 'Claimant provides secret details & evidence' },
            { step: '2. Under Review', desc: 'Finder/Authority compares against physical item' },
            { step: '3. Info Requested', desc: 'Additional receipt or purchase proof required' },
            { step: '4. Approved', desc: 'Ownership established, handover scheduled' },
            { step: '5. Rejected', desc: 'Proof failed or characteristics mismatched' },
            { step: '6. Returned', desc: 'Item handed over, celebratory resolution' },
            { step: '7. Withdrawn', desc: 'Withdrawn by claimant voluntarily' }
          ].map(s => (
            <div key={s.step} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">{s.step}</span>
              <span className="text-[11px] text-slate-500">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
        >
          <span>Start Searching Active Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
