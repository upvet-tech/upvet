import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveFinanceAccess } from "./finance-access";

export const getFinanceAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(({ context }) => resolveFinanceAccess(context.supabase, context.userId));