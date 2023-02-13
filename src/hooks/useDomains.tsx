import { DO_TOKEN_KEY } from "@/utils/const";
import { fireEvent } from "@/utils/fire-event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import {
  ICreateDomainRecordApiRequest,
  IDeleteDomainRecordApiRequest,
  IGetDomainApiRequest,
  IGetDomainRecordApiRequest,
  IListDomainRecordsRequest,
  IUpdateDomainRecordApiRequest,
} from "dots-wrapper/dist/domain";
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

async function getDomain({
  token,
  ...input
}: IGetDomainApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { domain },
  } = await dots.domain.getDomain(input);

  return domain;
}

async function getDomainRecords({
  token,
  ...input
}: IListDomainRecordsRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { domain_records },
  } = await dots.domain.listDomainRecords(input);

  return domain_records;
}

async function getDomainRecord({
  token,
  ...input
}: IGetDomainRecordApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { domain_record },
  } = await dots.domain.getDomainRecord(input);

  return domain_record;
}

async function updateDomainRecord({
  token,
  ...input
}: IUpdateDomainRecordApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { domain_record },
  } = await dots.domain.updateDomainRecord(input);

  fireEvent({
    name: "action_taken",
    params: {
      action_type: "updateDomainRecord",
    },
  });

  return domain_record;
}

async function createDomainRecord({
  token,
  ...input
}: ICreateDomainRecordApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { domain_record },
  } = await dots.domain.createDomainRecord(input);

  fireEvent({
    name: "action_taken",
    params: {
      action_type: "createDomainRecord",
    },
  });

  return domain_record;
}

async function deleteDomainRecord({
  token,
  ...input
}: IDeleteDomainRecordApiRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  await dots.domain.deleteDomainRecord(input);

  fireEvent({
    name: "action_taken",
    params: {
      action_type: "deleteDomainRecord",
    },
  });

  return true;
}

/**
 * Hooks
 */

export function useGetDomains({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["domains", page, per_page],
    queryFn: () =>
      getDomains({
        token,
        page,
        per_page,
      }),
  });
}

export function useGetDomain({ name }: IGetDomainApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["domains", name],
    queryFn: () =>
      getDomain({
        token,
        name,
      }),
  });
}

export function useGetDomainRecords(input: IListDomainRecordsRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [
      "domains-records",
      input.domain_name,
      input.type,
      input.page,
      input.per_page,
    ],
    queryFn: () =>
      getDomainRecords({
        token,
        ...input,
      }),
    onSuccess(data) {
      data.forEach((record) =>
        queryClient.setQueryData(
          ["domains-record-detail", input.domain_name, record.id],
          record
        )
      );
    },
  });
}

export function useGetDomainRecord(input: IGetDomainRecordApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: [
      "domains-record-detail",
      input.domain_name,
      input.domain_record_id,
    ],
    queryFn: () =>
      getDomainRecord({
        token,
        ...input,
      }),
  });
}

//updateDomainRecord
export function useUpdateDomainRecord() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IUpdateDomainRecordApiRequest) =>
      updateDomainRecord({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      await queryClient.invalidateQueries([
        ["domains-records", vars.domain_name],
      ]);
      await queryClient.invalidateQueries([
        "domains-record-detail",
        vars.domain_name,
        vars.domain_record_id,
      ]);
    },
  });
}

export function useCreateDomainRecord() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateDomainRecordApiRequest) =>
      createDomainRecord({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      await queryClient.invalidateQueries([
        ["domains-records", vars.domain_name],
      ]);
      await queryClient.invalidateQueries([
        "domains-record-detail",
        vars.domain_name,
      ]);
    },
  });
}
//updateDomainRecord
export function useDeleteDomainRecord() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IDeleteDomainRecordApiRequest) =>
      deleteDomainRecord({
        token,
        ...input,
      }),
    onSuccess: async (_, vars) => {
      await queryClient.invalidateQueries([
        ["domains-records", vars.domain_name],
      ]);
    },
  });
}
