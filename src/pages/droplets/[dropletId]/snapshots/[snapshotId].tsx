import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { useDestroySnapshot, useGetSnapshot } from "@/hooks/useSnapshot";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function SnapshotDetail() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "dropletDetailSnapshotDetail",
  //     nameOverride: "DropletDetailSnapshotDetailScreen",
  //   });
  // }, []);

  const router = useRouter();
  const { snapshotId } = router.query as { snapshotId: string };
  const [opened, { close, open }] = useDisclosure(false);

  const {
    data: snapshot,
    isLoading,
    refetch,
  } = useGetSnapshot({
    snapshot_id: Number(snapshotId),
  });
  const destorySnapshot = useDestroySnapshot();

  return (
    <Page>
      <MainNavbar title={snapshot?.name} />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          complete();
        }}
      >
        {isLoading ? (
          <></>
        ) : (
          <>
            {snapshot && (
              <>
                <div className="px-4 flex border-b py-3">
                  <div className="w-1/3 flex-none">Name</div>
                  <div className="flex-1">{snapshot.name}</div>
                </div>
                <div className="px-4 flex border-b py-3">
                  <div className="w-1/3 flex-none">Region</div>
                  <div className="flex-1 uppercase">
                    {snapshot.regions.join(", ")}
                  </div>
                </div>
                <div className="px-4 flex border-b py-3">
                  <div className="w-1/3 flex-none">Size (GB)</div>
                  <div className="flex-1">{snapshot.size_gigabytes} GB</div>
                </div>
                <div className="px-4 flex border-b py-3">
                  <div className="w-1/3 flex-none">Created</div>
                  <div className="flex-1">
                    {dayjs(snapshot.created_at).format("MM/DD/YYYY")}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </Page.Content>
      <Footer className="bg-red-600">
        <Toolbar position="bottom">
          <Button
            full
            form="settings"
            className="absolute inset-0"
            variant="danger"
            loading={destorySnapshot.isLoading}
            onClick={open}
          >
            Destroy Snapshot
          </Button>
        </Toolbar>
      </Footer>

      {snapshot && (
        <ActionSheet
          show={opened}
          onClose={() => {
            close();
          }}
        >
          <ActionSheet.Label>
            Are you sure you want to delete this snapshot? This action cannot be
            undone.
          </ActionSheet.Label>
          <ActionSheet.Button
            onClick={() => {
              close();
              destorySnapshot.mutate(
                {
                  snapshot_id: snapshot.id,
                },
                {
                  onSuccess: () => {
                    toast.success("Snapshot deleted");
                    router.back();
                  },
                }
              );
            }}
          >
            Confirm
          </ActionSheet.Button>
          <ActionSheet.Button
            className="text-red-600"
            onClick={close}
            border={false}
          >
            Cancel
          </ActionSheet.Button>
        </ActionSheet>
      )}
    </Page>
  );
}
