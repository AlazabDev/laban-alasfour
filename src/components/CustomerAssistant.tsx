import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronLeft,
  Clock3,
  Headset,
  MessageCircleMore,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildPhoneLink, buildWhatsAppLink, companyProfile } from "@/lib/company";

type AssistantAction = {
  label: string;
  kind: "route" | "external";
  href: string;
  tone?: "primary" | "soft";
};

type QuickPrompt = {
  label: string;
  value: string;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: AssistantAction[];
  prompts?: QuickPrompt[];
};

const defaultPrompts: QuickPrompt[] = [
  { label: "أريد تجربة المنتج في غرفتي", value: "أريد تجربة المنتج في غرفتي عبر VR" },
  { label: "أريد عرض سعر", value: "أريد عرض سعر" },
  { label: "أبحث عن وحدات إضاءة", value: "أبحث عن وحدات إضاءة" },
  { label: "ما مدة التنفيذ والتركيب؟", value: "ما مدة التنفيذ والتركيب؟" },
];

function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createWelcomeMessage(): Message {
  return {
    id: createId(),
    role: "assistant",
    text:
      "أهلاً بك، أنا مساعد لبن العصفور. أساعدك في اختيار الوحدات الخشبية أو وحدات الإضاءة، شرح المعاينة عبر VR من الهاتف، وتحويلك مباشرة إلى فريق المبيعات عند الحاجة.",
    actions: [
      { label: "ابدأ تجربة VR", kind: "route", href: "/vr", tone: "primary" },
      { label: "تحدث مع المبيعات", kind: "external", href: buildWhatsAppLink("مرحباً، أريد التحدث مع فريق مبيعات لبن العصفور."), tone: "soft" },
    ],
    prompts: defaultPrompts,
  };
}

function buildSalesMessage(topic: string, productSlug: string | null): string {
  if (productSlug) {
    return `مرحباً، أحتاج مساعدة بخصوص المنتج ${productSlug}. الموضوع: ${topic}`;
  }

  return `مرحباً، أحتاج مساعدة من فريق لبن العصفور. الموضوع: ${topic}`;
}

function buildAssistantReply(input: string, pathname: string): Message {
  const normalized = input.trim().toLowerCase();
  const productSlug = pathname.startsWith("/product/") ? decodeURIComponent(pathname.split("/").pop() ?? "") : null;

  if (/(vr|ar|معاين|كاميرا|غرفتي|الواقع|preview)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text:
        "المعاينة تتم من الهاتف مباشرة. نوجّهك إلى المنتج أو القسم المناسب، ثم تفتح التجربة لتشاهد القطعة داخل المساحة عبر الكاميرا قبل اتخاذ قرار الشراء.",
      actions: [
        { label: "انتقل إلى تجربة VR", kind: "route", href: "/vr", tone: "primary" },
        { label: "حجز معاينة مع الفريق", kind: "external", href: buildWhatsAppLink(buildSalesMessage("أريد حجز معاينة VR", productSlug)), tone: "soft" },
      ],
      prompts: [
        { label: "كيف أبدأ من الهاتف؟", value: "كيف أبدأ تجربة المنتج من الهاتف؟" },
        { label: "أريد ترشيح منتج مناسب", value: "أريد ترشيح منتج مناسب لمساحتي" },
      ],
    };
  }

  if (/(سعر|اسعار|تكلف|عرض سعر|quotation|quote|ميزاني)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text:
        "التسعير يعتمد على المقاس، الخامة، التشطيب، وعدد الوحدات المطلوبة. أسرع طريقة للحصول على عرض واضح هي إرسال المنتج أو صورة المساحة ليقوم فريق المبيعات بتجهيز السعر المناسب.",
      actions: [
        { label: "اطلب عرض سعر", kind: "external", href: buildWhatsAppLink(buildSalesMessage("أريد عرض سعر", productSlug)), tone: "primary" },
        { label: "اتصل الآن", kind: "external", href: buildPhoneLink(), tone: "soft" },
      ],
      prompts: [
        { label: "أريد تسعير للوحدات الخشبية", value: "أريد تسعير للوحدات الخشبية" },
        { label: "أريد تسعير لوحدات الإضاءة", value: "أريد تسعير لوحدات الإضاءة" },
      ],
    };
  }

  if (/(تركيب|شحن|توصيل|مدة|تنفيذ|delivery|install)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text:
        "مدة التنفيذ والتركيب تختلف حسب نوع المنتج والمدينة ومدى تخصيص الطلب. بعد تحديد الخامة والمقاس أو المنتج المطلوب، يشاركك الفريق بجدول واضح للتجهيز والتسليم والتركيب.",
      actions: [
        { label: "استفسر عن المدة", kind: "external", href: buildWhatsAppLink(buildSalesMessage("أريد معرفة مدة التنفيذ والتركيب", productSlug)), tone: "primary" },
      ],
      prompts: [
        { label: "هل يوجد شحن خارج الرياض؟", value: "هل يوجد شحن خارج الرياض؟" },
        { label: "ما المطلوب قبل التركيب؟", value: "ما المطلوب قبل التركيب؟" },
      ],
    };
  }

  if (/(اضاء|إنار|lighting|lamp|luci|اباجورة)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text:
        "نساعدك في اختيار وحدات إضاءة ديكورية ووظيفية متناسقة مع الخامة والمشهد العام، وليس مجرد قطعة منفصلة. يمكنك البدء من قسم الإضاءة أو طلب ترشيح مباشر بحسب نمط المساحة.",
      actions: [
        { label: "تصفح وحدات الإضاءة", kind: "route", href: "/lighting", tone: "primary" },
        { label: "اطلب ترشيح إضاءة", kind: "external", href: buildWhatsAppLink(buildSalesMessage("أريد ترشيح وحدات إضاءة", productSlug)), tone: "soft" },
      ],
      prompts: [
        { label: "أبحث عن إضاءة للمعيشة", value: "أبحث عن إضاءة لغرفة المعيشة" },
        { label: "أريد إضاءة متناسقة مع الخشب", value: "أريد إضاءة متناسقة مع الخشب" },
      ],
    };
  }

  if (/(خشب|وحدة|معيش|نوم|مطبخ|تفصيل|custom|wood)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text:
        "المتجر مخصص للوحدات الخشبية المصممة كجزء من تجربة متكاملة مع الإضاءة. إذا كنت تبحث عن وحدة معيشة أو غرفة نوم أو مطبخ، أستطيع توجيهك للقسم المناسب أو تحويلك للمبيعات لاقتراح تكوين يلائم المساحة.",
      actions: [
        { label: "وحدات المعيشة", kind: "route", href: "/living", tone: "primary" },
        { label: "غرف النوم", kind: "route", href: "/bedroom", tone: "soft" },
        { label: "حلول المطابخ", kind: "route", href: "/kitchen", tone: "soft" },
      ],
      prompts: [
        { label: "أريد استشارة لمساحة كاملة", value: "أريد استشارة لمساحة كاملة" },
        { label: "أبحث عن وحدة خشبية عملية", value: "أبحث عن وحدة خشبية عملية" },
      ],
    };
  }

  if (/(فرع|معرض|عنوان|location|showroom|زيارة)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text: `يمكنك التواصل أو التنسيق للزيارة عبر ${companyProfile.showroomCity}. كما نستقبل الاستفسارات وننسق الطلبات والمعاينات عن بعد بشكل مباشر مع فريق المبيعات.`,
      actions: [
        { label: "اتصال مباشر", kind: "external", href: buildPhoneLink(), tone: "primary" },
        { label: "راسلنا عبر واتساب", kind: "external", href: buildWhatsAppLink(buildSalesMessage("أريد معرفة موقع المعرض أو أقرب نقطة خدمة", productSlug)), tone: "soft" },
      ],
      prompts: [
        { label: "أريد تحديد موعد", value: "أريد تحديد موعد" },
      ],
    };
  }

  if (/(مبيعات|موظف|بشري|انسان|واتساب|اتصال|تواصل)/.test(normalized)) {
    return {
      id: createId(),
      role: "assistant",
      text: `يمكنني تحويلك فوراً إلى فريق المبيعات. ساعات المتابعة الحالية: ${companyProfile.supportHours}.`,
      actions: [
        { label: "واتساب المبيعات", kind: "external", href: buildWhatsAppLink(buildSalesMessage("أريد التحدث مع فريق المبيعات", productSlug)), tone: "primary" },
        { label: "اتصل الآن", kind: "external", href: buildPhoneLink(), tone: "soft" },
      ],
      prompts: [
        { label: "أريد عرض سعر", value: "أريد عرض سعر" },
        { label: "أريد حجز معاينة VR", value: "أريد حجز معاينة VR" },
      ],
    };
  }

  return {
    id: createId(),
    role: "assistant",
    text:
      "أقدر أساعدك في 3 أمور مباشرة: اختيار وحدة أو إضاءة مناسبة، شرح المعاينة عبر VR من الهاتف، أو تحويلك لفريق المبيعات لعرض سعر أو تنسيق الطلب.",
    actions: [
      { label: "ابدأ معاينة VR", kind: "route", href: "/vr", tone: "primary" },
      { label: "تحدث مع المبيعات", kind: "external", href: buildWhatsAppLink(buildSalesMessage(input, productSlug)), tone: "soft" },
    ],
    prompts: defaultPrompts,
  };
}

export function CustomerAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);

  const hiddenOnRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (hiddenOnRoute) {
      setIsOpen(false);
    }
  }, [hiddenOnRoute]);

  useEffect(() => {
    const savedMessages = sessionStorage.getItem("laban-assistant-messages");
    const savedOpen = sessionStorage.getItem("laban-assistant-open");

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as Message[];
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        setMessages([createWelcomeMessage()]);
      }
    }

    if (savedOpen === "true") {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("laban-assistant-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("laban-assistant-open", String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isOpen]);

  const headerHint = useMemo(() => {
    if (location.pathname.startsWith("/product/")) {
      return "أسئلة المنتج الحالي";
    }

    if (location.pathname === "/vr") {
      return "مساعدة المعاينة";
    }

    return "استقبال العملاء";
  }, [location.pathname]);

  function addResponse(input: string) {
    if (!input.trim()) {
      return;
    }

    const userMessage: Message = {
      id: createId(),
      role: "user",
      text: input.trim(),
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [...current, buildAssistantReply(input, location.pathname)]);
      setIsTyping(false);
    }, 520);
  }

  function handleAction(action: AssistantAction) {
    if (action.kind === "route") {
      navigate(action.href);
      setIsOpen(false);
      return;
    }

    window.open(action.href, "_blank", "noopener,noreferrer");
  }

  if (hiddenOnRoute) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex h-[min(680px,calc(100vh-7rem))] w-[min(410px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-background/95 shadow-elevated backdrop-blur-2xl"
          >
            <div className="relative overflow-hidden bg-gradient-navy px-5 pb-5 pt-4 text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,203,72,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-gold">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold">مساعد {companyProfile.brandNameAr}</h2>
                      <span className="rounded-full bg-primary-foreground/10 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground/75">
                        {headerHint}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-primary-foreground/72">
                      رد فوري، وفرز أولي، وتحويل سريع إلى المبيعات عند الحاجة
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-primary-foreground/78">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2.5 py-1">
                        <Clock3 className="h-3 w-3" />
                        {companyProfile.supportHours}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2.5 py-1">
                        <Headset className="h-3 w-3" />
                        واتساب ومكالمات مباشرة
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/8 text-primary-foreground/84 transition-colors hover:bg-primary-foreground/14"
                  aria-label="إغلاق المساعد"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(246,243,236,0.92),rgba(255,255,255,0.98))] px-4 py-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-soft ${
                        message.role === "assistant"
                          ? "rounded-tr-md border border-border/40 bg-card text-foreground"
                          : "rounded-tl-md bg-primary text-primary-foreground"
                      }`}
                    >
                      <p>{message.text}</p>

                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actions.map((action) => (
                            <button
                              key={`${message.id}-${action.label}`}
                              type="button"
                              onClick={() => handleAction(action)}
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                                action.tone === "primary"
                                  ? "bg-secondary text-secondary-foreground shadow-gold hover:translate-y-[-1px]"
                                  : "border border-border bg-background text-foreground/78 hover:border-secondary/40 hover:text-secondary"
                              }`}
                            >
                              {action.label}
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      )}

                      {message.prompts && message.prompts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.prompts.map((prompt) => (
                            <button
                              key={`${message.id}-${prompt.label}`}
                              type="button"
                              onClick={() => addResponse(prompt.value)}
                              className="rounded-full border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground/76 transition-colors hover:border-secondary/50 hover:text-secondary"
                            >
                              {prompt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-[1.5rem] rounded-tr-md border border-border/40 bg-card px-4 py-3 shadow-soft">
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary/70" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary/50 [animation-delay:120ms]" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary/30 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border/50 bg-card/94 p-3">
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                  استقبال أولي للعملاء وتوجيه سريع
                </span>
                <span dir="ltr">{companyProfile.phoneDisplay}</span>
              </div>

              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  addResponse(draft);
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 flex-shrink-0 rounded-2xl bg-gradient-gold text-secondary-foreground shadow-gold hover:scale-[1.02]"
                  aria-label="إرسال"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="اكتب سؤالك عن المنتجات أو المعاينة أو الأسعار..."
                  className="h-11 rounded-2xl border-border/60 bg-background/90 text-sm placeholder:text-muted-foreground/70"
                />
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-secondary/20 bg-gradient-navy px-4 py-3 text-right text-primary-foreground shadow-elevated transition-transform hover:translate-y-[-1px]"
          aria-label={isOpen ? "إخفاء المساعد" : "فتح المساعد"}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-gold">
            {isOpen ? <X className="h-5 w-5" /> : <MessageCircleMore className="h-5 w-5" />}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold">استقبال العملاء</p>
            <p className="text-xs text-primary-foreground/72">اسأل عن الأسعار، VR، أو التواصل المباشر</p>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
