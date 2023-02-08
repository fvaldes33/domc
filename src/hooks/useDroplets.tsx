import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IAction } from "dots-wrapper/dist/action";
import {
  IEnableDropletIpv6ApiRequest,
  IGetDropletActionApiRequest,
  IGetDropletApiRequest,
  IListDropletActionsApiRequest,
  IPowerCycleDropletApiRequest,
  IPowerOffDropletApiRequest,
  IPowerOnDropletApiRequest,
  IRebootDropletApiRequest,
  IShutdownDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { IListRequest } from "dots-wrapper/dist/types";
import { atom, useSetAtom } from "jotai";
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

type UseListDropletActionsQueryOptions = Omit<
  UseQueryOptions<IAction[], unknown, IAction[], (string | number)[]>,
  "initialData"
>;
export function useListDropletActions(
  input: IListDropletActionsApiRequest,
  options: UseListDropletActionsQueryOptions = {}
) {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
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

export const latestActionAtom = atom<IAction | undefined>(undefined);
export const shutdownAttemptAtom = atom<number | undefined>(undefined);
export const powerOffAttemptAtom = atom<number | undefined>(undefined);
export const powerOnAttemptAtom = atom<number | undefined>(undefined);

export function useShutdownDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
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
    key: "token",
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
    key: "token",
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
    key: "token",
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

export function usePowerOnDroplet() {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
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
    key: "token",
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
    key: "token",
  });
  const queryClient = useQueryClient();
  const setLatestAction = useSetAtom(latestActionAtom);
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
