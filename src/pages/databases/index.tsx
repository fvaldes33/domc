/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import {
  IconArrowRight,
  IconDatabase,
  IconHash,
  IconLoader,
  IconMapPin,
  IconNumber,
  IconServer,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "@/components/HapticLink";
import { useGetDroplets } from "@/hooks/useDroplets";
import { truncate } from "@/utils/truncate";
import { Button } from "@/components/Button";
import empty from "@/assets/droplets.png";
import { useListDatabaseClusters } from "@/hooks/useDatabases";

export default function DatabasesListingPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "dropletListing",
  //     nameOverride: "DropletListingScreen",
  //   });
  // }, []);

  const {
    data: clusters,
    isLoading,
    refetch,
  } = useListDatabaseClusters({
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
            <h1 className="text-2xl font-bold">Databases</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {clusters && clusters.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <img src={empty.src} alt="" className="w-40" />
                <p className="text-2xl font-bold text-center my-4">
                  {`Looks like you don't have any databases`}
                </p>
                <Button component={Link} href="/" className="flex-shrink-0">
                  Back
                </Button>
              </div>
            )}
            {clusters?.map((cluster) => {
              return (
                <button
                  key={cluster.id}
                  className="w-full relative rounded-lg shadow-xl p-4 bg-slate-100 dark:bg-gray-800 flex justify-between transition-transform duration-75 active:scale-95"
                >
                  <Link
                    href={`/databases/${cluster.id}`}
                    className="absolute inset-0"
                  >
                    <span className="sr-only">{cluster.name}</span>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {cluster.status === "online" ? (
                        <div className="h-3 w-3 bg-green-600 rounded-full ring-1 ring-offset-2 ring-green-600 mr-2"></div>
                      ) : (
                        <div className="h-3 w-3 bg-red-600 rounded-full ring-1 ring-offset-2 ring-red-600 mr-2"></div>
                      )}
                      <p className="font-medium leading-none">
                        {truncate(cluster.name, 30)}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <IconMapPin size={16} className="flex-none" />
                        <p className="ml-1 text-sm capitalize">
                          {cluster.region}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <IconDatabase size={16} className="flex-none" />
                        <p className="ml-1 text-sm capitalize truncate">
                          {cluster.engine} {cluster.version}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <IconHash size={16} className="flex-none" />
                        <p className="ml-1 text-sm capitalize truncate">
                          {cluster.num_nodes}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-none">
                    <IconArrowRight size={20} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Page.Content>
    </Page>
  );
}
