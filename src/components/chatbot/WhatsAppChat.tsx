import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { buildPhoneLink, buildWhatsAppLink, companyProfile } from "@/lib/company";
import { WHATSAPP_CHAT_STORAGE_KEY } from "./types";

type WhatsAppMessage = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  createdAt: number;
};

type SalesShortcut = {
  label: string;
  message: string;
};

function getCurrentContext(pathname: string): string {
  if (pathname.startsWith("/product/")) return "صفحة منتج";
  if (pathname.startsWith("/category/")) return "صفحة فئة";
  if (pathname === "/vr") return "صفحة تجربة VR";
  if (pathname === "/lighting") return "قسم الإضاءة";
  if (pathname === "/living") return "قسم الوحدات الخشبية";
  if (pathname === "/checkout") return "صفحة إتمام الطلب";
  return "الصفحة الرئيسية";
}

function createAssistantMessage(text: string): WhatsAppMessage {
  return {
    id: crypto.randomUUID(),
    sender: "assistant",
    text,
    createdAt: Date.now(),
  };
}

function buildInitialMessages(pathname: string): WhatsAppMessage[] {
  return [
    createAssistantMessage(
      [
        `مرحباً بك في ${companyProfile.brandNameAr}.`,
        "هذا المسار مخصص لاستقبال استفسارات البيع السريعة وتحويلها مباشرة إلى واتساب المبيعات.",
        `أنت الآن في ${getCurrentContext(pathname)}.`,
      ].join("\n"),
    ),
  ];
}

function loadStoredMessages(pathname: string): WhatsAppMessage[] {
  if (typeof window === "undefined") {
    return buildInitialMessages(pathname);
  }

  try {
    const raw = window.sessionStorage.getItem(WHATSAPP_CHAT_STORAGE_KEY);
    if (!raw) {
      return buildInitialMessages(pathname);
    }

    const parsed = JSON.parse(raw) as WhatsAppMessage[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : buildInitialMessages(pathname);
  } catch {
    return buildInitialMessages(pathname);
  }
}

export default function WhatsAppChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<WhatsAppMessage[]>(() =>
    loadStoredMessages(location.pathname),
  );
  const endRef = useRef<HTMLDivElement>(null);

  const shortcuts = useMemo<SalesShortcut[]>(
    () => [
      {
        label: "عرض سعر سريع",
        message: "أريد عرض سعر مبدئي لوحدة خشبية مع خيارات الخامات والتركيب.",
      },
      {
        label: "حجز تجربة VR",
        message: "أريد حجز تجربة VR لمعاينة المنتج داخل المساحة قبل الشراء.",
      },
      {
        label: "ترشيح إضاءة",
        message: "أريد ترشيح وحدات إضاءة تناسب المشروع والمساحة.",
      },
      {
        label: "تنفيذ خاص",
        message: "أريد تنفيذ وحدة بمقاسات خاصة وتفاصيل تشطيب مخصصة.",
      },
    ],
    [],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    window.sessionStorage.setItem(
      WHATSAPP_CHAT_STORAGE_KEY,
      JSON.stringify(messages.slice(-12)),
    );
  }, [messages]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length <= 1) {
        return buildInitialMessages(location.pathname);
      }
      return current;
    });
  }, [location.pathname]);

  const openWhatsApp = useCallback(
    (message: string) => {
      const payload = [
        `مرحباً، أراسلكم من متجر ${companyProfile.brandNameAr}.`,
        `السياق الحالي: ${getCurrentContext(location.pathname)}.`,
        `الطلب: ${message}`,
      ].join("\n");
      window.open(buildWhatsAppLink(payload), "_blank", "noopener,noreferrer");
    },
    [location.pathname],
  );

  const pushConversation = useCallback(
    (message: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "user",
          text: message,
          createdAt: Date.now(),
        },
        createAssistantMessage(
          "تم تجهيز الرسالة وتحويلك إلى واتساب المبيعات لإكمال التفاصيل مع الفريق مباشرة.",
        ),
      ]);
    },
    [],
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    pushConversation(trimmed);
    openWhatsApp(trimmed);
  }, [input, openWhatsApp, pushConversation]);

  const handleShortcut = useCallback(
    (message: string) => {
      pushConversation(message);
      openWhatsApp(message);
    },
    [openWhatsApp, pushConversation],
  );

  const resetChat = useCallback(() => {
    const initial = buildInitialMessages(location.pathname);
    setMessages(initial);
    window.sessionStorage.setItem(WHATSAPP_CHAT_STORAGE_KEY, JSON.stringify(initial));
  }, [location.pathname]);

  return (
    <>
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 left-6 z-50 group"
        aria-label="فتح محادثة واتساب"
      >
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 60, opacity: 0 }}
                >
                  <X className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <MessageCircle className="h-7 w-7 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.65], opacity: [0.32, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#25D366]"
            />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="fixed bottom-24 left-6 z-50 flex w-[390px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-2xl"
            style={{ maxHeight: "min(640px, calc(100vh - 8rem))" }}
          >
            <div className="bg-[#128C7E] px-4 py-4 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold">{companyProfile.brandNameAr}</h3>
                  <p className="mt-1 text-[11px] text-white/75">
                    استقبال مبيعات الوحدات الخشبية والإضاءة وتجربة VR
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={buildPhoneLink()}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="اتصال مباشر"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="إغلاق المحادثة"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-border bg-background px-4 py-3" dir="rtl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">ابدأ بأحد المسارات السريعة</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    سنحوّلك إلى واتساب المبيعات مع صياغة جاهزة وواضحة.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetChat}
                  className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  إعادة الضبط
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {shortcuts.map((shortcut) => (
                  <button
                    key={shortcut.label}
                    onClick={() => handleShortcut(shortcut.message)}
                    className="rounded-2xl border border-border bg-card px-3 py-3 text-right text-sm text-foreground transition-colors hover:border-[#25D366]/30 hover:bg-[#25D366]/5"
                  >
                    {shortcut.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[84%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
                      message.sender === "user"
                        ? "rounded-br-md bg-[#DCF8C6] text-foreground"
                        : "rounded-bl-md border border-border bg-card text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <span className="mt-2 block text-[10px] text-muted-foreground" dir="ltr">
                      {new Date(message.createdAt).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-border bg-card px-4 py-3">
              <div className="mb-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => navigate("/vr")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-primary/5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  VR
                </button>
                <button
                  onClick={() => navigate("/lighting")}
                  className="rounded-2xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-primary/5"
                >
                  الإضاءة
                </button>
                <button
                  onClick={() => navigate("/living")}
                  className="rounded-2xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-primary/5"
                >
                  الخشب
                </button>
              </div>

              <div className="flex items-center gap-2" dir="rtl">
                <button
                  type="button"
                  onClick={() =>
                    handleShortcut("أريد التحدث مع فريق المبيعات حول المنتج المناسب ومسار التنفيذ.")
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366] text-white transition-colors hover:bg-[#21bd5b]"
                  aria-label="إرسال الرسالة إلى واتساب"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="اكتب احتياجك وسنحوّلك مباشرة إلى واتساب..."
                  className="h-11 flex-1 rounded-2xl border border-border bg-muted px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#25D366]/25"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  aria-label="إرسال"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
              >
                متابعة الطلب داخل المتجر
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
