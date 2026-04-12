import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Loader2,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  Send,
  X,
} from "lucide-react";
import { buildPhoneLink, buildWhatsAppLink, companyProfile } from "@/lib/company";
import { ChatNavMenu } from "./ChatNavMenu";
import { FileUpload } from "./FileUpload";
import { TTSButton } from "./TTSButton";
import { streamChat } from "./chat-service";
import { ChatMessage, CHAT_STORAGE_KEY, SUGGESTED_QUESTIONS } from "./types";
import { VoiceChat } from "./VoiceChat";

type TabMode = "text" | "voice";

const MAX_STORED_MESSAGES = 18;

function createMessage(
  role: ChatMessage["role"],
  content: string,
  imageUrl?: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: Date.now(),
    imageUrl,
  };
}

function buildWelcomeMessage(): ChatMessage {
  return createMessage(
    "assistant",
    [
      `مرحباً، أنا مساعد ${companyProfile.brandNameAr}.`,
      "أساعدك في اختيار الوحدات الخشبية، ترشيح الإضاءة، وتجهيز تجربة VR قبل الشراء.",
      `فريقنا متاح ${companyProfile.supportHours}.`,
    ].join("\n"),
  );
}

function loadStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [buildWelcomeMessage()];
  }

  try {
    const raw = window.sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      return [buildWelcomeMessage()];
    }

    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [buildWelcomeMessage()];
    }

    return parsed;
  } catch {
    return [buildWelcomeMessage()];
  }
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredMessages());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>("text");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef(messages);

  const supportActions = useMemo(
    () => [
      {
        label: "واتساب المبيعات",
        href: buildWhatsAppLink("مرحباً، أريد التحدث مع فريق المبيعات في لبن العصفور."),
        icon: ExternalLink,
      },
      {
        label: "اتصال مباشر",
        href: buildPhoneLink(),
        icon: Phone,
      },
    ],
    [],
  );

  useEffect(() => {
    messagesRef.current = messages;
    window.sessionStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
    );
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  useEffect(() => {
    if (isOpen && activeTab === "text") {
      inputRef.current?.focus();
    }
  }, [isOpen, activeTab]);

  const sendMessage = useCallback(
    async (text: string, imageUrl?: string) => {
      const trimmed = text.trim();
      if (!trimmed && !imageUrl) return;
      if (isLoading) return;

      setInput("");
      setNavOpen(false);

      const userMessage = createMessage(
        "user",
        imageUrl ? `${trimmed || "أرفقت ملفاً للاسترشاد به"}\n[ملف مرفق]` : trimmed,
        imageUrl,
      );

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantId = crypto.randomUUID();
      let accumulated = "";

      const upsertAssistant = (content: string) => {
        setMessages((prev) => {
          const existingIndex = prev.findIndex((message) => message.id === assistantId);
          if (existingIndex >= 0) {
            return prev.map((message) =>
              message.id === assistantId ? { ...message, content } : message,
            );
          }

          return [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content,
              createdAt: Date.now(),
            },
          ];
        });
      };

      try {
        await streamChat({
          messages: [...messagesRef.current, userMessage],
          onDelta: (chunk) => {
            accumulated += chunk;
            upsertAssistant(accumulated);
          },
          onDone: () => setIsLoading(false),
          onError: (message) => {
            upsertAssistant(accumulated ? `${accumulated}\n\n${message}` : message);
            setIsLoading(false);
          },
        });
      } catch {
        upsertAssistant(
          "تعذر إكمال المحادثة حالياً. يمكنك التحويل مباشرة إلى واتساب المبيعات وسنخدمك فوراً.",
        );
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const handleSend = useCallback(() => {
    void sendMessage(input);
  }, [input, sendMessage]);

  const handleFileUploaded = useCallback(
    (url: string) => {
      void sendMessage(input || "أرفقت ملفاً أو صورة للمراجعة.", url);
    },
    [input, sendMessage],
  );

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage],
  );

  const resetConversation = useCallback(() => {
    const welcome = buildWelcomeMessage();
    setMessages([welcome]);
    window.sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([welcome]));
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
            aria-label="فتح مساعد المتجر"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-6 left-6 z-50 flex h-[580px] max-h-[calc(100vh-3rem)] w-[392px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-2xl"
          >
            <div className="relative bg-primary px-4 py-4 text-primary-foreground">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/10"
                  aria-label="إغلاق المحادثة"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1 text-center">
                  <p className="font-display text-sm font-bold">مساعد {companyProfile.brandNameAr}</p>
                  <p className="mt-1 text-[11px] text-primary-foreground/75">
                    وحدات خشبية، إضاءة، وتجربة VR قبل الشراء
                  </p>
                </div>
                <button
                  onClick={() => setNavOpen((current) => !current)}
                  className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/10"
                  aria-label="فتح قائمة التنقل"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
              <ChatNavMenu
                isOpen={navOpen}
                onClose={() => setNavOpen(false)}
                onCloseChat={() => setIsOpen(false)}
              />
            </div>

            <div className="grid grid-cols-2 border-b border-border bg-card" dir="rtl">
              <button
                onClick={() => setActiveTab("text")}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === "text"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                محادثة نصية
              </button>
              <button
                onClick={() => setActiveTab("voice")}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === "voice"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mic className="h-4 w-4" />
                محادثة صوتية
              </button>
            </div>

            {activeTab === "voice" ? (
              <VoiceChat
                onTranscriptMessage={handleVoiceTranscript}
                messages={messages}
                isLoading={isLoading}
              />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto bg-muted/20 px-4 py-4" dir="rtl">
                  {messages.length === 1 && (
                    <div className="mb-4 rounded-3xl border border-primary/10 bg-background/95 p-4 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            استقبال استشارات البيع والـ VR
                          </p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            اسأل عن المقاسات، الخامات، ألوان الإضاءة، أو اطلب معاينة المنتج داخل مساحتك.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {SUGGESTED_QUESTIONS.map((question) => (
                          <button
                            key={question}
                            onClick={() => void sendMessage(question)}
                            className="rounded-2xl border border-border bg-card px-3 py-3 text-right text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                          >
                            {question}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {supportActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <a
                              key={action.label}
                              href={action.href}
                              target={action.href.startsWith("http") ? "_blank" : undefined}
                              rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              <Icon className="h-4 w-4" />
                              {action.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
                            message.role === "user"
                              ? "rounded-br-md bg-primary text-primary-foreground"
                              : "rounded-bl-md border border-border bg-card text-foreground"
                          }`}
                        >
                          {message.imageUrl && (
                            <img
                              src={message.imageUrl}
                              alt="ملف مرفق"
                              className="mb-3 max-h-48 w-full rounded-2xl object-cover"
                              loading="lazy"
                            />
                          )}
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.role === "assistant" && (
                            <div className="mt-2 flex justify-start">
                              <TTSButton text={message.content} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                      <div className="flex justify-end">
                        <div className="rounded-3xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                    <div ref={endRef} />
                  </div>
                </div>

                <div className="border-t border-border bg-card px-3 py-3">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <p className="text-[11px] text-muted-foreground">
                      يمكنك التحويل فوراً إلى واتساب إذا احتجت عرض سعر مباشر أو موعد معاينة.
                    </p>
                    <button
                      type="button"
                      onClick={resetConversation}
                      className="text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      بدء محادثة جديدة
                    </button>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                    dir="rtl"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="اسأل عن منتج، خامة، إضاءة، أو تجربة VR..."
                      className="h-11 flex-1 rounded-2xl border border-border bg-muted px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled={isLoading}
                    />
                    <FileUpload onFileUploaded={handleFileUploaded} disabled={isLoading} />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                      aria-label="إرسال الرسالة"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
