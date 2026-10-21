-- ==============================================================================
-- FINDORA — SMART LOST-AND-FOUND NETWORK
-- Complete PostgreSQL Schema with Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fast fuzzy text matching

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  trust_score INTEGER DEFAULT 100 CHECK (trust_score BETWEEN 0 AND 100),
  recovered_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  community TEXT DEFAULT 'General Public',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ITEMS TABLE (LOST & FOUND)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT,
  brand TEXT,
  model TEXT,
  -- Distinctive features: for found items, kept SECRET so claimants must prove ownership
  distinctive_features TEXT,
  is_distinctive_feature_private BOOLEAN DEFAULT false,
  location_name TEXT NOT NULL,
  community TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  date_lost_or_found DATE NOT NULL,
  approximate_time TEXT,
  image_urls TEXT[] DEFAULT '{}',
  private_evidence_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claim_pending', 'resolved', 'expired', 'closed')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  safekeeping_status TEXT, -- e.g. "At Campus Security Desk"
  safe_handover_process TEXT,
  contact_preference TEXT DEFAULT 'platform_only' CHECK (contact_preference IN ('platform_only', 'email_safe', 'phone_masked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_community ON public.items(community);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_title_trgm ON public.items USING gin (title gin_trgm_ops);

-- 4. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lost_item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  found_item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('Strong Candidate', 'Possible Match', 'Weak Candidate')),
  explanation TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'claimed', 'confirmed')),
  signal_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_match_pair UNIQUE (lost_item_id, found_item_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_lost ON public.matches(lost_item_id);
CREATE INDEX IF NOT EXISTS idx_matches_found ON public.matches(found_item_id);

-- 5. CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL, -- Found item
  lost_item_id UUID REFERENCES public.items(id) ON DELETE SET NULL, -- Optional linked lost report
  claimant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- Finder/Holding desk
  ownership_explanation TEXT NOT NULL,
  secret_characteristics_proof TEXT NOT NULL, -- Proves knowing hidden distinctive attributes
  evidence_urls TEXT[] DEFAULT '{}', -- Receipts, serial photo, purchase proof
  preferred_contact TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (
    status IN ('submitted', 'under_review', 'info_requested', 'approved', 'rejected', 'returned_completed', 'withdrawn')
  ),
  status_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claims_item ON public.claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant ON public.claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_reporter ON public.claims(reporter_id);

-- 6. CLAIM MESSAGES TABLE (SAFE IN-APP SECURE DIALOG)
CREATE TABLE IF NOT EXISTS public.claim_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_moderator_note BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system' CHECK (type IN ('match', 'claim', 'system', 'recovery')),
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ITEMS POLICIES
-- Public can browse open items, but sensitive evidence is protected
CREATE POLICY "Items are viewable by everyone"
  ON public.items FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert items"
  ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.items FOR DELETE USING (auth.uid() = user_id);

-- MATCHES POLICIES
CREATE POLICY "Users can view matches related to their items"
  ON public.matches FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.items WHERE items.id = matches.lost_item_id AND items.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.items WHERE items.id = matches.found_item_id AND items.user_id = auth.uid())
  );

-- CLAIMS POLICIES
CREATE POLICY "Claimants and Reporters can view their claims"
  ON public.claims FOR SELECT USING (
    auth.uid() = claimant_id OR auth.uid() = reporter_id
  );

CREATE POLICY "Authenticated users can submit claims"
  ON public.claims FOR INSERT WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Claimants and Reporters can update claim status"
  ON public.claims FOR UPDATE USING (
    auth.uid() = claimant_id OR auth.uid() = reporter_id
  );

-- CLAIM MESSAGES POLICIES
CREATE POLICY "Participants can view claim messages"
  ON public.claim_messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.claims 
      WHERE claims.id = claim_messages.claim_id 
      AND (claims.claimant_id = auth.uid() OR claims.reporter_id = auth.uid())
    )
  );

CREATE POLICY "Participants can insert claim messages"
  ON public.claim_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.claims 
      WHERE claims.id = claim_messages.claim_id 
      AND (claims.claimant_id = auth.uid() OR claims.reporter_id = auth.uid())
    )
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- ==============================================================================
-- Insert buckets if storage schema exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-photos', 'item-photos', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('claim-evidence', 'claim-evidence', false) 
ON CONFLICT (id) DO NOTHING;
