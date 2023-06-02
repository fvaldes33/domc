/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import {
  IconArrowRight,
  IconDatabase,
  IconHash,
  IconLoader,
  IconMapPin,
  IconNumber,
  IconSearch,
  IconServer,
  IconX,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "@/components/HapticLink";
import { truncate } from "@/utils/truncate";
import { Button } from "@/components/Button";
import empty from "@/assets/droplets.png";
import { useListDatabaseClusters } from "@/hooks/useDatabases";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { classNames } from "@/utils/classNames";

export default function DatabasesListingPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "dropletListing",
  //     nameOverride: "DropletListingScreen",
  //   });
  // }, []);

  const form = useForm({
    initialValues: {
      searchTerm: "",
    },
  });
  const [opened, { toggle }] = useDisclosure(false, {
    onClose: () => {
      form.setFieldValue("searchTerm", "");
    },
  });

  const [page, setPage] = useState<number>(1);

  const { data, isLoading, refetch } = useListDatabaseClusters({
    page,
    per_page: 100,
  });

  const filteredClusters = useMemo(() => {
    const databases = data?.databases ?? [];
    if (!form.values.searchTerm) {
      return databases;
    }

    return databases.filter((d) =>
      d.name.toLowerCase().includes(form.values.searchTerm.toLowerCase())
    );
  }, [form.values, data?.databases]);

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
          <div
            className={classNames(
              "transition-all duration-150 ease-in-out",
              opened ? "hidden" : "block"
            )}
          >
            <h1 className="text-2xl font-bold">Databases</h1>
          </div>
          <form className="flex items-center gap-x-2 w-full justify-end">
            <button
              type="button"
              className={classNames(
                "transition-all duration-150 delay-300",
                opened ? "hidden" : "block"
              )}
              onClick={toggle}
            >
              <IconSearch size={20} />
            </button>
            <div
              className={classNames(
                "transition-all duration-150 ease-in-out",
                opened ? "w-full" : "w-0 overflow-hidden"
              )}
            >
              <input
                className="mt-1 block w-full dark:text-white dark:bg-neutral-800 placeholder:dark:text-white/75 rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
                placeholder="Search..."
                type="text"
                {...form.getInputProps("searchTerm")}
              />
            </div>
            <button
              type="button"
              className={classNames(
                "transition-all transform",
                opened
                  ? "duration-150 delay-300 translate-x-0"
                  : "invisible absolute translate-x-full"
              )}
              onClick={toggle}
            >
              <IconX size={20} />
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {filteredClusters && filteredClusters.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <img src={empty.src} alt="" className="w-40" />
                <p className="text-2xl font-bold text-center my-4">
                  {form.isDirty()
                    ? `No databases match ${form.values.searchTerm}`
                    : "Looks like you don't have any databases"}
                </p>
                <Button component={Link} href="/" className="flex-shrink-0">
                  Back
                </Button>
              </div>
            )}
            {filteredClusters?.map((cluster) => {
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
