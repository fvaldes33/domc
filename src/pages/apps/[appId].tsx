/* eslint-disable @next/next/no-img-element */
import { useInterval } from "@mantine/hooks";
import { IconList, IconLoader } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Button } from "konsta/react";
import Link from "@/components/HapticLink";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { AppActions, AppLogAction } from "@/components/AppActions";
import { AppDeploymentRecord } from "@/components/AppDeploymentRecord";
import { AppStatus } from "@/components/AppStatus";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetAppDeployments, useGetAppDetails } from "@/hooks/useApps";
import { timeAgo } from "@/utils/timeAgo";
import { FavoriteButton } from "@/components/FavoriteButton";

export default function AppDetailPage() {
  const { query } = useRouter();
  const {
    data: app,
    isLoading,
    isError,
    refetch,
  } = useGetAppDetails({
    app_id: query.appId as string,
  });

  const { data: deployments, refetch: refetchDeployments } =
    useGetAppDeployments({
      app_id: query.appId as string,
      page: 1,
      per_page: 5,
    });

  const { start, stop, active } = useInterval(() => {
    refetch();
    refetchDeployments();
  }, 5000);

  useEffect(() => {
    if (!app) return;

    if (app.in_progress_deployment) {
      if (!active) start();
    } else {
      if (active) stop();
    }
  }, [app, active, start, stop]);

  if (isError) {
    return (
      <Page>
        <MainNavbar />
        <Page.Content>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4">
              <p className="text-2xl font-bold">Sorry</p>
              <p className="mb-2">Something went wrong!</p>
              <Link href="/" passHref>
                <Button component="a" large tonal>
                  Go back
                </Button>
              </Link>
            </div>
          </div>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <MainNavbar
        right={
          <FavoriteButton
            resource={{
              id: query.appId as string,
              type: "apps",
              title: app?.spec.name,
            }}
          />
        }
      />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          await refetchDeployments();
          complete();
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <section className="p-4 flex flex-col">
              <header className="flex items-center justify-start">
                <div className="w-2/3">
                  <span className="inline-block mb-1 px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-md capitalize">
                    {app.tier_slug}
                  </span>
                  <h1 className="text-xl font-bold truncate overflow-hidden">
                    {app.spec.name}
                  </h1>
                  <div className="flex items-center">
                    <p className="mr-2 text-sm">
                      {app.region.label},{" "}
                      <span className="uppercase">{app.region.flag}</span>
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex items-start gap-x-2">
                  <AppLogAction app={app} />
                  <AppActions app={app} />
                </div>
              </header>

              <div className="grid grid-cols-3 border border-ocean-2 bg-ocean-2/10 rounded-lg divide-x divide-ocean-2 font-mono mt-2">
                <div className="p-2">
                  <p className="text-xs mb-1 font-medium">Status</p>
                  <AppStatus app={app} />
                </div>
                <div className="p-2">
                  <p className="text-xs mb-1 font-medium">Last Update</p>
                  <div className="flex items-center text-xs">
                    {timeAgo(app.last_deployment_created_at)}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs mb-1 font-medium">Live Domain</p>
                  <div className="text-xs overflow-hidden truncate">
                    {app.live_domain}
                  </div>
                </div>
              </div>
            </section>
            <div className="mb-6">
              <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-ocean-2 flex items-center px-4">
                <IconList className="" size={20} strokeWidth={1.5} />
                <span className="ml-2 uppercase">Recent Activity</span>
              </p>
              <ul className="">
                {deployments?.deployByDayKeys.map((date) => {
                  const dailyDeployments = deployments.deployByDay[date];
                  return (
                    <li key={date}>
                      <div className="py-2 px-4 sticky top-0 bg-white dark:bg-gray-800 border-b border-ocean-2 z-[1] text-sm font-medium">
                        <p>{dayjs(date).format("MMM DD, YYYY")}</p>
                      </div>
                      <ul className="px-4 relative before:content-[''] before:absolute before:z-0 before:top-10 before:left-10 before:h-[80%] before:border-l-2 before:border-ocean-2">
                        {dailyDeployments.map((deployment) => {
                          return (
                            <AppDeploymentRecord
                              key={deployment.id}
                              deployment={deployment}
                              appId={app.id}
                            />
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-center my-4">
                <Link
                  href={`/apps/${query.appId}/deployments`}
                  className="text-sm px-6 bg-ocean-2 text-white rounded-md h-11 flex items-center justify-center font-semibold transform transition-transform duration-75 active:scale-95"
                >
                  See All
                </Link>
              </div>
            </div>
          </>
        )}
      </Page.Content>
    </Page>
  );
}
