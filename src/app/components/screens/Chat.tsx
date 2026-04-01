import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic, Camera, Send, Moon, Sun, Plus, Search,
  MessageCircle, AlertTriangle, ChevronRight, Loader2, RefreshCw, Volume2, MicOff
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { sendGroqMessage, getSuggestions, ChatMessage } from "../../services/groqService";
import { isSpeechRecognitionSupported, startListening, stopListening, speak, stopSpeaking, unlockAudio } from "../../services/audioService";
import { useLanguage } from "../../context/LanguageContext";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  isVoice?: boolean;
  confidence?: "high" | "medium" | "low";
  escalate?: boolean;
  time: string;
  isTyping?: boolean;
}

interface Conversation {
  id: number;
  title: string;
  time: string;
  messages: Message[];
  groqHistory: ChatMessage[];
}

const DEFAULT_SUGGESTIONS = [
  "Best fertilizer for rice?",
  "How much water for banana?",
  "When to harvest coconut?",
  "Govt schemes for farmers",
];

const WELCOME_MESSAGE: Message = {
  id: 1,
  type: "ai",
  content:
    "🌾 **Namaskaram, Rajan!** I'm your Digital Krishi Officer — always here, always farmer-first.\n\nI can help with:\n🌱 Crop advice for Rice, Coconut & Banana\n🐛 Pest & disease identification\n💧 Irrigation & soil health\n💰 Market prices & Govt schemes\n\nTypecast your question in **English, Malayalam, or Tamil** — I'll respond in the same language!\n\nConfidence: High ✅",
  confidence: "high",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

function makeConversation(id: number, title: string, timeLabel: string): Conversation {
  return { id, title, time: timeLabel, messages: [WELCOME_MESSAGE], groqHistory: [] };
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  makeConversation(1, "Rice fertilizer advice", "2h ago"),
  makeConversation(2, "Coconut pest control", "5h ago"),
  makeConversation(3, "Market prices query", "Yesterday"),
  makeConversation(4, "Whitefly in tomatoes", "Mar 28"),
];
INITIAL_CONVERSATIONS[0].messages = [
  { id: 1, type: "user", content: "What fertilizer for rice vegetative stage?", time: "10:30 AM" },
  {
    id: 2, type: "ai",
    content: "🌾 For rice in vegetative stage (Thrissur, Kharif):\n\n🌱 **Nitrogen (Urea):** 50–60 kg/acre in two splits\n  - 1st dose: 20–25 days after transplanting\n  - 2nd dose: 40–45 days after transplanting\n\n💊 **Basal dose:** DAP 25 kg/acre before transplanting\n\n🌿 **Organic option:** Green manure (Sesbania) + vermicompost 2 t/acre\n\n📋 PM-KISAN beneficiaries can get subsidised fertiliser via Krishibhavan Thrissur.\n\nConfidence: High ✅",
    confidence: "high", time: "10:30 AM",
  },
];

export function Chat() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isDark, setIsDark] = useState(false);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId)!;
  const messages = activeConv?.messages ?? [];

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  const toggleListening = () => {
    unlockAudio(); // Bless audio player with user interaction
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      stopSpeaking(); // stop any ongoing AI voice before listening
      startListening(language, {
        onStart: () => setIsListening(true),
        onResult: (text, isFinal) => {
          setMessage(text); // live typing effect
          if (isFinal) {
            stopListening();
            setIsListening(false);
          }
        },
        onEnd: () => setIsListening(false),
        onError: (err) => {
          setErrorMsg(err);
          setIsListening(false);
        },
      });
    }
  };

  const updateConversation = useCallback(
    (id: number, updater: (conv: Conversation) => Conversation) => {
      setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
    },
    []
  );

  const sendMessage = async () => {
    unlockAudio(); // Bless audio player with user interaction
    if (!message.trim() || isLoading) return;
    const userText = message.trim();
    setMessage("");
    setErrorMsg(null);
    stopSpeaking(); // Interrupt AI to start a new query

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      content: userText,
      time: now,
    };

    // Add user message + typing indicator
    const typingMsg: Message = {
      id: Date.now() + 1,
      type: "ai",
      content: "",
      isTyping: true,
      time: now,
    };

    updateConversation(activeConvId, (conv) => ({
      ...conv,
      title: conv.messages.length <= 1 ? userText.slice(0, 40) : conv.title,
      messages: [...conv.messages, userMsg, typingMsg],
    }));

    setIsLoading(true);

    try {
      const { content, escalate, confidence } = await sendGroqMessage(
        activeConv.groqHistory,
        userText
      );

      const aiMsg: Message = {
        id: Date.now() + 2,
        type: "ai",
        content,
        confidence,
        escalate,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      updateConversation(activeConvId, (conv) => ({
        ...conv,
        messages: [...conv.messages.filter((m) => !m.isTyping), userMsg, aiMsg],
        groqHistory: [
          ...conv.groqHistory,
          { role: "user", content: userText },
          { role: "assistant", content },
        ],
      }));

      setSuggestions(getSuggestions(content));
      
      // Auto-play the AI response using OpenAI TTS
      speak(content);
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Connection error. Please try again.";
      setErrorMsg(errText);
      updateConversation(activeConvId, (conv) => ({
        ...conv,
        messages: conv.messages.filter((m) => !m.isTyping),
      }));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const startNewChat = () => {
    const newId = Date.now();
    const newConv: Conversation = makeConversation(newId, "New conversation", "Just now");
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setErrorMsg(null);
  };

  const bgClass = isDark
    ? "bg-[#111827] text-[#F9FAFB]"
    : "bg-[var(--farmgpt-page-bg)] text-[var(--farmgpt-text-primary)]";
  const cardBg = isDark ? "bg-[#1F2937]" : "bg-white";
  const borderColor = isDark ? "border-white/10" : "border-[var(--border)]";
  const inputBg = isDark ? "bg-[#374151] text-white placeholder:text-gray-400" : "bg-[var(--farmgpt-surface-green)] text-[var(--farmgpt-text-primary)] placeholder:text-[var(--farmgpt-text-secondary)]";

  /** Render formatted message content (bold, line breaks, bullet emoji) */
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const formatted = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  const confidenceMeta: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    high: { label: "High Confidence ✅", bg: "bg-green-50", text: "text-green-700" },
    medium: { label: "Medium Confidence ⚠️", bg: "bg-amber-50", text: "text-amber-700" },
    low: { label: "Low Confidence ❓", bg: "bg-red-50", text: "text-red-600" },
  };

  return (
    <div className={`h-full flex ${bgClass}`}>
      {/* ─── Sidebar ─── */}
      <div className={`w-72 shrink-0 border-r ${borderColor} ${cardBg} flex-col hidden lg:flex`}>
        <div className="p-4 border-b border-inherit">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--farmgpt-primary-green)] text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span style={{ fontSize: "0.875rem" }}>New Chat</span>
          </button>
        </div>

        <div className="p-3 border-b border-inherit">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--farmgpt-text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl outline-none ${inputBg}`}
              style={{ fontSize: "0.8rem" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setActiveConvId(conv.id); setErrorMsg(null); }}
              className={`w-full text-left p-3 rounded-xl mb-1 transition-all ${
                conv.id === activeConvId
                  ? "bg-[var(--farmgpt-primary-green)] text-white"
                  : isDark
                  ? "hover:bg-[#374151] text-gray-300"
                  : "hover:bg-[var(--farmgpt-surface-green)] text-[var(--farmgpt-text-primary)]"
              }`}
            >
              <div className="flex items-start gap-2">
                <MessageCircle
                  size={16}
                  className={conv.id === activeConvId ? "text-white/70 mt-0.5 shrink-0" : "text-[var(--farmgpt-text-secondary)] mt-0.5 shrink-0"}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "0.8rem", fontWeight: conv.id === activeConvId ? 600 : 400 }}>
                    {conv.title}
                  </p>
                  <p
                    className={conv.id === activeConvId ? "text-white/60" : "text-[var(--farmgpt-text-secondary)]"}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {conv.time}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Chat ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`px-6 py-3 border-b ${borderColor} ${cardBg} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--farmgpt-primary-green)] rounded-full flex items-center justify-center text-base">
              🤖
            </div>
            <div>
              <h2 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                Digital Krishi Officer
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.7rem" }}>
                  Always online · Groq AI · Llama 3.3 70B
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={stopSpeaking}
              className={`p-2 rounded-full ${isDark ? "bg-[#374151]" : "bg-[var(--farmgpt-surface-green)]"}`}
              title="Stop Audio"
            >
              <Volume2 size={17} className="text-[var(--farmgpt-primary-green)]" />
            </button>
            <button
              onClick={startNewChat}
              className={`p-2 rounded-full ${isDark ? "bg-[#374151]" : "bg-[var(--farmgpt-surface-green)]"}`}
              title="New Chat"
            >
              <RefreshCw size={17} className="text-[var(--farmgpt-primary-green)]" />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full ${isDark ? "bg-[#374151]" : "bg-[var(--farmgpt-surface-green)]"}`}
            >
              {isDark ? (
                <Sun size={18} className="text-[var(--farmgpt-accent-amber)]" />
              ) : (
                <Moon size={18} className="text-[var(--farmgpt-primary-green)]" />
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.28 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} gap-3`}
              >
                {msg.type === "ai" && (
                  <div className="w-9 h-9 bg-[var(--farmgpt-primary-green)] rounded-full flex items-center justify-center shrink-0 mt-1 text-base shadow-sm">
                    🤖
                  </div>
                )}

                <div className="max-w-[68%]">
                  {msg.type === "user" ? (
                    <div className="bg-[var(--farmgpt-accent-amber)] rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                      <p className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
                        {msg.content}
                      </p>
                    </div>
                  ) : msg.isTyping ? (
                    /* Typing Indicator */
                    <div className={`rounded-2xl rounded-tl-sm px-5 py-4 border-l-4 border-[var(--farmgpt-primary-green)] shadow-sm ${cardBg}`}>
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[var(--farmgpt-primary-green)] rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                        <span className="text-[var(--farmgpt-text-secondary)] ml-2" style={{ fontSize: "0.8rem" }}>
                          Krishi Officer thinking…
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* AI Response */
                    <div className={`rounded-2xl rounded-tl-sm px-4 py-3.5 border-l-4 border-[var(--farmgpt-primary-green)] shadow-sm ${cardBg}`}>
                      <p
                        className={isDark ? "text-[#F9FAFB]" : "text-[var(--farmgpt-text-primary)]"}
                        style={{ fontSize: "0.9rem", lineHeight: 1.75 }}
                      >
                        {renderContent(msg.content)}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {/* Confidence badge */}
                        {msg.confidence && (
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${confidenceMeta[msg.confidence].bg} ${confidenceMeta[msg.confidence].text}`}
                            style={{ fontSize: "0.75rem", fontWeight: 600 }}
                          >
                            {confidenceMeta[msg.confidence].label}
                          </div>
                        )}

                        {/* Manual Play Audio Button */}
                        <button
                          onClick={() => speak(msg.content)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${
                            isDark 
                              ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                              : "border-[var(--farmgpt-primary-green)] text-[var(--farmgpt-primary-green)] hover:bg-[var(--farmgpt-surface-green)]"
                          }`}
                          style={{ fontSize: "0.75rem", fontWeight: 600 }}
                          title="Play audio for this message"
                        >
                          <Volume2 size={13} />
                          Hear Output
                        </button>
                      </div>

                      {/* Escalation CTA */}
                      {msg.escalate && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#92400e" }}>
                              This needs expert review
                            </p>
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.5 }} className="mb-3">
                            Your local Krishibhavan officer can give you a definitive answer after inspecting the crop.
                          </p>
                          <button
                            onClick={() => navigate("/app/agri-officer")}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                            style={{ fontSize: "0.82rem", fontWeight: 700 }}
                          >
                            Talk to Expert
                            <ChevronRight size={15} />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}

                  <p
                    className="text-[var(--farmgpt-text-secondary)] mt-1.5"
                    style={{ fontSize: "0.7rem", textAlign: msg.type === "user" ? "right" : "left" }}
                  >
                    {msg.time}
                  </p>
                </div>

                {msg.type === "user" && (
                  <div className="w-9 h-9 bg-[var(--farmgpt-surface-green)] rounded-full flex items-center justify-center shrink-0 mt-1 text-base shadow-sm">
                    👨‍🌾
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
            >
              <AlertTriangle size={15} className="text-red-500 shrink-0" />
              <p className="text-red-700 flex-1" style={{ fontSize: "0.8rem" }}>
                {errorMsg}
              </p>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smart Suggestions */}
        <div className={`px-4 md:px-6 py-2 border-t ${borderColor}`}>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setMessage(s); inputRef.current?.focus(); }}
                className={`px-4 py-1.5 rounded-full border transition-colors ${
                  isDark
                    ? "bg-[#374151] text-gray-300 border-white/10 hover:border-white/30"
                    : "bg-white text-[var(--farmgpt-text-secondary)] border-[var(--border)] hover:border-[var(--farmgpt-primary-green)] hover:text-[var(--farmgpt-primary-green)]"
                }`}
                style={{ fontSize: "0.78rem" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className={`p-4 border-t ${borderColor} ${cardBg}`}>
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <button
              onClick={toggleListening}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? "bg-red-500 animate-pulse text-white shadow-lg shadow-red-500/30"
                  : "bg-[var(--farmgpt-primary-green)] text-white hover:opacity-90"
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={() => navigate("/app/image-diagnosis")}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#374151]" : "bg-[var(--farmgpt-surface-green)]"}`}
              title="Upload crop image for diagnosis"
            >
              <Camera size={18} className="text-[var(--farmgpt-primary-green)]" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask in English, Malayalam or Tamil…"
              disabled={isLoading}
              className={`flex-1 rounded-full px-5 py-3 outline-none transition-opacity ${inputBg} ${isLoading ? "opacity-60" : ""}`}
              style={{ fontSize: "0.9rem" }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              className="w-10 h-10 bg-[var(--farmgpt-primary-green)] rounded-full flex items-center justify-center hover:opacity-90 transition-all shrink-0 disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Send size={18} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}