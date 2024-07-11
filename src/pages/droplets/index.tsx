/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconLoader,
  IconMapPin,
  IconSearch,
  IconServer,
  IconX,
} from "@tabler/icons-react";
import { Page } from "@/components/Page";
import Link from "@/components/HapticLink";
import { useGetDroplets } from "@/hooks/useDroplets";
import { truncate } from "@/utils/truncate";
import { Button } from "@/components/Button";
import empty from "@/assets/droplets.png";
import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Toolbar } from "@/components/Toolbar";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { classNames } from "@/utils/classNames";
import { useRouter } from "next/router";

export default function DropletListingPage() {
  const router = useRouter();

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
  const { data, isLoading, refetch } = useGetDroplets({
    page,
    per_page: 100,
  });

  const filteredDroplets = useMemo(() => {
    const droplets = data?.droplets ?? [];
    if (!form.values.searchTerm) {
      return droplets;
    }
    return droplets.filter((d) =>
      d.name.toLowerCase().includes(form.values.searchTerm.toLowerCase())
    );
  }, [form.values, data?.droplets]);

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
            <h1 className="text-2xl font-bold">Droplets</h1>
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
            {filteredDroplets && filteredDroplets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <img src={empty.src} alt="" className="w-40" />
                <p className="text-2xl font-bold text-center my-4">
                  {form.isDirty()
                    ? `No droplets match ${form.values.searchTerm}`
                    : "Looks like you don't have any droplets"}
                </p>
                <Button component={Link} href="/" className="flex-shrink-0">
                  Back
                </Button>
              </div>
            )}
            {filteredDroplets?.map((droplet) => {
              return (
                <button
                  key={droplet.id}
                  className="w-full relative text-left rounded-lg border dark:border-gray-600 p-4 bg-slate-100 dark:bg-gray-800 flex justify-between transition-transform duration-75 active:scale-95"
                  onClick={() => {
                    router.push(`/droplets/${droplet.id}`);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-4">
                      {droplet.status === "active" ? (
                        <div className="shrink-0 h-3 w-3 bg-green-600 rounded-full ring-1 ring-offset-2 ring-green-600 mr-2"></div>
                      ) : (
                        <div className="shrink-0 h-3 w-3 bg-red-600 rounded-full ring-1 ring-offset-2 ring-red-600 mr-2"></div>
                      )}
                      <p className="font-medium leading-none truncate">
                        {droplet.name}
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

      {Object.keys(data?.links ?? {}).length > 0 && (
        <Footer className="bg-white dark:bg-black">
          <Toolbar position="bottom" border>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-2 flex items-center disabled:opacity-30"
            >
              <IconChevronLeft size={16} />
              <span className="ml-2 text-sm">Prev</span>
            </button>
            <button
              // @ts-ignore
              disabled={!data?.links?.pages?.next}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-2 flex items-center flex-row-reverse disabled:opacity-30"
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
