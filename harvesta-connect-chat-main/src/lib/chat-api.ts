/**
 * Harvestá Chat API Layer
 * All functions are API-ready placeholders for Supabase integration
 */

// ============ TYPES ============

export type UserRole = 'buyer' | 'seller' | 'logistics' | 'admin' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type MessageType = 
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'location'
  | 'contact'
  | 'product'
  | 'offer'
  | 'counter-offer'
  | 'quote'
  | 'invoice'
  | 'delivery-update'
  | 'system'
  | 'voice-call'
  | 'video-call';

export type ChatContext = 
  | { type: 'product'; productId: string }
  | { type: 'order'; orderId: string }
  | { type: 'rfq'; rfqId: string }
  | { type: 'delivery'; deliveryId: string }
  | { type: 'dispute'; disputeId: string }
  | { type: 'general' };

export type ConversationType = 'direct' | 'group' | 'rfq' | 'order' | 'support';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isOnline: boolean;
  lastSeen?: Date;
  isVerified?: boolean;
  phone?: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  avatar?: string;
  companyName?: string;
  location: string;
  country: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  responseTime: string;
  reliabilityScore: number;
  yearsActive: number;
  certifications: string[];
  products: ProductPreview[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ProductPreview {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  unit: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  type: MessageType;
  content: string;
  metadata?: Record<string, any>;
  replyTo?: string;
  replyToMessage?: Message;
  status: MessageStatus;
  createdAt: Date;
  updatedAt?: Date;
  reactions?: Array<{ userId: string; emoji: string }>;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title?: string;
  participants: User[];
  context?: ChatContext;
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isFrozen: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  currency: string;
  totalPrice: number;
  deliveryTerms?: string;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
}

export interface DeliveryUpdate {
  id: string;
  orderId: string;
  status: 'confirmed' | 'packaging' | 'picked-up' | 'in-transit' | 'delayed' | 'delivered';
  location?: string;
  estimatedDelivery?: Date;
  notes?: string;
  proofOfDelivery?: string[];
}

export interface RFQSummary {
  id: string;
  title: string;
  productCategory: string;
  quantity: number;
  unit: string;
  deadline: Date;
  quotesReceived: number;
  status: 'open' | 'closed' | 'awarded';
}

export interface ChatAnalytics {
  responseTimeAvg: number;
  messagesCount: number;
  conversationsCount: number;
  conversionRate: number;
  topSellers: Array<{ userId: string; name: string; responseTime: number }>;
}

// ============ API FUNCTIONS ============

/**
 * Fetch all conversations for the current user
 */
export async function fetchConversations(filters?: {
  type?: ConversationType;
  unreadOnly?: boolean;
  archived?: boolean;
}): Promise<Conversation[]> {
  console.log('[API] Fetching conversations with filters:', filters);
  return mockConversations;
}

/**
 * Fetch messages for a specific conversation
 */
export async function fetchMessages(
  conversationId: string,
  options?: {
    limit?: number;
    before?: Date;
    after?: Date;
  }
): Promise<Message[]> {
  console.log('[API] Fetching messages for:', conversationId, options);
  return mockMessages.filter(m => m.conversationId === conversationId);
}

/**
 * Send a new message
 */
export async function sendMessage(
  conversationId: string,
  message: {
    type: MessageType;
    content: string;
    metadata?: Record<string, any>;
    replyTo?: string;
  }
): Promise<Message> {
  console.log('[API] Sending message:', conversationId, message);
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId: 'current-user',
    senderRole: 'buyer',
    type: message.type,
    content: message.content,
    metadata: message.metadata,
    replyTo: message.replyTo,
    status: 'sent',
    createdAt: new Date(),
  };
  return newMessage;
}

/**
 * Upload a file attachment
 */
export async function uploadChatFile(
  file: File,
  conversationId: string
): Promise<{ url: string; type: string; name: string; size: number }> {
  console.log('[API] Uploading file:', file.name, conversationId);
  return {
    url: URL.createObjectURL(file),
    type: file.type,
    name: file.name,
    size: file.size,
  };
}

/**
 * Fetch seller profile
 */
export async function fetchSellerProfile(sellerId: string): Promise<SellerProfile> {
  console.log('[API] Fetching seller profile:', sellerId);
  return mockSellerProfile;
}

/**
 * Fetch seller products
 */
export async function fetchSellerProducts(sellerId: string): Promise<ProductPreview[]> {
  console.log('[API] Fetching seller products:', sellerId);
  return mockSellerProfile.products;
}

/**
 * Fetch seller reviews
 */
export async function fetchSellerReviews(sellerId: string): Promise<any[]> {
  console.log('[API] Fetching seller reviews:', sellerId);
  return mockReviews;
}

/**
 * Report a user
 */
export async function reportUser(
  userId: string,
  reason: string
): Promise<{ success: boolean; reportId: string }> {
  console.log('[API] Reporting user:', userId, reason);
  return { success: true, reportId: `report_${Date.now()}` };
}

/**
 * Block a user
 */
export async function blockUser(userId: string): Promise<{ success: boolean }> {
  console.log('[API] Blocking user:', userId);
  return { success: true };
}

/**
 * Fetch context details (product, order, RFQ, etc.)
 */
export async function fetchChatContext(context: ChatContext): Promise<Record<string, any>> {
  console.log('[API] Fetching chat context:', context);
  switch (context.type) {
    case 'product':
      return mockProductContext;
    case 'order':
      return mockOrderContext;
    case 'rfq':
      return mockRFQContext;
    case 'delivery':
      return mockDeliveryContext;
    default:
      return {};
  }
}

/**
 * Send a product/price offer
 */
export async function sendOffer(
  conversationId: string,
  offer: Omit<Offer, 'id' | 'status'>
): Promise<Offer> {
  console.log('[API] Sending offer:', conversationId, offer);
  return {
    ...offer,
    id: `offer_${Date.now()}`,
    status: 'pending',
  };
}

/**
 * Accept an offer
 */
export async function acceptOffer(offerId: string): Promise<{ success: boolean; orderId?: string }> {
  console.log('[API] Accepting offer:', offerId);
  return { success: true, orderId: `order_${Date.now()}` };
}

/**
 * Reject an offer
 */
export async function rejectOffer(offerId: string, reason?: string): Promise<{ success: boolean }> {
  console.log('[API] Rejecting offer:', offerId, reason);
  return { success: true };
}

/**
 * Escalate chat to admin
 */
export async function escalateChat(
  conversationId: string,
  reason: string
): Promise<{ success: boolean; ticketId: string }> {
  console.log('[API] Escalating chat:', conversationId, reason);
  return { success: true, ticketId: `ticket_${Date.now()}` };
}

/**
 * Moderate a chat (admin only)
 */
export async function moderateChat(
  conversationId: string,
  action: 'freeze' | 'unfreeze' | 'mute-user' | 'unmute-user' | 'inject-message',
  options?: { userId?: string; message?: string }
): Promise<{ success: boolean }> {
  console.log('[API] Moderating chat:', conversationId, action, options);
  return { success: true };
}

/**
 * Join a chat as admin
 */
export async function joinChatAsAdmin(
  conversationId: string,
  visible: boolean
): Promise<{ success: boolean }> {
  console.log('[API] Admin joining chat:', conversationId, visible ? 'visibly' : 'invisibly');
  return { success: true };
}

/**
 * Fetch chat analytics (admin only)
 */
export async function fetchChatAnalytics(
  filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    region?: string;
  }
): Promise<ChatAnalytics> {
  console.log('[API] Fetching analytics:', filters);
  return mockAnalytics;
}

/**
 * Mark messages as read
 */
export async function markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
  console.log('[API] Marking as read:', conversationId, messageIds);
}

/**
 * Search conversations
 */
export async function searchConversations(query: string): Promise<Conversation[]> {
  console.log('[API] Searching conversations:', query);
  return mockConversations.filter(c => 
    c.title?.toLowerCase().includes(query.toLowerCase()) ||
    c.participants.some(p => p.name.toLowerCase().includes(query.toLowerCase()))
  );
}

/**
 * Create a new conversation
 */
export async function createConversation(
  participants: string[],
  context?: ChatContext
): Promise<Conversation> {
  console.log('[API] Creating conversation:', participants, context);
  return mockConversations[0];
}

/**
 * Report a message/user
 */
export async function reportMessage(
  messageId: string,
  reason: string
): Promise<{ success: boolean; reportId: string }> {
  console.log('[API] Reporting message:', messageId, reason);
  return { success: true, reportId: `report_${Date.now()}` };
}

/**
 * Update typing status
 */
export async function updateTypingStatus(
  conversationId: string,
  isTyping: boolean
): Promise<void> {
  console.log('[API] Typing status:', conversationId, isTyping);
}

/**
 * Pin/Unpin conversation
 */
export async function togglePinConversation(conversationId: string): Promise<{ success: boolean; isPinned: boolean }> {
  console.log('[API] Toggle pin:', conversationId);
  return { success: true, isPinned: true };
}

/**
 * Archive conversation
 */
export async function archiveConversation(conversationId: string): Promise<{ success: boolean }> {
  console.log('[API] Archive:', conversationId);
  return { success: true };
}

/**
 * Delete conversation
 */
export async function deleteConversation(conversationId: string): Promise<{ success: boolean }> {
  console.log('[API] Delete:', conversationId);
  return { success: true };
}

// ============ MOCK DATA ============

const mockSellerProfile: SellerProfile = {
  id: 'user_1',
  name: 'Kofi Asante',
  avatar: undefined,
  companyName: 'Asante Organic Farms',
  location: 'Kumasi',
  country: 'Ghana',
  isVerified: true,
  rating: 4.8,
  reviewCount: 127,
  responseTime: 'Usually responds within 1 hour',
  reliabilityScore: 96,
  yearsActive: 4,
  certifications: ['Organic Certified', 'Export Ready', 'Fair Trade'],
  products: [
    { id: 'p1', name: 'Organic Cocoa Beans', image: '/placeholder.svg', price: 850, currency: 'XAF', unit: 'kg' },
    { id: 'p2', name: 'Raw Shea Butter', image: '/placeholder.svg', price: 1200, currency: 'XAF', unit: 'kg' },
    { id: 'p3', name: 'Palm Oil (Refined)', image: '/placeholder.svg', price: 650, currency: 'XAF', unit: 'L' },
    { id: 'p4', name: 'Cashew Nuts', image: '/placeholder.svg', price: 2500, currency: 'XAF', unit: 'kg' },
  ],
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  },
};

const mockReviews = [
  { id: 'r1', rating: 5, comment: 'Excellent quality products!', author: 'John D.', date: new Date() },
  { id: 'r2', rating: 4, comment: 'Good communication, fast delivery', author: 'Marie A.', date: new Date() },
];

const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Kofi Asante',
    avatar: undefined,
    role: 'seller',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'user_2',
    name: 'Amina Diallo',
    avatar: undefined,
    role: 'buyer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
  },
  {
    id: 'user_3',
    name: 'TransAfrica Logistics',
    avatar: undefined,
    role: 'logistics',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'user_4',
    name: 'Harvestá Support',
    avatar: undefined,
    role: 'admin',
    isOnline: true,
  },
];

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    type: 'direct',
    title: undefined,
    participants: [mockUsers[0], mockUsers[1]],
    context: { type: 'product', productId: 'prod_123' },
    lastMessage: {
      id: 'msg_last_1',
      conversationId: 'conv_1',
      senderId: 'user_1',
      senderRole: 'seller',
      type: 'text',
      content: 'Yes, we have 500kg available at XAF 850/kg',
      status: 'read',
      createdAt: new Date(Date.now() - 300000),
    },
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 300000),
  },
  {
    id: 'conv_2',
    type: 'rfq',
    title: 'RFQ: Organic Cocoa Beans - 2 Tons',
    participants: [mockUsers[1], mockUsers[0]],
    context: { type: 'rfq', rfqId: 'rfq_456' },
    lastMessage: {
      id: 'msg_last_2',
      conversationId: 'conv_2',
      senderId: 'user_1',
      senderRole: 'seller',
      type: 'offer',
      content: 'New quote submitted',
      status: 'delivered',
      createdAt: new Date(Date.now() - 1800000),
    },
    unreadCount: 3,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'conv_3',
    type: 'order',
    title: 'Order #ORD-2024-0892',
    participants: [mockUsers[1], mockUsers[2]],
    context: { type: 'order', orderId: 'order_892' },
    lastMessage: {
      id: 'msg_last_3',
      conversationId: 'conv_3',
      senderId: 'user_3',
      senderRole: 'logistics',
      type: 'delivery-update',
      content: 'Package picked up from seller',
      status: 'read',
      createdAt: new Date(Date.now() - 7200000),
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'conv_4',
    type: 'support',
    title: 'Payment Issue - Order #ORD-2024-0756',
    participants: [mockUsers[1], mockUsers[3]],
    context: { type: 'dispute', disputeId: 'dispute_123' },
    lastMessage: {
      id: 'msg_last_4',
      conversationId: 'conv_4',
      senderId: 'user_4',
      senderRole: 'admin',
      type: 'text',
      content: 'Your refund has been processed successfully.',
      status: 'read',
      createdAt: new Date(Date.now() - 86400000),
    },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'conv_5',
    type: 'direct',
    title: undefined,
    participants: [mockUsers[0]],
    context: { type: 'product', productId: 'prod_789' },
    lastMessage: {
      id: 'msg_last_5',
      conversationId: 'conv_5',
      senderId: 'current-user',
      senderRole: 'buyer',
      type: 'text',
      content: 'Is this product still available?',
      status: 'sent',
      createdAt: new Date(Date.now() - 600000),
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 600000),
  },
];

const mockMessages: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'current-user',
    senderRole: 'buyer',
    type: 'text',
    content: 'Hello! I am interested in your organic cocoa beans. Do you have stock available?',
    status: 'read',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'user_1',
    senderRole: 'seller',
    type: 'text',
    content: 'Hello! Yes, we have fresh stock. How much do you need?',
    status: 'read',
    createdAt: new Date(Date.now() - 86000000),
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'current-user',
    senderRole: 'buyer',
    type: 'text',
    content: 'I need about 500kg for export to Europe. What is your best price?',
    status: 'read',
    createdAt: new Date(Date.now() - 85000000),
  },
  {
    id: 'msg_4',
    conversationId: 'conv_1',
    senderId: 'user_1',
    senderRole: 'seller',
    type: 'audio',
    content: '',
    metadata: { duration: '0:45', url: '' },
    status: 'read',
    createdAt: new Date(Date.now() - 84000000),
  },
  {
    id: 'msg_5',
    conversationId: 'conv_1',
    senderId: 'user_1',
    senderRole: 'seller',
    type: 'offer',
    content: 'Here is my offer for you',
    metadata: {
      productName: 'Organic Cocoa Beans (Grade A)',
      quantity: 500,
      unit: 'kg',
      pricePerUnit: 850,
      currency: 'XAF',
      totalPrice: 425000,
      deliveryTerms: 'FOB Douala Port',
      validUntil: new Date(Date.now() + 86400000 * 7),
    },
    status: 'read',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'msg_6',
    conversationId: 'conv_1',
    senderId: 'current-user',
    senderRole: 'buyer',
    type: 'text',
    content: 'Thank you! Let me review and get back to you.',
    status: 'read',
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'msg_7',
    conversationId: 'conv_1',
    senderId: 'user_1',
    senderRole: 'seller',
    type: 'text',
    content: 'Yes, we have 500kg available at XAF 850/kg',
    status: 'read',
    createdAt: new Date(Date.now() - 300000),
  },
  // Messages for conv_2 (RFQ)
  {
    id: 'msg_rfq_1',
    conversationId: 'conv_2',
    senderId: 'system',
    senderRole: 'system',
    type: 'system',
    content: 'RFQ created: Organic Cocoa Beans - 2 Tons',
    status: 'read',
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'msg_rfq_2',
    conversationId: 'conv_2',
    senderId: 'user_1',
    senderRole: 'seller',
    type: 'quote',
    content: 'Quote submitted',
    metadata: {
      productName: 'Organic Cocoa Beans',
      quantity: 2000,
      unit: 'kg',
      pricePerUnit: 820,
      currency: 'XAF',
      totalPrice: 1640000,
      validUntil: new Date(Date.now() + 86400000 * 5),
    },
    status: 'read',
    createdAt: new Date(Date.now() - 1800000),
  },
  // Messages for conv_3 (Order)
  {
    id: 'msg_order_1',
    conversationId: 'conv_3',
    senderId: 'system',
    senderRole: 'system',
    type: 'system',
    content: 'Order #ORD-2024-0892 has been confirmed',
    status: 'read',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'msg_order_2',
    conversationId: 'conv_3',
    senderId: 'user_3',
    senderRole: 'logistics',
    type: 'delivery-update',
    content: '',
    metadata: {
      status: 'picked-up',
      location: 'Kumasi Warehouse',
      estimatedDelivery: new Date(Date.now() + 172800000),
      notes: 'Package collected, in good condition',
    },
    status: 'read',
    createdAt: new Date(Date.now() - 7200000),
  },
];

const mockProductContext = {
  id: 'prod_123',
  name: 'Organic Cocoa Beans (Grade A)',
  image: '/placeholder.svg',
  price: 850,
  currency: 'XAF',
  unit: 'kg',
  minOrder: 100,
  stock: 2500,
  seller: mockUsers[0],
};

const mockOrderContext = {
  id: 'order_892',
  orderNumber: 'ORD-2024-0892',
  status: 'in-transit',
  totalAmount: 425000,
  currency: 'XAF',
  items: [{ name: 'Organic Cocoa Beans', quantity: 500, unit: 'kg' }],
  createdAt: new Date(Date.now() - 86400000 * 3),
};

const mockRFQContext = {
  id: 'rfq_456',
  title: 'Organic Cocoa Beans - 2 Tons',
  category: 'Cocoa Products',
  quantity: 2000,
  unit: 'kg',
  deadline: new Date(Date.now() + 86400000 * 5),
  quotesReceived: 4,
  status: 'open',
};

const mockDeliveryContext = {
  id: 'delivery_789',
  orderId: 'order_892',
  status: 'in-transit',
  origin: 'Kumasi, Ghana',
  destination: 'Douala Port, Cameroon',
  estimatedDelivery: new Date(Date.now() + 172800000),
  trackingNumber: 'TRK-2024-78901',
};

const mockAnalytics: ChatAnalytics = {
  responseTimeAvg: 45,
  messagesCount: 1250,
  conversationsCount: 89,
  conversionRate: 23.5,
  topSellers: [
    { userId: 'user_1', name: 'Kofi Asante', responseTime: 12 },
    { userId: 'user_5', name: 'Marie Kouassi', responseTime: 25 },
  ],
};