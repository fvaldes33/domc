import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { inProgressAtom } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import {
  useDestroyDropletAndAllAssociatedResources,
  useGetDropletDetails,
  usePowerCycleDroplet,
  usePowerOnDroplet,
  useRebootDroplet,
  useShutdownDroplet,
} from "@/hooks/useDroplets";
import { useSetPreference } from "@/hooks/usePreferences";
import { DO_DESTROY_DROPLET } from "@/utils/const";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle, IconLoader } from "@tabler/icons-react";
import { UseMutationResult } from "@tanstack/react-query";
import { IAction } from "dots-wrapper/dist/action";
import {
  IdestroyDropletAndAllAssociatedResourcesApiRequest,
  IPowerCycleDropletApiRequest,
  IPowerOnDropletApiRequest,
  IRebootDropletApiRequest,
  IShutdownDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

type Action =
  | {
      title: string;
      type: "reboot";
      action: UseMutationResult<
        IAction,
        unknown,
        IRebootDropletApiRequest,
        unknown
      >;
    }
  | {
      title: string;
      type: "cycle";
      action: UseMutationResult<
        IAction,
        unknown,
        IPowerCycleDropletApiRequest,
        unknown
      >;
    }
  | {
      title: string;
      type: "poweroff";
      action: UseMutationResult<
        IAction,
        unknown,
        IShutdownDropletApiRequest,
        unknown
      >;
    }
  | {
      title: string;
      type: "poweron";
      action: UseMutationResult<
        IAction,
        unknown,
        IPowerOnDropletApiRequest,
        unknown
      >;
    }
  | {
      title: string;
      type: "destroy";
      action: UseMutationResult<
        void,
        unknown,
        IdestroyDropletAndAllAssociatedResourcesApiRequest,
        unknown
      >;
    };

export default function DropletPowerPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "dropletDetailPower",
  //     nameOverride: "DropletDetailPowerScreen",
  //   });
  // }, []);

  const [opened, { open, close }] = useDisclosure(false);
  const setPreference = useSetPreference<{ droplet_id: number }>();
  const router = useRouter();
  const { query } = router;

  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const setInProgressData = useSetAtom(inProgressAtom);

  const rebootDroplet = useRebootDroplet();
  const cycleDroplet = usePowerCycleDroplet();
  const shutdownDroplet = useShutdownDroplet();
  const poweronDroplet = usePowerOnDroplet();
  const destroyDroplet = useDestroyDropletAndAllAssociatedResources();

  const [action, setAction] = useState<Action>();

  return (
    <Page>
      <MainNavbar title={droplet?.name} />
      <Page.Content className="px-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            {droplet && ["new", "active"].includes(droplet.status) ? (
              <>
                <section className="py-4">
                  <div className="bg-red-400/25 p-4 rounded-md flex items-start mt-4">
                    <IconAlertTriangle className="flex-none" />
                    <p className="ml-2">
                      Warning: You will still be billed for a turned off
                      Droplet. To end billing, destroy the Droplet instead.
                    </p>
                  </div>
                </section>

                <section className="p-4 border rounded-lg mb-4">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Turn off Droplet</p>
                    <p className="">
                      When you turn off a Droplet from the control panel, we
                      first try a graceful shutdown. If that fails, we do a
                      forced shutdown, which may corrupt data. To ensure data
                      integrity, we recommend shutting down from the command
                      line with poweroff.
                    </p>
                    <p>When a Droplet is off:</p>
                    <ul>
                      <li>
                        Its data and IP address are retained and its disk, CPU
                        and RAM are reserved.
                      </li>
                      <li>
                        You continue to accrue its data transfer allowance.
                      </li>
                    </ul>
                  </div>
                  <Button
                    className="mt-4"
                    block
                    onClick={() => {
                      setAction({
                        type: "poweroff",
                        title: "Power Off",
                        action: shutdownDroplet,
                      });
                      open();
                    }}
                  >
                    Turn Off
                  </Button>
                </section>

                <section className="p-4 border rounded-lg mb-4">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Reboot</p>
                    <p className="">
                      Reboots a Droplet. A reboot action is an attempt to reboot
                      the Droplet in a graceful way, similar to using the reboot
                      command from the console.
                    </p>
                  </div>
                  <Button
                    className="mt-4"
                    block
                    onClick={() => {
                      setAction({
                        type: "reboot",
                        title: "Reboot",
                        action: rebootDroplet,
                      });
                      open();
                    }}
                    loading={rebootDroplet.isLoading}
                  >
                    Reboot
                  </Button>
                </section>

                <section className="p-4 border rounded-lg mb-4">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Power Cycle</p>
                    <p className="">
                      A power cycle will immediately hard reset the server. You
                      should only choose this option when you are unable to
                      reboot the Droplet from the command line.
                    </p>
                    <p>Do you wish to proceed?</p>
                  </div>
                  <Button
                    className="mt-4"
                    block
                    onClick={() => {
                      setAction({
                        type: "cycle",
                        title: "Power Cycle",
                        action: cycleDroplet,
                      });
                      open();
                    }}
                  >
                    Power Cycle
                  </Button>
                </section>

                <section className="p-4 border rounded-lg mb-4">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Destroy Droplet</p>
                    <p className="">
                      This is irreversible. We will destroy your Droplet and all
                      associated backups. All Droplet data will be scrubbed and
                      irretrievable.
                    </p>
                    <p>Do you wish to proceed?</p>
                  </div>
                  <Button
                    className="mt-4"
                    block
                    variant="danger"
                    onClick={() => {
                      setAction({
                        type: "destroy",
                        title: "Detroy Droplet",
                        action: destroyDroplet,
                      });
                      open();
                    }}
                  >
                    Destroy
                  </Button>
                </section>
              </>
            ) : (
              <>
                <section className="py-4">
                  <div className="bg-orange-400/25 p-4 rounded-md flex items-start mt-4">
                    <IconAlertTriangle className="flex-none" />
                    <p className="ml-2">
                      Your droplet is currently turned off.
                    </p>
                  </div>
                </section>
                <section className="p-4 border rounded-lg mt-4 mb-4">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Power On</p>
                    <p className="">Powers on your droplet.</p>
                  </div>
                  <Button
                    className="mt-4"
                    block
                    onClick={() => {
                      setAction({
                        type: "poweron",
                        title: "Power On",
                        action: poweronDroplet,
                      });
                      open();
                    }}
                  >
                    Power On
                  </Button>
                </section>
                <section className="p-4 border rounded-lg ">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Destroy Droplet</p>
                    <p className="">
                      This is irreversible. We will destroy your Droplet and all
                      associated backups. All Droplet data will be scrubbed and
                      irretrievable.
                    </p>
                    <p>Do you wish to proceed?</p>
                  </div>
                  <Button
                    className="mt-4"
                    block
                    variant="danger"
                    onClick={() => {
                      setAction({
                        type: "destroy",
                        title: "Detroy Droplet",
                        action: destroyDroplet,
                      });
                      open();
                    }}
                  >
                    Destroy
                  </Button>
                </section>
              </>
            )}
          </>
        )}

        <ActionSheet
          show={opened}
          onClose={() => {
            close();
            setAction(undefined);
          }}
        >
          <ActionSheet.Label>Confirm {action?.title}</ActionSheet.Label>
          <ActionSheet.Button
            onClick={() => {
              if (droplet) {
                close();
                if (action?.type === "destroy") {
                  action.action.mutate(
                    {
                      droplet_id: droplet.id,
                      acknowledge: true,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Destroy droplet scheduled");
                        setPreference.mutate(
                          {
                            key: DO_DESTROY_DROPLET,
                            value: {
                              droplet_id: droplet.id,
                            },
                          },
                          {
                            onSuccess: () => {
                              router.back();
                            },
                          }
                        );
                      },
                    }
                  );
                } else {
                  action?.action.mutate(
                    {
                      droplet_id: droplet.id,
                    },
                    {
                      onSuccess: (data) => {
                        setInProgressData({
                          action: data,
                          droplet: droplet,
                        });
                      },
                    }
                  );
                }
              }
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
      </Page.Content>
    </Page>
  );
}
