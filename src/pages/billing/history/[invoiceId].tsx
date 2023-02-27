import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetInvoiceSummary, useListInvoiceItems } from "@/hooks/useCustomer";
import { classNames } from "@/utils/classNames";
import { formatCurrency } from "@/utils/formatCurrency";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Disclosure } from "@headlessui/react";
import { IconChevronDown } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export default function InvoiceDetail() {
  const { query } = useRouter();
  const { data, isLoading: invoiceIsLoading } = useGetInvoiceSummary({
    invoice_uuid: query.invoiceId as string,
  });
  const { data: items, isLoading: itemsIsLoading } = useListInvoiceItems({
    invoice_uuid: query.invoiceId as string,
  });

  const isLoading = invoiceIsLoading || itemsIsLoading;

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        <section className="p-4">
          <p className="text-2xl font-bold flex items-center">
            Final Invoice for{" "}
            {data ? (
              dayjs(`${data.billing_period}-01`).format("MMMM YYYY")
            ) : (
              <span className="ml-2 inline-block h-6 w-32 rounded-md bg-gray-200 animate-pulse" />
            )}
          </p>
        </section>

        {isLoading ? (
          <>
            <section className="mx-4 border border-ocean-2 bg-ocean-2/10 rounded-md">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="border-b border-ocean-2/50 last-of-type:border-0"
                  key={`rollup-skeleton-${index}`}
                >
                  <div className="flex items-center p-4 w-full">
                    <div className="h-5 w-5 mr-2 rounded-md bg-gray-300 animate-pulse" />
                    <div className="h-5 w-40 rounded-md bg-gray-300 animate-pulse" />
                    <div className="h-5 w-10 ml-auto rounded-md bg-gray-300 animate-pulse" />
                  </div>
                </div>
              ))}
            </section>
            <section className="px-4 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  className="flex items-center py-2"
                  key={`totals-skeleton-${index}`}
                >
                  <div className="h-5 w-40 rounded-md bg-gray-300 animate-pulse" />
                  <div className="h-5 w-10 ml-auto rounded-md bg-gray-300 animate-pulse" />
                </div>
              ))}
            </section>
          </>
        ) : (
          <>
            <section className="mx-4 border border-ocean-2 bg-ocean-2/10 rounded-md">
              {data?.product_charges?.items.map((item) => {
                const details = items?.invoice_items.filter(
                  (i) => i.product === item.name
                );
                return (
                  <div
                    key={`charges-${item.name}`}
                    className="border-b border-ocean-2/50 last-of-type:border-0"
                  >
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className="flex items-center p-4 w-full"
                            onClick={() => {
                              if (Capacitor.isNativePlatform()) {
                                Haptics.impact({
                                  style: ImpactStyle.Light,
                                });
                              }
                            }}
                          >
                            <IconChevronDown
                              className={classNames(
                                "mr-2 transition-transform transform",
                                open ? "rotate-180" : ""
                              )}
                            />
                            <span>{item.name}</span>
                            <span className="ml-auto font-bold">
                              {formatCurrency(+item.amount)}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel className="pb-2">
                            {details?.map((detail) => {
                              return (
                                <div
                                  key={detail.description}
                                  className="pl-12 pr-4 py-2 flex items-start text-sm"
                                >
                                  <div className="pr-2">
                                    <p>{detail.description}</p>
                                    <p className="text-xs">
                                      {detail.duration}

                                      <span className="lowercase">
                                        {" "}
                                        {detail.duration_unit}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="ml-auto flex-none text-sm">
                                    {formatCurrency(+detail.amount)}
                                  </div>
                                </div>
                              );
                            })}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                );
              })}
            </section>
            <section className="px-4 mt-6">
              {data?.product_charges && (
                <div className="flex items-center py-1">
                  <p className="text-lg">Subtotal</p>
                  <p className="text-lg ml-auto">
                    {formatCurrency(+data.product_charges.amount)}
                  </p>
                </div>
              )}
              {data?.overages && (
                <div className="flex items-center py-1">
                  <p className="text-lg">Overages</p>
                  <p className="text-lg ml-auto">
                    {formatCurrency(+data.overages?.amount)}
                  </p>
                </div>
              )}
              {data?.credits_and_adjustments && (
                <div className="flex items-center py-1">
                  <p className="text-lg">Credits</p>
                  <p className="text-lg ml-auto">
                    {formatCurrency(+data.credits_and_adjustments?.amount)}
                  </p>
                </div>
              )}
              {data?.amount && (
                <div className="flex items-center py-2 mt-2 border-t">
                  <p className="text-lg">Total</p>
                  <p className="text-lg ml-auto font-bold">
                    {formatCurrency(+data.amount)}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </Page.Content>
    </Page>
  );
}
