import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.appvents.domc",
  appName: "Mission Control",
  webDir: "out",
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#ffffffff",
    },
  },
  // server: {
  //   url: "https://f4d5-136-57-130-168.ngrok.io",
  //   cleartext: true,
  // },
};

export default config;
