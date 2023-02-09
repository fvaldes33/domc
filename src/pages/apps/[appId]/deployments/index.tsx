import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
  IconLoader,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "konsta/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AppDeploymentRecord } from "@/components/AppDeploymentRecord";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { Footer } from "@/components/Footer";
import { useGetAppDeployments, useGetAppDetails } from "@/hooks/useApps";

export default function AppDetailDeployments() {
  const { query } = useRouter();
  const [page, setPage] = useState<number>(1);
  const { data: app } = useGetAppDetails({
    app_id: query.appId as string,
  });

  const { data, isLoading, isError, refetch } = useGetAppDeployments({
    app_id: query.appId as string,
    page,
    per_page: 10,
  });

  useEffect(() => {
    document.querySelector("#content")?.scrollTo({
      top: 0,
    });
  }, [page]);

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
                <Button large tonal>
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
      <MainNavbar title={app?.spec.name ?? ""} />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          complete();
        }}
      >
        <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
          <IconList className="" size={20} strokeWidth={1.5} />
          <span className="ml-2 uppercase">All Activity ({data?.total})</span>
        </p>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <ul className="">
              {data?.deployByDayKeys.map((date) => {
                const dailyDeployments = data.deployByDay[date];
                return (
                  <li key={date}>
                    <div className="py-2 px-4 sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-600 z-[1] text-sm font-medium">
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
          </>
        )}
      </Page.Content>
      {data?.hasMore && (
        <Footer>
          <Toolbar position="bottom" border>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-2 flex items-center"
            >
              <IconChevronLeft size={16} />
              <span className="ml-2 text-sm">Prev</span>
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-2 flex items-center flex-row-reverse"
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
