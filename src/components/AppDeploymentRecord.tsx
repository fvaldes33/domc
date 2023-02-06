import { useCreateRollback } from "@/hooks/useApps";
import { DeploymentPhaseMap } from "@/utils/deployment-phases";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "@mantine/hooks";
import { IconFileUnknown, IconLoader } from "@tabler/icons-react";
import dayjs from "dayjs";
import { IAppDeployment } from "dots-wrapper/dist/app";
import { Button, Checkbox, List, ListItem } from "konsta/react";
import Link from "next/link";
import { Fragment, useState } from "react";

export function AppDeploymentRecord({
  appId,
  deployment,
}: {
  appId: string;
  deployment: IAppDeployment;
}) {
  const createRollback = useCreateRollback();
  const [confirm, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [skipPin, setSkipPin] = useState<boolean>(true);

  const Phase =
    DeploymentPhaseMap.get(deployment.phase) ?? (() => <IconFileUnknown />);

  const startRollback = () => {
    closeConfirm();
    createRollback.mutate({
      app_id: appId,
      deployment_id: deployment.id,
      skip_pin: skipPin,
    });
  };

  return (
    <>
      <div className="py-2 flex items-start">
        <div className="bg-white dark:bg-ios-dark-surface w-full max-w-[50px] flex justify-center items-start relative z-10">
          <Phase />
        </div>
        <div className="ml-2 text-sm">
          <Link
            className="mb-2"
            href={`/apps/${appId}/deployments/${deployment.id}`}
          >
            {deployment.cause === "manual"
              ? "forced a rebuild and deployment"
              : deployment.cause}
          </Link>
          <div className="flex">
            <p>{dayjs(deployment.created_at).format("hh:mm:ss A")}</p>
            <p className="mx-1">&bull;</p>
            {deployment.phase === "SUPERSEDED" ? (
              <button
                onClick={openConfirm}
                className="text-ocean dark:text-blue-400 underline font-medium"
              >
                Rollback
              </button>
            ) : (
              <p>Rollback Unavailable</p>
            )}
          </div>
        </div>
      </div>
      <Transition show={confirm} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={closeConfirm}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed bottom-0 inset-x-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="w-full pt-4 px-4 pb-safe max-w-md transform overflow-hidden border dark:border-gray-800 rounded-t-2xl bg-white dark:bg-gray-900 text-left transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirm Your Rollback
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    A new deployment will be created to perform the rollback.
                  </p>

                  <List margin="my-4">
                    <ListItem
                      label
                      title="Skip Pin"
                      text={
                        <p className="line-clamp-6">
                          If not checked, the rollback deployment will be pinned
                          and any new deployments will be disabled. If checked,
                          the rollback will be immediately committed and the app
                          will remain unpinned.
                        </p>
                      }
                      media={
                        <>
                          <Checkbox
                            component="div"
                            checked={skipPin}
                            onChange={(e) => {
                              // @ts-ignore
                              setSkipPin(e.target.checked);
                            }}
                          />
                        </>
                      }
                    />
                  </List>
                </div>

                <div className="flex items-center space-x-4 my-4">
                  <Button
                    large
                    tonal
                    onClick={closeConfirm}
                    colors={{
                      tonalBgIos: "bg-red-600",
                      tonalTextIos: "bg-red-600",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button large tonal onClick={startRollback}>
                    Continue
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {createRollback.isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <IconLoader size={32} className="animate-spin" />
        </div>
      )}
    </>
  );
}
