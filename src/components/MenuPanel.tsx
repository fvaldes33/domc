/* eslint-disable @next/next/no-img-element */
import { classNames } from "@/utils/classNames";
import { useDisclosure } from "@mantine/hooks";
import {
  IconApps,
  IconDatabase,
  IconDroplet,
  IconHome,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { List, ListInput, ListItem, Navbar, Page, Panel } from "konsta/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMissionControl } from "./MissionControlProvider";

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
];

export function MenuPanel({ opened, close }: MenuPanelProps) {
  const router = useRouter();
  const { account } = useMissionControl();

  return (
    <Panel side="left" opened={opened} onBackdropClick={close}>
      <Page>
        <Navbar
          centerTitle={false}
          title="Mission Control"
          right={
            <button
              onClick={close}
              className="ml-auto h-full bg-transparent flex items-center justify-center"
            >
              <IconX size={24} />
            </button>
          }
        />
        {account && (
          <List margin="m-0">
            <ListItem
              // @ts-ignore
              title={account.team.name}
              text={account.email}
              media={
                <img
                  className="w-12 object-cover rounded-full bg-ocean"
                  src={`https://avatars.dicebear.com/api/miniavs/${account.email}.svg`}
                  alt=""
                />
              }
            />
          </List>
        )}
        <nav className="flex flex-col">
          {NAV_ITEMS.map(({ label, to, end, icon: Icon }) => {
            const isActive = router.route === to;
            return (
              <Link
                key={to}
                href={to}
                className={classNames(
                  "h-10 px-4 flex items-center",
                  isActive ? "bg-ocean text-white" : ""
                )}
                onClick={close}
              >
                <Icon size={20} className="mr-4" />
                <p>{label}</p>
              </Link>
            );
          })}
        </nav>
      </Page>
    </Panel>
  );
}
