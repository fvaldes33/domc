import { DO_DESTROY_DROPLET, DO_TOKEN_KEY } from "@/utils/const";
import { getRemoteApiEndpoint } from "@/utils/endpoint";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IAction } from "dots-wrapper/dist/action";
import {
  IdestroyDropletAndAllAssociatedResourcesApiRequest,
  IDisableDropletBackupsApiRequest,
  IEnableDropletBackupsApiRequest,
  IEnableDropletIpv6ApiRequest,
  IGetDropletActionApiRequest,
  IGetDropletApiRequest,
  IGetDropletDestroyStatusApiRequest,
  IListDropletActionsApiRequest,
  IListDropletBackupsApiRequest,
  IListDropletSnapshotsApiRequest,
  IPowerCycleDropletApiRequest,
  IPowerOffDropletApiRequest,
  IPowerOnDropletApiRequest,
  IRebootDropletApiRequest,
  IShutdownDropletApiRequest,
  ISnapshotDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { IListRequest } from "dots-wrapper/dist/types";
import { atom, useSetAtom } from "jotai";
import { useClearPreference, useGetPreference } from "./usePreferences";

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

async function listDropletActions({
  token,
  ...input
}: IListDropletActionsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { actions },
  } = await dots.droplet.listDropletActions(input);

  return actions;
}

async function listDropletBackups({
  token,
  ...input
}: IListDropletBackupsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { backups },
  } = await dots.droplet.listDropletBackups(input);

  return backups;
}

async function listDropletSnapshots({
  token,
  ...input
}: IListDropletSnapshotsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { snapshots },
  } = await dots.droplet.listDropletSnapshots(input);

  return snapshots;
}

async function enableDropletBackups({
  token,
  ...input
}: IEnableDropletBackupsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.enableDropletBackups(input);

  return action;
}

async function disableDropletBackups({
  token,
  ...input
}: IDisableDropletBackupsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.disableDropletBackups(input);

  return action;
}

async function snapshotDroplet({
  token,
  ...input
}: ISnapshotDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.snapshotDroplet(input);

  return action;
}

async function shutdownDroplet({
  token,
  ...input
}: IShutdownDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.shutdownDroplet(input);

  return action;
}

async function powerOffDroplet({
  token,
  ...input
}: IPowerOffDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.powerOffDroplet(input);

  return action;
}

async function rebootDroplet({
  token,
  ...input
}: IRebootDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.rebootDroplet(input);

  return action;
}

async function powerCycleDroplet({
  token,
  ...input
}: IPowerCycleDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.powerCycleDroplet(input);

  return action;
}

async function destroyDropletAndAllAssociatedResources({
  token,
  ...input
}: IdestroyDropletAndAllAssociatedResourcesApiRequest & {
  token?: string | null;
}): Promise<void> {
  if (!token) throw new Error("Token is required");

  try {
    const remoteEndpoint = getRemoteApiEndpoint();

    const res = await fetch(`${remoteEndpoint}/api/destroy-droplet`, {
      method: "post",
      body: JSON.stringify({
        droplet_id: input.droplet_id,
        token,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!res.ok) {
      throw res;
    }
  } catch (error) {
    throw error;
  }
}

async function getDropletDestroyStatus({
  token,
  ...input
}: IGetDropletDestroyStatusApiRequest & {
  token?: string | null;
}) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const { data } = await dots.droplet.getDropletDestroyStatus(input);

  return data;
}

async function powerOnDroplet({
  token,
  ...input
}: IPowerOnDropletApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.powerOnDroplet(input);

  return action;
}

async function enableDropletIpv6({
  token,
  ...input
}: IEnableDropletIpv6ApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.enableDropletIpv6(input);

  return action;
}

async function waitForAction({
  token,
  ...input
}: Partial<IGetDropletActionApiRequest> & { token?: string | null }) {
  if (!token) throw new Error("Token is required");
  const { droplet_id, action_id } = input;
  if (!droplet_id) throw new Error("Token is required");
  if (!action_id) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { action },
  } = await dots.droplet.getDropletAction({
    droplet_id,
    action_id,
  });

  return action;
}

/**
 * ==========================================================
 * HOOKS START HERE
 * ==========================================================
 */

export function useGetDroplets({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
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
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["droplets", droplet_id],
    enabled: Boolean(droplet_id),
    queryFn: () =>
      getDropletDetails({
        token,
        droplet_id,
      }),
  });
}

export function useGetDropletDestroyStatus({
  droplet_id,
}: IGetDropletDestroyStatusApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();
  const clearPreference = useClearPreference();

  return useQuery({
    queryKey: ["destroy", droplet_id],
    queryFn: () =>
      getDropletDestroyStatus({
        token,
        droplet_id,
      }),
    retry: false,
    refetchInterval(data) {
      if (!data) {
        return false;
      }
      return data.completed_at ? false : 2500;
    },
    onSuccess: async (data) => {
      if (data && data.completed_at) {
        clearPreference.mutate({
          key: DO_DESTROY_DROPLET,
        });
        await queryClient.invalidateQueries(["droplets", data.droplet.id]);
      }
    },
  });
}

type UseListDropletActionsQueryOptions = Omit<
  UseQueryOptions<IAction[], unknown, IAction[], (string | number)[]>,
  "initialData"
>;
export function useListDropletActions(
  input: IListDropletActionsApiRequest,
  options: UseListDropletActionsQueryOptions = {}
) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["droplet-actions", input.droplet_id],
    queryFn: () =>
      listDropletActions({
        token,
        ...input,
      }),
    refetchInterval(data, query) {
      const inProgress = data?.some((a) => a.status === "in-progress");
      return inProgress ? 2500 : 0;
    },
    ...options,
  });
}

export function useListDropletBackups(input: IListDropletActionsApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["droplet-backups", input.droplet_id],
    queryFn: () =>
      listDropletBackups({
        token,
        ...input,
      }),
  });
}

export function useListDropletSnapshots(input: IListDropletActionsApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["droplet-snapshots", input.droplet_id],
    queryFn: () =>
      listDropletSnapshots({
        token,
        ...input,
      }),
  });
}

export const latestActionAtom = atom<IAction | undefined>(undefined);
export const shutdownAttemptAtom = atom<number | undefined>(undefined);
export const powerOffAttemptAtom = atom<number | undefined>(undefined);
export const powerOnAttemptAtom = atom<number | undefined>(undefined);

export function useShutdownDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const setShutdownAttempt = useSetAtom(shutdownAttemptAtom);
  return useMutation({
    mutationFn: (input: IShutdownDropletApiRequest) =>
      shutdownDroplet({
        token,
        ...input,
      }),
    onSuccess(data) {
      setShutdownAttempt(data.id);
    },
  });
}

export function usePowerOffDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const setPowerOffAttempt = useSetAtom(powerOffAttemptAtom);

  return useMutation({
    mutationFn: (input: IPowerOffDropletApiRequest) =>
      powerOffDroplet({
        token,
        ...input,
      }),
    onSuccess(data) {
      setPowerOffAttempt(data.id);
    },
  });
}

export function useRebootDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IRebootDropletApiRequest) =>
      rebootDroplet({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export function usePowerCycleDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IPowerCycleDropletApiRequest) =>
      powerCycleDroplet({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export function useDestroyDropletAndAllAssociatedResources() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IdestroyDropletAndAllAssociatedResourcesApiRequest) =>
      destroyDropletAndAllAssociatedResources({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export function usePowerOnDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();
  const setPowerOnAttempt = useSetAtom(powerOnAttemptAtom);

  return useMutation({
    mutationFn: (input: IPowerOnDropletApiRequest) =>
      powerOnDroplet({
        token,
        ...input,
      }),
    onSuccess: async (data, vars) => {
      setPowerOnAttempt(data.id);
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export function useEnableDropletIpv6() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IPowerOnDropletApiRequest) =>
      enableDropletIpv6({
        token,
        ...input,
      }),
    onSuccess: async (data, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export type UseWaitForActionQueryOptions = Omit<
  UseQueryOptions<IAction, unknown, IAction, (string | number)[]>,
  "initialData"
>;
export function useWaitForAction(
  input: Partial<IGetDropletActionApiRequest>,
  options: UseWaitForActionQueryOptions = {}
) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["droplet-actions", input.action_id ?? ""],
    queryFn: () =>
      waitForAction({
        token,
        ...input,
      }),
    refetchInterval(data) {
      const inProgress = data && data.status === "in-progress";
      return inProgress ? 2500 : 0;
    },
    enabled: Boolean(input.droplet_id) && Boolean(input.action_id),
    ...options,
    onSuccess: async (data, ...args) => {
      if (data.status === "completed") {
        void (await queryClient.invalidateQueries([
          "droplet-actions",
          input.droplet_id,
        ]));
      }
      if (options.onSuccess) {
        options.onSuccess(data, ...args);
      }
    },
  });
}

export function useEnableDropletBackups() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IEnableDropletBackupsApiRequest) =>
      enableDropletBackups({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export function useDisableDropletBackups() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IDisableDropletBackupsApiRequest) =>
      disableDropletBackups({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}

export function useSnapshotDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ISnapshotDropletApiRequest) =>
      snapshotDroplet({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries([
        "droplet-actions",
        vars.droplet_id,
      ]));
    },
  });
}
