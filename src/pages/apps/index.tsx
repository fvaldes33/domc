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
import Link from "@/components/HapticLink";
import rocket from "@/assets/code.png";
import { Button } from "@/components/Button";

export default function AppListingPage() {
  const { data: apps, refetch } = useGetApps({
    page: 1,
    per_page: 10,
  });

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
          <div>
            <h1 className="text-2xl font-bold">Apps</h1>
          </div>
        </div>

        <div className="px-4">
          {apps && apps.length === 0 && (
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
          {apps?.map((app) => (
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
              <div className="flex flex-none">
                <IconArrowRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </Page.Content>
    </Page>
  );
}
