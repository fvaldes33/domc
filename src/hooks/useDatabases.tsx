import { DO_BASE_URL, DO_DESTROY_DROPLET, DO_TOKEN_KEY } from "@/utils/const";
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
  ICreateDatabaseClusterUserApiRequest,
  ICreateDatabaseDbApiRequest,
  IDeleteDatabaseClusterDbApiRequest,
  IDestroyDatabaseClusterApiRequest,
  IGetDatabaseClusterApiRequest,
  IListDatabaseClusterDbsApiRequest,
  IListDatabaseClusterUsersApiRequest,
  IRemoveDatabaseClusterUserApiRequest,
} from "dots-wrapper/dist/database";
import { IListRequest } from "dots-wrapper/dist/types";
import { useClearPreference, useGetPreference } from "./usePreferences";

type WithToken<T> = T & { token?: string | null };

async function listDatabaseClusters({
  token,
  ...input
}: WithToken<IListRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { databases },
  } = await dots.database.listDatabaseClusters({
    ...input,
  });

  return databases;
}

export function useListDatabaseClusters({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });

  return useQuery({
    queryKey: ["dbclusters", page, per_page],
    queryFn: () =>
      listDatabaseClusters({
        token,
        page,
        per_page,
      }),
  });
}

async function getDatabaseCluster({
  token,
  ...input
}: WithToken<IGetDatabaseClusterApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { database },
  } = await dots.database.getDatabaseCluster({
    ...input,
  });

  return database;
}

export function useDatabaseCluster({
  database_cluster_id,
}: IGetDatabaseClusterApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });

  return useQuery({
    queryKey: ["dbclusters", database_cluster_id],
    enabled: Boolean(database_cluster_id),
    queryFn: () =>
      getDatabaseCluster({
        token,
        database_cluster_id,
      }),
  });
}

async function listDatabaseClusterDbs({
  token,
  page = 1,
  per_page = 100,
  ...input
}: WithToken<IListDatabaseClusterDbsApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { dbs },
  } = await dots.database.listDatabaseClusterDbs({
    ...input,
  });

  return dbs;
}

export function useListDatabaseClusterDbs({
  database_cluster_id,
  page,
  per_page,
}: IListDatabaseClusterDbsApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });

  return useQuery({
    queryKey: ["dbclusters", "dbs", database_cluster_id],
    enabled: Boolean(database_cluster_id),
    queryFn: () =>
      listDatabaseClusterDbs({
        token,
        database_cluster_id,
        page,
        per_page,
      }),
  });
}

async function listDatabaseClusterUsers({
  token,
  page = 1,
  per_page = 100,
  database_cluster_id,
}: WithToken<IListDatabaseClusterUsersApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { users },
  } = await dots.database.listDatabaseClusterUsers({
    page,
    per_page,
    database_cluster_id,
  });

  return users;
}

export function useListDatabaseClusterUsers({
  database_cluster_id,
  page,
  per_page,
}: IListDatabaseClusterUsersApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });

  return useQuery({
    queryKey: ["dbclusters", "users", database_cluster_id],
    enabled: Boolean(database_cluster_id),
    queryFn: () =>
      listDatabaseClusterUsers({
        token,
        database_cluster_id,
        page,
        per_page,
      }),
  });
}

async function createDatabaseClusterUser({
  token,
  ...input
}: WithToken<ICreateDatabaseClusterUserApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  return await dots.database.createDatabaseClusterUser({
    ...input,
  });
}

export function useCreateDatabaseClusterUser() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateDatabaseClusterUserApiRequest) =>
      createDatabaseClusterUser({
        token,
        ...input,
      }),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries([
        "dbclusters",
        "users",
        vars.database_cluster_id,
      ]);
    },
  });
}

async function resetDatabaseClusterUser({
  token,
  database_cluster_id,
  user_name,
}: WithToken<IRemoveDatabaseClusterUserApiRequest>) {
  if (!token) throw new Error("Token is required");

  const res = await fetch(
    `${DO_BASE_URL}/databases/${database_cluster_id}/users/${user_name}/reset_auth`,
    {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await res.json();
}

export function useResetDatabaseClusterUser() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IRemoveDatabaseClusterUserApiRequest) =>
      resetDatabaseClusterUser({
        token,
        ...input,
      }),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries([
        "dbclusters",
        "users",
        vars.database_cluster_id,
      ]);
    },
  });
}

async function removeDatabaseClusterUser({
  token,
  ...input
}: WithToken<IRemoveDatabaseClusterUserApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  return await dots.database.removeDatabaseClusterUser({
    ...input,
  });
}

export function useRemoveDatabaseClusterUser() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IRemoveDatabaseClusterUserApiRequest) =>
      removeDatabaseClusterUser({
        token,
        ...input,
      }),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries([
        "dbclusters",
        "users",
        vars.database_cluster_id,
      ]);
    },
  });
}

async function createDatabaseClusterDb({
  token,
  ...input
}: WithToken<ICreateDatabaseDbApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  return await dots.database.createDatabaseClusterDb({
    ...input,
  });
}

export function useCreateDatabaseClusterDb() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateDatabaseDbApiRequest) =>
      createDatabaseClusterDb({
        token,
        ...input,
      }),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries([
        "dbclusters",
        "dbs",
        vars.database_cluster_id,
      ]);
    },
  });
}

async function deleteDatabaseClusterDb({
  token,
  ...input
}: WithToken<IDeleteDatabaseClusterDbApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  return await dots.database.deleteDatabaseClusterDb({
    ...input,
  });
}

export function useDeleteDatabaseClusterDb() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IDeleteDatabaseClusterDbApiRequest) =>
      deleteDatabaseClusterDb({
        token,
        ...input,
      }),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries([
        "dbclusters",
        "dbs",
        vars.database_cluster_id,
      ]);
    },
  });
}

async function destroyDatabaseCluster({
  token,
  ...input
}: WithToken<IDestroyDatabaseClusterApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  return await dots.database.destroyDatabaseCluster({
    ...input,
  });
}

export function useDestroyDatabaseCluster() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IDestroyDatabaseClusterApiRequest) =>
      destroyDatabaseCluster({
        token,
        ...input,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["dbclusters"]);
    },
  });
}
