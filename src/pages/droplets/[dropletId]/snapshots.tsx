import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetDropletDetails } from "@/hooks/useDroplets";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function DropletSnapshotsPage() {
  const { query } = useRouter();
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });

  return (
    <Page>
      <MainNavbar title={droplet?.name} />
      <Page.Content>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>Snapshots [todo]</>
        )}
      </Page.Content>
    </Page>
  );
}
