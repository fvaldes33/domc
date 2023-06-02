import { IEnhancedProject } from "@/hooks/useProjects";
import { IconArrowRight, IconDatabase } from "@tabler/icons-react";
import Link from "@/components/HapticLink";
import { useMemo } from "react";
import { useListDatabaseClusters } from "@/hooks/useDatabases";

export function DatabaseListing({ project }: { project?: IEnhancedProject }) {
  const { data } = useListDatabaseClusters({
    page: 1,
    per_page: 100,
  });

  const projectClusters = useMemo(() => {
    if (!project) {
      return data?.databases;
    }
    return data?.databases?.filter((cluster) => {
      const ids = project?.resources
        .filter((r) => {
          return r.urn.includes("dbaas");
        })
        .map((r) => r.urn.split(":").pop());
      return ids?.includes(String(cluster.id));
    });
  }, [data?.databases, project]);

  if (!projectClusters?.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
        <IconDatabase className="" size={20} strokeWidth={1.5} />
        <span className="ml-2 uppercase">
          Databases ({projectClusters.length})
        </span>

        <Link href="/droplets" className="flex items-center ml-auto">
          <span>View All</span>
          <IconArrowRight size={16} />
        </Link>
      </p>
      <ul className="px-4">
        {projectClusters.map((cluster) => (
          <li key={cluster.id}>
            <Link
              href={`/databases/${cluster.id}`}
              className="py-2 flex items-center justify-between"
            >
              <span className="block">{cluster.name}</span>
              <span className="capitalize">{cluster.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
