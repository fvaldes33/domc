import { Button } from "@/components/Button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Footer } from "@/components/Footer";
import HapticLink from "@/components/HapticLink";
import { MainNavbar } from "@/components/MainNavbar";
import { useMissionControl } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { useGetDomain, useGetDomainRecords } from "@/hooks/useDomains";
import canAccess from "@/utils/permissions";
import { IconEdit, IconLoader, IconWorld } from "@tabler/icons-react";
import { IDomain, IDomainRecord } from "dots-wrapper/dist/domain";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function DomainDetailPage() {
  const { isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("domain", ["update"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);

  const { query } = useRouter();
  const { data: domain, isLoading: domainLoading } = useGetDomain({
    name: query.name as string,
  });

  const { data: records, isLoading: recordsLoading } = useGetDomainRecords({
    domain_name: query.name as string,
    page: 1,
    per_page: 100,
  });

  const isLoading = domainLoading || recordsLoading;

  return (
    <Page>
      <MainNavbar
        title={domain?.name}
        right={
          <FavoriteButton
            resource={{
              id: query.name as string,
              type: "domains",
              title: domain?.name,
            }}
          />
        }
      />
      <Page.Content>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="pb-safe px-safe">
            <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
              <IconWorld className="" size={20} strokeWidth={1.5} />
              <span className="ml-2 uppercase">Domain Records</span>
            </p>
            <table className="mx-auto block max-w-fit whitespace-nowrap table-fixed w-full overflow-x-auto text-sm">
              <colgroup>
                <col style={{ width: "70px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "40px" }} />
              </colgroup>
              <thead>
                <tr className="sticky top-0 z-10">
                  <th className="text-left px-4 bg-gray-200 dark:bg-gray-800 py-2">
                    Type
                  </th>
                  <th className="text-left px-4 bg-gray-200 dark:bg-gray-800 py-2">
                    Name
                  </th>
                  <th className="text-left px-4 bg-gray-200 dark:bg-gray-800 py-2">
                    Data
                  </th>
                  <th className="text-left px-4 bg-gray-200 dark:bg-gray-800 py-2">
                    TTL
                  </th>
                  <th className="text-left px-4 bg-gray-200 dark:bg-gray-800 py-2">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {records
                  ?.filter((r) => r.type !== "SOA")
                  .sort((a: IDomainRecord, b: IDomainRecord) =>
                    a.type.localeCompare(b.type)
                  )
                  .map((record) => {
                    return (
                      <DomainRecordItem
                        key={record.id}
                        record={record}
                        domain={domain!}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </Page.Content>
      <Footer className="bg-ocean-2">
        <Toolbar position="bottom">
          <Button
            full
            component={Link}
            href={`/domains/${domain?.name}/new`}
            onClick={(e: any) => {
              if (!can) {
                e.preventDefault();
                toggleIap();
              }
            }}
          >
            New Record
          </Button>
        </Toolbar>
      </Footer>
    </Page>
  );
}

function DomainRecordItem({
  domain,
  record,
}: {
  domain: IDomain;
  record: IDomainRecord;
}) {
  const { isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("domain", ["update"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);

  const recordName =
    record.name === "@"
      ? domain.name
      : record.type === "CNAME"
      ? `${record.name}.${domain.name}`
      : record.name;

  return (
    <tr className="relative">
      <td className="max-w-[70px] px-4 py-2 overflow-hidden truncate">
        <div>{record.type}</div>
      </td>
      <td className="max-w-[180px] px-4 py-2 overflow-hidden truncate">
        <p>{recordName}</p>
      </td>
      <td className="max-w-[180px] px-4 py-2 overflow-hidden truncate">
        <p>{record.data}</p>
      </td>
      <td className="max-w-[120px] px-4 py-2 overflow-hidden truncate">
        {record.priority && (
          <span className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 mr-1">
            {record.priority}
          </span>
        )}
        <span>{record.ttl}</span>
      </td>
      <td className="max-w-[40px] sticky right-0 bg-white dark:bg-black z-0 pl-6 text-right">
        <HapticLink
          href={`/domains/${domain.name}/${record.id}`}
          onClick={(e) => {
            if (!can) {
              e.preventDefault();
              toggleIap();
            }
          }}
        >
          <IconEdit strokeWidth={1.5} size={16} />
        </HapticLink>
      </td>
    </tr>
  );
}
