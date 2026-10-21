import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Item, MatchRecord, Claim, NotificationItem, ItemStatus, ClaimStatus } from '../types';
import { INITIAL_ITEMS, INITIAL_CLAIMS, INITIAL_NOTIFICATIONS } from '../lib/mockData';
import { findMatchesForItem, calculateMatchSignals, generateMatchExplanation, getConfidenceLevel } from '../lib/matchingEngine';

interface DataContextType {
  items: Item[];
  matches: MatchRecord[];
  claims: Claim[];
  notifications: NotificationItem[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Item;
  getItemById: (id: string) => Item | undefined;
  updateItemStatus: (itemId: string, status: ItemStatus) => void;
  submitClaim: (claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => Claim;
  updateClaimStatus: (claimId: string, status: ClaimStatus, statusNotes?: string) => void;
  addClaimMessage: (claimId: string, senderId: string, senderName: string, message: string) => void;
  dismissMatch: (matchId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  regenerateMatches: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Items State
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('findora_items');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_ITEMS; }
    }
    return INITIAL_ITEMS;
  });

  // 2. Claims State
  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem('findora_claims');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_CLAIMS; }
    }
    return INITIAL_CLAIMS;
  });

  // 3. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('findora_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // 4. Matches State
  const [matches, setMatches] = useState<MatchRecord[]>([]);

  // Function to compute all pairwise matches between active LOST and FOUND items
  const computeAllMatches = useCallback((currentItems: Item[]): MatchRecord[] => {
    const lostItems = currentItems.filter(i => i.type === 'lost' && i.status !== 'resolved' && i.status !== 'closed');
    const foundItems = currentItems.filter(i => i.type === 'found' && i.status !== 'resolved' && i.status !== 'closed');
    const allComputed: MatchRecord[] = [];

    for (const lost of lostItems) {
      for (const found of foundItems) {
        if (lost.userId === found.userId) continue;

        const signals = calculateMatchSignals(lost, found);
        if (signals.normalizedTotal >= 35) {
          const confidence = getConfidenceLevel(signals.normalizedTotal);
          const explanation = generateMatchExplanation(lost, found, signals);

          allComputed.push({
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
    }

    return allComputed.sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  // Compute matches on initial mount and when items change
  useEffect(() => {
    const computed = computeAllMatches(items);
    setMatches(computed);
  }, [items, computeAllMatches]);

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem('findora_items', JSON.stringify(items));
  }, [items]);

  // Save claims to localStorage
  useEffect(() => {
    localStorage.setItem('findora_claims', JSON.stringify(claims));
  }, [claims]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('findora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add Item
  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item => {
    const newItem: Item = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setItems(prev => [newItem, ...prev]);

    // Check for matches immediately
    const immediateMatches = findMatchesForItem(newItem, items);
    if (immediateMatches.length > 0) {
      const best = immediateMatches[0];
      if (best.matchScore >= 60) {
        const newNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          userId: newItem.userId,
          title: `Smart Match Discovered! (${best.matchScore}% Match)`,
          message: `Findora detected a ${best.confidenceLevel.toLowerCase()} matching "${newItem.title}".`,
          type: 'match',
          link: '/matches',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }

    return newItem;
  };

  const getItemById = (id: string): Item | undefined => {
    return items.find(i => i.id === id);
  };

  const updateItemStatus = (itemId: string, status: ItemStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status, updatedAt: new Date().toISOString() };
      }
      return item;
    }));
  };

  // Submit Claim
  const submitClaim = (claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'messages'>): Claim => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim_${Date.now()}`,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: claimData.claimantId,
          senderName: claimData.claimantName,
          message: `Submitted ownership claim with verification proof: "${claimData.ownershipExplanation.substring(0, 100)}..."`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClaims(prev => [newClaim, ...prev]);

    // Mark item status as claim_pending
    updateItemStatus(claimData.itemId, 'claim_pending');

    // Send notification to item finder/reporter
    const targetItem = getItemById(claimData.itemId);
    if (targetItem) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: targetItem.userId,
        title: `New Ownership Claim Received`,
        message: `${claimData.claimantName} filed an ownership claim for "${targetItem.title}". Review private proof now.`,
        type: 'claim',
        link: '/claims',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }

    return newClaim;
  };

  const updateClaimStatus = (claimId: string, status: ClaimStatus, statusNotes?: string) => {
    setClaims(prev => prev.map(claim => {
      if (claim.id === claimId) {
        const updated = {
          ...claim,
          status,
          statusNotes: statusNotes || claim.statusNotes,
          updatedAt: new Date().toISOString()
        };

        // If returned_completed, mark item as resolved
        if (status === 'returned_completed') {
          updateItemStatus(claim.itemId, 'resolved');
          if (claim.lostItemId) {
            updateItemStatus(claim.lostItemId, 'resolved');
          }
        }

        // Notify claimant
        const notif: NotificationItem = {
          id: `notif_${Date.now()}`,
          userId: claim.claimantId,
          title: `Claim Status Updated: ${status.replace('_', ' ').toUpperCase()}`,
          message: statusNotes || `Your claim for item #${claim.itemId.slice(-6)} has been set to ${status}.`,
          type: status === 'returned_completed' ? 'recovery' : 'claim',
          link: '/claims',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(nPrev => [notif, ...nPrev]);

        return updated;
      }
      return claim;
    }));
  };

  const addClaimMessage = (claimId: string, senderId: string, senderName: string, message: string) => {
    setClaims(prev => prev.map(claim => {
      if (claim.id === claimId) {
        const newMessage = {
          id: `msg_${Date.now()}`,
          senderId,
          senderName,
          message,
          timestamp: new Date().toISOString()
        };
        return {
          ...claim,
          messages: [...claim.messages, newMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return claim;
    }));
  };

  const dismissMatch = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const regenerateMatches = () => {
    const computed = computeAllMatches(items);
    setMatches(computed);
  };

  return (
    <DataContext.Provider
      value={{
        items,
        matches,
        claims,
        notifications,
        addItem,
        getItemById,
        updateItemStatus,
        submitClaim,
        updateClaimStatus,
        addClaimMessage,
        dismissMatch,
        markNotificationRead,
        markAllNotificationsRead,
        regenerateMatches
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
