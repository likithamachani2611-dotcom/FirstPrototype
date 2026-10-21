import { Item, MatchRecord, MatchSignalBreakdown, ConfidenceLevel } from '../types';

/**
 * Text tokenization and cleaning helper.
 * Removes stop words, punctuation, and returns set of distinct lowercased lemmas/tokens.
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'with', 'for', 'to', 'from', 'by', 'about',
    'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against',
    'during', 'without', 'before', 'under', 'around', 'among', 'and', 'or', 'is',
    'was', 'are', 'were', 'it', 'my', 'i', 'this', 'that', 'of', 'some', 'has', 'have'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !stopWords.has(token));
}

/**
 * Jaccard token similarity with partial token matching
 */
function calculateJaccardSimilarity(textA: string, textB: string): number {
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  tokensA.forEach(tA => {
    if (tokensB.has(tA)) {
      intersectionCount++;
    } else {
      // Substring check for compound words (e.g., "airpods" vs "airpod")
      for (const tB of tokensB) {
        if (tA.includes(tB) || tB.includes(tA)) {
          intersectionCount += 0.8;
          break;
        }
      }
    }
  });

  const unionSize = tokensA.size + tokensB.size - intersectionCount;
  return unionSize > 0 ? Math.min(1, intersectionCount / unionSize) : 0;
}

/**
 * Levenshtein distance for fuzzy brand/name comparison
 */
function levenshteinDistance(s1: string, s2: string): number {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = b[j - 1] === a[i - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function stringFuzzyMatchScore(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 1.0;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const maxLen = Math.max(a.length, b.length);
  const dist = levenshteinDistance(a, b);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Color dictionary with aliases for normalization
 */
const COLOR_FAMILIES: Record<string, string[]> = {
  black: ['black', 'onyx', 'midnight', 'charcoal', 'dark', 'jet', 'space gray', 'space grey'],
  blue: ['blue', 'navy', 'sky', 'cyan', 'indigo', 'azure', 'teal', 'cobalt', 'denim'],
  red: ['red', 'crimson', 'scarlet', 'burgundy', 'maroon', 'ruby', 'rose'],
  white: ['white', 'pearl', 'silver', 'ivory', 'cream', 'off-white', 'light'],
  gray: ['gray', 'grey', 'silver', 'slate', 'graphite', 'titanium', 'ash'],
  green: ['green', 'olive', 'emerald', 'mint', 'forest', 'sage', 'lime'],
  brown: ['brown', 'tan', 'beige', 'khaki', 'chocolate', 'caramel', 'coffee', 'leather'],
  yellow: ['yellow', 'gold', 'amber', 'mustard', 'lemon'],
  purple: ['purple', 'violet', 'lavender', 'lilac', 'plum'],
  pink: ['pink', 'magenta', 'salmon', 'coral', 'blush'],
  orange: ['orange', 'peach', 'terracotta', 'rust']
};

function normalizeColor(color: string): string {
  const c = color.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(COLOR_FAMILIES)) {
    if (aliases.some(alias => c.includes(alias))) {
      return canonical;
    }
  }
  return c;
}

function compareColors(lostPrimary: string, lostSec?: string, foundPrimary?: string, foundSec?: string): number {
  if (!foundPrimary) return 0.5; // neutral if found color unspecified
  const lp = normalizeColor(lostPrimary);
  const fp = normalizeColor(foundPrimary);
  
  if (lp === fp) return 1.0;

  // Cross check secondary colors
  const ls = lostSec ? normalizeColor(lostSec) : null;
  const fs = foundSec ? normalizeColor(foundSec) : null;

  if ((ls && ls === fp) || (fs && fs === lp) || (ls && fs && ls === fs)) {
    return 0.8;
  }

  // Same color family fuzzy match
  return 0.1;
}

/**
 * Haversine formula in kilometers
 */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Date proximity score:
 * Items found after being lost:
 * 0 - 2 days: 1.0
 * 3 - 7 days: 0.85
 * 8 - 14 days: 0.65
 * 15 - 30 days: 0.4
 * > 30 days: 0.2
 * If found date is before lost date by > 1 day: Contradiction! (0 or penalty)
 */
function evaluateDateProximity(lostDateStr: string, foundDateStr: string): { score: number; contradiction: boolean; diffDays: number } {
  const lostDate = new Date(lostDateStr);
  const foundDate = new Date(foundDateStr);
  const diffTime = foundDate.getTime() - lostDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < -1) {
    // Found more than 1 day before it was supposedly lost -> Contradiction!
    return { score: 0, contradiction: true, diffDays };
  }

  if (diffDays >= -1 && diffDays <= 2) {
    return { score: 1.0, contradiction: false, diffDays };
  } else if (diffDays <= 7) {
    return { score: 0.85, contradiction: false, diffDays };
  } else if (diffDays <= 14) {
    return { score: 0.65, contradiction: false, diffDays };
  } else if (diffDays <= 30) {
    return { score: 0.4, contradiction: false, diffDays };
  } else {
    return { score: 0.2, contradiction: false, diffDays };
  }
}

/**
 * Core Algorithm: Evaluates lost vs found item and produces weighted score and signal breakdown
 */
export function calculateMatchSignals(lostItem: Item, foundItem: Item): MatchSignalBreakdown {
  // 1. Category compatibility (15%)
  let rawCategoryScore = 0;
  if (lostItem.category === foundItem.category) {
    rawCategoryScore = 1.0;
  } else if (
    (lostItem.category === 'Bags & Wallets' && foundItem.category === 'Cards & Documents') ||
    (lostItem.category === 'Cards & Documents' && foundItem.category === 'Bags & Wallets') ||
    (lostItem.category === 'Electronics' && foundItem.category === 'Accessories' as any)
  ) {
    rawCategoryScore = 0.5; // related
  } else {
    rawCategoryScore = 0.0;
  }

  // 2. Item-name similarity (15%)
  const rawNameScore = stringFuzzyMatchScore(lostItem.title, foundItem.title);

  // 3. Description similarity (20%)
  const rawDescScore = calculateJaccardSimilarity(lostItem.description, foundItem.description);

  // 4. Color compatibility (10%)
  const rawColorScore = compareColors(
    lostItem.primaryColor,
    lostItem.secondaryColor,
    foundItem.primaryColor,
    foundItem.secondaryColor
  );

  // 5. Brand or model compatibility (10%)
  let rawBrandScore = 0.5; // default neutral if both missing
  const hasLostBrand = Boolean(lostItem.brand || lostItem.model);
  const hasFoundBrand = Boolean(foundItem.brand || foundItem.model);

  if (hasLostBrand && hasFoundBrand) {
    const brandMatch = stringFuzzyMatchScore(lostItem.brand || '', foundItem.brand || '');
    const modelMatch = stringFuzzyMatchScore(lostItem.model || '', foundItem.model || '');
    rawBrandScore = Math.max(brandMatch, modelMatch);
  } else if (!hasLostBrand && !hasFoundBrand) {
    rawBrandScore = 0.6; // normalized neutral
  } else {
    rawBrandScore = 0.4;
  }

  // 6. Distinctive feature compatibility (15%)
  let rawDistinctiveScore = 0.4; // neutral
  const lostDistinctive = lostItem.distinctiveFeatures || '';
  const foundDistinctive = foundItem.distinctiveFeatures || '';
  if (lostDistinctive && foundDistinctive) {
    rawDistinctiveScore = calculateJaccardSimilarity(lostDistinctive, foundDistinctive);
    if (rawDistinctiveScore > 0.3) {
      rawDistinctiveScore = Math.min(1.0, rawDistinctiveScore * 1.5);
    }
  }

  // 7. Date proximity (5%)
  const dateResult = evaluateDateProximity(lostItem.dateLostOrFound, foundItem.dateLostOrFound);
  const rawDateScore = dateResult.score;

  // 8. Location proximity (10%)
  let rawLocationScore = 0.3;
  if (lostItem.latitude && lostItem.longitude && foundItem.latitude && foundItem.longitude) {
    const distKm = haversineDistanceKm(
      lostItem.latitude,
      lostItem.longitude,
      foundItem.latitude,
      foundItem.longitude
    );
    if (distKm <= 0.2) rawLocationScore = 1.0; // Same building or 200m
    else if (distKm <= 1.0) rawLocationScore = 0.85; // Same campus/neighborhood
    else if (distKm <= 5.0) rawLocationScore = 0.6; // Same city district
    else if (distKm <= 20.0) rawLocationScore = 0.3;
    else rawLocationScore = 0.05;
  } else {
    // Check community and location string similarity
    const sameCommunity = lostItem.community.toLowerCase() === foundItem.community.toLowerCase();
    const locTextSimilarity = calculateJaccardSimilarity(lostItem.locationName, foundItem.locationName);
    if (sameCommunity) {
      rawLocationScore = locTextSimilarity > 0.2 ? 0.95 : 0.75;
    } else {
      rawLocationScore = locTextSimilarity > 0.4 ? 0.6 : 0.2;
    }
  }

  // Contradiction penalties:
  let contradictionPenalty = 0;
  if (dateResult.contradiction) {
    contradictionPenalty += 35; // major contradiction
  }
  if (rawCategoryScore === 0) {
    contradictionPenalty += 40; // Completely incompatible category
  }

  // Weighted sum (base weights: 15 + 15 + 20 + 10 + 10 + 15 + 5 + 10 = 100)
  const categoryScore = rawCategoryScore * 15;
  const nameScore = rawNameScore * 15;
  const descriptionScore = rawDescScore * 20;
  const colorScore = rawColorScore * 10;
  const brandScore = rawBrandScore * 10;
  const distinctiveScore = rawDistinctiveScore * 15;
  const dateScore = rawDateScore * 5;
  const locationScore = rawLocationScore * 10;

  const totalRaw = categoryScore + nameScore + descriptionScore + colorScore + brandScore + distinctiveScore + dateScore + locationScore;
  const normalizedTotal = Math.max(0, Math.min(100, Math.round(totalRaw - contradictionPenalty)));

  return {
    categoryScore: Math.round(categoryScore * 10) / 10,
    nameScore: Math.round(nameScore * 10) / 10,
    descriptionScore: Math.round(descriptionScore * 10) / 10,
    colorScore: Math.round(colorScore * 10) / 10,
    brandScore: Math.round(brandScore * 10) / 10,
    distinctiveScore: Math.round(distinctiveScore * 10) / 10,
    dateScore: Math.round(dateScore * 10) / 10,
    locationScore: Math.round(locationScore * 10) / 10,
    contradictionPenalty,
    normalizedTotal
  };
}

/**
 * Generates an explainable, human-readable rationale based on actual computed signals
 */
export function generateMatchExplanation(
  lostItem: Item,
  foundItem: Item,
  signals: MatchSignalBreakdown
): string {
  const reasons: string[] = [];
  const cautions: string[] = [];

  // Category
  if (signals.categoryScore >= 14) {
    reasons.push(`both reports classify the item under '${lostItem.category}'`);
  }

  // Name & Brand
  if (lostItem.brand && foundItem.brand && signals.brandScore >= 8) {
    reasons.push(`share brand compatibility (${lostItem.brand})`);
  } else if (signals.nameScore >= 10) {
    reasons.push(`have closely aligned item titles ('${lostItem.title}' and '${foundItem.title}')`);
  }

  // Colors
  if (signals.colorScore >= 8) {
    reasons.push(`share matching color signatures (${lostItem.primaryColor})`);
  }

  // Location & Community
  if (lostItem.community === foundItem.community) {
    reasons.push(`were both reported in the same community (${lostItem.community})`);
  } else if (signals.locationScore >= 7) {
    reasons.push(`occurred in geographically close proximity`);
  }

  // Date
  if (signals.dateScore >= 4) {
    reasons.push(`dates align closely (${lostItem.dateLostOrFound} vs ${foundItem.dateLostOrFound})`);
  }

  // Distinctive features
  if (signals.distinctiveScore >= 10) {
    reasons.push(`match distinctive characteristics mentioned in both descriptions`);
  }

  // Contradiction or missing info
  if (signals.contradictionPenalty > 0) {
    cautions.push(`Note: There is a timeline or category discrepancy that reduced confidence.`);
  }

  if (lostItem.primaryColor && foundItem.primaryColor && signals.colorScore < 4) {
    cautions.push(`Colors differ slightly (${lostItem.primaryColor} vs ${foundItem.primaryColor}).`);
  }

  let text = `Potential match because ${reasons.join(', ')}.`;
  if (cautions.length > 0) {
    text += ` ${cautions.join(' ')}`;
  }
  text += ` Please review specific details or submit a claim with private ownership proof.`;

  return text;
}

/**
 * Classifies confidence level based on normalized total score
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 75) return 'Strong Candidate';
  if (score >= 45) return 'Possible Match';
  return 'Weak Candidate';
}

/**
 * Compares an item against an array of candidate counter-items (e.g. Lost vs all Found items)
 */
export function findMatchesForItem(targetItem: Item, candidates: Item[]): MatchRecord[] {
  const matches: MatchRecord[] = [];
  const isLost = targetItem.type === 'lost';

  for (const candidate of candidates) {
    // Only match LOST with FOUND
    if (candidate.type === targetItem.type) continue;
    // Do not match against same user or resolved items
    if (candidate.userId === targetItem.userId) continue;
    if (candidate.status === 'resolved' || candidate.status === 'closed') continue;

    const lost = isLost ? targetItem : candidate;
    const found = isLost ? candidate : targetItem;

    const signals = calculateMatchSignals(lost, found);

    // Filter out weak noise below 35%
    if (signals.normalizedTotal >= 35) {
      const confidence = getConfidenceLevel(signals.normalizedTotal);
      const explanation = generateMatchExplanation(lost, found, signals);

      matches.push({
        id: `match_${lost.id}_${found.id}`,
        lostItemId: lost.id,
        foundItemId: found.id,
        matchScore: signals.normalizedTotal,
        confidenceLevel: confidence,
        explanation,
        status: 'active',
        signalBreakdown: signals,
        lostItem: lost,
        foundItem: found,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Sort descending by match score
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
