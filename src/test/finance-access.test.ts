import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { resolveFinanceAccess } from "@/lib/upvet/finance-access";

function clientFor(roles: Record<string, string>, failed = false) {
  const filters: Record<string, unknown> = {};
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn((key: string, value: unknown) => { filters[key] = value; return query; }),
    then: (resolve: (value: unknown) => unknown) => Promise.resolve({
      data: Object.keys(roles).map((clinic_id) => ({ clinic_id })), error: failed ? { message: "denied" } : null,
    }).then(resolve),
  };
  const rpc = vi.fn(async (_name: string, args: { target_clinic_id: string }) => ({
    data: ["admin", "financeiro"].includes(roles[args.target_clinic_id] ?? ""), error: null,
  }));
  return { client: { from: vi.fn(() => query), rpc } as unknown as SupabaseClient<Database>, filters, rpc };
}

describe("Financial authorization", () => {
  for (const role of ["admin", "financeiro"]) {
    it(`allows ${role} only in its own clinic`, async () => {
      const { client, filters, rpc } = clientFor({ clinicA: role });
      expect(await resolveFinanceAccess(client, "current-user")).toEqual({ canAccess: true, clinicIds: ["clinicA"] });
      expect(filters).toEqual({ user_id: "current-user", is_active: true });
      expect(rpc).toHaveBeenCalledWith("can_access_finance", { target_clinic_id: "clinicA" });
    });
  }
  for (const role of ["veterinario", "recepcionista", "estoque", "super_admin"]) {
    it(`denies automatic financial access to ${role}`, async () => {
      const { client } = clientFor({ clinicA: role });
      expect(await resolveFinanceAccess(client, "current-user")).toEqual({ canAccess: false, clinicIds: [] });
    });
  }
  it("does not reuse permissions between clinics", async () => {
    const { client } = clientFor({ clinicA: "admin", clinicB: "recepcionista" });
    expect(await resolveFinanceAccess(client, "current-user")).toEqual({ canAccess: true, clinicIds: ["clinicA"] });
  });
  it("denies accounts without membership", async () => {
    const { client } = clientFor({});
    expect(await resolveFinanceAccess(client, "current-user")).toEqual({ canAccess: false, clinicIds: [] });
  });
  it("fails closed when the membership query fails", async () => {
    const { client } = clientFor({ clinicA: "admin" }, true);
    await expect(resolveFinanceAccess(client, "current-user")).rejects.toThrow();
  });
  it("fails closed when the permission check fails", async () => {
    const { client, rpc } = clientFor({ clinicA: "admin" });
    rpc.mockResolvedValue({ data: true, error: { message: "denied" } } as unknown as { data: boolean; error: null });
    await expect(resolveFinanceAccess(client, "current-user")).rejects.toThrow();
  });
});