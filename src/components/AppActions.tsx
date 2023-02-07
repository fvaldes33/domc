import { useDisclosure } from "@mantine/hooks";
import { IconLoader } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { IApp } from "dots-wrapper/dist/app";

import { useCreateDeployment } from "@/hooks/useApps";
import { ActionSheet } from "./ActionSheet";

interface AppActionsProps {
  app: IApp;
}

export function AppActions({ app }: AppActionsProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const createDeployment = useCreateDeployment();
  const queryClient = useQueryClient();

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

  return (
    <>
      <button
        className="text-sm px-6 bg-ocean-2 text-white rounded-md h-11 flex items-center justify-center font-semibold transform transition-transform duration-75 active:scale-95"
        onClick={open}
      >
        Actions
      </button>

      <ActionSheet show={opened} onClose={close}>
        <ActionSheet.Label>Actions</ActionSheet.Label>
        <ActionSheet.Button onClick={() => deploy(false)}>
          Deploy
        </ActionSheet.Button>
        <ActionSheet.Button onClick={() => deploy(true)}>
          Force Rebuild and Deploy
        </ActionSheet.Button>
        <ActionSheet.Button className="text-red-600" onClick={close}>
          Cancel
        </ActionSheet.Button>
      </ActionSheet>

      {createDeployment.isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <IconLoader size={32} className="animate-spin" />
        </div>
      )}
    </>
  );
}
