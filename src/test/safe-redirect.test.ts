import { describe, expect, it } from "vitest";
import { safeRedirect } from "@/lib/upvet/safe-redirect";
describe("safeRedirect", () => {
  it("keeps internal paths", () => expect(safeRedirect("/financeiro")).toBe("/financeiro"));
  it("blocks external URLs", () => expect(safeRedirect("https://evil.com")).toBe("/"));
  it("blocks protocol-relative URLs", () => expect(safeRedirect("//evil.com")).toBe("/"));
  it("avoids loops to auth", () => expect(safeRedirect("/auth")).toBe("/"));
});
