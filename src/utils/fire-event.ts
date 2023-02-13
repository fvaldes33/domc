import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";

export function fireEvent({ name, params }: { name: string; params: any }) {
  FirebaseAnalytics.logEvent({
    name,
    params,
  });
}
