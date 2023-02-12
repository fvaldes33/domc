import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetDomainRecords, useGetDomains } from "@/hooks/useDomains";
import { IconArrowRight, IconLoader } from "@tabler/icons-react";
import { IDomain, IDomainRecord } from "dots-wrapper/dist/domain";
import { useMemo, useState } from "react";
import Link from "@/components/HapticLink";

export default function DomainListingPage() {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, refetch } = useGetDomains({
    page,
    per_page: 25,
  });

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Domains</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((domain) => (
              <DomainRecord key={domain.name} domain={domain} />
            ))}
          </div>
        )}
      </Page.Content>
    </Page>
  );
}

interface DomainRecordGroup {
  [key: string]: IDomainRecord[];
}
function DomainRecord({ domain }: { domain: IDomain }) {
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
      <button className="text-left w-full relative rounded-lg shadow-xl p-4 bg-slate-100 dark:bg-gray-800 flex justify-between transition-transform duration-75 active:scale-95">
        <Link href={`/domains/${domain.name}`} className="absolute inset-0">
          <span className="sr-only">{domain.name}</span>
        </Link>
        <div className="flex-1">
          <div className="mb-2">
            <p className="font-medium leading-none">{domain.name}</p>
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
