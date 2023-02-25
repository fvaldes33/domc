import { DO_TOKEN_KEY } from "@/utils/const";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IAccount } from "dots-wrapper/dist/account";
import { useGetPreference } from "./usePreferences";

async function getAccount({ token }: { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { account },
  } = await dots.account.getAccount();

  return account;
}

export function useGetAccount(
  options: Omit<
    UseQueryOptions<IAccount, unknown, IAccount, string[]>,
    "initialData"
  > = {}
) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount({ token }),
    ...options,
  });
}
