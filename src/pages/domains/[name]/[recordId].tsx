import { Button } from "@/components/Button";
import { DomainRecordForm } from "@/components/DomainRecordForm";
import { Footer } from "@/components/Footer";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import {
  useDeleteDomainRecord,
  useGetDomain,
  useGetDomainRecord,
  useUpdateDomainRecord,
} from "@/hooks/useDomains";
import { useTimeout } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { IDomainRecord } from "dots-wrapper/dist/domain";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function DomainRecordEditPage() {
  const router = useRouter();
  const { name, recordId } = router.query as { name: string; recordId: string };

  const { data: domain, isLoading: domainIsLoading } = useGetDomain({
    name,
  });

  const { data: record, isLoading: recordIsLoading } = useGetDomainRecord({
    domain_name: name,
    domain_record_id: Number(recordId),
  });

  const updateDomainRecord = useUpdateDomainRecord();
  const deleteDomainRecord = useDeleteDomainRecord();

  const [del, setDel] = useState<boolean>(false);
  const { start, clear } = useTimeout(() => {
    setDel(true);
    deleteDomainRecord.mutate(
      {
        domain_name: name,
        domain_record_id: Number(recordId),
      },
      {
        onSuccess: () => {
          toast.success("Domain record deleted");
          router.back();
        },
      }
    );
  }, 3000);

  const onSave = (newRecord: IDomainRecord) => {
    updateDomainRecord.mutate(
      {
        domain_name: name,
        domain_record_id: record!.id,
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
        {record && <DomainRecordForm record={record} onSave={onSave} />}

        <div className="mt-10 border-t">
          <button
            onTouchStart={() => {
              setDel(true);
              start();
            }}
            onTouchEnd={() => {
              if (!deleteDomainRecord.isLoading) {
                setDel(false);
                clear();
              }
            }}
            onTouchCancel={() => {
              if (!deleteDomainRecord.isLoading) {
                setDel(false);
                clear();
              }
            }}
            className="p-4 text-left w-full relative"
          >
            <div className="flex relative z-10">
              <div className="flex-none text-red-600">
                <IconTrash size={24} />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-red-600">Delete Record</p>
                <p>
                  Press and hold for 3 seconds. This action cannot be undone.
                </p>
              </div>
            </div>
            <motion.div
              className="bg-red-400 absolute inset-0 pointer-events-none z-0"
              initial={{
                width: 0,
              }}
              animate={
                del || deleteDomainRecord.isLoading
                  ? {
                      width: "100%",
                    }
                  : { width: 0 }
              }
              transition={{
                duration: 3,
                type: "tween",
              }}
            ></motion.div>
          </button>

          {del}
        </div>
      </Page.Content>
      <Footer className="bg-ocean-2">
        <Toolbar position="bottom">
          <Button form="recordForm" full loading={updateDomainRecord.isLoading}>
            Save
          </Button>
        </Toolbar>
      </Footer>
    </Page>
  );
}
