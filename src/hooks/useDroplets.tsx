import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IListRequest } from "dots-wrapper/dist/types";
import { useGetPreference } from "./usePreferences";

async function getDroplets({
  token,
  ...input
}: IListRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { droplets },
  } = await dots.droplet.listDroplets(input);

  return droplets;
}

export function useGetDroplets({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
  });
  return useQuery({
    queryKey: ["droplets", page, per_page],
    queryFn: () =>
      getDroplets({
        token,
        page,
        per_page,
      }),
  });
}
