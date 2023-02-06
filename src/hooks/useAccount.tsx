import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { useGetPreference } from "./usePreferences";

async function getAccount({ token }: { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { account },
  } = await dots.account.getAccount();

  return account;
}

export function useGetAccount() {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
  });
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount({ token }),
  });
}
