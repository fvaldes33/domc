/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import { useGetApps } from "@/hooks/useApps";
import { timeAgo } from "@/utils/timeAgo";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconRocket,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "@/components/HapticLink";
import rocket from "@/assets/code.png";
import { Button } from "@/components/Button";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { classNames } from "@/utils/classNames";
import { Footer } from "@/components/Footer";
import { Toolbar } from "@/components/Toolbar";

export default function AppListingPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "appListing",
  //     nameOverride: "AppListingpage",
  //   });
  // }, []);

  const form = useForm({
    initialValues: {
      searchTerm: "",
    },
  });
  const [opened, { toggle }] = useDisclosure(false, {
    onClose: () => {
      form.setFieldValue("searchTerm", "");
    },
  });

  const [page, setPage] = useState<number>(1);
  const { data, refetch } = useGetApps({
    page,
    per_page: 100,
  });

  const filteredApps = useMemo(() => {
    const apps = data?.apps ?? [];
    if (!form.values.searchTerm) {
      return apps;
    }

    return apps.filter((d) =>
      d.spec.name.toLowerCase().includes(form.values.searchTerm.toLowerCase())
    );
  }, [form.values, data?.apps]);

  return (
    <Page>
      <MainNavbar />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          complete();
        }}
      >
        <div className="p-4 flex items-center justify-between">
          <div
            className={classNames(
              "transition-all duration-150 ease-in-out",
              opened ? "hidden" : "block"
            )}
          >
            <h1 className="text-2xl font-bold">Apps</h1>
          </div>
          <form className="flex items-center gap-x-2 w-full justify-end">
            <button
              type="button"
              className={classNames(
                "transition-all duration-150 delay-300",
                opened ? "hidden" : "block"
              )}
              onClick={toggle}
            >
              <IconSearch size={20} />
            </button>
            <div
              className={classNames(
                "transition-all duration-150 ease-in-out",
                opened ? "w-full" : "w-0 overflow-hidden"
              )}
            >
              <input
                className="mt-1 block w-full dark:text-white dark:bg-neutral-800 placeholder:dark:text-white/75 rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
                placeholder="Search..."
                type="text"
                {...form.getInputProps("searchTerm")}
              />
            </div>
            <button
              type="button"
              className={classNames(
                "transition-all transform",
                opened
                  ? "duration-150 delay-300 translate-x-0"
                  : "invisible absolute translate-x-full"
              )}
              onClick={toggle}
            >
              <IconX size={20} />
            </button>
          </form>
        </div>

        <div className="px-4">
          {filteredApps && filteredApps.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96">
              <img src={rocket.src} alt="" className="w-40" />
              <p className="text-2xl font-bold text-center my-4">
                {`Looks like you don't have any apps`}
              </p>
              <Button component={Link} href="/" className="flex-shrink-0">
                Back
              </Button>
            </div>
          )}
          {filteredApps?.map((app) => (
            <button
              key={app.id}
              className="w-full relative rounded-lg shadow-xl p-4 bg-slate-100 dark:bg-gray-800 flex justify-between transition-transform duration-75 active:scale-95"
            >
              <Link href={`/apps/${app.id}`} className="absolute inset-0">
                <span className="sr-only">{app.spec.name}</span>
              </Link>
              <div>
                <div className="flex items-center mb-2">
                  {app.active_deployment.phase === "ACTIVE" ? (
                    <div className="h-3 w-3 bg-green-600 rounded-full ring-1 ring-offset-2 ring-green-600 mr-2"></div>
                  ) : (
                    <div className="h-3 w-3 bg-red-600 rounded-full ring-1 ring-offset-2 ring-red-600 mr-2"></div>
                  )}
                  <p className="font-medium leading-none">{app.spec.name}</p>
                </div>

                <div className="flex items-center mb-1">
                  <p className="mr-2 text-sm">
                    {app.region.label},{" "}
                    <span className="uppercase">{app.region.flag}</span>
                  </p>
                </div>

                <div className="text-sm flex items-center">
                  <IconRocket size={16} />
                  <span className="block ml-1">
                    {timeAgo(
                      app.last_deployment_active_at ??
                        app.last_deployment_created_at
                    )}{" "}
                    &bull; {app.live_domain}
                  </span>
                </div>
              </div>
              <div className="flex flex-none">
                <IconArrowRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </Page.Content>

      {Object.keys(data?.links ?? {}).length > 0 && (
        <Footer className="bg-white dark:bg-black">
          <Toolbar position="bottom" border>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-2 flex items-center disabled:opacity-30"
            >
              <IconChevronLeft size={16} />
              <span className="ml-2 text-sm">Prev</span>
            </button>
            <button
              // @ts-ignore
              disabled={!data?.links?.pages?.next}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-2 flex items-center flex-row-reverse disabled:opacity-30"
            >
              <IconChevronRight size={16} />
              <span className="mr-2 text-sm">Next</span>
            </button>
          </Toolbar>
        </Footer>
      )}
    </Page>
  );
}
