import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { useBrowser } from "@/hooks/useBrowser";
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
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "settings",
  //     nameOverride: "SettingsScreen",
  //   });
  // }, []);

  const navigate = useBrowser();

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
  return (
    <Page>
      <MainNavbar title="Settings" />
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
            <input
              type="text"
              name="token"
              id="token"
              autoComplete="none"
              className="mt-1 block w-full dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
              {...getInputProps("token")}
            />
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

        <div className="border-t p-4 flex items-center justify-between">
          <p>Subscription</p>
          <Button
            size="sm"
            variant="outline"
            onClick={onRestorePurchases}
            loading={restorePurchases.isLoading}
          >
            Restore Purchases
          </Button>
        </div>

        <div className="border-t p-4 pb-safe prose dark:prose-invert">
          <h2>About</h2>
          <p>
            <i>Mission Control</i> for Digital Ocean is the &quot;go to&quot;
            app for developers to manage their resources on the go. From the App
            Platform to individual Droplets, you can keep an eye on all your
            mission critical resources.
          </p>
          <p>
            Icons and Illustrations by{" "}
            <span
              className="font-bold"
              onClick={() => navigate("https://icons8.com")}
            >
              Icons8
            </span>
            .
          </p>
          <p>
            <strong>
              &copy; {dayjs().format("YYYY")} Appvents, LLC. All Rights
              Reserved.
            </strong>
          </p>
          <p>
            Developed by <strong>Franco Valdes</strong>.
          </p>
        </div>
      </Page.Content>
    </Page>
  );
}
