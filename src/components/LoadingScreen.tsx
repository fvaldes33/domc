import { IconLoader } from "@tabler/icons-react";
import { Page } from "@/components/Page";

export function LoadingScreen() {
  return (
    <Page>
      <Page.Content>
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div>
              <h1 className="">Mission Control</h1>
              <p>for Digital Ocean</p>
            </div>
            <IconLoader size={32} className="animate-spin" />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}
