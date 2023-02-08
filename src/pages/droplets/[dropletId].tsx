import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import {
  powerOnAttemptAtom,
  shutdownAttemptAtom,
  useGetDropletDetails,
  useListDropletActions,
  usePowerOffDroplet,
} from "@/hooks/useDroplets";
import { classNames } from "@/utils/classNames";
import { timeAgo } from "@/utils/timeAgo";
import {
  IconCamera,
  IconChevronRight,
  IconCloudUpload,
  IconHistory,
  IconLoader,
  IconNetwork,
  IconPower,
  IconResize,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

const dropletNavigationItems = [
  { label: "Power", icon: IconPower, href: "power" },
  { label: "Resize", icon: IconResize, href: "resize" },
  { label: "Backups", icon: IconCloudUpload, href: "backups" },
  { label: "Snapshots", icon: IconCamera, href: "snapshots" },
];

export default function DropletDetailPage() {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [shutdownAttempt, setShutdownAttempt] = useAtom(shutdownAttemptAtom);
  const [powerOnAttempt, setPowerOnAttempt] = useAtom(powerOnAttemptAtom);
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const forcePowerOff = usePowerOffDroplet();
  const { data: actions } = useListDropletActions(
    {
      page: 1,
      per_page: 50,
      droplet_id: Number(query.dropletId),
    },
    {
      refetchInterval(data, query) {
        const inProgress = data?.some((a) => a.status === "in-progress");
        return inProgress ? 2500 : 0;
      },
      onSuccess(data) {
        if (shutdownAttempt) {
          const shutdownAction = data.find((a) => a.id === shutdownAttempt);
          if (shutdownAction && shutdownAction.status === "errored") {
            forcePowerOff.mutate({
              droplet_id: droplet!.id,
            });
          } else if (shutdownAction && shutdownAction.status === "completed") {
            setTimeout(() => {
              setShutdownAttempt(undefined);
              queryClient.invalidateQueries(["droplets", droplet?.id]);
            }, 2500);
          }
        }

        if (powerOnAttempt) {
          const poweronAction = data.find((a) => a.id === powerOnAttempt);
          if (poweronAction && poweronAction.status === "completed") {
            setTimeout(() => {
              setPowerOnAttempt(undefined);
              queryClient.invalidateQueries(["droplets", droplet?.id]);
            }, 2500);
          }
        }
      },
    }
  );

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

  const inProgress = useMemo(() => {
    return actions?.find((a) => a.status === "in-progress");
  }, [actions]);

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

                {inProgress && (
                  <section className="mt-4 mx-4 p-4 flex items-center bg-ocean-2/10 rounded-lg">
                    <div className="flex-none">
                      <IconLoader className="animate-spin" />
                    </div>
                    <div className="pl-4">
                      <p className="text-sm font-semibold capitalize">
                        {inProgress.type.replace("_", " ")} in progress
                      </p>
                      <p className="text-xs">
                        {timeAgo(inProgress.started_at)}
                      </p>
                    </div>
                  </section>
                )}

                <section className="mt-4 px-4 grid grid-cols-4 gap-4">
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

                <section className="mt-4">
                  <div className="mb-6">
                    <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                      <IconHistory className="" size={20} strokeWidth={1.5} />
                      <span className="ml-2 uppercase">History</span>
                    </p>
                    <ul className="">
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
                                <p className="text-xs text-gray-600 dark:text-white">
                                  {dayjs(action.completed_at).diff(
                                    dayjs(action.started_at),
                                    "s"
                                  )}{" "}
                                  seconds
                                </p>
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
