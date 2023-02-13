/* eslint-disable @next/next/no-img-element */
import { IconLoader } from "@tabler/icons-react";
import { Page } from "@/components/Page";
import splash from "@/assets/splash.png";

export function LoadingScreen() {
  return (
    <Page>
      <Page.Content>
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img
              src={splash.src}
              alt=""
              className="h-full w-full object-cover absolute inset-0"
            />
            <IconLoader size={32} className="animate-spin" />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}
