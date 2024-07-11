/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { MainNavbar } from "@/components/MainNavbar";
import { useMissionControl } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { getAccount } from "@/hooks/useAccount";
import {
  useClearPreference,
  useGetPreference,
  useSetPreference,
} from "@/hooks/usePreferences";
import { DO_TOKEN_KEY, DO_ACCOUNTS, DO_ACTIVE_PROJECT } from "@/utils/const";
import canAccess from "@/utils/permissions";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEyeOff, IconSwitch2 } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

export default function Teams() {
  const { accounts, isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("team", ["create"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);

  const [opened, { open, close }] = useDisclosure(false);
  const { data: token } = useGetPreference<string>({
    key: DO_TOKEN_KEY,
  });

  const queryClient = useQueryClient();
  const setPreferences = useSetPreference();
  const clearPreference = useClearPreference();

  const switchTeam = async (newToken: string) => {
    await clearPreference.mutateAsync({
      key: DO_ACTIVE_PROJECT,
    });

    setPreferences.mutate(
      {
        key: DO_TOKEN_KEY,
        value: newToken,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries([
            "accounts",
            "billing",
            "apps",
            "droplets",
            "dbclusters",
            "domains",
            "domains-records",
            "projects",
            "snapshot",
          ]);
          toast.success("Team switched");
        },
      }
    );
  };

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
          </div>
        </div>
        <ul>
          {Object.entries(accounts ?? {})?.map(([uuid, record], idx) => {
            const isActive = token === record.token;
            return (
              <div
                key={idx}
                className="px-4 py-2 flex items-center text-left w-full"
              >
                <img
                  className="w-10 object-cover rounded-full bg-ocean flex-shrink-0"
                  src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${record.email}`}
                  alt=""
                />
                <div className="px-4 text-sm">
                  <p className="font-medium dark:text-white">
                    {/* @ts-ignore */}
                    {record.team.name}{" "}
                    {isActive && (
                      <span className="text-emerald-700">| Active</span>
                    )}
                  </p>
                  <p className="text-xs truncate dark:text-white">
                    {record.email}
                  </p>
                </div>

                <div className="ml-auto">
                  {isActive ? (
                    <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-600 uppercase text-xs rounded-md">
                      Active
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      square
                      onClick={() => switchTeam(record.token)}
                    >
                      <IconSwitch2 size={20} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </ul>

        <Transition show={opened} as={Fragment}>
          <Dialog as="div" className="relative z-[999]" onClose={close}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
            </Transition.Child>
            <div className="fixed inset-0 top-12 w-full h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full h-full pt-4 px-4 pb-safe max-w-md transform overflow-hidden border dark:border-gray-800 rounded-t-2xl bg-white dark:bg-gray-900 text-left transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add New Team
                  </Dialog.Title>
                  <div className="py-4">
                    <NewTeamForm onComplete={close} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </Page.Content>
      <Footer className="bg-ocean-2">
        <Toolbar position="bottom" border>
          <Button
            full
            onClick={() => {
              if (!can) {
                toggleIap();
              } else {
                open();
              }
            }}
          >
            New Team
          </Button>
        </Toolbar>
      </Footer>
    </Page>
  );
}

function NewTeamForm({ onComplete }: { onComplete: () => void }) {
  const { accounts } = useMissionControl();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const setPreferences = useSetPreference();
  const clearPreference = useClearPreference();
  const [isPasswordVisible, { toggle }] = useDisclosure(false);
  const form = useForm<{ token: string }>({
    validate: zodResolver(
      z.object({ token: z.string().min(1, "Token is required") })
    ),
    initialValues: {
      token: "",
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const data = await getAccount({ token: values.token });

      await clearPreference.mutateAsync({
        key: DO_ACTIVE_PROJECT,
      });

      await setPreferences.mutateAsync({
        key: DO_ACCOUNTS,
        value: {
          ...(accounts ?? {}),
          // @ts-expect-error: Wrong types in package
          [data.team.uuid]: {
            ...data,
            token: values.token,
          },
        },
      });

      setPreferences.mutate(
        {
          key: DO_TOKEN_KEY,
          value: values.token,
        },
        {
          async onSuccess() {
            await queryClient.invalidateQueries();
            setIsLoading(false);
            onComplete();
          },
        }
      );
    } catch (error) {
      toast.error("Something went wrong");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.onSubmit(onSubmit)}>
      <div className="">
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
            className="mt-1 pr-10 block w-full dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
            {...form.getInputProps("token")}
          />
          <span className="absolute right-0 aspect-square inset-y-0 h-full flex items-center justify-center p-1">
            <button
              onClick={toggle}
              type="button"
              className="border border-ocean-2 rounded-md h-full w-full flex items-center justify-center bg-white"
            >
              {isPasswordVisible ? (
                <IconEye size={16} />
              ) : (
                <IconEyeOff size={16} />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={() => onComplete()}
        >
          Cancel
        </Button>
        <Button size="sm" type="submit" loading={isLoading}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}
