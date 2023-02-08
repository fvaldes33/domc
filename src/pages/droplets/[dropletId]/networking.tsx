import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import {
  useEnableDropletIpv6,
  useGetDropletDetails,
} from "@/hooks/useDroplets";
import { IconCopy, IconLoader, IconNetwork } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function DropletNetworkingPage() {
  const { query } = useRouter();
  const queryClient = useQueryClient();

  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const enableDropletIpv6 = useEnableDropletIpv6();
  const triggerEnable = () => {
    enableDropletIpv6.mutate(
      {
        droplet_id: droplet!.id,
      },
      {
        onSuccess: async () => {
          toast.success("IPv6 Enabled");
          void (await queryClient.invalidateQueries(["droplets", droplet!.id]));
        },
      }
    );
  };

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
            <section className="mt-4">
              <div className="">
                <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                  <IconNetwork className="" size={20} strokeWidth={1.5} />
                  <span className="ml-2 uppercase">Networking</span>
                </p>
                <ul className="mb-2">
                  {droplet?.networks.v4.map((network) => {
                    return (
                      <li key={network.ip_address} className="">
                        <div className="flex justify-between items-center px-4 py-2">
                          <div className="capitalize">
                            {network.type === "public"
                              ? `${network.type} IPv4`
                              : `${network.type} Network`}
                          </div>
                        </div>
                        <ul className="mb-2 pb-2 pl-4 border-b">
                          <li className="flex justify-between items-center px-4 py-2">
                            <div className="capitalize text-sm">IP Address</div>
                            <div className="flex items-center">
                              <p className="text-gray-600 dark:text-white mr-4 text-sm">
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
                            <div className="capitalize text-sm">Gateway</div>
                            <div className="flex items-center">
                              <p className="text-gray-600 dark:text-white mr-4 text-sm">
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
                            <div className="capitalize text-sm">Netmask</div>
                            <div className="flex items-center">
                              <p className="text-gray-600 dark:text-white mr-4 text-sm">
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
                      </li>
                    );
                  })}
                </ul>

                {droplet?.networks.v6 && droplet.networks.v6.length > 0 ? (
                  <ul className="mb-2">
                    {droplet?.networks.v6.map((network) => {
                      return (
                        <li key={network.ip_address} className="">
                          <div className="flex justify-between items-center px-4 py-2">
                            <div className="capitalize">
                              {network.type === "public"
                                ? `${network.type} IPv4`
                                : `${network.type} Network`}
                            </div>
                          </div>
                          <ul className="mb-2 pb-2 pl-4 border-b">
                            <li className="flex justify-between items-center px-4 py-2">
                              <div className="capitalize text-sm">
                                IP Address
                              </div>
                              <div className="flex items-center">
                                <p className="text-gray-600 dark:text-white mr-4 text-sm">
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
                              <div className="capitalize text-sm">Gateway</div>
                              <div className="flex items-center">
                                <p className="text-gray-600 dark:text-white mr-4 text-sm">
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
                              <div className="capitalize text-sm">Netmask</div>
                              <div className="flex items-center">
                                <p className="text-gray-600 dark:text-white mr-4 text-sm">
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
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <>
                    <div className="flex justify-between items-center px-4 py-2">
                      <div className="capitalize">IPv6</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={triggerEnable}
                        loading={enableDropletIpv6.isLoading}
                      >
                        Enable
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </Page.Content>
    </Page>
  );
}
