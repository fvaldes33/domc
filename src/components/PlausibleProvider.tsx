import { usePlausibleEvent } from "@/hooks/usePlausibleEvent";
import { useRouter } from "next/router";
import { createContext, useEffect } from "react";

interface PlausibleContextProps {
  domain: string;
  enabled: boolean;
}
interface PlausibleProviderProps extends PlausibleContextProps {
  children: React.ReactNode;
}

export const PlausibleContext = createContext<PlausibleContextProps>({
  domain: "",
  enabled: true,
});

function PlausibleRouteListener() {
  const { mutate } = usePlausibleEvent();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      mutate({
        name: "pageview",
        url,
      });
    };

    // initial load
    mutate({
      name: "pageview",
      url: window.location.pathname,
    });

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

const PlausibleContextProvider = ({
  domain,
  enabled = true,
  children,
}: PlausibleProviderProps) => {
  return (
    <PlausibleContext.Provider
      value={{
        domain,
        enabled,
      }}
    >
      <PlausibleRouteListener />
      {children}
    </PlausibleContext.Provider>
  );
};

export { PlausibleContextProvider };
