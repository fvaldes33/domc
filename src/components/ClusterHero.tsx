import { classNames } from "@/utils/classNames";
import { dbMap } from "@/utils/db-helpers";
import { timeAgo } from "@/utils/timeAgo";
import { truncate } from "@/utils/truncate";
import { IDatabaseCluster } from "dots-wrapper/dist/database";
import { useMemo } from "react";

export function ClusterHero({ cluster }: { cluster?: IDatabaseCluster }) {
  const dbSizeConfig = useMemo(() => {
    if (!cluster) return null;

    const sizeMap = dbMap.get(cluster.size);
    if (!sizeMap) {
      return [];
    }
    const { cpu, size } = sizeMap;
    const uri = cluster.connection.uri.split(":")[0].replace("sql", "SQL");
    const { version } = cluster;

    return [cluster.region, cpu, size, `${uri}${version}`];
  }, [cluster]);

  if (!cluster) {
    return (
      <section className="px-4 flex flex-col">
        <header className="flex items-center justify-start">
          <div className="w-full">
            <div
              className={classNames(
                "inline-block mb-1 px-2 py-1 text-xs rounded-md capitalize",
                "bg-gray-400 text-white h-5 w-14 animate-pulse"
              )}
            ></div>
            <p className="h-7 w-3/4 bg-gray-200 animate-pulse rounded-md mb-2"></p>

            <div className="flex items-center h-4 w-3/5 animate-pulse bg-gray-200 rounded-md mb-1"></div>
            <div className="flex items-center space-x-1 text-sm h-4 w-1/2 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          <div className="ml-auto">{/* <AppActions app={app} /> */}</div>
        </header>
      </section>
    );
  }

  return (
    <section className="px-4 flex flex-col">
      <header className="flex items-center justify-start">
        <div className="">
          <span
            className={classNames(
              "inline-block mb-1 px-2 py-1 text-xs rounded-md capitalize",
              cluster.status === "online"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            )}
          >
            {cluster.status}
          </span>
          <h1 className="text-xl font-bold truncate overflow-hidden">
            {truncate(cluster.name, 25)}
          </h1>

          <div className="flex items-center">
            {dbSizeConfig?.map((c, index) => (
              <p
                key={index}
                className="uppercase text-sm pl-2 pr-3 first-of-type:pl-0 last-of-type:after:content-[''] after:content-['/'] relative after:absolute after:right-0"
              >
                {c}
              </p>
            ))}
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <p className="capitalize">Created {timeAgo(cluster.created_at)}</p>
          </div>
        </div>
        <div className="ml-auto">{/* <AppActions app={app} /> */}</div>
      </header>
    </section>
  );
}
