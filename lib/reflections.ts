// Reflection persistence helpers (Pause Button feature) — Supabase-backed

export interface Reflection {
  id: string;
  user_id: string;
  couple_id: string;
  timestamp: string;
  emotion: string;
  mode: 'reset' | 'vent';
  raw_text: string;
  ai_summary: string;
  shared_with_partner: boolean;
  post_reset_feeling?: string;
}

export interface PartnerMessage {
  id: string;
  couple_id: string;
  sender_id: string;
  type: 'reflection_share' | 'acknowledge' | 'reply' | 'talk_later';
  reflection_id: string;
  message: string;
  status: 'unread' | 'acknowledged' | 'replied' | 'talk_later';
  timestamp: string;
}

async function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const { supabase } = await import('./supabase');
  return supabase;
}

export async function saveReflection(data: {
  user_id: string;
  couple_id: string;
  emotion: string;
  mode: 'reset' | 'vent';
  raw_text: string;
  ai_summary: string;
  shared_with_partner: boolean;
  post_reset_feeling?: string;
}): Promise<string | null> {
  try {
    const sb = await getSupabase();
    if (!sb) return null;

    const { data: result, error } = await sb
      .from('user_reflections')
      .insert(data)
      .select('id')
      .single();
    if (error) {
      console.error('[Reflections] Save error:', error.message);
      return null;
    }
    return result.id;
  } catch (e) {
    console.error('[Reflections] Save failed:', e);
    return null;
  }
}

export async function shareWithPartner(
  reflectionId: string,
  coupleId: string,
  senderId: string,
  summary: string,
  emotion: string
): Promise<boolean> {
  try {
    const sb = await getSupabase();
    if (!sb) return false;

    // Update reflection as shared
    const { error: updateError } = await sb
      .from('user_reflections')
      .update({ shared_with_partner: true })
      .eq('id', reflectionId);
    if (updateError) {
      console.error('[Reflections] Share update error:', updateError.message);
      return false;
    }

    // Create partner message
    const { error: msgError } = await sb
      .from('partner_messages')
      .insert({
        couple_id: coupleId,
        sender_id: senderId,
        type: 'reflection_share',
        reflection_id: reflectionId,
        message: summary,
        status: 'unread',
      });
    if (msgError) {
      console.error('[Reflections] Message create error:', msgError.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[Reflections] Share failed:', e);
    return false;
  }
}

export async function fetchReflections(userId: string): Promise<Reflection[]> {
  try {
    const sb = await getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from('user_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    if (error) {
      console.error('[Reflections] Fetch error:', error.message);
      return [];
    }
    return (data ?? []) as Reflection[];
  } catch {
    return [];
  }
}

export async function fetchPartnerMessages(coupleId: string): Promise<PartnerMessage[]> {
  try {
    const sb = await getSupabase();
    if (!sb) return [];

    const { data, error } = await sb
      .from('partner_messages')
      .select('*')
      .eq('couple_id', coupleId)
      .order('timestamp', { ascending: false });
    if (error) {
      console.error('[Reflections] Messages fetch error:', error.message);
      return [];
    }
    return (data ?? []) as PartnerMessage[];
  } catch {
    return [];
  }
}

export async function updateMessageStatus(
  messageId: string,
  status: 'acknowledged' | 'replied' | 'talk_later',
  replyText?: string
): Promise<boolean> {
  try {
    const sb = await getSupabase();
    if (!sb) return false;

    const { error } = await sb
      .from('partner_messages')
      .update({ status })
      .eq('id', messageId);
    if (error) {
      console.error('[Reflections] Status update error:', error.message);
      return false;
    }

    // If replying, create a reply message
    if (status === 'replied' && replyText) {
      const { data: original } = await sb
        .from('partner_messages')
        .select('couple_id, sender_id')
        .eq('id', messageId)
        .single();
      if (original) {
        await sb.from('partner_messages').insert({
          couple_id: original.couple_id,
          sender_id: 'partner',
          type: 'reply',
          reflection_id: messageId,
          message: replyText,
          status: 'unread',
        });
      }
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchUnreadCount(coupleId: string, userId: string): Promise<number> {
  try {
    const sb = await getSupabase();
    if (!sb) return 0;

    const { count, error } = await sb
      .from('partner_messages')
      .select('*', { count: 'exact', head: true })
      .eq('couple_id', coupleId)
      .eq('status', 'unread')
      .neq('sender_id', userId);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
