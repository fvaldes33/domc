import { classNames } from "@/utils/classNames";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Refresher } from "./Refresher";

function Page({
  children,
  main = true,
  withSidebar = true,
}: {
  main?: boolean;
  withSidebar?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      data-type="domc-page"
      className={classNames(
        "absolute inset-0 flex flex-col justify-between overflow-hidden select-none z-10",
        main && withSidebar ? "lg:pl-64" : ""
      )}
      style={{
        contain: "layout size style",
      }}
    >
      {children}
    </div>
  );
}

const RESISTANCE = 1.5;
const PULLDOWNTHRESHOLD = 64;
const MAXPULLDOWNDISTANCE = 90;

function Content({
  onRefresh,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"main"> & {
  onRefresh?: (complete: () => void) => Promise<void> | void;
}) {
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const y = useMotionValue(0);

  const isRefreshedEnabled = Boolean(onRefresh);

  const mainRef = useRef<HTMLElement>(null);
  const childRef = useRef<HTMLElement>();
  const refresherRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const shouldTriggerRefresh = useRef<boolean>(false);
  const touchStart = useRef<number>(0);

  const onTouchStart = (event: MouseEvent | TouchEvent) => {
    if (!isRefreshedEnabled) return;

    isDragging.current = false;

    if (childRef.current!.getBoundingClientRect().top < 44) {
      return;
    }

    touchStart.current =
      event instanceof MouseEvent ? event.pageY : event.touches[0].pageY;

    isDragging.current = true;
  };

  const onTouchMove = (event: MouseEvent | TouchEvent) => {
    if (!isRefreshedEnabled) return;

    if (!isDragging.current) {
      return;
    }

    const newY =
      event instanceof MouseEvent ? event.pageY : event.touches[0].pageY;

    if (newY < touchStart.current) {
      isDragging.current = false;
      return;
    }

    setIsPulling(true);

    const yDistanceMoved = Math.min(
      (newY - touchStart.current) / RESISTANCE,
      MAXPULLDOWNDISTANCE
    );

    if (yDistanceMoved >= PULLDOWNTHRESHOLD) {
      isDragging.current = true;
      shouldTriggerRefresh.current = true;
    } else {
      shouldTriggerRefresh.current = false;
    }

    if (yDistanceMoved >= MAXPULLDOWNDISTANCE) {
      return;
    }

    animate(y, yDistanceMoved);

    refresherRef.current!.style.setProperty(
      "--refresh-opacity",
      (yDistanceMoved / 65).toString()
    );
    refresherRef.current!.style.setProperty(
      "--refresh-rotation",
      `${(yDistanceMoved / 65) * 360}deg`
    );
  };

  const onTouchEnd = () => {
    if (!isRefreshedEnabled) return;

    if (!shouldTriggerRefresh.current) {
      animate(y, 0);
      refresherRef.current!.style.setProperty("--refresh-opacity", "0");
      refresherRef.current!.style.setProperty("--refresh-rotation", "0deg");
      isDragging.current = false;
      setIsPulling(false);
    } else {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({
          style: ImpactStyle.Medium,
        });
      }
      animate(y, PULLDOWNTHRESHOLD);
      setIsRefreshing(true);

      onRefresh!(() => {
        shouldTriggerRefresh.current = false;
        isDragging.current = false;
        animate(y, 0);
        // mainRef.current!.style.setProperty("--drag-y", `0px`);
        refresherRef.current!.style.setProperty("--refresh-opacity", "0");
        refresherRef.current!.style.setProperty("--refresh-rotation", "0deg");
        setIsPulling(false);
        setIsRefreshing(false);
      });
    }
  };

  useEffect(() => {
    if (!mainRef.current) {
      return;
    }

    const mainEl = mainRef.current;
    childRef.current = mainEl.querySelector<HTMLElement>(":first-child")!;
    mainEl.addEventListener("touchstart", onTouchStart, { passive: true });
    mainEl.addEventListener("touchmove", onTouchMove, { passive: true });
    mainEl.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      mainEl.removeEventListener("touchstart", onTouchStart);
      mainEl.removeEventListener("touchmove", onTouchMove);
      mainEl.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-type="domc-content"
      className="h-full w-full relative flex-grow flex-shrink basis-0"
      style={{
        contain: "size style",
      }}
    >
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <Refresher
          ref={refresherRef}
          isPulling={isPulling}
          isRefreshing={isRefreshing}
        />
      </div>
      <motion.main
        ref={mainRef}
        className={classNames(
          "md:px-safe bg-white dark:bg-black absolute inset-0 overflow-hidden touch-pan-x touch-pan-y touch-pinch-zoom overflow-y-auto overscroll-y-contain z-0 will-change-scroll",
          className ?? ""
        )}
        style={{
          y,
        }}
        transition={{
          type: "spring",
          bounce: 0.5,
        }}
      >
        {children}
      </motion.main>
    </div>
  );
}

Page.Content = Content;

export { Page };
