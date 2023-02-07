import { CopyButton } from "@/components/CopyButton";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetDropletDetails } from "@/hooks/useDroplets";
import { IconCopy, IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function DropletNetworkDetail() {
  const { query } = useRouter();
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const [version, type] = (query.type as string).split("-") as [
    "v4" | "v6",
    "public" | "private"
  ];
  const network = droplet?.networks[version].filter((n) => n.type === type);

  return (
    <Page>
      <MainNavbar title={droplet?.name} />
      <Page.Content>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <section className="p-4 flex flex-col">
              <header className="flex items-center justify-start">
                <h1 className="text-xl font-bold truncate overflow-hidden capitalize">
                  {type} Network IP{version}
                </h1>
              </header>
            </section>

            {network?.map((network) => (
              <ul key={network.ip_address} className="mb-6">
                <li className="flex justify-between items-center px-4 py-2">
                  <div className="capitalize">IP Address</div>
                  <div className="flex items-center">
                    <p className="text-gray-600 dark:text-white mr-4">
                      {network.ip_address}
                    </p>
                    <CopyButton
                      square
                      size="sm"
                      variant="outline"
                      value={network.ip_address}
                    >
                      <IconCopy size={16} className="" />
                    </CopyButton>
                  </div>
                </li>
                <li className="flex justify-between items-center px-4 py-2">
                  <div className="capitalize">Gateway</div>
                  <div className="flex items-center">
                    <p className="text-gray-600 dark:text-white mr-4">
                      {network.gateway}
                    </p>
                    <CopyButton
                      square
                      size="sm"
                      variant="outline"
                      value={network.gateway}
                    >
                      <IconCopy size={16} className="" />
                    </CopyButton>
                  </div>
                </li>
                <li className="flex justify-between items-center px-4 py-2">
                  <div className="capitalize">Netmask</div>
                  <div className="flex items-center">
                    <p className="text-gray-600 dark:text-white mr-4">
                      {network.netmask}
                    </p>
                    <CopyButton
                      square
                      size="sm"
                      variant="outline"
                      value={String(network.netmask)}
                    >
                      <IconCopy size={16} className="" />
                    </CopyButton>
                  </div>
                </li>
              </ul>
            ))}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
