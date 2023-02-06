import { useCreateDeployment } from "@/hooks/useApps";
import { useDisclosure } from "@mantine/hooks";
import { IconLoader } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { IApp } from "dots-wrapper/dist/app";
import {
  Actions,
  ActionsButton,
  ActionsGroup,
  ActionsLabel,
  Button,
} from "konsta/react";

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
      <Button large tonal className="text-sm px-6" onClick={open}>
        Actions
      </Button>

      <Actions opened={opened} onBackdropClick={close}>
        <ActionsGroup>
          <ActionsLabel>Actions</ActionsLabel>
          <ActionsButton onClick={() => deploy(false)}>Deploy</ActionsButton>
          <ActionsButton onClick={() => deploy(true)}>
            Force Rebuild and Deploy
          </ActionsButton>
          <ActionsButton colors={{ textIos: "text-red-600" }} onClick={close}>
            Cancel
          </ActionsButton>
        </ActionsGroup>
      </Actions>

      {createDeployment.isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <IconLoader size={32} className="animate-spin" />
        </div>
      )}
    </>
  );
}
