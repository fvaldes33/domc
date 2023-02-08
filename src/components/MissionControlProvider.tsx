import { useGetAccount } from "@/hooks/useAccount";
import { useGetPreference } from "@/hooks/usePreferences";
import { IAccount } from "dots-wrapper/dist/account";
import { IAction } from "dots-wrapper/dist/action";
import { IDroplet } from "dots-wrapper/dist/droplet";
import { atom, useAtomValue } from "jotai";
import { createContext, useContext, useEffect } from "react";
import { DropletActionWatcher } from "./DropletActionWatcher";

interface MissionControlContextProps {
  theme: "light" | "dark";
  token?: string;
  account?: IAccount;
}

const MissionControlContext = createContext<MissionControlContextProps>({
  theme: "light",
});

interface InProgress {
  droplet: IDroplet;
  action: IAction;
}
export const inProgressAtom = atom<InProgress | undefined>(undefined);

export function MissonControlProvider({
  token,
  theme,
  children,
}: {
  token: string;
  theme: MissionControlContextProps["theme"];
  children: React.ReactNode;
}) {
  const { data: account } = useGetAccount();
  const inProgress = useAtomValue(inProgressAtom);

  useEffect(() => {
    if (
      theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <MissionControlContext.Provider value={{ theme, token, account }}>
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
