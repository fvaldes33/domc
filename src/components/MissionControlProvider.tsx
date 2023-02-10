import { useGetAccount } from "@/hooks/useAccount";
import { useGetPreference } from "@/hooks/usePreferences";
import { DO_COLOR_SCHEME_PREF } from "@/utils/const";
import { IAccount } from "dots-wrapper/dist/account";
import { IAction } from "dots-wrapper/dist/action";
import {
  IDroplet,
  ISnapshotDropletApiRequest,
} from "dots-wrapper/dist/droplet";
import { atom, useAtomValue } from "jotai";
import { createContext, useContext, useEffect } from "react";
import { DropletActionWatcher } from "./DropletActionWatcher";

interface MissionControlContextProps {
  theme: "light" | "dark";
  colorSchemePref: "manual" | "system";
  token?: string;
  account?: IAccount;
}

const MissionControlContext = createContext<MissionControlContextProps>({
  theme: "light",
  colorSchemePref: "manual",
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

  useEffect(() => {
    if (colorSchemePref === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [colorSchemePref, theme]);

  return (
    <MissionControlContext.Provider
      value={{ theme, token, account, colorSchemePref }}
    >
      {inProgress && (
        <DropletActionWatcher
          droplet={inProgress.droplet}
          action={inProgress.action}
        />
      )}
      {children}
    </MissionControlContext.Provider>
  );
}

export function useMissionControl() {
  return useContext(MissionControlContext);
}
