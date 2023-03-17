import { Capacitor } from "@capacitor/core";
import {
  CapacitorPurchases,
  CustomerInfo,
  Offering,
} from "@capgo/capacitor-purchases";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useGetOfferings(
  options: Omit<
    UseQueryOptions<Offering | null, unknown, Offering | null, string[]>,
    "initialData"
  > = {}
) {
  return useQuery({
    queryKey: ["purchases", "offerings"],
    queryFn: async (): Promise<Offering | null> => {
      if (!Capacitor.isNativePlatform()) {
        throw new Error("Not native platform");
      }
      const { offerings } = await CapacitorPurchases.getOfferings();

      if (offerings.current !== null) {
        return offerings.current;
      }

      return null;
    },
    ...options,
  });
}

export function useGetStatus(
  options: Omit<
    UseQueryOptions<CustomerInfo, unknown, CustomerInfo, string[]>,
    "initialData"
  > = {}
) {
  return useQuery({
    queryKey: ["purchases", "status"],
    queryFn: async (): Promise<CustomerInfo> => {
      if (!Capacitor.isNativePlatform()) {
        throw new Error("Not native platform");
      }
      const { customerInfo } = await CapacitorPurchases.getCustomerInfo();
      return customerInfo;
    },
    ...options,
  });
}

export function usePurchasePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      identifier,
      offeringIdentifier,
    }: {
      identifier: string;
      offeringIdentifier: string;
    }) => {
      if (!Capacitor.isNativePlatform()) {
        throw new Error("Not native platform");
      }
      return await CapacitorPurchases.purchasePackage({
        identifier,
        offeringIdentifier,
      });
    },
    onSuccess: async (data) => {
      void (await queryClient.invalidateQueries(["purchases", "status"]));
    },
  });
}

export function useRestorePurchases() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!Capacitor.isNativePlatform()) {
        throw new Error("Not native platform");
      }
      const { customerInfo } = await CapacitorPurchases.restorePurchases();
      if (!customerInfo.entitlements?.active?.length) {
        throw new Error("Could not restore");
      }
      return customerInfo;
    },
    onSettled: async () => {
      void (await queryClient.invalidateQueries(["purchases", "status"]));
    },
  });
}
