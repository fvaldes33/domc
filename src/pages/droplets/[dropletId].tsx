import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetDropletDetails } from "@/hooks/useDroplets";
import { classNames } from "@/utils/classNames";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function DropletDetailPage() {
  const { query } = useRouter();
  const { data: droplet, isLoading } = useGetDropletDetails({
    droplet_id: Number(query.dropletId),
  });

  const region = useMemo(() => {
    if (!droplet) return null;
    if (typeof droplet.region === "string") return null;
    return droplet.region;
  }, [droplet]);

  const image = useMemo(() => {
    if (!droplet) return null;
    if (typeof droplet.image === "string" || typeof droplet.image === "number")
      return null;
    return droplet.image;
  }, [droplet]);

  console.log({ droplet });
  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            {droplet && (
              <section className="p-4 flex flex-col">
                <header className="flex items-center justify-start">
                  <div className="">
                    <span
                      className={classNames(
                        "inline-block mb-1 px-2 py-1 text-xs rounded-md capitalize",
                        droplet.status === "active"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      )}
                    >
                      {droplet.status}
                    </span>
                    <h1 className="text-xl font-bold truncate overflow-hidden">
                      {droplet.name}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">{region?.name}</p>
                      <span>&bull;</span>
                      <p className="">{image?.name}</p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {/* <AppActions app={app} /> */}
                  </div>
                </header>
              </section>
            )}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
