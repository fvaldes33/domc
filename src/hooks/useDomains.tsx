import { DO_TOKEN_KEY } from "@/utils/const";
import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IListRequest } from "dots-wrapper/dist/types";
import { useGetPreference } from "./usePreferences";

async function getDomains({
  token,
  ...input
}: IListRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { domains },
  } = await dots.domain.listDomains(input);

  return domains;
}

export function useGetDomains({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["droplets", page, per_page],
    queryFn: () =>
      getDomains({
        token,
        page,
        per_page,
      }),
  });
}
