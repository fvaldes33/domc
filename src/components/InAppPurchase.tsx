/* eslint-disable @next/next/no-img-element */
import {
  useGetOfferings,
  useGetStatus,
  usePurchasePackage,
  useRestorePurchases,
} from "@/hooks/useGetOfferings";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import { IconCheck, IconLoader } from "@tabler/icons-react";
import {
  Purchases,
  type PurchasesPackage,
} from "@revenuecat/purchases-capacitor";
import { classNames } from "@/utils/classNames";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Button } from "./Button";
import { toast } from "react-hot-toast";
import { usePlausibleEvent } from "@/hooks/usePlausibleEvent";
import { useRouter } from "next/router";
import { useBrowser } from "@/hooks/useBrowser";

type InAppPurchaseProps = {
  opened: boolean;
  close: () => void;
  open: () => void;
};
export function InAppPurchase({ opened, close, open }: InAppPurchaseProps) {
  const router = useRouter();
  const navigate = useBrowser();
  const plausible = usePlausibleEvent();
  const { data: status } = useGetStatus();

  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage>();
  const { data: offerings } = useGetOfferings({
    onSuccess: (data) => {
      if (data && data.availablePackages.length > 0) {
        if (data.identifier === "ltd") {
          setSelectedPkg(data.lifetime!);
        } else {
          setSelectedPkg(data.annual!);
        }
      } else {
        plausible.mutate({
          name: "no_offerings",
          url: window.location.pathname,
        });
        close();
      }
    },
  });

  const purchasePackage = usePurchasePackage();
  const restorePurchases = useRestorePurchases();

  const onSetPackage = (pkg: PurchasesPackage) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({
        style: ImpactStyle.Medium,
      });
    }
    setSelectedPkg(pkg);
  };

  const onPurchasePackage = () => {
    if (!selectedPkg) {
      return;
    }

    plausible.mutate({
      name: "subscribe_start",
      url: window.location.pathname,
      props: {
        package: selectedPkg.identifier,
      },
    });
    purchasePackage.mutate(
      {
        aPackage: selectedPkg,
      },
      {
        onSuccess: () => {
          toast.success("Your purchase was successful!");
          plausible.mutate({
            name: "subscribe_complete",
            url: window.location.pathname,
            props: {
              package: selectedPkg.identifier,
            },
          });

          setTimeout(() => {
            onClose();
          }, 1000);
        },
        onError: (error: any) => {
          toast.error(error?.message);
        },
      }
    );
  };

  const onRestorePurchases = () => {
    restorePurchases.mutate(undefined, {
      onSuccess: () => {
        toast.success("Your purchase was restored!");
        setTimeout(() => {
          onClose();
        }, 1000);
      },
      onError: (error: any) => {
        toast.error(error?.message);
      },
    });
  };

  const onClose = () => {
    close();
  };

  // useEffect(() => {
  //   if (!status) return;
  //   if (!offerings) return;

  //   if (!["/", "/about", "/settings"].includes(router.pathname)) {
  //     if (
  //       Object.entries(status.entitlements.active).length &&
  //       offerings.availablePackages.length
  //     ) {
  //       open();
  //     }
  //   }
  // }, [open, status, offerings, router.pathname]);

  const isLifetime = useMemo(() => {
    return offerings?.identifier === "ltd";
  }, [offerings]);

  return (
    <div>
      <Transition show={opened} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed bottom-0 inset-x-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="w-full pt-6 px-4 max-w-md mx-auto max-h-[90vh] pb-safe transform overflow-y-auto border dark:border-gray-800 rounded-t-2xl bg-white dark:bg-gray-900 dark:text-white text-left transition-all">
                <div className="flex items-center">
                  <img src={logo.src} alt="" className="h-20 w-20" />
                  <div className="ml-4">
                    <p className="text-xl font-bold">Mission Control</p>
                    <p className="italic">for DigitalOcean</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-2xl font-bold mb-2">
                    {isLifetime
                      ? "One Time Purchase"
                      : "Start Your 3-Day Free Trial"}
                  </p>
                  <p>
                    Get total control of your DigitalOcean account on the go.
                    Monitor and manage your Droplets, Apps, Databases and
                    Domains all from the palm of your hand.
                  </p>
                </div>
                {offerings && offerings.availablePackages.length > 0 && (
                  <>
                    <div className="mt-4 space-y-6">
                      {offerings?.availablePackages
                        .filter((pkg) =>
                          isLifetime ? pkg.packageType === "LIFETIME" : true
                        )
                        .map((pkg) => {
                          const { product } = pkg;
                          const isChecked =
                            selectedPkg?.identifier === pkg.identifier;
                          return (
                            <div className="" key={pkg.identifier}>
                              <input
                                id={`pkg-${pkg.packageType}`}
                                name="offering"
                                type="radio"
                                className="peer hidden"
                                checked={isChecked}
                                onChange={(e) => onSetPackage(pkg)}
                              />
                              <label
                                htmlFor={`pkg-${pkg.packageType}`}
                                className="relative p-4 border-2 border-ocean-2 rounded-2xl block w-full peer-checked:bg-ocean-2 peer-checked:text-white"
                              >
                                {pkg.packageType === "ANNUAL" && (
                                  <span className="absolute top-0 right-2 -translate-y-1/2 px-2 py-1 border-2 border-ocean-2 font-bold text-xs bg-white text-ocean-2 rounded-full">
                                    Most Popular
                                  </span>
                                )}
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-bold">{product.title}</p>
                                    <p className="mb-2">
                                      {product.description}
                                    </p>

                                    <div className="flex items-center">
                                      <p className="font-bold">
                                        {product.priceString}
                                        {pkg.packageType === "MONTHLY"
                                          ? "/mo"
                                          : pkg.packageType === "ANNUAL"
                                          ? "/yr"
                                          : ""}
                                      </p>
                                      {pkg.packageType === "ANNUAL" && (
                                        <p className="ml-2 font-bold text-green-400 italic">
                                          &bull; 16% savings
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span
                                      className={classNames(
                                        "h-6 w-6 rounded-full flex items-center justify-center",
                                        isChecked
                                          ? "bg-white border border-white text-ocean-2"
                                          : "bg-white border border-ocean-2"
                                      )}
                                    >
                                      {isChecked ? (
                                        <IconCheck size={16} />
                                      ) : null}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                      <Button
                        block
                        onClick={onPurchasePackage}
                        loading={purchasePackage.isLoading}
                      >
                        {isLifetime ? "Purchase" : "Subscribe"}
                      </Button>
                    </div>
                    <div className="text-center text-sm my-4">
                      {isLifetime
                        ? "No subscription needed. One time purchase and get access forever on all your devices."
                        : "Subscriptions automatically renew after the 3-day freetrial. Cancel any time on the app store."}
                    </div>
                    <div className="text-center text-sm mt-4 mb-2">
                      <Button
                        size="sm"
                        variant="light"
                        onClick={onRestorePurchases}
                        loading={restorePurchases.isLoading}
                      >
                        Restore Purchases
                      </Button>
                    </div>
                    <div className="flex items-center justify-center text-sm mt-2 mb-4">
                      <span
                        onClick={() =>
                          navigate("https://missionctrl.appvents.com/privacy")
                        }
                      >
                        Privacy
                      </span>
                      <span className="inline-block mx-2">|</span>
                      <span
                        onClick={() =>
                          navigate(
                            "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                          )
                        }
                      >
                        Terms of Use
                      </span>
                    </div>
                  </>
                )}
                {(purchasePackage.isLoading || restorePurchases.isLoading) && (
                  <div className="backdrop-blur-lg fixed inset-0 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-32 h-32 flex flex-col items-center justify-center shadow-2xl">
                      <IconLoader className="animate-spin" />
                      <p className="text-center text-xs mt-2">
                        {purchasePackage.isLoading
                          ? "Setting up your purchase"
                          : "Restoring your purchase"}
                      </p>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
