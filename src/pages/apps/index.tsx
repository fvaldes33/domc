/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import { useGetApps } from "@/hooks/useApps";
import { timeAgo } from "@/utils/timeAgo";
import {
  IconArrowRight,
  IconClock,
  IconCreditCard,
  IconWorld,
  IconExternalLink,
  IconShip,
  IconRocket,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "next/link";

export default function AppListingPage() {
  const { data: apps } = useGetApps({
    page: 1,
    per_page: 10,
  });

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Apps</h1>
          </div>
        </div>

        <div className="px-4">
          {apps?.map((app) => (
            <div
              key={app.id}
              className="rounded-lg shadow-xl p-4 bg-slate-100 dark:bg-gray-800"
            >
              <div className="relative flex items-center justify-between">
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

                    <img
                      alt={`flag of ${app.region.flag}`}
                      src={`https://countryflagsapi.com/svg/${app.region.flag}`}
                      crossOrigin="anonymous"
                      className="w-4"
                    />
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
                <div className="flex items-center">
                  <IconArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Page.Content>
    </Page>
  );
}
