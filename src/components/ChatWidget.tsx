"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { X, Send, Paperclip, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  text: string;
  media_url?: string;
  media_type?: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

interface Props {
  /** If provided, opens chat directly with this user */
  initialWithUserId?: string;
  /** Optional booking context */
  bookingId?: string;
  /** Force-open on mount */
  openInitially?: boolean;
  /** Called when widget closes */
  onClose?: () => void;
}

export default function ChatWidget({ initialWithUserId, bookingId, openInitially, onClose }: Props) {
  const { user } = useAuth();
  const { lang } = useLang();
  const u = getUI(lang);

  const [open, setOpen] = useState(!!openInitially);
  const [activeUserId, setActiveUserId] = useState<string | null>(initialWithUserId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load unread count
  const loadUnread = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/chat/unread", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUnreadTotal(data.total || 0);
      }
    } catch {}
  }, [user]);

  // Load conversations (all people current user has messaged with)
  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      // Fetch all messages where current user is sender or receiver
      const res = await fetch(`/api/chat?with=__all__`, { credentials: "include" }).catch(() => null);
      // The API doesn't support __all__, so we use unread endpoint + build from messages
      // Instead, let's get all messages for the user by fetching recent bookings context
      // Actually simplest: query messages table via the unread endpoint for senders, then fetch last message per sender
    } catch {}

    // Build conversations from all messages — we need a different approach
    // Use supabase via API: fetch all messages where user is participant
    try {
      const res = await fetch("/api/chat/conversations", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setConversations(data || []);
      }
    } catch {}
  }, [user]);

  // Poll unread count
  useEffect(() => {
    if (!user) return;
    loadUnread();
    const interval = setInterval(loadUnread, 5000);
    return () => clearInterval(interval);
  }, [user, loadUnread]);

  // Load conversations when widget opens
  useEffect(() => {
    if (open && user && conversations.length === 0) {
      loadConversations();
    }
  }, [open, user, conversations.length, loadConversations]);

  // Load messages for active conversation
  useEffect(() => {
    if (!open || !activeUserId || !user) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const params = bookingId
          ? `bookingId=${bookingId}`
          : `with=${activeUserId}`;
        const res = await fetch(`/api/chat?${params}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch {} finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [open, activeUserId, user, bookingId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch user name for active conversation
  useEffect(() => {
    if (!activeUserId) return;
    // Try to find in conversations first
    const conv = conversations.find(c => c.userId === activeUserId);
    if (conv) {
      setUserName(conv.userName);
      return;
    }
    // Fallback: show short id
    setUserName(activeUserId.slice(0, 8));
  }, [activeUserId, conversations]);

  const sendMessage = async () => {
    if (!input.trim() || !activeUserId || !user) return;
    const text = input.trim();
    setInput("");

    // Optimistic
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      from_user_id: user.id,
      to_user_id: activeUserId,
      text,
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          to_user_id: activeUserId,
          text,
          booking_id: bookingId || undefined,
        }),
      });
    } catch {
      // Remove optimistic on error
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveUserId(null);
    onClose?.();
  };

  if (!user) return null;

  // Floating button
  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); if (initialWithUserId) setActiveUserId(initialWithUserId); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition active:scale-95"
        style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
        aria-label={u.openChat}
      >
        <MessageCircle size={26} />
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
        <h3 className="font-bold text-sm">
          {activeUserId ? userName : u.messages}
        </h3>
        <div className="flex items-center gap-1">
          {activeUserId && (
            <button onClick={() => setActiveUserId(null)} className="text-white/80 hover:text-white p-1">
              <span className="text-xs">←</span>
            </button>
          )}
          <button onClick={handleClose} className="text-white/80 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      {activeUserId ? (
        // Messages view
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {loading && messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">{u.noMessages}</div>
            )}
            {!loading && messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">{u.noMessages}</div>
            )}
            {messages.map((msg) => {
              const isMine = msg.from_user_id === user.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${isMine ? "text-white rounded-br-md" : "bg-gray-200 text-gray-800 rounded-bl-md"}`} style={isMine ? { background: "linear-gradient(135deg, #D4001A, #F2A900)" } : undefined}>
                    {msg.media_url && msg.media_type === "image" && (
                      <img src={msg.media_url} alt="" className="rounded-lg mb-1 max-w-full" />
                    )}
                    {msg.text && <p className="leading-snug">{msg.text}</p>}
                    <span className={`text-[10px] ${isMine ? "text-white/60" : "text-gray-400"} block mt-0.5`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white flex-shrink-0">
            <button className="text-gray-400 hover:text-gray-600 p-1" title="Attach">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={u.typeMessage}
              className="flex-1 px-3 py-2 rounded-full border border-gray-200 text-sm outline-none focus:border-red-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              <Send size={16} />
            </button>
          </div>
        </>
      ) : (
        // Conversations list
        <div className="flex-1 overflow-y-auto bg-white">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-12 px-4">
              <MessageCircle size={36} className="mx-auto mb-3 opacity-30" />
              {u.noMessages}
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => { setActiveUserId(conv.userId); setUserName(conv.userName); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 text-left"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {conv.userName?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm truncate">{conv.userName}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {conv.lastAt ? new Date(conv.lastAt).toLocaleDateString([], { day: "numeric", month: "short" }) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 flex-shrink-0 ml-2">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
