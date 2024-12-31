import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconLoader, IconScript } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { IApp } from "dots-wrapper/dist/app";

import { useCreateDeployment, useGetAppDeploymentLogs } from "@/hooks/useApps";
import { ActionSheet } from "./ActionSheet";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { LogModal, LogModalProps } from "./LogModal";
import canAccess from "@/utils/permissions";
import { useMissionControl } from "./MissionControlProvider";
import { Button } from "./Button";

interface AppActionsProps {
  app: IApp;
}

export function AppLogAction({ app }: AppActionsProps) {
  const { isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("app", ["update"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);
  const getAppDeploymentLogs = useGetAppDeploymentLogs();
  const queryClient = useQueryClient();

  const [logModalProps, setLogModalProps] = useState<
    Omit<LogModalProps, "onClose">
  >({
    show: false,
  });

  const getLogsForComponent = () => {
    close();
    if (!app.active_deployment.services?.length) {
      toast.error("No logs available for app");
      return;
    }
    getAppDeploymentLogs.mutate(
      {
        app_id: app?.id,
        deployment_id: app.active_deployment.id,
        component_name: app.active_deployment.services[0].name,
        type: "RUN",
      },
      {
        onSuccess: (data) => {
          if (data.historic_urls?.length) {
            const [url] = data.historic_urls;
            setLogModalProps({
              show: true,
              url,
              type: "RUN",
            });
          } else if (data.live_url) {
            setLogModalProps({
              show: true,
              url: data.live_url,
              type: "RUN",
            });
          }
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (!can) {
            toggleIap();
          } else {
            getLogsForComponent();
          }
        }}
      >
        Logs
      </Button>
      <LogModal
        {...logModalProps}
        onClose={() => {
          setLogModalProps({
            show: false,
            url: undefined,
            type: undefined,
          });
        }}
      />
    </>
  );
}

export function AppActions({ app }: AppActionsProps) {
  const { isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("app", ["update"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);

  const [opened, { open, close }] = useDisclosure(false);

  const createDeployment = useCreateDeployment();
  const getAppDeploymentLogs = useGetAppDeploymentLogs();
  const queryClient = useQueryClient();

  const [logModalProps, setLogModalProps] = useState<
    Omit<LogModalProps, "onClose">
  >({
    show: false,
  });

  const deploy = (force_build: boolean) => {
    close();
    createDeployment.mutate(
      {
        app_id: app.id as string,
        force_build,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            queryClient.invalidateQueries(["apps", app.id]);
          }, 2500);
        },
        onError(error) {
          toast.error(error instanceof Error ? error.message : "Unknown error");
        },
      }
    );
  };

  const getLogsForComponent = () => {
    close();
    if (!app.active_deployment.services?.length) {
      toast.error("No logs available for app");
      return;
    }
    getAppDeploymentLogs.mutate(
      {
        app_id: app?.id,
        deployment_id: app.active_deployment.id,
        component_name: app.active_deployment.services[0].name,
        type: "RUN",
        follow: true,
      },
      {
        onSuccess: (data) => {
          if (data.live_url) {
            setLogModalProps({
              show: true,
              url: data.live_url,
              type: "RUN",
            });
          } else if (data.historic_urls?.length) {
            const [url] = data.historic_urls;
            setLogModalProps({
              show: true,
              url,
              type: "RUN",
            });
          }
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          open();
        }}
      >
        Actions
      </Button>

      <ActionSheet show={opened} onClose={close}>
        {/* <ActionSheet.Label>Actions</ActionSheet.Label> */}
        <ActionSheet.Button
          onClick={() => {
            if (can) {
              deploy(false);
            } else {
              toggleIap();
            }
          }}
        >
          Deploy
        </ActionSheet.Button>
        <ActionSheet.Button
          onClick={() => {
            if (can) {
              deploy(true);
            } else {
              toggleIap();
            }
          }}
        >
          Force Rebuild and Deploy
        </ActionSheet.Button>
        <ActionSheet.Button
          onClick={() => {
            if (can) {
              getLogsForComponent();
            } else {
              toggleIap();
            }
          }}
        >
          View Runtime Logs
        </ActionSheet.Button>
        <ActionSheet.Button
          className="text-red-600 dark:text-red-600"
          border={false}
          onClick={close}
        >
          Cancel
        </ActionSheet.Button>
      </ActionSheet>

      {createDeployment.isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <IconLoader size={32} className="animate-spin" />
        </div>
      )}

      <LogModal
        {...logModalProps}
        onClose={() => {
          setLogModalProps({
            show: false,
            url: undefined,
            type: undefined,
          });
        }}
      />
    </>
  );
}
