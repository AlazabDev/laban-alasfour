import { env } from "@/lib/env";

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export const companyProfile = {
  brandNameAr: "لبن العصفور",
  brandNameEn: "Laban Alasfour",
  phoneDisplay: env.contactPhoneDisplay,
  phoneRaw: normalizePhone(env.contactPhoneRaw),
  whatsappRaw: normalizePhone(env.contactWhatsappRaw),
  email: env.contactEmail,
  showroomCity: env.showroomCity,
  supportHours: env.supportHours,
} as const;

export function buildPhoneLink(): string {
  return `tel:${companyProfile.phoneRaw}`;
}

export function buildWhatsAppLink(message: string): string {
  const phone = companyProfile.whatsappRaw.replace(/^\+/, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
