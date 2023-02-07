/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import { useGetApps } from "@/hooks/useApps";
import { timeAgo } from "@/utils/timeAgo";
import {
  IconArrowRight,
  IconMapPin,
  IconRocket,
  IconServer,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "next/link";
import { useGetDroplets } from "@/hooks/useDroplets";

export default function AppListingPage() {
  const { data: droplets } = useGetDroplets({
    page: 1,
    per_page: 10,
  });

  console.log(droplets);
  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Droplets</h1>
          </div>
        </div>

        <div className="px-4 space-y-4">
          {droplets?.map((droplet) => {
            return (
              <div
                key={droplet.id}
                className="rounded-lg shadow-xl p-4 bg-slate-100 dark:bg-gray-800"
              >
                <div className="relative flex justify-between">
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
                      <p className="font-medium leading-none">{droplet.name}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      {typeof droplet.region !== "string" && (
                        <div className="flex items-center">
                          <IconMapPin size={16} />
                          <p className="ml-1 text-sm capitalize">
                            {droplet.region.name.toLowerCase()}
                          </p>
                        </div>
                      )}

                      {typeof droplet.image !== "string" &&
                        typeof droplet.image !== "number" && (
                          <div className="flex items-center">
                            <IconServer size={16} />
                            <p className="ml-1 text-sm capitalize truncate">
                              {droplet.image.name.toLowerCase()}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex">
                    <IconArrowRight size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Page.Content>
    </Page>
  );
}
