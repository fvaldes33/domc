import {
  latestActionAtom,
  usePowerOffDroplet,
  usePowerOnDroplet,
  useSnapshotDroplet,
  useWaitForAction,
} from "@/hooks/useDroplets";
import { timeAgo } from "@/utils/timeAgo";
import { IconLoader } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { IAction } from "dots-wrapper/dist/action";
import { IDroplet } from "dots-wrapper/dist/droplet";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  inProgressAtom,
  postShutdownActionAtom,
} from "./MissionControlProvider";

export function DropletActionWatcher({
  droplet,
  action,
}: {
  droplet: IDroplet;
  action: IAction;
}) {
  const setInProgressData = useSetAtom(inProgressAtom);
  const [postShutdownAction, setPostShutdownAction] = useAtom(
    postShutdownActionAtom
  );
  const queryClient = useQueryClient();
  const forcePowerOff = usePowerOffDroplet();
  const powerOn = usePowerOnDroplet();

  const [msg, setMsg] = useState<string>(
    () => `${action.type.replace("_", " ")} in progress`
  );
  const snapshotDroplet = useSnapshotDroplet();

  useEffect(() => {
    setMsg(`${action.type.replace("_", " ")} in progress`);
  }, [action]);

  useWaitForAction(
    {
      droplet_id: droplet.id,
      action_id: action.id,
    },
    {
      onSuccess: async (data) => {
        if (data.status === "completed") {
          setMsg("Updating Droplet Information");
          setTimeout(async () => {
            await queryClient.invalidateQueries(["droplets", droplet.id]);

            if (postShutdownAction) {
              if (data.type === "shutdown" || data.type === "power_off") {
                //
                snapshotDroplet.mutate(postShutdownAction, {
                  onSuccess: (data) => {
                    setInProgressData({
                      droplet,
                      action: data,
                    });
                  },
                });
              } else if (data.type === "snapshot") {
                await queryClient.invalidateQueries([
                  "droplet-snapshots",
                  droplet.id,
                ]);
                powerOn.mutate(
                  {
                    droplet_id: droplet.id,
                  },
                  {
                    onSuccess: (data) => {
                      setPostShutdownAction(undefined);
                      setInProgressData({
                        droplet,
                        action: data,
                      });
                    },
                  }
                );
              }
            } else {
              if (data.type === "snapshot") {
                await queryClient.invalidateQueries([
                  "droplet-snapshots",
                  droplet.id,
                ]);
              }
              setInProgressData(undefined);
            }
          }, 5000);
        } else if (data.status === "errored" && data.type === "shutdown") {
          forcePowerOff.mutate(
            {
              droplet_id: droplet.id,
            },
            {
              onSuccess: (data) => {
                setInProgressData({
                  droplet,
                  action: data,
                });
              },
            }
          );
        }
      },
    }
  );

  return (
    <div className="pt-safe pb-safe fixed z-[101] bottom-4 inset-x-0 flex items-end justify-center px-4">
      <section className="p-4 flex items-center bg-ocean text-white rounded-lg w-full max-w-xs">
        <div className="flex-none">
          <IconLoader className="animate-spin" />
        </div>
        <div className="pl-4">
          <p className="text-sm font-semibold capitalize">{msg}</p>
          <p className="text-xs">{timeAgo(action.started_at)}</p>
        </div>
      </section>
    </div>
  );
}
