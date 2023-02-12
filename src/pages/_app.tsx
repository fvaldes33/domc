import "@/styles/globals.css";
import "xterm/css/xterm.css";

import { Nunito_Sans } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

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
        <Toaster containerClassName="mt-safe" />
      </AppWrapper>
    </QueryClientProvider>
  );
}

function AppWrapper({ children }: { children: React.ReactNode }) {
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

  return (
    <App>
      {isLoading ? (
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
