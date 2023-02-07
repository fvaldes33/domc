import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IGetDropletApiRequest } from "dots-wrapper/dist/droplet";
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

async function getDropletDetails({
  token,
  ...input
}: IGetDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { droplet },
  } = await dots.droplet.getDroplet(input);

  return droplet;
}

/**
 * ==========================================================
 * HOOKS START HERE
 * ==========================================================
 */

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

export function useGetDropletDetails({ droplet_id }: IGetDropletApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
  });
  return useQuery({
    queryKey: ["droplets", droplet_id],
    queryFn: () =>
      getDropletDetails({
        token,
        droplet_id,
      }),
  });
}
