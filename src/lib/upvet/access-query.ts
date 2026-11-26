import { queryOptions } from "@tanstack/react-query";
import { getFinanceAccess } from "./access.functions";

export const financeAccessQuery = () => queryOptions({
  queryKey: ["upvet", "finance-access"],
  queryFn: () => getFinanceAccess(),
  staleTime: 0,
  gcTime: 0,
});