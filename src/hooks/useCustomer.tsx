import { WithToken } from "@/types";
import { DO_TOKEN_KEY } from "@/utils/const";
import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import {
  IGetInvoiceSummaryApiRequest,
  IListInvoiceItemsApiRequest,
} from "dots-wrapper/dist/customer";
import { IListRequest } from "dots-wrapper/dist/types";
import { useGetPreference } from "./usePreferences";

async function getBalance({ token }: { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { account_balance, month_to_date_balance, month_to_date_usage },
  } = await dots.customer.getBalance();

  return {
    account_balance,
    month_to_date_balance,
    month_to_date_usage,
  };
}

export function useGetBalance() {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["balance"],
    queryFn: () => getBalance({ token }),
  });
}

async function listBillingHistory({
  token,
  ...input
}: WithToken<IListRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: {
      billing_history,
      meta: { total },
    },
  } = await dots.customer.listBillingHistory(input);

  const { page, per_page } = input;
  return {
    billing_history,
    hasMore: page! * per_page! < total,
  };
}

export function useListBillingHistory({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["billing-history", page],
    queryFn: () => listBillingHistory({ token, page, per_page }),
  });
}

async function getInvoiceSummary({
  token,
  ...input
}: WithToken<IGetInvoiceSummaryApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const { data } = await dots.customer.getInvoiceSummary(input);
  return data;
}

export function useGetInvoiceSummary({
  invoice_uuid,
}: IGetInvoiceSummaryApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["invoice", invoice_uuid],
    queryFn: () => getInvoiceSummary({ token, invoice_uuid }),
  });
}

async function listInvoiceItems({
  token,
  ...input
}: WithToken<IListInvoiceItemsApiRequest>) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const { data } = await dots.customer.listInvoiceItems({
    ...input,
    page: 1,
    per_page: 100,
  });
  return data;
}

export function useListInvoiceItems({
  invoice_uuid,
}: IListInvoiceItemsApiRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  return useQuery({
    queryKey: ["invoice-items", invoice_uuid],
    queryFn: () => listInvoiceItems({ token, invoice_uuid }),
  });
}
