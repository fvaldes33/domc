import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useDestroyDatabaseCluster } from "@/hooks/useDatabases";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";

export default function DatabaseClusterDestroy() {
  const { query, ...router } = useRouter();
  const destroyDb = useDestroyDatabaseCluster();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Page>
      <MainNavbar />
      <Page.Content className="px-4">
        <section className="mt-4 p-4 border rounded-lg mb-4">
          <div className="prose dark:prose-invert">
            <p className="lead">Destroy Database Cluster</p>
            <p className="">
              Destroying a database cluster is permanent. This will destroy the
              cluster, standby nodes, read-only nodes, data, and backups
              associated to it.
            </p>
            <p>Do you wish to proceed?</p>
          </div>
          <Button
            className="mt-4"
            block
            variant="danger"
            onClick={open}
            loading={destroyDb.isLoading}
          >
            Destroy
          </Button>
        </section>
      </Page.Content>

      <ActionSheet show={opened} onClose={close}>
        <ActionSheet.Label>Confirm Destroy Database</ActionSheet.Label>
        <ActionSheet.Button
          onClick={() => {
            close();
            destroyDb.mutate(
              {
                database_cluster_id: query.databaseId as string,
              },
              {
                onSuccess: () => {
                  router.replace(`/databases`, undefined, { shallow: false });
                },
              }
            );
          }}
        >
          Confirm
        </ActionSheet.Button>
        <ActionSheet.Button border={false} className="text-red-600">
          Cancel
        </ActionSheet.Button>
      </ActionSheet>
    </Page>
  );
}
