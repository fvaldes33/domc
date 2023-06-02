import { DO_BASE_URL, DO_TOKEN_KEY } from "@/utils/const";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { createApiClient } from "dots-wrapper";
import {
  IAppDeployment,
  ICreateAppDeploymentApiRequest,
  IGetAppApiRequest,
  IGetAppDeploymentApiRequest,
  IGetAppDeploymentLogsApiRequest,
  IListAppDeploymentsApiRequest,
} from "dots-wrapper/dist/app";
import { IListRequest } from "dots-wrapper/dist/types";
import { useGetPreference } from "./usePreferences";

async function getApps({
  token,
  ...input
}: IListRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const { data } = await dots.app.listApps(input);

  return data;
}

async function getAppDetail({
  token,
  app_id,
}: IGetAppApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });

  const {
    data: { app },
  } = await dots.app.getApp({ app_id });

  return app;
}

async function getAppDeployments({
  token,
  app_id,
  page,
  per_page,
}: IListAppDeploymentsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });

  const {
    data: {
      deployments,
      meta: { total },
    },
  } = await dots.app.listAppDeployments({
    app_id,
    page,
    per_page,
  });

  type Grouped = {
    [key: string]: IAppDeployment[];
  };
  const deployByDay = deployments.reduce<Grouped>((acc, deployment) => {
    const d: string = dayjs(deployment.created_at).format("YYYY-MM-DD");
    if (d in acc) {
      return {
        ...acc,
        [d]: [...acc[d], deployment],
      };
    }
    return {
      ...acc,
      [d]: [deployment],
    };
  }, {});

  return {
    total,
    deployByDay,
    deployByDayKeys: Object.keys(deployByDay).sort((a, b) => {
      const ahash = Number(dayjs(a).format("c"));
      const bhash = Number(dayjs(b).format("c"));
      return ahash - bhash;
    }),
    hasMore: page! * per_page! < total,
  };
}

async function getAppDeployment({
  token,
  app_id,
  deployment_id,
}: IGetAppDeploymentApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });

  const {
    data: { deployment },
  } = await dots.app.getAppDeployment({
    app_id,
    deployment_id,
  });

  return {
    deployment,
  };
}

async function createDeployment({
  token,
  app_id,
  force_build,
}: ICreateAppDeploymentApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });

  const {
    data: { deployment },
  } = await dots.app.createAppDeployment({
    app_id,
    force_build,
  });

  return {
    deployment,
  };
}

interface ICreateAppRollbackApiRequest {
  app_id: string;
  deployment_id: string;
  skip_pin?: boolean;
  token?: string | null;
}
async function createRollback({
  token,
  app_id,
  deployment_id,
  skip_pin = true,
}: ICreateAppRollbackApiRequest) {
  const url = `${DO_BASE_URL}/apps/${app_id}/rollback`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      deployment_id,
      skip_pin,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  const data = await res.json();

  return data.deployment as IAppDeployment;
}

async function validateRollback({
  token,
  app_id,
  deployment_id,
  skip_pin = true,
}: ICreateAppRollbackApiRequest) {
  const url = `${DO_BASE_URL}/apps/${app_id}/rollback/validate`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      deployment_id,
      skip_pin,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  const data = await res.json();

  return data as { valid: boolean };
}

async function getAppDeploymentLogs({
  token,
  ...input
}: IGetAppDeploymentLogsApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });

  const { data } = await dots.app.getAppDeploymentLogs(input);

  return data;
}

/**
 * ==========================================================
 * HOOKS START HERE
 * ==========================================================
 */

export function useGetApps({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["apps", page, per_page],
    queryFn: () =>
      getApps({
        token,
        page,
        per_page,
      }),
  });
}

export function useGetAppDetails({ app_id }: IGetAppApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["apps", app_id],
    queryFn: () =>
      getAppDetail({
        token,
        app_id,
      }),
    enabled: Boolean(app_id),
  });
}

export function useGetAppDeployments({
  app_id,
  page = 1,
  per_page = 5,
}: IListAppDeploymentsApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["deployments", app_id, page, per_page],
    queryFn: () =>
      getAppDeployments({
        token,
        app_id,
        page,
        per_page,
      }),
    enabled: Boolean(app_id),
    keepPreviousData: true,
  });
}

export function useGetAppDeployment({
  app_id,
  deployment_id,
}: IGetAppDeploymentApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["deployments", app_id, deployment_id],
    queryFn: () =>
      getAppDeployment({
        token,
        app_id,
        deployment_id,
      }),
    enabled: Boolean(app_id) && Boolean(deployment_id),
  });
}

export function useCreateDeployment() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ICreateAppDeploymentApiRequest) =>
      createDeployment({
        ...input,
        token,
      }),
    onSuccess: async (_, vars) => {
      // void (await queryClient.invalidateQueries(["apps", vars.app_id]));
      void (await queryClient.invalidateQueries(["deployments"]));
    },
  });
}

export function useCreateRollback() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ICreateAppRollbackApiRequest) => {
      const data = await validateRollback({
        ...input,
        token,
      });
      if (!data.valid) {
        throw data;
      }
      return createRollback({
        ...input,
        token,
      });
    },
    onSuccess: async (_, vars) => {
      // void (await queryClient.invalidateQueries(["apps", vars.app_id]));
      void (await queryClient.invalidateQueries(["deployments"]));
      setTimeout(async () => {
        void (await queryClient.invalidateQueries(["apps", vars.app_id]));
      }, 2500);
    },
  });
}

export function useGetAppDeploymentLogs() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useMutation({
    mutationFn: async (input: IGetAppDeploymentLogsApiRequest) =>
      getAppDeploymentLogs({
        token,
        ...input,
      }),
  });
}
