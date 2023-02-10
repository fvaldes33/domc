import { DO_TOKEN_KEY } from "@/utils/const";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import {
  IDeleteSnapshotApiRequest,
  IGetSnapshotApiRequest,
} from "dots-wrapper/dist/snapshot";
import {
  useClearPreference,
  useGetPreference,
  useSetPreference,
} from "./usePreferences";

async function getSnapshot({
  token,
  ...input
}: IGetSnapshotApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { snapshot },
  } = await dots.snapshot.getSnapshot(input);

  return snapshot;
}

async function destroySnapshot({
  token,
  ...input
}: IDeleteSnapshotApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });

  await dots.snapshot.deleteSnapshot(input);

  return true;
}

/**
 * ==========================================================
 * HOOKS START HERE
 * ==========================================================
 */

export function useGetSnapshot({ snapshot_id }: IGetSnapshotApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["snapshot", snapshot_id],
    queryFn: () =>
      getSnapshot({
        token,
        snapshot_id,
      }),
  });
}

export function useDestroySnapshot() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useMutation({
    mutationFn: (input: IDeleteSnapshotApiRequest) =>
      destroySnapshot({
        token,
        ...input,
      }),
  });
}
