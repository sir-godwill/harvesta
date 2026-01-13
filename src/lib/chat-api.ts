/**
 * Harvestá Chat API Layer
 * All functions are API-ready placeholders for Supabase integration
 */

// ============ TYPES ============

export type UserRole = 'buyer' | 'seller' | 'logistics' | 'admin' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'product' | 'offer' | 'counter-offer' | 'quote' | 'invoice' | 'delivery-update' | 'system' | 'voice-call' | 'video-call';
export type ChatContext = { type: 'product'; productId: string } | { type: 'order'; orderId: string } | { type: 'rfq'; rfqId: string } | { type: 'delivery'; deliveryId: string } | { type: 'dispute'; disputeId: string } | { type: 'general' };
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

// ============ MOCK DATA ============

const mockUsers: User[] = [
  { id: 'user_1', name: 'Kofi Asante', role: 'seller', isOnline: true, isVerified: true },
  { id: 'user_2', name: 'Amina Diallo', role: 'buyer', isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
  { id: 'user_3', name: 'TransAfrica Logistics', role: 'logistics', isOnline: true },
  { id: 'user_4', name: 'Support Team', role: 'admin', isOnline: true },
];

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    type: 'direct',
    participants: [mockUsers[0], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    context: { type: 'product', productId: 'prod_1' },
    lastMessage: { id: 'm1', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'text', content: 'Yes, we can offer bulk pricing for orders above 500kg', status: 'delivered', createdAt: new Date(Date.now() - 300000) },
    unreadCount: 2,
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
    title: 'RFQ: Organic Cocoa Beans',
    participants: [mockUsers[0], mockUsers[1], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    context: { type: 'rfq', rfqId: 'rfq_123' },
    lastMessage: { id: 'm2', conversationId: 'conv_2', senderId: 'user_2', senderRole: 'buyer', type: 'quote', content: 'Quote submitted: 850 XAF/kg for 2000kg', status: 'read', createdAt: new Date(Date.now() - 7200000) },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'conv_3',
    type: 'order',
    title: 'Order #ORD-4521',
    participants: [mockUsers[2], { id: 'current-user', name: 'You', role: 'buyer', isOnline: true }],
    context: { type: 'order', orderId: 'ORD-4521' },
    lastMessage: { id: 'm3', conversationId: 'conv_3', senderId: 'user_3', senderRole: 'logistics', type: 'delivery-update', content: 'Your shipment is now in transit. ETA: 2 days', status: 'read', createdAt: new Date(Date.now() - 14400000) },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isFrozen: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 14400000),
  },
];

const mockMessages: Message[] = [
  { id: 'm1', conversationId: 'conv_1', senderId: 'current-user', senderRole: 'buyer', type: 'text', content: 'Hello! I\'m interested in your organic cocoa beans', status: 'read', createdAt: new Date(Date.now() - 86400000) },
  { id: 'm2', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'text', content: 'Welcome! Our premium cocoa is harvested fresh from Cameroon farms.', status: 'read', createdAt: new Date(Date.now() - 86400000 + 60000) },
  { id: 'm3', conversationId: 'conv_1', senderId: 'current-user', senderRole: 'buyer', type: 'text', content: 'What\'s your pricing for bulk orders?', status: 'read', createdAt: new Date(Date.now() - 86400000 + 120000) },
  { id: 'm4', conversationId: 'conv_1', senderId: 'user_1', senderRole: 'seller', type: 'text', content: 'Yes, we can offer bulk pricing for orders above 500kg', status: 'delivered', createdAt: new Date(Date.now() - 300000) },
];

const mockSellerProfile: SellerProfile = {
  id: 'user_1',
  name: 'Kofi Asante',
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
  ],
};

// ============ API FUNCTIONS ============

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchConversations(filters?: { type?: ConversationType; unreadOnly?: boolean }): Promise<Conversation[]> {
  await delay(300);
  let results = [...mockConversations];
  if (filters?.type) results = results.filter(c => c.type === filters.type);
  if (filters?.unreadOnly) results = results.filter(c => c.unreadCount > 0);
  return results;
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  await delay(250);
  return mockMessages.filter(m => m.conversationId === conversationId);
}

export async function sendMessage(conversationId: string, message: { type: MessageType; content: string; metadata?: Record<string, any> }): Promise<Message> {
  await delay(200);
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId: 'current-user',
    senderRole: 'buyer',
    type: message.type,
    content: message.content,
    metadata: message.metadata,
    status: 'sent',
    createdAt: new Date(),
  };
  return newMessage;
}

export async function fetchSellerProfile(sellerId: string): Promise<SellerProfile> {
  await delay(300);
  return mockSellerProfile;
}

export async function searchConversations(query: string): Promise<Conversation[]> {
  await delay(200);
  return mockConversations.filter(c =>
    c.title?.toLowerCase().includes(query.toLowerCase()) ||
    c.participants.some(p => p.name.toLowerCase().includes(query.toLowerCase()))
  );
}

export async function escalateChat(conversationId: string, reason: string): Promise<{ success: boolean; ticketId: string }> {
  await delay(400);
  console.log('[API] Escalating chat:', conversationId, reason);
  return { success: true, ticketId: `ticket_${Date.now()}` };
}

export async function updateTypingStatus(conversationId: string, isTyping: boolean): Promise<void> {
  console.log('[API] Typing status:', conversationId, isTyping);
}

export async function markAsRead(conversationId: string): Promise<void> {
  await delay(100);
  console.log('[API] Marking as read:', conversationId);
}

export async function createConversation(participants: string[], context?: ChatContext): Promise<Conversation> {
  await delay(300);
  return mockConversations[0];
}

export async function fetchChatContext(conversationId: string): Promise<ChatContext | null> {
  await delay(200);
  const conversation = mockConversations.find(c => c.id === conversationId);
  return conversation?.context || null;
}

export async function moderateChat(conversationId: string, action: 'freeze' | 'unfreeze' | 'warn'): Promise<{ success: boolean }> {
  await delay(300);
  console.log('[API] Moderating chat:', conversationId, action);
  return { success: true };
}

export async function joinChatAsAdmin(conversationId: string): Promise<{ success: boolean }> {
  await delay(200);
  console.log('[API] Admin joining chat:', conversationId);
  return { success: true };
}

export async function sendOffer(conversationId: string, offer: Omit<Offer, 'id' | 'status'>): Promise<Message> {
  await delay(400);
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId: 'current-user',
    senderRole: 'seller',
    type: 'offer',
    content: `Offer: ${offer.quantity} ${offer.unit} of ${offer.productName} at ${offer.pricePerUnit} ${offer.currency}/${offer.unit}`,
    metadata: { offer },
    status: 'sent',
    createdAt: new Date(),
  };
  return newMessage;
}
