import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { useMissionControl } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { useRestorePurchases } from "@/hooks/useGetOfferings";
import {
  useClearPreference,
  useGetPreference,
  useSetPreference,
} from "@/hooks/usePreferences";
import {
  DO_ACTIVE_PROJECT,
  DO_COLOR_SCHEME_PREF,
  DO_TOKEN_KEY,
} from "@/utils/const";
import { Capacitor } from "@capacitor/core";
import { useForm } from "@mantine/form";
import { RateApp } from "capacitor-rate-app";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const { isPaid } = useMissionControl();
  const { data: token } = useGetPreference<string>({
    key: DO_TOKEN_KEY,
  });

  const { data: colorScheme } = useGetPreference<string>({
    key: DO_COLOR_SCHEME_PREF,
  });

  const setPreferences = useSetPreference();
  const clearPreference = useClearPreference();
  const restorePurchases = useRestorePurchases();

  const { getInputProps, onSubmit, setFieldValue, ...form } = useForm({
    initialValues: {
      token: token ?? "",
      colorScheme: colorScheme ?? "manual",
    },
  });

  const handleFormSubmit = (values: typeof form.values) => {
    if (values.token !== token) {
      // reset active project
      clearPreference.mutate({
        key: DO_ACTIVE_PROJECT,
      });
    }

    setPreferences.mutate({
      key: DO_TOKEN_KEY,
      value: values.token,
    });

    setPreferences.mutate(
      {
        key: DO_COLOR_SCHEME_PREF,
        value: values.colorScheme,
      },
      {
        onSuccess: () => {
          toast.success("Settings Saved");
        },
      }
    );
  };

  useEffect(() => {
    if (token) {
      setFieldValue("token", token);
    }
    if (colorScheme) {
      setFieldValue("colorScheme", colorScheme);
    }
  }, [setFieldValue, token, colorScheme]);

  const onRestorePurchases = () => {
    restorePurchases.mutate(undefined, {
      onSuccess: () => {
        toast.success("Purchase restored");
      },
      onError: (error: any) => {
        toast.error(error?.message!);
      },
    });
  };

  const triggerAppRate = () => {
    if (Capacitor.isNativePlatform()) {
      RateApp.requestReview();
    }
  };

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
        <form
          id="settings"
          className="px-4 pb-4"
          onSubmit={onSubmit(handleFormSubmit)}
        >
          <div className="mb-4">
            <label
              htmlFor="token"
              className="block text-sm font-medium text-black dark:text-white"
            >
              API Token
            </label>
            <textarea
              name="token"
              id="token"
              autoComplete="none"
              rows={3}
              className="mt-1 block w-full dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
              {...getInputProps("token")}
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="colorScheme"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Color Scheme
            </label>
            <select
              name="colorScheme"
              id="colorScheme"
              className="mt-1 block w-full dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
              {...getInputProps("colorScheme")}
            >
              <option value="manual">Manual</option>
              <option value="system">System</option>
            </select>
          </div>
          <Button size="sm" type="submit" loading={setPreferences.isLoading}>
            Save Settings
          </Button>
        </form>

        {!isPaid && (
          <section className="px-4 border-t border-ocean-2 pt-6">
            <div className="flex items-center justify-center p-6 border border-ocean-2 bg-ocean-2/10 rounded-md ">
              <div className="text-center">
                <p className="mb-1">Already have a subscription?</p>
                <Button
                  size="sm"
                  variant="light"
                  onClick={onRestorePurchases}
                  loading={restorePurchases.isLoading}
                >
                  Restore
                </Button>
              </div>
            </div>
          </section>
        )}

        <div className="mt-6 border-t border-ocean-2 p-4 flex items-center justify-between">
          <p>Rate App</p>
          <Button size="sm" variant="outline" onClick={triggerAppRate}>
            Leave Review
          </Button>
        </div>
      </Page.Content>
    </Page>
  );
}
