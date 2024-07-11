import { StatusBar, Style } from "@capacitor/status-bar";
import { getAccount, useGetAccount } from "@/hooks/useAccount";
import { useGetStatus } from "@/hooks/useGetOfferings";
import { IAccount } from "dots-wrapper/dist/account";
import { IAction } from "dots-wrapper/dist/action";
import {
  IDroplet,
  ISnapshotDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { atom, useAtomValue } from "jotai";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DropletActionWatcher } from "./DropletActionWatcher";
import { InAppPurchase } from "./InAppPurchase";
import { MenuPanelLarge } from "./MenuPanelLarge";
import { Capacitor } from "@capacitor/core";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { useGetPreference } from "@/hooks/usePreferences";
import { DO_ACCOUNTS } from "@/utils/const";
import { TokenAccountMap } from "@/types";
import { useDisclosure } from "@mantine/hooks";

interface MissionControlContextProps {
  theme: "light" | "dark";
  colorSchemePref: "manual" | "system";
  token?: string;
  account?: IAccount;
  accounts?: TokenAccountMap;
  isPaid: boolean;
  toggleIap: () => void;
}

const MissionControlContext = createContext<MissionControlContextProps>({
  theme: "light",
  colorSchemePref: "manual",
  isPaid: false,
  toggleIap: () => {},
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
  const [iapOpened, { close: closeIap, open: openIap, toggle: toggleIap }] =
    useDisclosure(false);
  const { data: accounts } = useGetPreference<TokenAccountMap>({
    key: DO_ACCOUNTS,
  });
  const { data: account } = useGetAccount({
    onSuccess: async (data) => {
      if (Capacitor.isNativePlatform()) {
        await Purchases.logIn({
          appUserID: data.email,
        });
        await Purchases.setAttributes({
          // @ts-expect-error - ts issue
          attributes: {
            $email: data.email,
          },
        });
      }
    },
  });
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
    return true; //Object.keys(customerInfo?.entitlements?.active ?? {}).length > 0;
  }, [customerInfo]);

  return (
    <MissionControlContext.Provider
      value={{
        theme,
        token,
        account,
        accounts,
        colorSchemePref,
        isPaid,
        toggleIap,
      }}
    >
      {inProgress && (
        <DropletActionWatcher
          droplet={inProgress.droplet}
          action={inProgress.action}
        />
      )}
      <MenuPanelLarge />
      {children}
      <InAppPurchase opened={iapOpened} close={closeIap} open={openIap} />
    </MissionControlContext.Provider>
  );
}

export function useMissionControl() {
  return useContext(MissionControlContext);
}
