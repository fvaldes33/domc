import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import {
  useGetDropletDetails,
  usePowerCycleDroplet,
  usePowerOnDroplet,
  useRebootDroplet,
  useShutdownDroplet,
} from "@/hooks/useDroplets";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle, IconLoader } from "@tabler/icons-react";
import { UseMutationResult } from "@tanstack/react-query";
import { IAction } from "dots-wrapper/dist/action";
import {
  IPowerCycleDropletApiRequest,
  IPowerOnDropletApiRequest,
  IRebootDropletApiRequest,
  IShutdownDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { useRouter } from "next/router";
import { useState } from "react";

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
    };

export default function DropletPowerPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { query } = useRouter();
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const router = useRouter();
  const rebootDroplet = useRebootDroplet();
  const cycleDroplet = usePowerCycleDroplet();
  const shutdownDroplet = useShutdownDroplet();
  const poweronDroplet = usePowerOnDroplet();

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
                    full
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
                    full
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
                    full
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
                <section className="p-4 border rounded-lg mt-4">
                  <div className="prose dark:prose-invert">
                    <p className="lead">Power On</p>
                    <p className="">Powers on your droplet.</p>
                  </div>
                  <Button
                    className="mt-4"
                    full
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
                action?.action.mutate(
                  {
                    droplet_id: droplet.id,
                  },
                  {
                    onSuccess: () => {
                      router.back();
                    },
                  }
                );
              }
            }}
          >
            Confirm
          </ActionSheet.Button>
          <ActionSheet.Button className="text-red-600" onClick={close}>
            Cancel
          </ActionSheet.Button>
        </ActionSheet>
      </Page.Content>
    </Page>
  );
}
