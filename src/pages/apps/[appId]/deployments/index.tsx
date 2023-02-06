import { AppDeploymentRecord } from "@/components/AppDeploymentRecord";
import { MainNavbar } from "@/components/MainNavbar";
import { useGetAppDeployments, useGetAppDetails } from "@/hooks/useApps";
import { DeploymentPhaseMap } from "@/utils/deployment-phases";
import {
  IconActivity,
  IconFileUnknown,
  IconList,
  IconLoader,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Button, Page, Toolbar } from "konsta/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AppDetailDeployments() {
  const { query } = useRouter();
  const [page, setPage] = useState<number>(1);
  const { data: app } = useGetAppDetails({
    app_id: query.appId as string,
  });

  const { data, isLoading, isError } = useGetAppDeployments({
    app_id: query.appId as string,
    page,
    per_page: 10,
  });

  useEffect(() => {
    document.querySelector("#content")?.scrollTo({
      top: 0,
    });
  }, [page]);

  if (isLoading) {
    return (
      <Page id="page-is-loading">
        <MainNavbar />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconLoader size={24} className="animate-spin" />
        </div>
      </Page>
    );
  }

  if (!data || isError) {
    return (
      <Page>
        <MainNavbar />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4">
            <p className="text-2xl font-bold">Sorry</p>
            <p className="mb-2">Something went wrong!</p>
            <Link href="/" passHref>
              <Button large tonal>
                Go back
              </Button>
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <MainNavbar title={app?.spec.name ?? ""} />
      <div className="mb-6">
        <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
          <IconList className="" size={20} strokeWidth={1.5} />
          <span className="ml-2 uppercase">All Activity ({data?.total})</span>
        </p>
        <ul className="">
          {data?.deployByDayKeys.map((date) => {
            const dailyDeployments = data.deployByDay[date];
            return (
              <li key={date}>
                <div className="py-2 px-4 bg-white dark:bg-gray-800 border-b dark:border-gray-600 relative z-[1] text-sm font-medium">
                  <p>{dayjs(date).format("MMM DD, YYYY")}</p>
                </div>
                <ul className="px-4 relative before:content-[''] before:absolute before:z-0 before:top-10 before:left-10 before:h-[80%] before:border-l-2 before:border-gray-200">
                  {dailyDeployments.map((deployment) => {
                    return (
                      <AppDeploymentRecord
                        key={deployment.id}
                        deployment={deployment}
                        appId={query.appId as string}
                      />
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>

      {data?.hasMore && (
        <Toolbar
          top={false}
          className={`left-0 bottom-0 fixed flex justify-between w-full`}
        >
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="w-1/4"
            tonal
          >
            Prev
          </Button>
          <Button
            className="w-1/4"
            onClick={() => setPage((prev) => prev + 1)}
            tonal
          >
            Next
          </Button>
        </Toolbar>
      )}
    </Page>
  );
}
