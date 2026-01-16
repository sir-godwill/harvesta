import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support';
  title?: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  metadata?: any;
  participants?: ConversationParticipant[];
  last_message?: Message;
  unreadCount?: number;
  isArchived?: boolean;
  isPinned?: boolean;
  isFrozen?: boolean;
  context?: any;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'member' | 'admin';
  joined_at: string;
  left_at?: string;
  muted: boolean;
  pinned: boolean;
  user?: any;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  type: 'text' | 'image' | 'document' | 'product' | 'quote' | 'system' | 'order';
  metadata?: any;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  sender?: any;
  attachments?: MessageAttachment[];
  is_read?: boolean;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  thumbnail_url?: string;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
  typing_in?: string;
}

export interface ChatContext {
  type: 'general' | 'product' | 'order' | 'rfq' | 'delivery';
  id?: string;
  data?: any;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  participantIds: string[],
  type: Conversation['type'] = 'direct',
  title?: string
): Promise<{ data: Conversation | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        type,
        title,
        metadata: {}
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const participants = [user.id, ...participantIds].map(userId => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: userId === user.id ? 'admin' : 'member'
    }));

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (partError) throw partError;

    return { data: conversation, error: null };
  } catch (error) {
    console.error('Error creating conversation:', error);
    return { data: null, error };
  }
}

/**
 * Fetch user's conversations
 */
export async function fetchConversations(
  userId?: string
): Promise<{ data: Conversation[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    if (!targetUserId) throw new Error('User ID required');

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          user:user_profiles(*)
        )
      `)
      .in('id',
        supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', targetUserId)
      )
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    // Fetch unread counts and last messages
    const conversationsWithExtras = await Promise.all(
      (data || []).map(async (conv) => {
        const { data: unreadData } = await supabase
          .from('messages')
          .select('id')
          .eq('conversation_id', conv.id)
          .not('sender_id', 'eq', targetUserId)
          .not('id', 'in',
            supabase
              .from('message_read_status')
              .select('message_id')
              .eq('user_id', targetUserId)
          );

        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*, sender:user_profiles(*)')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...conv,
          unread_count: unreadData?.length || 0,
          last_message: lastMessage
        };
      })
    );

    return { data: conversationsWithExtras, error: null };
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return { data: null, error };
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  type: Message['type'] = 'text',
  metadata?: any
): Promise<{ data: Message | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        type,
        metadata: metadata || {}
      })
      .select('*, sender:user_profiles(*)')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }
}

/**
 * Fetch messages for a conversation
 */
export async function fetchMessages(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ data: Message[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:user_profiles(*),
        attachments:message_attachments(*)
      `)
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Check read status for each message
    const messagesWithReadStatus = await Promise.all(
      (data || []).map(async (msg) => {
        const { data: readStatus } = await supabase
          .from('message_read_status')
          .select('id')
          .eq('message_id', msg.id)
          .eq('user_id', user.id)
          .single();

        return {
          ...msg,
          is_read: !!readStatus
        };
      })
    );

    return { data: messagesWithReadStatus.reverse(), error: null };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { data: null, error };
  }
}

/**
 * Mark message as read
 */
export async function markAsRead(
  messageId: string
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('message_read_status')
      .insert({
        message_id: messageId,
        user_id: user.id
      })
      .select()
      .single();

    if (error && error.code !== '23505') throw error; // Ignore duplicate key error
    return { data, error: null };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { data: null, error };
  }
}

/**
 * Mark all messages in conversation as read
 */
export async function markConversationAsRead(
  conversationId: string
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get all unread messages
    const { data: messages } = await supabase
      .from('messages')
      .select('id')
      .eq('conversation_id', conversationId)
      .not('sender_id', 'eq', user.id);

    if (!messages || messages.length === 0) {
      return { data: null, error: null };
    }

    // Mark all as read
    const readStatuses = messages.map(msg => ({
      message_id: msg.id,
      user_id: user.id
    }));

    const { data, error } = await supabase
      .from('message_read_status')
      .upsert(readStatuses);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    return { data: null, error };
  }
}

/**
 * Search conversations by title or participant name
 */
export async function searchConversations(query: string): Promise<Conversation[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          user:user_profiles(*)
        )
      `)
      .in('id',
        supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)
      )
      .or(`title.ilike.%${query}%`); // Better search would include participant names

    if (error) throw error;

    return (data || []).map(conv => ({
      ...conv,
      unreadCount: 0 // Mock for now or fetch properly
    }));
  } catch (error) {
    console.error('Error searching conversations:', error);
    return [];
  }
}

/**
 * Update user presence
 */
export async function updatePresence(
  status: UserPresence['status'],
  typingIn?: string
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        status,
        typing_in: typingIn,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating presence:', error);
    return { data: null, error };
  }
}

/**
 * Upload chat attachment
 */
export async function uploadChatAttachment(
  file: File,
  conversationId: string
): Promise<{ data: string | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${conversationId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(fileName);

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return { data: null, error };
  }
}

/**
 * Search messages
 */
export async function searchMessages(
  query: string,
  conversationId?: string
): Promise<{ data: Message[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let queryBuilder = supabase
      .from('messages')
      .select(`
        *,
        sender:user_profiles(*),
        conversation:conversations(*)
      `)
      .ilike('content', `%${query}%`)
      .is('deleted_at', null);

    if (conversationId) {
      queryBuilder = queryBuilder.eq('conversation_id', conversationId);
    } else {
      // Only search in user's conversations
      queryBuilder = queryBuilder.in('conversation_id',
        supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)
      );
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching messages:', error);
    return { data: null, error };
  }
}

/**
 * Delete message
 */
export async function deleteMessage(
  messageId: string
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('sender_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { data: null, error };
  }
}

/**
 * Edit message
 */
export async function editMessage(
  messageId: string,
  newContent: string
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .update({
        content: newContent,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .eq('sender_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error editing message:', error);
    return { data: null, error };
  }
}

/**
 * Fetch context details for chat
 */
export async function fetchChatContext(context: ChatContext): Promise<any> {
  if (!context.id || context.type === 'general') return null;

  try {
    if (context.type === 'product') {
      const { data } = await supabase
        .from('products')
        .select(`
          name,
          unit_of_measure,
          product_images(image_url, is_primary),
          product_variants(pricing_tiers(price_per_unit, currency))
        `)
        .eq('id', context.id)
        .single();

      if (!data) return null;

      const primaryImage = data.product_images?.find((i: any) => i.is_primary)?.image_url || data.product_images?.[0]?.image_url;
      const variant = data.product_variants?.[0];
      const tier = variant?.pricing_tiers?.[0];

      return {
        name: data.name,
        image: primaryImage,
        rating: 4.5, // Mock, needs reviews table join
        price: tier?.price_per_unit || 0,
        currency: tier?.currency || 'XAF',
        unit: data.unit_of_measure || 'unit'
      };
    }

    if (context.type === 'order') {
      const { data } = await supabase
        .from('orders')
        .select('order_number, status, total_amount, currency')
        .eq('id', context.id)
        .single();

      if (!data) return null;

      return {
        orderNumber: data.order_number,
        status: data.status,
        totalAmount: data.total_amount,
        currency: data.currency
      };
    }

    if (context.type === 'rfq') {
      // Assuming rfq_requests table
      const { data } = await supabase
        .from('rfq_requests')
        .select('status, quantity, unit_of_measure, product_id') // Join products for name?
        .eq('id', context.id)
        .single();

      if (!data) return null;

      return {
        status: data.status,
        title: 'RFQ Request', // Placeholder
        quantity: data.quantity,
        unit: data.unit_of_measure
      };
    }

    if (context.type === 'delivery') {
      const { data } = await supabase
        .from('deliveries')
        .select('tracking_number, carrier:logistics_partners(name), destination_address')
        .eq('id', context.id)
        .single();

      if (!data) return null;

      return {
        trackingNumber: data.tracking_number,
        carrier: data.carrier?.name || 'Unknown',
        deliveryLocation: (() => {
          try {
            const addr = typeof data.destination_address === 'string' ? JSON.parse(data.destination_address) : data.destination_address;
            return addr?.city || 'Unknown';
          } catch { return 'Unknown'; }
        })()
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching chat context:', error);
    return null;
  }
}
