const REQUIRED_ENV_VARS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
] as const;

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

function readRequiredEnv(name: RequiredEnvVar): string {
  const value = import.meta.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function readOptionalEnv(name: string, fallback: string): string {
  const value = import.meta.env[name];
  return value?.trim() ? value.trim() : fallback;
}

function readBooleanEnv(name: string, fallback = false): boolean {
  const value = import.meta.env[name];

  if (!value) {
    return fallback;
  }

  return value.trim().toLowerCase() === "true";
}

export const env = {
  appEnv: readOptionalEnv("VITE_APP_ENV", "development"),
  siteUrl: readOptionalEnv("VITE_SITE_URL", "http://localhost:8080"),
  assetBaseUrl: readOptionalEnv("VITE_ASSET_BASE_URL", "http://localhost:8080/assets/catalog"),
  enableAdmin: readBooleanEnv("VITE_ENABLE_ADMIN", false),
  contactPhoneDisplay: readOptionalEnv("VITE_CONTACT_PHONE_DISPLAY", "+966 50 123 4567"),
  contactPhoneRaw: readOptionalEnv("VITE_CONTACT_PHONE_RAW", "+966501234567"),
  contactWhatsappRaw: readOptionalEnv("VITE_CONTACT_WHATSAPP_RAW", "+966501234567"),
  contactEmail: readOptionalEnv("VITE_CONTACT_EMAIL", "info@labanalasfour.com"),
  showroomCity: readOptionalEnv("VITE_SHOWROOM_CITY", "الرياض، المملكة العربية السعودية"),
  supportHours: readOptionalEnv("VITE_SUPPORT_HOURS", "يومياً من 10 صباحاً إلى 10 مساءً"),
  supabaseUrl: readRequiredEnv("VITE_SUPABASE_URL"),
  supabasePublishableKey: readRequiredEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
} as const;
