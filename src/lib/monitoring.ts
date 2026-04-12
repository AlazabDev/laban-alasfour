import { env } from "@/lib/env";

type MonitoringPayload = {
  source: string;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
};

function canReportErrors(): boolean {
  return env.monitoringEnabled && Boolean(env.monitoringEndpoint);
}

function buildPayload(payload: MonitoringPayload) {
  return {
    app: "laban-alasfour-storefront",
    appEnv: env.appEnv,
    page: typeof window !== "undefined" ? window.location.href : null,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    timestamp: new Date().toISOString(),
    ...payload,
  };
}

export function reportError(payload: MonitoringPayload) {
  const body = JSON.stringify(buildPayload(payload));

  if (!canReportErrors()) {
    if (env.appEnv !== "production") {
      console.error("[monitoring disabled]", payload);
    }
    return;
  }

  try {
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(env.monitoringEndpoint, blob);
      return;
    }

    void fetch(env.monitoringEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch (error) {
    if (env.appEnv !== "production") {
      console.error("[monitoring failed]", error);
    }
  }
}

export function initMonitoring() {
  if (typeof window === "undefined") {
    return;
  }

  window.addEventListener("error", (event) => {
    reportError({
      source: "window.error",
      message: event.message || "Unknown window error",
      stack: event.error instanceof Error ? event.error.stack : undefined,
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason =
      event.reason instanceof Error
        ? {
            message: event.reason.message,
            stack: event.reason.stack,
          }
        : {
            message: typeof event.reason === "string" ? event.reason : "Unhandled promise rejection",
            stack: undefined,
          };

    reportError({
      source: "window.unhandledrejection",
      message: reason.message,
      stack: reason.stack,
    });
  });
}
