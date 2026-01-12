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

export interface ChatUser {
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
  participants: ChatUser[];
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

export async function fetchConversations(filters?: {
  type?: ConversationType;
  unreadOnly?: boolean;
  archived?: boolean;
}): Promise<Conversation[]> {
  console.log('[API] Fetching conversations with filters:', filters);
  return mockConversations;
}

export async function fetchMessages(
  conversationId: string,
  options?: { limit?: number; before?: Date; after?: Date }
): Promise<Message[]> {
  console.log('[API] Fetching messages for:', conversationId, options);
  return mockMessages.filter(m => m.conversationId === conversationId);
}

export async function sendMessage(
  conversationId: string,
  message: { type: MessageType; content: string; metadata?: Record<string, any>; replyTo?: string }
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

export async function uploadChatFile(
  file: File,
  conversationId: string
): Promise<{ url: string; type: string; name: string; size: number }> {
  console.log('[API] Uploading file:', file.name, conversationId);
  return { url: URL.createObjectURL(file), type: file.type, name: file.name, size: file.size };
}

export async function fetchSellerProfile(sellerId: string): Promise<SellerProfile> {
  console.log('[API] Fetching seller profile:', sellerId);
  return mockSellerProfile;
}

export async function searchConversations(query: string): Promise<Conversation[]> {
  console.log('[API] Searching conversations:', query);
  return mockConversations.filter(c => 
    c.title?.toLowerCase().includes(query.toLowerCase()) ||
    c.participants.some(p => p.name.toLowerCase().includes(query.toLowerCase()))
  );
}

export async function updateTypingStatus(conversationId: string, isTyping: boolean): Promise<void> {
  console.log('[API] Typing status:', conversationId, isTyping);
}

export async function markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
  console.log('[API] Marking as read:', conversationId, messageIds);
}

export async function escalateChat(
  conversationId: string,
  reason: string
): Promise<{ success: boolean; ticketId: string }> {
  console.log('[API] Escalating chat:', conversationId, reason);
  return { success: true, ticketId: `ticket_${Date.now()}` };
}

export async function sendOffer(
  conversationId: string,
  offer: Omit<Offer, 'id' | 'status'>
): Promise<Offer> {
  console.log('[API] Sending offer:', conversationId, offer);
  return { ...offer, id: `offer_${Date.now()}`, status: 'pending' };
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
};

const mockUsers: ChatUser[] = [
  { id: 'user_1', name: 'Kofi Asante', role: 'seller', isOnline: true, isVerified: true },
  { id: 'user_2', name: 'Amina Diallo', role: 'buyer', isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
  { id: 'user_3', name: 'TransAfrica Logistics', role: 'logistics', isOnline: true },
  { id: 'user_4', name: 'Jean-Pierre Mbarga', role: 'seller', isOnline: true, isVerified: true },
  { id: 'admin_1', name: 'Harvestá Support', role: 'admin', isOnline: true },
];

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    type: 'direct',
    participants: [mockUsers[0], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    lastMessage: { id: 'm1', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'text', content: 'Yes, we can deliver by next week!', status: 'read', createdAt: new Date() },
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'conv_2',
    type: 'order',
    title: 'Order #ORD-4521',
    participants: [mockUsers[3], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    context: { type: 'order', orderId: 'ORD-4521' },
    lastMessage: { id: 'm2', conversationId: 'conv_2', senderId: 'user_4', senderRole: 'seller', type: 'delivery-update', content: 'Your order has been shipped!', status: 'delivered', createdAt: new Date(Date.now() - 1800000) },
    unreadCount: 2,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'conv_3',
    type: 'rfq',
    title: 'RFQ: Organic Coffee Beans',
    participants: [mockUsers[0], mockUsers[3], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    context: { type: 'rfq', rfqId: 'RFQ-001' },
    lastMessage: { id: 'm3', conversationId: 'conv_3', senderId: 'user_1', senderRole: 'seller', type: 'quote', content: 'Quote submitted', status: 'sent', createdAt: new Date(Date.now() - 7200000) },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'conv_4',
    type: 'support',
    title: 'Support Ticket #1234',
    participants: [mockUsers[4], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    context: { type: 'dispute', disputeId: 'DSP-001' },
    lastMessage: { id: 'm4', conversationId: 'conv_4', senderId: 'admin_1', senderRole: 'admin', type: 'text', content: 'We are looking into your issue.', status: 'read', createdAt: new Date(Date.now() - 86400000) },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 86400000),
  },
];

const mockMessages: Message[] = [
  { id: 'm1', conversationId: 'conv_1', senderId: 'current-user', senderRole: 'buyer', type: 'text', content: 'Hello! I am interested in your organic cocoa beans.', status: 'read', createdAt: new Date(Date.now() - 300000) },
  { id: 'm2', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'text', content: 'Hello! Thank you for your interest. How much quantity do you need?', status: 'read', createdAt: new Date(Date.now() - 240000) },
  { id: 'm3', conversationId: 'conv_1', senderId: 'current-user', senderRole: 'buyer', type: 'text', content: 'I need about 500kg for my chocolate factory.', status: 'read', createdAt: new Date(Date.now() - 180000) },
  { id: 'm4', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'offer', content: 'Here is my offer for 500kg organic cocoa beans', metadata: { productName: 'Organic Cocoa Beans', quantity: 500, unit: 'kg', pricePerUnit: 850, currency: 'XAF', totalPrice: 425000, validUntil: new Date(Date.now() + 7 * 86400000) }, status: 'read', createdAt: new Date(Date.now() - 120000) },
  { id: 'm5', conversationId: 'conv_1', senderId: 'current-user', senderRole: 'buyer', type: 'text', content: 'This looks great! Can you deliver by next week?', status: 'read', createdAt: new Date(Date.now() - 60000) },
  { id: 'm6', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'text', content: 'Yes, we can deliver by next week!', status: 'read', createdAt: new Date() },
];
