import { StatusBar, Style } from "@capacitor/status-bar";
import { useGetAccount } from "@/hooks/useAccount";
import { useGetStatus } from "@/hooks/useGetOfferings";
import { IAccount } from "dots-wrapper/dist/account";
import { IAction } from "dots-wrapper/dist/action";
import {
  IDroplet,
  ISnapshotDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { atom, useAtomValue } from "jotai";
import { createContext, useContext, useEffect, useMemo } from "react";
import { DropletActionWatcher } from "./DropletActionWatcher";
import { InAppPurchase } from "./InAppPurchase";
import { MenuPanelLarge } from "./MenuPanelLarge";
import { Capacitor } from "@capacitor/core";

interface MissionControlContextProps {
  theme: "light" | "dark";
  colorSchemePref: "manual" | "system";
  token?: string;
  account?: IAccount;
  isPaid: boolean;
}

const MissionControlContext = createContext<MissionControlContextProps>({
  theme: "light",
  colorSchemePref: "manual",
  isPaid: false,
});

interface InProgress {
  droplet: IDroplet;
  action: IAction;
}
export const inProgressAtom = atom<InProgress | undefined>(undefined);
export const postShutdownActionAtom = atom<
  ISnapshotDropletApiRequest | undefined
>(undefined);

export function MissonControlProvider({
  token,
  theme,
  colorSchemePref,
  children,
}: {
  token: string;
  theme: MissionControlContextProps["theme"];
  colorSchemePref: MissionControlContextProps["colorSchemePref"];
  children: React.ReactNode;
}) {
  const { data: account } = useGetAccount();
  const inProgress = useAtomValue(inProgressAtom);
  const { data: customerInfo } = useGetStatus();

  useEffect(() => {
    const setStatusBarStyleDark = async () => {
      if (Capacitor.isNativePlatform()) {
        await StatusBar.setStyle({ style: Style.Dark });
      }
    };

    const setStatusBarStyleLight = async () => {
      if (Capacitor.isNativePlatform()) {
        await StatusBar.setStyle({ style: Style.Light });
      }
    };

    if (colorSchemePref === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        setStatusBarStyleDark();
      } else {
        document.documentElement.classList.remove("dark");
        setStatusBarStyleLight();
      }
    } else {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        setStatusBarStyleDark();
      } else {
        document.documentElement.classList.remove("dark");
        setStatusBarStyleLight();
      }
    }
  }, [colorSchemePref, theme]);

  const isPaid = useMemo(() => {
    return Boolean(customerInfo?.activeSubscriptions.length);
  }, [customerInfo]);

  return (
    <MissionControlContext.Provider
      value={{ theme, token, account, colorSchemePref, isPaid }}
    >
      {inProgress && (
        <DropletActionWatcher
          droplet={inProgress.droplet}
          action={inProgress.action}
        />
      )}
      <MenuPanelLarge />
      {children}
      <InAppPurchase />
    </MissionControlContext.Provider>
  );
}

export function useMissionControl() {
  return useContext(MissionControlContext);
}
