import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useBrowser } from "@/hooks/useBrowser";
import dayjs from "dayjs";

export default function AboutPage() {
  const navigate = useBrowser();

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">About</h1>
          </div>
        </div>
        <div className="px-4 pb-safe prose dark:prose-invert">
          <p>
            Mission Control <i>for DigitalOcean</i> is the &quot;go to&quot; app
            for developers to manage their resources on the go. From the App
            Platform to individual Droplets, you can keep an eye on all your
            mission critical resources.
          </p>
          <p>
            Icons and Illustrations by{" "}
            <span
              className="font-bold"
              onClick={() => navigate("https://icons8.com")}
            >
              Icons8
            </span>
            . Data provided by the{" "}
            <span
              className="font-bold"
              onClick={() => navigate("https://docs.digitalocean.com/")}
            >
              DigitalOcean API
            </span>
            . Developed by <strong>Franco Valdes</strong>.
          </p>

          <p>
            <span
              className="underline"
              onClick={() =>
                navigate("https://missionctrl.appvents.com/privacy")
              }
            >
              Privacy
            </span>
            <span className="inline-block mx-2">|</span>
            <span
              className="underline"
              onClick={() =>
                navigate(
                  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                )
              }
            >
              Terms of Use
            </span>
          </p>
          <p>
            <strong>
              &copy; {dayjs().format("YYYY")} Appvents, LLC. All Rights
              Reserved.
            </strong>
          </p>
        </div>
      </Page.Content>
    </Page>
  );
}
