import { Button } from "@/components/Button";
import { ClusterHero } from "@/components/ClusterHero";
import { FavoriteButton } from "@/components/FavoriteButton";
import HapticLink from "@/components/HapticLink";
import { MainNavbar } from "@/components/MainNavbar";
import { useMissionControl } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { useDatabaseCluster } from "@/hooks/useDatabases";
import canAccess from "@/utils/permissions";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBomb,
  IconChevronRight,
  IconFileDatabase,
  IconLoader,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function DatabaseDetailPage() {
  const { isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("database", ["update"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);

  const { query } = useRouter();
  const {
    data: cluster,
    isLoading,
    refetch,
  } = useDatabaseCluster({
    database_cluster_id: query.databaseId as string,
  });

  const [show, { toggle }] = useDisclosure(false);
  const [network, setNetwork] = useState<"public" | "private">("public");

  const connectionSettings = useMemo(() => {
    if (!cluster) return null;
    return network === "public"
      ? cluster.connection
      : cluster.private_connection;
  }, [cluster, network]);

  return (
    <Page>
      <MainNavbar
        right={
          <FavoriteButton
            resource={{
              id: query.databaseId as string,
              type: "databases",
              title: cluster?.name,
            }}
          />
        }
      />
      <Page.Content
        onRefresh={async (complete) => {
          await Promise.all([refetch]);
          complete();
        }}
      >
        {isLoading ? (
          <>
            <ClusterHero />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconLoader size={24} className="animate-spin" />
            </div>
          </>
        ) : (
          <>
            {cluster && (
              <>
                <ClusterHero cluster={cluster} />
                <section className="px-4 mt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Button
                      size="sm"
                      variant={network === "public" ? "primary" : "outline"}
                      onClick={() => setNetwork("public")}
                    >
                      Public
                    </Button>
                    <Button
                      size="sm"
                      variant={network === "private" ? "primary" : "outline"}
                      onClick={() => setNetwork("private")}
                    >
                      Private (vpc)
                    </Button>
                  </div>
                  <div className="border border-ocean-2 bg-ocean-2/10 rounded-md p-4 font-mono text-xs space-y-2">
                    <div className="space-y-1">
                      <div className="w-1/4 flex-none font-bold">username</div>
                      <div className="">{connectionSettings?.user}</div>
                    </div>
                    <div className="space-y-1 flex items-center">
                      <div>
                        <div className="w-1/4 flex-none font-bold">
                          password
                        </div>
                        <div className="">
                          {show ? connectionSettings?.password : "************"}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Button size="sm" variant="light" onClick={toggle}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-1/4 flex-none font-bold">host</div>
                      <div className="">{connectionSettings?.host}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-1/4 flex-none font-bold">port</div>
                      <div className="">{connectionSettings?.port}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-1/4 flex-none font-bold">database</div>
                      <div className="">{connectionSettings?.database}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-1/4 flex-none font-bold">sslmode</div>
                      <div className="">
                        {connectionSettings?.ssl ? "true" : "false"}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-4 space-y-4">
                  <HapticLink
                    href={`/databases/${query.databaseId}/users-dbs`}
                    className="flex items-center justify-between px-4 py-2"
                    onClick={(e) => {
                      if (!can) {
                        e.preventDefault();
                        toggleIap();
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <IconUser size={16} />
                      <p className="ml-2">Manage Users</p>
                    </div>
                    <div className="ml-auto">
                      <IconChevronRight size={16} />
                    </div>
                  </HapticLink>
                  <HapticLink
                    href={`/databases/${query.databaseId}/users-dbs`}
                    className="flex items-center justify-between px-4 py-2"
                    onClick={(e) => {
                      if (!can) {
                        e.preventDefault();
                        toggleIap();
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <IconFileDatabase size={16} />
                      <p className="ml-2">Manage Databases</p>
                    </div>
                    <div className="ml-auto">
                      <IconChevronRight size={16} />
                    </div>
                  </HapticLink>
                  <HapticLink
                    href={`/databases/${query.databaseId}/destroy`}
                    className="flex items-center justify-between px-4 py-2"
                    onClick={(e) => {
                      if (!can) {
                        e.preventDefault();
                        toggleIap();
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <IconBomb size={16} />
                      <p className="ml-2">Destroy Databases</p>
                    </div>
                    <div className="ml-auto">
                      <IconChevronRight size={16} />
                    </div>
                  </HapticLink>
                </section>
              </>
            )}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
