import { Item, UserProfile, Claim, NotificationItem } from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_sarah_chen',
    email: 'sarah.chen@stanford.edu',
    fullName: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'user',
    trustScore: 99,
    recoveredCount: 2,
    reportedCount: 4,
    community: 'Stanford University Campus',
    isVerified: true,
    createdAt: '2025-09-01T10:00:00Z'
  },
  {
    id: 'usr_officer_davis',
    email: 'm.davis@stanfordpolice.org',
    fullName: 'Officer Marcus Davis',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'moderator',
    trustScore: 100,
    recoveredCount: 38,
    reportedCount: 15,
    community: 'Stanford University Campus',
    isVerified: true,
    createdAt: '2024-03-15T08:30:00Z'
  },
  {
    id: 'usr_alex_rivera',
    email: 'alex.rivera@techmetro.org',
    fullName: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'user',
    trustScore: 94,
    recoveredCount: 1,
    reportedCount: 3,
    community: 'Central Transit Hub & Metro',
    isVerified: true,
    createdAt: '2025-11-12T14:20:00Z'
  },
  {
    id: 'usr_priya_sharma',
    email: 'priya.sharma@westfield.com',
    fullName: 'Priya Sharma (Guest Services)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'moderator',
    trustScore: 98,
    recoveredCount: 24,
    reportedCount: 9,
    community: 'Westfield Galleria Mall',
    isVerified: true,
    createdAt: '2024-08-01T09:00:00Z'
  }
];

export const INITIAL_ITEMS: Item[] = [
  // 1. LOST: Space Gray MacBook Pro (Target for strong match)
  {
    id: 'item_lost_macbook',
    type: 'lost',
    title: 'Space Gray MacBook Pro 14"',
    category: 'Electronics',
    description: 'Left on a wooden study cubicle on the 2nd floor of Green Library. Has an astronaut sticker and a Python programming sticker on the outer casing.',
    primaryColor: 'Space Gray',
    secondaryColor: 'Black',
    brand: 'Apple',
    model: 'MacBook Pro 14-inch M2',
    distinctiveFeatures: 'Astronaut sticker in top-right corner, small dent near left USB-C port, lock screen wallpaper of Lake Tahoe.',
    locationName: 'Green Library, 2nd Floor Quiet Study Area',
    community: 'Stanford University Campus',
    latitude: 37.4275,
    longitude: -122.1697,
    dateLostOrFound: '2026-10-15',
    approximateTime: '16:30',
    imageUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'open',
    userId: 'usr_sarah_chen',
    userFullName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    contactPreference: 'platform_only',
    createdAt: '2026-10-15T18:00:00Z',
    updatedAt: '2026-10-15T18:00:00Z'
  },

  // 2. FOUND: Apple MacBook in Library (Strong Match to #1!)
  {
    id: 'item_found_macbook',
    type: 'found',
    title: 'Space Gray Apple Laptop with Stickers',
    category: 'Electronics',
    description: 'Found unattended after closing hours in Green Library 2nd floor desk row B. Turned over to campus security front counter.',
    primaryColor: 'Space Gray',
    secondaryColor: 'Black',
    brand: 'Apple',
    model: 'MacBook Pro',
    distinctiveFeatures: 'Has space/astronaut themed stickers on the lid. Small cosmetic mark on side edge.',
    isDistinctiveFeaturePrivate: true,
    locationName: 'Green Library 2nd Floor, Desks Row B',
    community: 'Stanford University Campus',
    latitude: 37.4277,
    longitude: -122.1695,
    dateLostOrFound: '2026-10-15',
    approximateTime: '21:15',
    imageUrls: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'open',
    userId: 'usr_officer_davis',
    userFullName: 'Officer Marcus Davis',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    safekeepingStatus: 'Secured in Lost & Found Vault - Campus Security Office Desk 1',
    safeHandoverProcess: 'Claimant must present photo ID and correctly state the lock screen picture or password.',
    contactPreference: 'platform_only',
    createdAt: '2026-10-15T22:00:00Z',
    updatedAt: '2026-10-15T22:00:00Z'
  },

  // 3. LOST: Leather Wallet (Alex Rivera)
  {
    id: 'item_lost_wallet',
    type: 'lost',
    title: 'Brown Vintage Bifold Leather Wallet',
    category: 'Bags & Wallets',
    description: 'Slipped out of my jacket pocket while boarding the blue line subway train towards Downtown at Central Station Platform 3.',
    primaryColor: 'Brown',
    secondaryColor: 'Tan',
    brand: 'Bellroy',
    model: 'Hide & Seek',
    distinctiveFeatures: 'Has initials "A.R." stamped in gold foil on bottom interior flap; contains transit card and student transit pass.',
    locationName: 'Central Transit Hub, Platform 3 Blue Line',
    community: 'Central Transit Hub & Metro',
    latitude: 37.7749,
    longitude: -122.4194,
    dateLostOrFound: '2026-10-14',
    approximateTime: '08:45',
    imageUrls: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'claim_pending',
    userId: 'usr_alex_rivera',
    userFullName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    contactPreference: 'platform_only',
    createdAt: '2026-10-14T09:30:00Z',
    updatedAt: '2026-10-16T11:00:00Z'
  },

  // 4. FOUND: Brown Leather Wallet (Central Metro)
  {
    id: 'item_found_wallet',
    type: 'found',
    title: 'Brown Leather Bifold Wallet',
    category: 'Bags & Wallets',
    description: 'Discovered between seats in car #104 of Blue Line incoming to Central Station. Handed to Station Master office.',
    primaryColor: 'Brown',
    brand: 'Bellroy',
    distinctiveFeatures: 'Contains monogram initials stamped on inside; several transit cards.',
    isDistinctiveFeaturePrivate: true,
    locationName: 'Central Transit Hub & Metro Station Office',
    community: 'Central Transit Hub & Metro',
    latitude: 37.7752,
    longitude: -122.4191,
    dateLostOrFound: '2026-10-14',
    approximateTime: '10:00',
    imageUrls: [
      'https://images.unsplash.com/photo-1556774687-0e2fdd0116c0?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'claim_pending',
    userId: 'usr_officer_davis',
    userFullName: 'Station Lost Property Staff',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    safekeepingStatus: 'Station Master Customer Care Counter 2',
    safeHandoverProcess: 'Claimant must verify their name on the transit pass or state the embossed initials.',
    contactPreference: 'platform_only',
    createdAt: '2026-10-14T11:00:00Z',
    updatedAt: '2026-10-16T11:00:00Z'
  },

  // 5. LOST: Bose Wireless Headphones
  {
    id: 'item_lost_headphones',
    type: 'lost',
    title: 'Bose QuietComfort 45 Over-Ear Headphones',
    category: 'Electronics',
    description: 'Black Bose noise-canceling headphones in black zipper travel case. Left on dining table near food court entrance.',
    primaryColor: 'Black',
    brand: 'Bose',
    model: 'QuietComfort 45',
    distinctiveFeatures: 'Small scratch on right ear cup hinge, charging cable inside mesh pocket.',
    locationName: 'Food Court Table 14, 2nd Level',
    community: 'Westfield Galleria Mall',
    latitude: 37.4030,
    longitude: -122.1150,
    dateLostOrFound: '2026-10-16',
    approximateTime: '13:15',
    imageUrls: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'open',
    userId: 'usr_sarah_chen',
    userFullName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    contactPreference: 'platform_only',
    createdAt: '2026-10-16T14:00:00Z',
    updatedAt: '2026-10-16T14:00:00Z'
  },

  // 6. FOUND: Black Noise Canceling Headphones (Westfield Mall)
  {
    id: 'item_found_headphones',
    type: 'found',
    title: 'Black Bose Headphones in Hard Case',
    category: 'Electronics',
    description: 'Found on food court seating area near the elevators. Checked in at Customer Service Desk on Ground Floor.',
    primaryColor: 'Black',
    brand: 'Bose',
    distinctiveFeatures: 'Has headphone cable and USB-C adapter inside zipper compartment. Tiny wear mark on hinge.',
    isDistinctiveFeaturePrivate: true,
    locationName: 'Westfield Galleria Mall - Guest Services Desk',
    community: 'Westfield Galleria Mall',
    latitude: 37.4032,
    longitude: -122.1148,
    dateLostOrFound: '2026-10-16',
    approximateTime: '14:30',
    imageUrls: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'open',
    userId: 'usr_priya_sharma',
    userFullName: 'Priya Sharma (Guest Services)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    safekeepingStatus: 'Guest Services Safe Box Level 1',
    safeHandoverProcess: 'Present Bluetooth device name or phone pairing confirmation.',
    contactPreference: 'platform_only',
    createdAt: '2026-10-16T15:00:00Z',
    updatedAt: '2026-10-16T15:00:00Z'
  },

  // 7. RESOLVED: Hydro Flask Water Bottle (Success Story)
  {
    id: 'item_recovered_flask',
    type: 'lost',
    title: 'Olive Green Hydro Flask 32oz',
    category: 'Water Bottles',
    description: 'Forgot in Gym Studio 3 during Tuesday evening yoga class. Bottle has National Park stickers.',
    primaryColor: 'Green',
    brand: 'Hydro Flask',
    distinctiveFeatures: 'Yosemite & Zion stickers, dented steel bottom edge.',
    locationName: 'Campus Recreation & Fitness Center',
    community: 'Stanford University Campus',
    latitude: 37.4260,
    longitude: -122.1650,
    dateLostOrFound: '2026-10-11',
    approximateTime: '19:00',
    imageUrls: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'resolved',
    userId: 'usr_sarah_chen',
    userFullName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-10-11T20:30:00Z',
    updatedAt: '2026-10-12T16:00:00Z'
  },

  // 8. FOUND: Car Key Fob with Keychain
  {
    id: 'item_found_keys',
    type: 'found',
    title: 'Toyota Smart Key Fob with Plush Keychain',
    category: 'Keys',
    description: 'Found on grass lawn near the Oval fountain benches. Has a small teal plush mascot attached.',
    primaryColor: 'Black',
    secondaryColor: 'Teal',
    brand: 'Toyota',
    distinctiveFeatures: 'Teal character plush keychain, gym badge barcode on back ring.',
    isDistinctiveFeaturePrivate: true,
    locationName: 'The Oval Lawn & Fountain',
    community: 'Stanford University Campus',
    latitude: 37.4290,
    longitude: -122.1680,
    dateLostOrFound: '2026-10-16',
    approximateTime: '11:00',
    imageUrls: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'open',
    userId: 'usr_officer_davis',
    userFullName: 'Officer Marcus Davis',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    safekeepingStatus: 'Main Quad Police Substation Desk',
    safeHandoverProcess: 'Test unlocking the vehicle or provide registration key code.',
    contactPreference: 'platform_only',
    createdAt: '2026-10-16T11:45:00Z',
    updatedAt: '2026-10-16T11:45:00Z'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim_wallet_101',
    itemId: 'item_found_wallet',
    lostItemId: 'item_lost_wallet',
    claimantId: 'usr_alex_rivera',
    claimantName: 'Alex Rivera',
    claimantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    reporterId: 'usr_officer_davis',
    ownershipExplanation: 'This is my Bellroy wallet that slipped out of my coat pocket on Blue Line Car 104 this Wednesday morning.',
    secretCharacteristicsProof: 'The stamped initials inside are "A.R." in gold. Inside the second card slot is a student transit card with number ending in 8492.',
    evidenceUrls: [
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&q=80&w=400'
    ],
    preferredContact: 'In-app secure messaging / pickup at Central Station Master office',
    status: 'under_review',
    statusNotes: 'Officer Davis verified the initials match. Requested physical photo ID verification upon pickup.',
    messages: [
      {
        id: 'msg_1',
        senderId: 'usr_alex_rivera',
        senderName: 'Alex Rivera',
        message: 'Hello! I lost my wallet on the Blue Line train. The initials "A.R." and card details are exactly as stated.',
        timestamp: '2026-10-14T11:30:00Z'
      },
      {
        id: 'msg_2',
        senderId: 'usr_officer_davis',
        senderName: 'Officer Marcus Davis',
        message: 'Hello Alex, the initials match our inspection. Please bring government photo ID to Counter 2 before 6 PM to collect.',
        timestamp: '2026-10-14T14:15:00Z'
      }
    ],
    createdAt: '2026-10-14T11:30:00Z',
    updatedAt: '2026-10-14T14:15:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_sarah_chen',
    title: 'High Confidence Match Found! (89%)',
    message: 'A found item "Space Gray Apple Laptop with Stickers" closely matches your lost "Space Gray MacBook Pro 14"".',
    type: 'match',
    link: '/matches',
    read: false,
    createdAt: '2026-10-15T22:05:00Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_sarah_chen',
    title: 'Potential Match: Bose Headphones (86%)',
    message: 'Guest Services at Westfield Galleria reported finding black noise-canceling headphones in the food court.',
    type: 'match',
    link: '/matches',
    read: false,
    createdAt: '2026-10-16T15:10:00Z'
  },
  {
    id: 'notif_3',
    userId: 'usr_alex_rivera',
    title: 'Claim Update: Bellroy Wallet',
    message: 'Officer Marcus Davis responded to your ownership claim for the leather wallet.',
    type: 'claim',
    link: '/claims',
    read: true,
    createdAt: '2026-10-14T14:16:00Z'
  }
];

export const RECOVERY_STORIES = [
  {
    id: 'story_1',
    title: 'Stanford Student Recovers Hydro Flask in 18 Hours',
    description: 'Sarah forgot her customized water bottle in Gym Studio 3. The finder posted it with distinguishing sticker locations kept private, and Findora algorithm alerted Sarah instantly.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
    category: 'Water Bottles',
    timeToRecover: '18 hours',
    location: 'Stanford Recreation Center'
  },
  {
    id: 'story_2',
    title: 'Wedding Band Returned Safely at Westfield Mall',
    description: 'A platinum band was turned into guest services. By requiring private inscription details during the claim step, false claims were prevented and the rightful owner was reunited.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    category: 'Jewelry',
    timeToRecover: '2 days',
    location: 'Westfield Galleria Mall'
  },
  {
    id: 'story_3',
    title: 'Metro Commuter Backpack Recovered Across 4 Transit Stations',
    description: 'An engineering student left their bag containing project notebooks on the commuter train. Smart location matching linked the report with the central terminal lost property depot.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    category: 'Bags & Wallets',
    timeToRecover: '24 hours',
    location: 'Central Transit Hub'
  }
];
