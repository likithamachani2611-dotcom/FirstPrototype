export type ItemType = 'lost' | 'found';

export type ItemStatus = 'open' | 'claim_pending' | 'resolved' | 'expired' | 'closed';

export type ItemCategory = 
  | 'Electronics'
  | 'Bags & Wallets'
  | 'Keys'
  | 'Cards & Documents'
  | 'Books & Stationery'
  | 'Clothing & Accessories'
  | 'Jewelry & Watches'
  | 'Water Bottles'
  | 'Musical Instruments'
  | 'Sports Equipment'
  | 'Pets'
  | 'Other';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  primaryColor: string;
  secondaryColor?: string;
  brand?: string;
  model?: string;
  // Distinctive features: for lost items, public; for found items, kept PRIVATE to test claimants!
  distinctiveFeatures?: string;
  isDistinctiveFeaturePrivate?: boolean;
  locationName: string;
  community: string; // e.g. "University Campus", "Central Railway Station", "Westfield Mall", "Downtown Metro"
  latitude?: number;
  longitude?: number;
  dateLostOrFound: string; // YYYY-MM-DD
  approximateTime?: string;
  imageUrls: string[];
  privateEvidenceUrls?: string[]; // Receipts, serial number photos (only owner/mods see)
  status: ItemStatus;
  userId: string;
  userFullName?: string;
  userAvatar?: string;
  safekeepingStatus?: string; // e.g., "At Mall Security Desk #3", "With Finder"
  safeHandoverProcess?: string; // e.g., "Meet at North Gate Security Desk"
  contactPreference?: 'platform_only' | 'email_safe' | 'phone_masked';
  createdAt: string;
  updatedAt: string;
}

export type ConfidenceLevel = 'Strong Candidate' | 'Possible Match' | 'Weak Candidate';

export interface MatchSignalBreakdown {
  categoryScore: number;       // weight: 15%
  nameScore: number;           // weight: 15%
  descriptionScore: number;    // weight: 20%
  colorScore: number;          // weight: 10%
  brandScore: number;          // weight: 10%
  distinctiveScore: number;    // weight: 15%
  dateScore: number;           // weight: 5%
  locationScore: number;       // weight: 10%
  contradictionPenalty: number;
  normalizedTotal: number;     // 0 - 100
}

export interface MatchRecord {
  id: string;
  lostItemId: string;
  foundItemId: string;
  matchScore: number; // 0 - 100
  confidenceLevel: ConfidenceLevel;
  explanation: string;
  status: 'active' | 'dismissed' | 'claimed' | 'confirmed';
  signalBreakdown: MatchSignalBreakdown;
  lostItem?: Item;
  foundItem?: Item;
  createdAt: string;
}

export type ClaimStatus = 
  | 'submitted'
  | 'under_review'
  | 'info_requested'
  | 'approved'
  | 'rejected'
  | 'returned_completed'
  | 'withdrawn';

export interface ClaimMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isModeratorNote?: boolean;
}

export interface Claim {
  id: string;
  itemId: string; // The found item being claimed
  lostItemId?: string; // Optional linked lost report
  claimantId: string;
  claimantName: string;
  claimantAvatar?: string;
  reporterId: string; // The finder or holding desk
  ownershipExplanation: string;
  secretCharacteristicsProof: string; // Answers to private distinctive features
  evidenceUrls: string[]; // Purchase receipt, photo of serial number, old selfies with item
  preferredContact: string;
  status: ClaimStatus;
  statusNotes?: string;
  messages: ClaimMessage[];
  createdAt: string;
  updatedAt: string;
  item?: Item;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'user' | 'moderator' | 'admin';
  trustScore: number; // e.g. 98%
  recoveredCount: number;
  reportedCount: number;
  community: string;
  isVerified: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'claim' | 'system' | 'recovery';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  type: 'all' | 'lost' | 'found';
  category: string;
  community: string;
  startDate: string;
  endDate: string;
  status: string;
  sortBy: 'newest' | 'oldest' | 'relevance';
}
