import { Button } from "@/components/Button";
import { DomainRecordForm } from "@/components/DomainRecordForm";
import { Footer } from "@/components/Footer";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { useCreateDomainRecord, useGetDomain } from "@/hooks/useDomains";
import { IDomainRecord } from "dots-wrapper/dist/domain";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function DomainRecordNewPage() {
  // useMemo(async () => {
  //   await FirebaseAnalytics.setScreenName({
  //     screenName: "domainNew",
  //     nameOverride: "DomainNewScreen",
  //   });
  // }, []);
  const router = useRouter();
  const { name } = router.query as { name: string };

  const { data: domain, isLoading: domainIsLoading } = useGetDomain({
    name,
  });

  const createDomainRecord = useCreateDomainRecord();

  const onSave = (newRecord: IDomainRecord) => {
    createDomainRecord.mutate(
      {
        domain_name: name,
        ...newRecord,
      },
      {
        onSuccess: () => {
          toast.success("Domain Record Updated");
          router.back();
        },
        onError: (error: any) => {
          console.log(error);
          if ("response" in error) {
            return toast.error(error.response.data.message);
          }
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Page>
      <MainNavbar title={domain?.name} />
      <Page.Content>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Domain Record</h1>
          </div>
        </div>
        <DomainRecordForm onSave={onSave} />
      </Page.Content>
      <Footer className="bg-ocean-2">
        <Toolbar position="bottom">
          <Button form="recordForm" full loading={createDomainRecord.isLoading}>
            Save
          </Button>
        </Toolbar>
      </Footer>
    </Page>
  );
}
