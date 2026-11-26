/** Accepts only same-origin internal paths; anything else falls back to the dashboard. */
export function safeRedirect(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (value.startsWith("/auth") || value.startsWith("/reset-password")) return "/";
  return value;
}
