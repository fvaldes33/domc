import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { useGetPreference } from "./usePreferences";

async function getBalance({ token }: { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { account_balance, month_to_date_balance, month_to_date_usage },
  } = await dots.customer.getBalance();

  return {
    account_balance,
    month_to_date_balance,
    month_to_date_usage,
  };
}

export function useGetBalance() {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
  });
  return useQuery({
    queryKey: ["balance"],
    queryFn: () => getBalance({ token }),
  });
}
