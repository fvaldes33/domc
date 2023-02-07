import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetDropletDetails } from "@/hooks/useDroplets";
import { classNames } from "@/utils/classNames";
import { timeAgo } from "@/utils/timeAgo";
import { IconChevronRight, IconLoader, IconNetwork } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function DropletDetailPage() {
  const { query } = useRouter();
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });

  const region = useMemo(() => {
    if (!droplet) return null;
    if (typeof droplet.region === "string") return null;
    return droplet.region;
  }, [droplet]);

  const image = useMemo(() => {
    if (!droplet) return null;
    if (typeof droplet.image === "string" || typeof droplet.image === "number")
      return null;
    return droplet.image;
  }, [droplet]);

  console.log({ droplet });
  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            {droplet && (
              <>
                <section className="px-4 flex flex-col">
                  <header className="flex items-center justify-start">
                    <div className="">
                      <span
                        className={classNames(
                          "inline-block mb-1 px-2 py-1 text-xs rounded-md capitalize",
                          droplet.status === "active"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        )}
                      >
                        {droplet.status}
                      </span>
                      <h1 className="text-xl font-bold truncate overflow-hidden">
                        {droplet.name}
                      </h1>
                      <div className="flex items-center space-x-1 text-sm">
                        <p className="capitalize">
                          Created {timeAgo(droplet.created_at)}
                        </p>
                        <span>&bull;</span>
                        <p className="uppercase">{region?.slug}</p>
                      </div>
                      <p className="text-sm">{image?.name}</p>
                    </div>
                    <div className="ml-auto">
                      {/* <AppActions app={app} /> */}
                    </div>
                  </header>
                </section>
                <section className="px-4">
                  <div className="grid grid-cols-2 border rounded-lg divide-x mt-2">
                    <div className="p-2">
                      <p className="text-xs mb-1 font-medium">Size</p>
                      <div className="text-xs">
                        <p>
                          <span className="font-semibold">
                            {droplet.size.disk}
                          </span>{" "}
                          GB SSD
                        </p>
                        <p>
                          <span className="font-semibold">
                            {droplet.size.vcpus}
                          </span>{" "}
                          vCPU
                        </p>
                        <p>
                          <span className="font-semibold">
                            {droplet.size.transfer}
                          </span>{" "}
                          TB Transfer
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs mb-1 font-medium">Cost</p>
                      <div className="">
                        <p className="text-base font-semibold">
                          ${droplet.size.price_monthly}/
                          <span className="text-sm">mo</span>
                        </p>
                        <p className="text-xs">
                          {droplet.size.price_hourly} <span>$/h</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-4">
                  <div className="mb-6">
                    <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                      <IconNetwork className="" size={20} strokeWidth={1.5} />
                      <span className="ml-2 uppercase">Networking</span>
                    </p>
                    <ul className="">
                      {droplet.networks.v4.map((network) => {
                        return (
                          <li key={network.ip_address} className="">
                            <Link
                              href={`${droplet.id}/networks/v4-${network.type}`}
                              className="flex justify-between items-center px-4 py-2"
                            >
                              <div className="capitalize">
                                {network.type === "public"
                                  ? `${network.type} IPv4`
                                  : `${network.type} Network`}
                              </div>
                              <div className="flex items-center">
                                <p className="text-gray-600 dark:text-white">
                                  {network.ip_address}
                                </p>
                                <IconChevronRight size={16} className="ml-4" />
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                      {droplet.networks.v6.map((network) => {
                        return (
                          <li
                            key={network.ip_address}
                            className="flex justify-between items-center px-4 py-2"
                          >
                            <div className="capitalize">
                              {network.type} IPv4
                            </div>
                            <div className="flex items-center">
                              <p className="text-gray-600 dark:text-white">
                                {network.ip_address}
                              </p>
                              <IconChevronRight size={16} className="ml-4" />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
