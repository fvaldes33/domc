import { Balance } from "@/components/Balance";
import { Footer } from "@/components/Footer";
import HapticLink from "@/components/HapticLink";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { Toolbar } from "@/components/Toolbar";
import { useGetBalance, useListBillingHistory } from "@/hooks/useCustomer";
import { formatCurrency } from "@/utils/formatCurrency";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconHistory,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";

export default function BillingIndexPage() {
  const [page, setPage] = useState<number>(1);
  const { data } = useListBillingHistory({
    page,
    per_page: 50,
  });

  const onClick = (cb: Function) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({
        style: ImpactStyle.Light,
      });
    }
    cb();
  };

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <section className="p-4">
          <p className="text-2xl font-bold">Billing History</p>
        </section>
        {/* History */}
        <section className="">
          <ul>
            {data?.billing_history?.map((bill) => {
              return (
                <li key={bill.date}>
                  {bill.invoice_uuid ? (
                    <HapticLink
                      href={`/billing/history/${bill.invoice_uuid}`}
                      className="px-4 py-2 flex items-start border-b border-ocean-2/50"
                    >
                      <div>
                        <p>{dayjs(bill.date).format("MMM DD, YYYY")}</p>
                        <p className="text-sm">{bill.description}</p>
                        <p>{formatCurrency(+bill.amount)}</p>
                      </div>
                      {bill.invoice_uuid && (
                        <div className="ml-auto flex">
                          <p>View Invoice</p>
                          <IconChevronRight />
                        </div>
                      )}
                    </HapticLink>
                  ) : (
                    <div className="px-4 py-2 flex items-start border-b border-ocean-2/50">
                      <div>
                        <p>{dayjs(bill.date).format("MMM DD, YYYY")}</p>
                        <p className="text-sm">{bill.description}</p>
                        <p>{formatCurrency(+bill.amount)}</p>
                      </div>
                      {bill.invoice_uuid && (
                        <div className="ml-auto flex">
                          <p>View Invoice</p>
                          <IconChevronRight />
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </Page.Content>
      <Footer className="bg-white dark:bg-black">
        <Toolbar position="bottom" border>
          <button
            disabled={page === 1}
            onClick={() => onClick(() => setPage((prev) => prev - 1))}
            className="px-2 flex items-center disabled:opacity-30"
          >
            <IconChevronLeft size={16} />
            <span className="ml-2 text-sm">Prev</span>
          </button>
          <button
            disabled={!data?.hasMore}
            onClick={() => onClick(() => setPage((prev) => prev + 1))}
            className="px-2 flex items-center flex-row-reverse disabled:opacity-30"
          >
            <IconChevronRight size={16} />
            <span className="mr-2 text-sm">Next</span>
          </button>
        </Toolbar>
      </Footer>
    </Page>
  );
}
