/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import {
  IconArrowRight,
  IconLoader,
  IconMapPin,
  IconServer,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "@/components/HapticLink";
import { useGetDroplets } from "@/hooks/useDroplets";
import { truncate } from "@/utils/truncate";
import { Button } from "@/components/Button";
import empty from "@/assets/droplets.png";

export default function DropletListingPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "dropletListing",
  //     nameOverride: "DropletListingScreen",
  //   });
  // }, []);

  const {
    data: droplets,
    isLoading,
    refetch,
  } = useGetDroplets({
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
            <h1 className="text-2xl font-bold">Droplets</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {droplets && droplets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <img src={empty.src} alt="" className="w-40" />
                <p className="text-2xl font-bold text-center my-4">
                  {`Looks like you don't have any droplets`}
                </p>
                <Button component={Link} href="/" className="flex-shrink-0">
                  Back
                </Button>
              </div>
            )}
            {droplets?.map((droplet) => {
              return (
                <button
                  key={droplet.id}
                  className="w-full relative rounded-lg shadow-xl p-4 bg-slate-100 dark:bg-gray-800 flex justify-between transition-transform duration-75 active:scale-95"
                >
                  <Link
                    href={`/droplets/${droplet.id}`}
                    className="absolute inset-0"
                  >
                    <span className="sr-only">{droplet.name}</span>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {droplet.status === "active" ? (
                        <div className="h-3 w-3 bg-green-600 rounded-full ring-1 ring-offset-2 ring-green-600 mr-2"></div>
                      ) : (
                        <div className="h-3 w-3 bg-red-600 rounded-full ring-1 ring-offset-2 ring-red-600 mr-2"></div>
                      )}
                      <p className="font-medium leading-none">
                        {truncate(droplet.name, 30)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {typeof droplet.region !== "string" && (
                        <div className="flex items-center">
                          <IconMapPin size={16} className="flex-none" />
                          <p className="ml-1 text-sm capitalize">
                            {droplet.region.name.toLowerCase()}
                          </p>
                        </div>
                      )}

                      {typeof droplet.image !== "string" &&
                        typeof droplet.image !== "number" && (
                          <div className="flex items-center">
                            <IconServer size={16} className="flex-none" />
                            <p className="ml-1 text-sm capitalize truncate">
                              {droplet.image.name.toLowerCase()}
                            </p>
                          </div>
                        )}
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
