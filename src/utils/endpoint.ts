import { Capacitor } from "@capacitor/core";

export function getRemoteApiEndpoint() {
  if (Capacitor.isNativePlatform()) {
    return "https://domc.vercel.app";
  }
  return "http://localhost:3000";
}
