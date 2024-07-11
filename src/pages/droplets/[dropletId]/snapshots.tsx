import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { MainNavbar } from "@/components/MainNavbar";
import {
  inProgressAtom,
  postShutdownActionAtom,
} from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import {
  useGetDropletDetails,
  useListDropletSnapshots,
  useShutdownDroplet,
  useSnapshotDroplet,
} from "@/hooks/useDroplets";
import { truncate } from "@/utils/truncate";
import { useDisclosure } from "@mantine/hooks";
import { IconCamera, IconLoader } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import Link from "@/components/HapticLink";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function DropletSnapshotsPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "dropletDetailSnapshots",
  //     nameOverride: "DropletDetailSnapshotsScreen",
  //   });
  // }, []);

  const { query } = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const { data: snapshots, refetch } = useListDropletSnapshots({
    droplet_id: Number(query.dropletId),
  });

  const setInProgressData = useSetAtom(inProgressAtom);
  const shutdownDroplet = useShutdownDroplet();
  const snapshotDroplet = useSnapshotDroplet();
  const setPostShutdownAction = useSetAtom(postShutdownActionAtom);

  const snapshotWithShutdown = () => {
    shutdownDroplet.mutate(
      {
        droplet_id: droplet!.id,
      },
      {
        onError: (error: any) => {
          toast.error(error.message);
        },
        onSuccess: (data) => {
          close();
          setInProgressData({
            action: data,
            droplet: droplet!,
          });
          setPostShutdownAction({
            droplet_id: droplet!.id,
            name: `${droplet!.name}-${dayjs().format("c")}`,
          });
        },
      }
    );
  };

  const snapshotLive = () => {
    snapshotDroplet.mutate(
      {
        droplet_id: droplet!.id,
        name: `${droplet!.name}-${dayjs().format("c")}`,
      },
      {
        onError: (error: any) => {
          toast.error(error.message);
        },
        onSuccess: (data) => {
          close();
          setInProgressData({
            action: data,
            droplet: droplet!,
          });
          toast.success("Your snapshot has started");
        },
      }
    );
  };

  return (
    <Page>
      <MainNavbar title={droplet?.name} />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          complete();
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            {snapshots && snapshots.length > 0 ? (
              <div className="mb-6">
                <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
                  <IconCamera className="" size={20} strokeWidth={1.5} />
                  <span className="ml-2 uppercase">Snapshots</span>
                </p>
                <ul className="px-4">
                  {snapshots?.map((snapshot) => (
                    <li key={snapshot.id}>
                      <Link
                        href={`/droplets/${droplet?.id}/snapshots/${snapshot.id}`}
                        className="py-2 flex items-start justify-between"
                      >
                        <div>
                          <p>{truncate(snapshot.name, 25)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            {snapshot.size_gigabytes}GB /{" "}
                            <span className="uppercase">
                              {snapshot.regions.join("*")}
                            </span>
                          </p>
                        </div>
                        <span className="text-sm mt-1">
                          {dayjs(snapshot.created_at).format("MM/DD/YYYY")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <section className="p-4 border rounded-lg mx-4 mb-4">
                <div className="prose dark:prose-invert">
                  <p className="lead">Take snapshot</p>
                  <p>
                    {`Power down your Droplet before taking a snapshot to ensure
                    data consistency. Snapshot's cost is based on space used and
                    charged at a rate of $0.06/GiB/mo.`}
                  </p>
                  <p>
                    Snapshots can take up to 1 minute per GB of data used by
                    your Droplet. Snapshots cost $0.06/GiB/mo based on the size
                    of the snapshot (not the size of the filesystem).
                  </p>
                  <p>
                    We recommend turning off your Droplet before taking a
                    snapshot to ensure data consistency.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </Page.Content>
      <Footer className="bg-ocean-2">
        <Toolbar position="bottom">
          <Button
            full
            className="absolute inset-0"
            onClick={() => {
              open();
            }}
          >
            Take Snapshot
          </Button>
        </Toolbar>
      </Footer>
      {droplet && (
        <ActionSheet
          show={opened}
          onClose={() => {
            close();
          }}
        >
          <ActionSheet.Label>Take Snapshot</ActionSheet.Label>
          {["active", "new"].includes(droplet.status) ? (
            <>
              <ActionSheet.Button onClick={snapshotWithShutdown}>
                With Shutdown
              </ActionSheet.Button>
              <ActionSheet.Button onClick={snapshotLive}>
                Take Live Snapshot
              </ActionSheet.Button>
            </>
          ) : (
            <ActionSheet.Button onClick={snapshotLive}>
              Take Snapshot
            </ActionSheet.Button>
          )}

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
