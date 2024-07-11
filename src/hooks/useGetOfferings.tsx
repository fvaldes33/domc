import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  CustomerInfo,
  type PurchasesOfferings,
  PurchasesPackage,
} from "@revenuecat/purchases-capacitor";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useGetOfferings(
  options: Omit<
    UseQueryOptions<
      PurchasesOfferings["current"] | null,
      unknown,
      PurchasesOfferings["current"] | null,
      string[]
    >,
    "initialData"
  > = {}
) {
  return useQuery({
    queryKey: ["purchases", "offerings"],
    queryFn: async (): Promise<PurchasesOfferings["current"] | null> => {
      if (!Capacitor.isNativePlatform()) {
        throw new Error("Not native platform");
      }
      const offerings = await Purchases.getOfferings();

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
      const { customerInfo } = await Purchases.getCustomerInfo();
      return customerInfo;
    },
    ...options,
  });
}

export function usePurchasePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ aPackage }: { aPackage: PurchasesPackage }) => {
      if (!Capacitor.isNativePlatform()) {
        throw new Error("Not native platform");
      }
      return await Purchases.purchasePackage({
        aPackage,
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
      const { customerInfo } = await Purchases.restorePurchases();
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
