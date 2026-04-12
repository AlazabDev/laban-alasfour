export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  imageUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const CHAT_STORAGE_KEY = "laban-alasfour-chatbot";
export const WHATSAPP_CHAT_STORAGE_KEY = "laban-alasfour-whatsapp-chat";

export const NAV_ITEMS: NavItem[] = [
  { label: "الرئيسية", href: "/", icon: "🏠" },
  { label: "الوحدات الخشبية", href: "/living", icon: "🪵" },
  { label: "غرف النوم", href: "/bedroom", icon: "🛏️" },
  { label: "الإضاءة", href: "/lighting", icon: "💡" },
  { label: "المطابخ", href: "/kitchen", icon: "🍽️" },
  { label: "تجربة VR", href: "/vr", icon: "🥽" },
  { label: "إتمام الطلب", href: "/checkout", icon: "🛒" },
];

export const SUGGESTED_QUESTIONS = [
  "أريد ترشيح وحدة خشبية تناسب غرفة المعيشة.",
  "ما الفرق بين الإضاءة الديكورية والإضاءة العملية؟",
  "كيف تعمل تجربة VR قبل الشراء؟",
  "أريد عرض سعر مبدئي مع التركيب.",
];
