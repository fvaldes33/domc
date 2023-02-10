import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { inProgressAtom } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import {
  useDisableDropletBackups,
  useEnableDropletBackups,
  useGetDropletDetails,
  useListDropletBackups,
} from "@/hooks/useDroplets";
import { BACKUP_COST } from "@/utils/const";
import { formatCurrency } from "@/utils/formatCurrency";
import { truncate } from "@/utils/truncate";
import { useDisclosure } from "@mantine/hooks";
import { IconBackpack, IconLoader } from "@tabler/icons-react";
import { UseMutationResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import { IAction } from "dots-wrapper/dist/action";
import {
  IDisableDropletBackupsApiRequest,
  IEnableDropletBackupsApiRequest,
} from "dots-wrapper/dist/droplet";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

type Action =
  | {
      title: string;
      type: "enable";
      action: UseMutationResult<
        IAction,
        unknown,
        IEnableDropletBackupsApiRequest,
        unknown
      >;
    }
  | {
      title: string;
      type: "disable";
      action: UseMutationResult<
        IAction,
        unknown,
        IDisableDropletBackupsApiRequest,
        unknown
      >;
    };

export default function DropletBackupsPage() {
  const { query } = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [action, setAction] = useState<Action>();
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });
  const { data: backups } = useListDropletBackups({
    droplet_id: Number(query.dropletId),
  });
  const setInProgressData = useSetAtom(inProgressAtom);
  const enableBackups = useEnableDropletBackups();
  const disableBackups = useDisableDropletBackups();

  const backupsAreEnabled = useMemo(() => {
    if (droplet) {
      if (droplet.backup_ids.length > 0) {
        return true;
      }
      if (droplet.next_backup_window !== null) {
        return true;
      }
    }

    return false;
  }, [droplet]);

  const price = droplet?.size?.price_monthly
    ? formatCurrency(droplet.size.price_monthly * BACKUP_COST * 4)
    : false;
  return (
    <Page>
      <MainNavbar title={droplet?.name} />
      <Page.Content>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="px-4 mt-4">
            {backupsAreEnabled ? (
              <section className="p-4 border rounded-lg mb-4">
                <div className="prose dark:prose-invert">
                  <p className="lead">Backups</p>
                  <p className="">
                    Backups are currently enabled. They are retained for 4 weeks
                    and can be converted into snapshots for further use.
                  </p>
                  {price && (
                    <p>* Backups for this Droplet cost {price} per month.</p>
                  )}
                  <p className="text-xs">
                    Backup Calculation:
                    <br />
                    5% Droplet cost per backup (4 backups per month)
                  </p>
                  <p>
                    Next Backup:{" "}
                    {dayjs((droplet?.next_backup_window as any).start).format(
                      "MM/DD/YYYY"
                    )}
                  </p>
                </div>
                <Button
                  className="mt-4"
                  full
                  variant="danger"
                  onClick={() => {
                    setAction({
                      type: "disable",
                      title: "Disable Backups",
                      action: disableBackups,
                    });
                    open();
                  }}
                >
                  Disable Backups
                </Button>
              </section>
            ) : (
              <section className="p-4 border rounded-lg mb-4">
                <div className="prose dark:prose-invert">
                  <p className="lead">Start backing up your Droplet</p>
                  <p className="">
                    Backups automatically create weekly copies of your Droplet.
                    They can be used for restoring lost or corrupt data and
                    creating new Droplets. To keep a backup indefinitely, you
                    can convert it to a snapshot.
                  </p>
                  {price && (
                    <p>* Backups for this Droplet cost {price} per month.</p>
                  )}
                  <p className="text-xs">
                    Backup Calculation:
                    <br />
                    5% Droplet cost per backup (4 backups per month)
                  </p>
                </div>
                <Button
                  className="mt-4"
                  full
                  onClick={() => {
                    setAction({
                      type: "enable",
                      title: "Enable Backups",
                      action: enableBackups,
                    });
                    open();
                  }}
                >
                  Enable Backups
                </Button>
              </section>
            )}
          </div>
        )}

        {backups && backups.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-800 flex items-center px-4">
              <IconBackpack className="" size={20} strokeWidth={1.5} />
              <span className="ml-2 uppercase">Backups</span>
            </p>
            <ul className="px-4">
              {backups?.map((backup) => (
                <li
                  key={backup.id}
                  className="py-2 flex items-start justify-between"
                >
                  <div>
                    <p>{truncate(backup.name, 25)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      {backup.size_gigabytes}GB /{" "}
                      <span className="uppercase">
                        {backup.regions.join("*")}
                      </span>
                    </p>
                  </div>
                  <span className="text-sm mt-1">
                    {dayjs(backup.created_at).format("MM/DD/YYYY")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
                    onSuccess: (data) => {
                      setInProgressData({
                        action: data,
                        droplet: droplet,
                      });
                    },
                  }
                );
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
