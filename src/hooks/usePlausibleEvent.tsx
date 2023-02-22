import { PlausibleContext } from "@/components/PlausibleProvider";
import { Capacitor } from "@capacitor/core";
import { Device, DeviceInfo } from "@capacitor/device";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

function usePlausible() {
  return useContext(PlausibleContext);
}

export function usePlausibleEvent() {
  const { domain, enabled } = usePlausible();

  return useMutation({
    mutationKey: ["plausible", enabled],
    mutationFn: async ({
      name = "pageview",
      url,
      props = {},
    }: {
      name: string;
      url: string;
      props?: Record<string, string>;
    }) => {
      if (!enabled) return true;

      let deviceData: DeviceInfo = {
        name: "",
        model: "",
        operatingSystem: "unknown",
        platform: "web",
        osVersion: "",
        manufacturer: "",
        isVirtual: false,
        webViewVersion: "",
      };
      if (Capacitor.isNativePlatform()) {
        deviceData = await Device.getInfo();
      }
      const { model, operatingSystem, platform, osVersion } = deviceData;

      const res = await fetch(
        `https://b59f-136-57-130-168.ngrok.io/api/event`,
        {
          method: "post",
          body: JSON.stringify({
            name,
            url,
            domain,
            screen_width: window.innerWidth,
            props: {
              ...props,
              model,
              operatingSystem,
              platform,
              osVersion,
            },
          }),
          headers: {
            "User-Agent": window.navigator.userAgent,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw res;
      return res.ok;
    },
  });
}
