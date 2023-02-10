import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import {
  useGetDropletDestroyStatus,
  useGetDropletDetails,
  useListDropletActions,
} from "@/hooks/useDroplets";
import { useGetPreference } from "@/hooks/usePreferences";
import { classNames } from "@/utils/classNames";
import { DO_DESTROY_DROPLET } from "@/utils/const";
import { timeAgo } from "@/utils/timeAgo";
import { truncate } from "@/utils/truncate";
import {
  IconCamera,
  IconChevronRight,
  IconCloudUpload,
  IconFileShredder,
  IconHistory,
  IconLoader,
  IconNetwork,
  IconPower,
  IconResize,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { IDroplet } from "dots-wrapper/dist/droplet";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

const dropletNavigationItems = [
  { label: "Power", icon: IconPower, href: "power" },
  // { label: "Resize", icon: IconResize, href: "resize" },
  { label: "Backups", icon: IconCloudUpload, href: "backups" },
  { label: "Snapshots", icon: IconCamera, href: "snapshots" },
];

export default function DropletDetailPage() {
  const { query } = useRouter();
  const {
    data: droplet,
    isLoading,
    refetch,
  } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const { data: actions, refetch: refetchActions } = useListDropletActions({
    page: 1,
    per_page: 10,
    droplet_id: Number(query.dropletId),
  });
  const { data: dropletDestroy } = useGetPreference<{ droplet_id: number }>({
    key: DO_DESTROY_DROPLET,
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

  return (
    <Page>
      <MainNavbar />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          await refetchActions();
          complete();
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            {droplet && (
              <>
                {dropletDestroy && dropletDestroy.droplet_id === droplet.id && (
                  <DropletDestroyingWarning droplet={droplet} />
                )}
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
                        {truncate(droplet.name, 25)}
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

                <section className="mt-4 px-4 grid grid-cols-3 gap-4">
                  {dropletNavigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={`${droplet.id}/${item.href}`}
                      className="flex items-center justify-center aspect-square rounded-lg bg-ocean-2/10 dark:bg-ocean-2/40 text-ocean-2 dark:text-white"
                    >
                      <span className="flex flex-col items-center">
                        <item.icon size={24} strokeWidth={1} />
                        <p className="text-xs mt-1">{item.label}</p>
                      </span>
                    </Link>
                  ))}
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
                              href={`${droplet.id}/networking`}
                              className="flex justify-between items-center px-4 py-2"
                            >
                              <div className="capitalize text-sm">
                                {network.type === "public"
                                  ? `${network.type} IPv4`
                                  : `${network.type} Network`}
                              </div>
                              <div className="flex items-center">
                                <p className="text-gray-600 dark:text-white text-sm">
                                  {network.ip_address}
                                </p>
                                <IconChevronRight size={16} className="ml-2" />
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                      {droplet.networks.v6.map((network) => {
                        return (
                          <li key={network.ip_address} className="">
                            <Link
                              href={`${droplet.id}/networking`}
                              className="flex justify-between items-center px-4 py-2"
                            >
                              <div className="capitalize text-sm">
                                {network.type === "public"
                                  ? `${network.type} IPv6`
                                  : `${network.type} Network`}
                              </div>
                              <div className="flex items-center">
                                <p className="text-gray-600 dark:text-white text-sm">
                                  {network.ip_address}
                                </p>
                                <IconChevronRight size={16} className="ml-2" />
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>

                <section className="mt-4">
                  <div className="mb-6">
                    <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                      <IconHistory className="" size={20} strokeWidth={1.5} />
                      <span className="ml-2 uppercase">History</span>
                    </p>
                    <ul className="text-sm">
                      {actions?.map((action) => {
                        return (
                          <li key={action.id} className="">
                            <div className="flex justify-between items-center px-4 py-2">
                              <div className="capitalize">
                                <p>{action.type.replace("_", " ")}</p>
                                <p className="text-xs text-gray-600 dark:text-white">
                                  {timeAgo(action.started_at)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600 dark:text-white capitalize">
                                  {action.status}
                                </p>
                                {action.completed_at && (
                                  <p className="text-xs text-gray-600 dark:text-white">
                                    {dayjs(action.completed_at).diff(
                                      dayjs(action.started_at),
                                      "s"
                                    )}{" "}
                                    seconds
                                  </p>
                                )}
                              </div>
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

function DropletDestroyingWarning({ droplet }: { droplet: IDroplet }) {
  const { data } = useGetDropletDestroyStatus({
    droplet_id: droplet.id,
  });

  console.log(data);

  return (
    <div className="fixed inset-0 py-safe backdrop-blur-md flex items-center justify-center">
      <section className="p-4 flex items-center bg-red-600 text-white rounded-lg w-full max-w-xs">
        <div className="flex-none">
          <IconFileShredder />
        </div>
        <div className="pl-4">
          <p className="text-sm font-semibold capitalize">{`${droplet.name} is being destroyed`}</p>
          <p className="text-xs">In Progress</p>
        </div>
      </section>
    </div>
  );
}
