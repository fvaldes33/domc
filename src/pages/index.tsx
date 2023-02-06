import Head from "next/head";
import { Page } from "konsta/react";
import { IconSwitch2 } from "@tabler/icons-react";
import { MainNavbar } from "@/components/MainNavbar";
import { useGetProjects } from "@/hooks/useProjects";
import { useDisclosure } from "@mantine/hooks";
import { useGetPreference, useSetPreference } from "@/hooks/usePreferences";
import { DO_ACTIVE_PROJECT } from "@/utils/const";
import { Fragment, useMemo } from "react";
import { timeAgo } from "@/utils/timeAgo";
import { Dialog, Transition } from "@headlessui/react";
import { Balance } from "@/components/Balance";
import { AppListing } from "@/components/AppListing";
import { DropletListing } from "@/components/DropletListing";
import { DomainListing } from "@/components/DomainListing";

export default function Home() {
  const { data: projects } = useGetProjects({
    page: 1,
    per_page: 10,
  });

  const [opened, { close, open }] = useDisclosure(false);

  const { data: activeProjectId } = useGetPreference({
    key: DO_ACTIVE_PROJECT,
    defaultValue: projects?.find((p) => p.is_default)?.id,
    enabled: Boolean(projects),
  });

  const setActiveProject = useSetPreference();

  const project = useMemo(() => {
    return projects?.find((p) => p.id === activeProjectId);
  }, [projects, activeProjectId]);

  return (
    <>
      <Head>
        <title>Digital Ocean Mission Control</title>
      </Head>
      <Page>
        <MainNavbar />
        <div className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              {project ? (
                <h1 className="text-2xl font-bold">{project.name}</h1>
              ) : (
                <h1 className="bg-gray-200 animate-pulse h-7 w-2/3 mb-2 rounded-md"></h1>
              )}
              {project?.is_default && (
                <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-600 uppercase text-xs rounded-md">
                  Default
                </span>
              )}
            </div>

            {project ? (
              <p className="text-base text-gray-600">
                {timeAgo(project.created_at)}
              </p>
            ) : (
              <p className="text-base text-gray-600 h-6 animate-pulse rounded-md bg-gray-200 w-16"></p>
            )}
          </div>
          {projects && projects.length > 1 && (
            <button
              onClick={open}
              className="flex-none h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 transform transition-transform duration-75 active:scale-95"
            >
              <IconSwitch2 size={20} />
            </button>
          )}
        </div>

        <Balance />

        {project && <AppListing project={project} />}

        {project && <DropletListing project={project} />}

        {project && <DomainListing project={project} />}
      </Page>

      <Transition show={opened} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={close}>
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
              <Dialog.Panel className="w-full pt-4 pb-safe max-w-md transform overflow-hidden border dark:border-gray-800 rounded-t-2xl bg-white dark:bg-gray-900 text-left transition-all">
                {projects?.map((project) => (
                  <div
                    className="p-4 flex items-center justify-start"
                    key={project.id}
                  >
                    <div>
                      <div className="flex items-center">
                        <h1 className="text-lg font-bold">{project.name}</h1>
                        {project.is_default && (
                          <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-600 uppercase text-xs rounded-md">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-200">
                        {timeAgo(project.created_at)}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <button
                        className="h-10 px-4 text-sm font-medium bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 transform transition-transform duration-75 active:scale-95"
                        onClick={() =>
                          setActiveProject.mutate(
                            {
                              key: DO_ACTIVE_PROJECT,
                              value: project.id,
                            },
                            {
                              onSuccess: () => {
                                close();
                              },
                            }
                          )
                        }
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
