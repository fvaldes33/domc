import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { useMissionControl } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { getAccount } from "@/hooks/useAccount";
import { useRestorePurchases } from "@/hooks/useGetOfferings";
import {
  useClearPreference,
  useGetPreference,
  useSetPreference,
} from "@/hooks/usePreferences";
import { TokenAccountMap } from "@/types";
import { classNames } from "@/utils/classNames";
import {
  DO_ACTIVE_PROJECT,
  DO_COLOR_SCHEME_PREF,
  DO_TOKEN_KEY,
  DO_ACCOUNTS,
  ENABLE_HAPTIC_FEEDBACK,
} from "@/utils/const";
import { Capacitor } from "@capacitor/core";
import { Switch } from "@headlessui/react";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { RateApp } from "capacitor-rate-app";
import e from "cors";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const { account, isPaid } = useMissionControl();
  const { data: token } = useGetPreference<string>({
    key: DO_TOKEN_KEY,
  });
  const { data: accounts } = useGetPreference<TokenAccountMap>({
    key: DO_ACCOUNTS,
  });

  const { data: colorScheme } = useGetPreference<string>({
    key: DO_COLOR_SCHEME_PREF,
  });

  const { data: enabledHapticFeedback } = useGetPreference<boolean>({
    key: ENABLE_HAPTIC_FEEDBACK,
    defaultValue: true,
  });
  const [isPasswordVisible, { toggle }] = useDisclosure(false);

  const setPreferences = useSetPreference();
  const clearPreference = useClearPreference();
  const restorePurchases = useRestorePurchases();

  const { getInputProps, onSubmit, setFieldValue, ...form } = useForm({
    initialValues: {
      token: token ?? "",
      colorScheme: colorScheme ?? "manual",
      enableHapticFeedback: enabledHapticFeedback ?? true,
    },
  });

  const handleFormSubmit = async (values: typeof form.values) => {
    if (values.token !== token) {
      // reset active project
      clearPreference.mutate({
        key: DO_ACTIVE_PROJECT,
      });
    }

    if (!values.token) {
      // removing the token and also remove the account
      setPreferences.mutate({
        key: DO_TOKEN_KEY,
        value: values.token,
      });
      if (account && accounts?.[account.uuid]) {
        const newAccounts = { ...accounts };
        delete newAccounts[account.uuid];
        setPreferences.mutate({
          key: DO_ACCOUNTS,
          value: newAccounts,
        });
      }
    } else {
      try {
        const newAccount = await getAccount({ token: values.token });
        const newAccounts = { ...accounts };
        newAccounts[newAccount.uuid] = {
          ...newAccount,
          token: values.token,
        };
        setPreferences.mutate({
          key: DO_TOKEN_KEY,
          value: values.token,
        });
        setPreferences.mutate({
          key: DO_ACCOUNTS,
          value: newAccounts,
        });
      } catch (error) {
        toast.error("Something went wrong");
        return;
      }
    }

    setPreferences.mutateAsync({
      key: DO_COLOR_SCHEME_PREF,
      value: values.colorScheme,
    });
    setPreferences.mutateAsync({
      key: ENABLE_HAPTIC_FEEDBACK,
      value: values.enableHapticFeedback,
    });
    toast.success("Settings Saved");
  };

  useEffect(() => {
    if (token) {
      setFieldValue("token", token);
    }
    if (colorScheme) {
      setFieldValue("colorScheme", colorScheme);
    }
    if (enabledHapticFeedback) {
      setFieldValue("enableHapticFeedback", enabledHapticFeedback);
    }
  }, [setFieldValue, token, colorScheme, enabledHapticFeedback]);

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
          <div className="mb-4 ">
            <label
              htmlFor="token"
              className="block text-sm font-medium text-black dark:text-white"
            >
              API Token
            </label>
            <div className="relative">
              <input
                name="token"
                id="token"
                autoComplete="none"
                type={isPasswordVisible ? "text" : "password"}
                className="mt-1 pr-12 block w-full dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
                {...getInputProps("token")}
              />
              <span className="absolute right-0 aspect-square inset-y-0 h-full flex items-center justify-center p-1">
                <button
                  onClick={toggle}
                  type="button"
                  className="border border-ocean-2 rounded-md h-full w-full flex items-center justify-center bg-white"
                >
                  {isPasswordVisible ? (
                    <IconEye size={16} className="dark:text-black" />
                  ) : (
                    <IconEyeOff size={16} className="dark:text-black" />
                  )}
                </button>
              </span>
            </div>
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

          <div className="mb-4 flex items-center justify-between">
            <label
              htmlFor="enableHapticFeedback"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Enable Haptic Feedback
            </label>
            <Switch
              checked={form.values.enableHapticFeedback}
              onChange={(checked: boolean) =>
                setFieldValue("enableHapticFeedback", checked)
              }
              className={classNames(
                "group relative flex h-7 w-14 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none",
                form.values.enableHapticFeedback ? "bg-ocean-2" : "bg-ocean"
              )}
            >
              <span className="sr-only">Enable haptic feedback</span>
              <span
                aria-hidden={true}
                className={classNames(
                  "pointer-events-none inline-block h-5 w-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out",
                  form.values.enableHapticFeedback
                    ? "translate-x-7"
                    : "translate-x-0"
                )}
              />
            </Switch>
          </div>
          <Button size="sm" type="submit" loading={setPreferences.isLoading}>
            Save Settings
          </Button>
        </form>

        {!isPaid && (
          <section className="px-4 border-t border-ocean-2 pt-6">
            <div className="flex items-center justify-center p-6 border border-ocean-2 bg-ocean-2/10 rounded-md ">
              <div className="text-center">
                <p className="mb-1">Purchased on another device?</p>
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
