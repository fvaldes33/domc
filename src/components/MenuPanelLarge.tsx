/* eslint-disable @next/next/no-img-element */
import { classNames } from "@/utils/classNames";
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
  // { label: "Databases", icon: IconDatabase, to: "/databases", end: false },
  { label: "Domains", icon: IconWorld, to: "/domains", end: false },
  { label: "Droplets", icon: IconDroplet, to: "/droplets", end: false },
  { label: "Settings", icon: IconSettings2, to: "/settings", end: false },
];

export function MenuPanelLarge() {
  const router = useRouter();
  const { account } = useMissionControl();

  return (
    <div className="hidden md:block fixed inset-y-0 left-0 border-r h-full w-64 bg-white dark:bg-gray-700/50 z-50">
      <Page main={false}>
        <Navbar
          title={"Mission Control"}
          titleProps={{
            centered: false,
          }}
        />
        <Page.Content>
          <div className="flex flex-col h-full">
            <nav className="flex flex-col">
              {NAV_ITEMS.map(({ label, to, end, icon: Icon }) => {
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
              <Link href="/settings" className="px-2 py-2 flex items-center">
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
    </div>
  );
}
