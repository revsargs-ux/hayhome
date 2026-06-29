import { supabase } from "@/lib/supabase";

export interface ErrorLog {
  level?: "error" | "warn" | "info";
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  status?: number;
  userId?: string;
  userAgent?: string;
  ip?: string;
  context?: Record<string, unknown>;
}

/**
 * Log error to Supabase hayhome_errors table.
 * Non-blocking — never throws.
 */
export async function logError(err: ErrorLog): Promise<void> {
  try {
    await supabase.from("hayhome_errors").insert({
      level: err.level || "error",
      message: (err.message || "").slice(0, 2000),
      stack: err.stack?.slice(0, 5000) || null,
      url: err.url?.slice(0, 500) || null,
      method: err.method?.slice(0, 10) || null,
      status: err.status || null,
      user_id: err.userId || null,
      user_agent: err.userAgent?.slice(0, 300) || null,
      ip: err.ip?.slice(0, 50) || null,
      context: err.context || null,
    });
  } catch (e) {
    // Never throw from logger
    console.error("[logError] Failed to log:", e);
  }
}

/**
 * Wrap an async API handler with error logging.
 * Catches errors, logs them, returns 500.
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (err: unknown) {
      const req = args[0];
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;

      // Extract request info if it's a NextRequest
      let url: string | undefined;
      let method: string | undefined;
      let ip: string | undefined;
      let userAgent: string | undefined;

      if (req && typeof req === "object") {
        const r = req as { nextUrl?: { pathname?: string }; method?: string; headers?: { get?: (n: string) => string | null } };
        url = r.nextUrl?.pathname;
        method = r.method;
        ip = r.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim();
        userAgent = r.headers?.get?.("user-agent") || undefined;
      }

      await logError({ message, stack, url, method, ip, userAgent, status: 500 });

      throw err; // Re-throw so Next.js handles the response
    }
  }) as T;
}
