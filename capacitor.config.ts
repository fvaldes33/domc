import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.appvents.domc",
  appName: "Mission Control",
  webDir: "out",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#ffffffff",
    },
  },
  // server: {
  //   url: "https://8f7d-136-57-130-168.ngrok.io",
  //   cleartext: true,
  // },
};

export default config;
