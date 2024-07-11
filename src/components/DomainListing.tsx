import { useGetDomains } from "@/hooks/useDomains";
import { IEnhancedProject } from "@/hooks/useProjects";
import { IconApps, IconArrowRight } from "@tabler/icons-react";
import Link from "@/components/HapticLink";
import { useMemo } from "react";

export function DomainListing({ project }: { project?: IEnhancedProject }) {
  const { data } = useGetDomains({
    page: 1,
    per_page: 100,
  });

  const projectDomains = useMemo(() => {
    const domains = data?.domains ?? [];

    if (!project) {
      return domains;
    }
    return domains?.filter((domain) => {
      const ids = project?.resources
        .filter((r) => {
          return r.urn.includes("domain");
        })
        .map((r) => r.urn.split(":").pop());
      return ids?.includes(domain.name);
    });
  }, [data?.domains, project]);

  if (!projectDomains?.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
        <IconApps className="" size={20} strokeWidth={1.5} />
        <span className="ml-2 uppercase">
          Domains ({projectDomains.length})
        </span>

        <Link href="/domains" className="flex items-center ml-auto">
          <span>View All</span>
          <IconArrowRight size={16} />
        </Link>
      </p>
      <ul className="px-4">
        {projectDomains.map((domain) => {
          const numRecords = domain.zone_file.split("\n").length - 1;
          return (
            <li key={domain.name}>
              <Link
                href={`/domains/${domain.name}`}
                className="py-2 flex flex-col gap-y-1 gap-4 relative pr-6"
              >
                <p className="font-medium leading-none">{domain.name}</p>
                <p className="text-sm truncate">{numRecords} records</p>
                <IconArrowRight
                  className="absolute top-1/2 right-0 transform -translate-y-1/2"
                  size={16}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
