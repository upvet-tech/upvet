import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Authorization always comes from the database; no browser role or custom permission grants access. */
export async function resolveFinanceAccess(client: SupabaseClient<Database>, userId: string) {
  const { data: members, error } = await client.from("upvet_clinic_members")
    .select("clinic_id").eq("user_id", userId).eq("is_active", true);
  if (error) throw new Error("Não foi possível verificar seu acesso financeiro.");
  const clinicIds = [...new Set((members ?? []).map((member) => member.clinic_id))];
  const checks = await Promise.all(clinicIds.map(async (clinicId) => {
    const { data: allowed, error: permissionError } = await client.rpc("can_access_finance", { target_clinic_id: clinicId });
    if (permissionError) throw new Error("Não foi possível verificar seu acesso financeiro.");
    return allowed === true ? clinicId : null;
  }));
  return { clinicIds: checks.filter((id): id is string => id !== null), canAccess: checks.some((id) => id !== null) };
}