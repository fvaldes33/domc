import { useGetAccount } from "@/hooks/useAccount";
import { useGetPreference } from "@/hooks/usePreferences";
import { IAccount } from "dots-wrapper/dist/account";
import { createContext, useContext, useEffect } from "react";

interface MissionControlContextProps {
  theme: "light" | "dark";
  token?: string;
  account?: IAccount;
}

const MissionControlContext = createContext<MissionControlContextProps>({
  theme: "light",
});

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

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <MissionControlContext.Provider value={{ theme, token, account }}>
      {children}
    </MissionControlContext.Provider>
  );
}

export function useMissionControl() {
  return useContext(MissionControlContext);
}
