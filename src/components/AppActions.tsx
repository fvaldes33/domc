import { useDisclosure } from "@mantine/hooks";
import { IconLoader } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { AppDeploymentLogType, IApp } from "dots-wrapper/dist/app";

import { useCreateDeployment, useGetAppDeploymentLogs } from "@/hooks/useApps";
import { ActionSheet } from "./ActionSheet";
import toast from "react-hot-toast";
import { useState } from "react";
import { LogModal, LogModalProps } from "./LogModal";

interface AppActionsProps {
  app: IApp;
}

export function AppActions({ app }: AppActionsProps) {
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
      }
    );
  };

  const getLogsForComponent = () => {
    close();
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
            window.screen.orientation.unlock();
            setLogModalProps({
              show: true,
              url,
              type: "RUN",
            });
          } else if (data.live_url) {
            window.screen.orientation.unlock();
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
      <button
        className="text-sm px-6 bg-ocean-2 text-white rounded-md h-11 flex items-center justify-center font-semibold transform transition-transform duration-75 active:scale-95"
        onClick={open}
      >
        Actions
      </button>

      <ActionSheet show={opened} onClose={close}>
        {/* <ActionSheet.Label>Actions</ActionSheet.Label> */}
        <ActionSheet.Button onClick={() => deploy(false)}>
          Deploy
        </ActionSheet.Button>
        <ActionSheet.Button onClick={() => deploy(true)}>
          Force Rebuild and Deploy
        </ActionSheet.Button>
        <ActionSheet.Button onClick={() => getLogsForComponent()}>
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
          window.screen.orientation.lock("portrait");
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
