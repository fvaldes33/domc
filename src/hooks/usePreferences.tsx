import { Preferences } from "@capacitor/preferences";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getPreference<T>(key: string, defaultValue?: T): Promise<T> {
  const { value } = await Preferences.get({ key });
  if (value) {
    return JSON.parse(value) as T;
  }
  return (defaultValue ?? null) as T;
}

async function setPreference<T>(key: string, value: T): Promise<void> {
  return await Preferences.set({
    key,
    value: JSON.stringify(value),
  });
}

async function clearPreference(key: string): Promise<void> {
  return await Preferences.remove({ key });
}

export function useGetPreference<T = string>({
  key,
  defaultValue,
  enabled = true,
}: {
  key: string;
  defaultValue?: T;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["preferences", key],
    queryFn: () => getPreference<T>(key, defaultValue),
    // initialData: defaultValue ?? null,
    enabled,
  });
}

export function useSetPreference<T = string>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: T }) =>
      setPreference<T>(key, value),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries(["preferences", vars.key]));
    },
  });
}
export function useClearPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key }: { key: string }) => clearPreference(key),
    onSuccess: async (_, vars) => {
      void (await queryClient.invalidateQueries(["preferences", vars.key]));
    },
  });
}
