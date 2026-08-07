import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";
import { globalLimiter } from "./lib/rate-limit";

const app: Express = express();

// ── 1. Trust exactly one reverse-proxy hop (Replit) ─────────────────────
// Required so req.ip resolves to the real client IP, not the proxy IP.
// Setting to 1 (not `true`) avoids blindly trusting spoofed XFF headers.
app.set("trust proxy", 1);

// ── 2. Security headers via Helmet ───────────────────────────────────────
// Sets: X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
// X-DNS-Prefetch-Control, X-Download-Options, HSTS (1 year, preload),
// Permissions-Policy, and removes X-Powered-By.
app.use(
  helmet({
    contentSecurityPolicy: false, // API-only server; no HTML to protect
    hsts: {
      maxAge: 31_536_000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    crossOriginEmbedderPolicy: false, // not needed for a JSON API
  }),
);

// ── 3. CORS — allowlist instead of reflect-all ───────────────────────────
// In Replit's path-based proxy both frontend and /api share the same host,
// so most requests are same-origin. The origin check catches direct API
// calls from other origins and development workflows.
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/[^.]+\.replit\.dev$/,
  /^https:\/\/[^.]+\.repl\.co$/,
  /^https:\/\/[^.]+\.replit\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // Same-origin browser requests have no Origin header → allow.
      if (!origin) return callback(null, true);
      const allowed = ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
      if (allowed) return callback(null, true);
      logger.warn({ origin }, "CORS: blocked request from disallowed origin");
      callback(new Error("CORS: origin not allowed"));
    },
  }),
);

// ── 4. Request logging — strip sensitive headers ─────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          // Drop query string — may contain auth codes / tokens
          url: req.url?.split("?")[0],
          // Never log Authorization header value
          hasAuth: Boolean(req.headers?.authorization),
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── 5. Cookie parser ─────────────────────────────────────────────────────
app.use(cookieParser());

// ── 6. Body parsing — enforce size limits ────────────────────────────────
// Caps prevent memory-exhaustion and slowloris-style body attacks.
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ── 7. Cache-Control for all API responses ───────────────────────────────
// Prevents caches (CDNs, proxies, browsers) from storing auth-gated data.
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  next();
});

// ── 8. Global rate limiter (Tier 1) ─────────────────────────────────────
// Per-route tighter limiters are applied on top inside routes/index.ts.
app.use(globalLimiter);

// ── 9. Session / auth middleware ─────────────────────────────────────────
app.use(authMiddleware);

// ── 10. Routes ───────────────────────────────────────────────────────────
app.use("/api", router);

// ── 11. 404 handler ──────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// ── 12. Global error handler ─────────────────────────────────────────────
// Must have exactly 4 parameters for Express to recognise it as an error
// handler. Never exposes stack traces or internal messages in production.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const isProd = process.env.NODE_ENV === "production";
  const status =
    typeof (err as { status?: number }).status === "number"
      ? (err as { status: number }).status
      : 500;

  if (status >= 500) {
    logger.error({ err }, "Unhandled server error");
  }

  res.status(status).json({
    error: isProd ? "An unexpected error occurred" : String(err),
    ...(isProd ? {} : { detail: (err as Error)?.stack }),
  });
});

export default app;
