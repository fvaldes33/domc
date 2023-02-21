/* eslint-disable @next/next/no-img-element */
import { classNames } from "@/utils/classNames";
import { Dialog, Transition } from "@headlessui/react";
import {
  IconApps,
  IconDatabase,
  IconDroplet,
  IconHome,
  IconSettings2,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import Link from "@/components/HapticLink";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Footer } from "./Footer";
import { useMissionControl } from "./MissionControlProvider";
import { Navbar } from "./Navbar";
import { Page } from "./Page";
import { Toolbar } from "./Toolbar";

interface MenuPanelProps {
  opened: boolean;
  close: () => void;
}

const NAV_ITEMS = [
  { label: "Home", icon: IconHome, to: "/", end: true },
  { label: "Apps", icon: IconApps, to: "/apps", end: false },
  { label: "Databases", icon: IconDatabase, to: "/databases", end: false },
  { label: "Domains", icon: IconWorld, to: "/domains", end: false },
  { label: "Droplets", icon: IconDroplet, to: "/droplets", end: false },
  { label: "Settings", icon: IconSettings2, to: "/settings", end: false },
];

export function MenuPanel({ opened, close }: MenuPanelProps) {
  const router = useRouter();
  const { account } = useMissionControl();

  return (
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
        <div className="fixed inset-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative h-full w-64 bg-white dark:bg-gray-700/50">
              <Page>
                <Navbar
                  title={"Mission Control"}
                  titleProps={{
                    centered: false,
                  }}
                  right={
                    <button onClick={close} className="dark:text-white">
                      <IconX size={24} />
                    </button>
                  }
                />
                <Page.Content>
                  <div className="flex flex-col h-full">
                    <nav className="flex flex-col">
                      {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
                        const isActive = router.route === to;
                        return (
                          <Link
                            key={to}
                            href={to}
                            className={classNames(
                              "h-10 px-4 flex items-center",
                              isActive
                                ? "bg-ocean text-white dark:text-white"
                                : "dark:text-white"
                            )}
                            onClick={close}
                          >
                            <Icon size={20} className="mr-4" />
                            <p>{label}</p>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </Page.Content>
                {account && (
                  <Footer>
                    <Toolbar border position="bottom">
                      <Link
                        href="/settings"
                        className="px-2 py-2 flex items-center"
                        onClick={close}
                      >
                        <img
                          className="w-10 object-cover rounded-full bg-ocean flex-shrink-0"
                          src={`https://avatars.dicebear.com/api/miniavs/${account.email}.svg`}
                          alt=""
                        />
                        <div className="px-4 text-sm">
                          <p className="font-medium dark:text-white">
                            {/* @ts-ignore */}
                            {account.team.name}
                          </p>
                          <p className="text-xs truncate dark:text-white">
                            {account.email}
                          </p>
                        </div>
                      </Link>
                    </Toolbar>
                  </Footer>
                )}
              </Page>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
