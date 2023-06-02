import { useGetDroplets } from "@/hooks/useDroplets";
import { IEnhancedProject } from "@/hooks/useProjects";
import { IconArrowRight, IconDroplet } from "@tabler/icons-react";
import Link from "@/components/HapticLink";
import { useMemo } from "react";

export function DropletListing({ project }: { project?: IEnhancedProject }) {
  const { data } = useGetDroplets({
    page: 1,
    per_page: 100,
  });

  const projectDroplets = useMemo(() => {
    const droplets = data?.droplets ?? [];
    if (!project) {
      return droplets;
    }
    return droplets?.filter((droplet) => {
      const ids = project?.resources
        .filter((r) => {
          return r.urn.includes("droplet");
        })
        .map((r) => r.urn.split(":").pop());
      return ids?.includes(String(droplet.id));
    });
  }, [data, project]);

  if (!projectDroplets?.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
        <IconDroplet className="" size={20} strokeWidth={1.5} />
        <span className="ml-2 uppercase">
          Droplets ({projectDroplets.length})
        </span>

        <Link href="/droplets" className="flex items-center ml-auto">
          <span>View All</span>
          <IconArrowRight size={16} />
        </Link>
      </p>
      <ul className="px-4">
        {projectDroplets.map((droplet) => (
          <li key={droplet.id}>
            <Link
              href={`/droplets/${droplet.id}`}
              className="py-2 flex items-center justify-between"
            >
              <span className="block">{droplet.name}</span>
              <span className="capitalize">{droplet.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
