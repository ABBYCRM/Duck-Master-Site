/**
 * Strip characters that should never appear in user-supplied strings:
 *  • Null bytes          — crash/injection vector in C-based libs
 *  • ASCII control chars — except \t (0x09), \n (0x0a), \r (0x0d)
 *  • HTML tags           — defence-in-depth even though responses are JSON
 *
 * Does NOT encode for HTML output — that's the renderer's job.
 */
export function sanitizeString(value: string, maxLen = 500): string {
  return value
    .replace(/\0/g, "")                          // null bytes
    .replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")  // control chars
    .replace(/<[^>]*>/g, "")                     // HTML tags
    .trim()
    .slice(0, maxLen);
}

/**
 * Mask all environment-variable-style secrets from a string so they
 * cannot leak into log output. Replaces any value that looks like an
 * API key (20+ printable non-space chars after "nvapi-", "Bearer ", etc.)
 * with [REDACTED].
 */
export function redactSecrets(text: string): string {
  return text
    // NVIDIA / generic bearer tokens
    .replace(/nvapi-[A-Za-z0-9_\-]{8,}/g, "[REDACTED]")
    .replace(/Bearer\s+[A-Za-z0-9_\-\.]{20,}/g, "Bearer [REDACTED]")
    // Generic "key=<long value>" patterns
    .replace(/(api[_-]?key\s*[:=]\s*)[^\s"'&,]{10,}/gi, "$1[REDACTED]");
}
