import { useGetApps } from "@/hooks/useApps";
import { IEnhancedProject } from "@/hooks/useProjects";
import { IconApps, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo } from "react";

export function AppListing({ project }: { project?: IEnhancedProject }) {
  const { data: apps } = useGetApps({
    page: 1,
    per_page: 10,
  });

  const projectApps = useMemo(() => {
    if (!project) {
      return apps;
    }
    return apps?.filter((app) => {
      const ids = project?.resources
        .filter((r) => {
          return r.urn.includes("app");
        })
        .map((r) => r.urn.split(":").pop());
      return ids?.includes(app.id);
    });
  }, [apps, project]);

  if (!projectApps?.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
        <IconApps className="" size={20} strokeWidth={1.5} />
        <span className="ml-2 uppercase">Apps ({projectApps?.length})</span>

        <Link href="/apps" className="flex items-center ml-auto">
          <span>View All</span>
          <IconArrowRight size={16} />
        </Link>
      </p>
      <ul className="px-4">
        {projectApps?.map((app) => (
          <li key={app.id}>
            <Link
              href={`/apps/${app.id}`}
              className="py-2 flex items-center justify-between"
            >
              <span>{app.spec.name}</span>
              <span>{app.live_domain}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
