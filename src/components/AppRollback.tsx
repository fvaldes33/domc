import { useCreateRollback } from "@/hooks/useApps";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "@mantine/hooks";
import { IconLoader } from "@tabler/icons-react";
import { IAppDeployment } from "dots-wrapper/dist/app";
import { Button, Checkbox, List, ListItem } from "konsta/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Footer } from "./Footer";
import { Toolbar } from "./Toolbar";
import toast from "react-hot-toast";

export function AppRollback({
  appId,
  deployment,
}: {
  appId: string;
  deployment: IAppDeployment;
}) {
  const router = useRouter();
  const createRollback = useCreateRollback();
  const [confirm, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [skipPin, setSkipPin] = useState<boolean>(true);

  const startRollback = () => {
    closeConfirm();
    createRollback.mutate(
      {
        app_id: appId,
        deployment_id: deployment.id,
        skip_pin: skipPin,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.back();
          }, 1000);
        },
        onError(error) {
          toast.error(error instanceof Error ? error.message : "Unknown error");
        },
      }
    );
  };

  return (
    <Footer className="bg-ocean-2">
      <Toolbar border position="bottom">
        <button
          onClick={openConfirm}
          className="absolute inset-0 bg-ocean-2 border-0 text-white dark:text-white font-semibold"
        >
          Rollback
        </button>
      </Toolbar>
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
    </Footer>
  );
}
