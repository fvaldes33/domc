import { Balance } from "@/components/Balance";
import HapticLink from "@/components/HapticLink";
import { MainNavbar } from "@/components/MainNavbar";
import { useMissionControl } from "@/components/MissionControlProvider";
import { Page } from "@/components/Page";
import { useGetBalance, useListBillingHistory } from "@/hooks/useCustomer";
import { formatCurrency } from "@/utils/formatCurrency";
import canAccess from "@/utils/permissions";
import {
  IconArrowRight,
  IconChevronRight,
  IconHistory,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

export default function BillingIndexPage() {
  const { isPaid, toggleIap } = useMissionControl();
  const can = useMemo(() => {
    return canAccess("invoice", ["read"], isPaid ? "PURCHASER" : "FREE");
  }, [isPaid]);
  const [page, setPage] = useState<number>(1);
  const { data: billing } = useGetBalance();
  const { data, refetch } = useListBillingHistory({
    page,
    per_page: 10,
  });

  return (
    <Page>
      <MainNavbar />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          complete();
        }}
      >
        <section className="p-4">
          <p className="text-2xl font-bold">Billing / Usage</p>
        </section>

        {/* current bill */}
        <section className="px-4 mb-4">
          <div className="border border-ocean-2 bg-ocean-2/10 rounded-md p-4 space-y-2">
            <p className="text-lg">
              Estimated Due for {dayjs().format("MMMM")}
            </p>
            <p className="text-sm mb-6">
              This is an estimate of the amount you owe based on your current
              month-to-date usage after credits & prepayments.
            </p>
            <p className="text-2xl">
              {billing ? formatCurrency(+billing.month_to_date_balance) : ""}
            </p>
          </div>
        </section>
        {/* History */}
        <section className="">
          <p className="sticky top-[-1px] bg-white dark:bg-black text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b border-ocean-2/50 flex items-center px-4">
            <IconHistory className="" size={20} strokeWidth={1.5} />
            <span className="ml-2 uppercase">History</span>

            <HapticLink
              href="/billing/history"
              className="flex items-center ml-auto"
            >
              <span>View All</span>
              <IconArrowRight size={16} />
            </HapticLink>
          </p>

          <ul>
            {data?.billing_history?.map((bill, index) => {
              return (
                <li key={`bill-${index}`}>
                  {bill.invoice_uuid ? (
                    <HapticLink
                      href={`/billing/history/${bill.invoice_uuid}`}
                      className="px-4 py-2 flex items-start border-b border-ocean-2/50"
                      onClick={(e) => {
                        if (!can) {
                          e.preventDefault();
                          toggleIap();
                        }
                      }}
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
    </Page>
  );
}
