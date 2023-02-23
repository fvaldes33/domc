import "@/styles/globals.css";
import "xterm/css/xterm.css";

import { SplashScreen } from "@capacitor/splash-screen";
import { Nunito_Sans } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

import { useGetPreference } from "@/hooks/usePreferences";
import { App } from "@/components/App";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SetupScreen } from "@/components/SetupScreen";
import { MissonControlProvider } from "@/components/MissionControlProvider";
import { Toaster } from "react-hot-toast";
import {
  DO_COLOR_SCHEME,
  DO_COLOR_SCHEME_PREF,
  DO_TOKEN_KEY,
} from "@/utils/const";
import { Capacitor } from "@capacitor/core";
import { CapacitorPurchases } from "@capgo/capacitor-purchases";
import { PlausibleContextProvider } from "@/components/PlausibleProvider";

// const inter = Inter({ subsets: ["latin"] });
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--nunito-font",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PlausibleContextProvider domain="domc.appvents.com" enabled={true}>
        <Head>
          <title>Digital Ocean Mission Control</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `:root {
          --nunito-font: ${nunito.style.fontFamily}
        }`,
            }}
          ></style>
        </Head>
        <AppWrapper>
          <Component {...pageProps} />
        </AppWrapper>
        <Toaster containerClassName="mt-safe z-[999]" />
      </PlausibleContextProvider>
    </QueryClientProvider>
  );
}

function AppWrapper({ children }: { children: React.ReactNode }) {
  const [appReady, setAppReady] = useState<boolean>(false);

  const { data: token, isLoading } = useGetPreference<string | null>({
    key: DO_TOKEN_KEY,
  });
  const { data: colorScheme } = useGetPreference<"light" | "dark">({
    key: DO_COLOR_SCHEME,
    defaultValue: "light",
  });

  const { data: colorSchemePref } = useGetPreference<"system" | "manual">({
    key: DO_COLOR_SCHEME_PREF,
    defaultValue: "manual",
  });

  useEffect(() => {
    (async () => {
      if (Capacitor.isNativePlatform()) {
        window.screen.orientation.lock("portrait");
        await SplashScreen.hide();
        CapacitorPurchases.setDebugLogsEnabled({
          enabled: process.env.NODE_ENV !== "production",
        });
        if (Capacitor.getPlatform() === "ios") {
          CapacitorPurchases.setup({
            apiKey: "appl_TvgfielhyfmviHVWafRxdDrqDWM", // prod
          });
        } else {
          CapacitorPurchases.setup({
            apiKey: "goog_pKBkxaOJfEEEnuVrMTjwJlxKCOE", // prod
          });
        }
      }
      setAppReady(true);
    })();
  }, []);

  return (
    <App>
      {isLoading || !appReady ? (
        <LoadingScreen />
      ) : token ? (
        <MissonControlProvider
          theme={colorScheme ?? "light"}
          token={token}
          colorSchemePref={colorSchemePref ?? "manual"}
        >
          {children}
        </MissonControlProvider>
      ) : (
        <SetupScreen />
      )}
    </App>
  );
}
