/* eslint-disable @next/next/no-img-element */
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetDomainRecords, useGetDomains } from "@/hooks/useDomains";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconLoader,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { IDomain, IDomainRecord } from "dots-wrapper/dist/domain";
import { useMemo, useState } from "react";
import Link from "@/components/HapticLink";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { classNames } from "@/utils/classNames";
import { Footer } from "@/components/Footer";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";

export default function DomainListingPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "domainListing",
  //     nameOverride: "DomainListingScreen",
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
  const { data, isLoading, refetch } = useGetDomains({
    page,
    per_page: 100,
  });

  const filteredDomains = useMemo(() => {
    const domains = data?.domains ?? [];
    if (!form.values.searchTerm) {
      return domains;
    }

    return domains.filter((d) =>
      d.name.toLowerCase().includes(form.values.searchTerm.toLowerCase())
    );
  }, [form.values, data?.domains]);

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
            <h1 className="text-2xl font-bold">Domains</h1>
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
          <div className="space-y-4">
            {filteredDomains.length > 0 ? (
              <>
                {filteredDomains?.map((domain) => (
                  <DomainRecord key={domain.name} domain={domain} />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96">
                <p className="text-2xl font-bold text-center my-4">
                  {form.isDirty()
                    ? `No domains match ${form.values.searchTerm}`
                    : "Looks like you don't have any domains"}
                </p>
                <Button component={Link} href="/" className="flex-shrink-0">
                  Back
                </Button>
              </div>
            )}
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

interface DomainRecordGroup {
  [key: string]: IDomainRecord[];
}
function DomainRecord({ domain }: { domain: IDomain }) {
  const router = useRouter();
  const { data, isLoading } = useGetDomainRecords({
    domain_name: domain.name,
    page: 1,
    per_page: 100,
  });

  const recordGroups = useMemo(() => {
    if (!data) return {};

    return data.reduce((acc, record) => {
      return {
        ...acc,
        [record.type]:
          record.type in acc ? [...acc[record.type], record] : [record],
      };
    }, {} as DomainRecordGroup);
  }, [data]);

  return (
    <div className="px-4">
      <button
        className="text-left w-full relative rounded-lg border dark:border-gray-600 p-4 bg-slate-100 dark:bg-gray-800 flex justify-between transition-transform duration-75 active:scale-95"
        onClick={() => {
          router.push(`/domains/${domain.name}`);
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <p className="font-medium leading-none truncate">{domain.name}</p>
          </div>

          <div className="text-xs flex -mx-1">
            {isLoading ? (
              <span className="block h-4 w-52 bg-slate-300 rounded-sm animate-pulse"></span>
            ) : (
              <>
                {Object.keys(recordGroups)
                  .sort()
                  .map((recordKey) => {
                    const records = recordGroups[recordKey];
                    return (
                      <div
                        key={recordKey}
                        className="pl-1 pr-2 relative after:content-['/'] after:absolute after:right-0 last-of-type:after:content-['']"
                      >
                        {records.length} {recordKey}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-none">
          <IconArrowRight size={20} />
        </div>
      </button>
    </div>
  );
}
