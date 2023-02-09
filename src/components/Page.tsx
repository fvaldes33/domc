import { classNames } from "@/utils/classNames";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Refresher } from "./Refresher";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-type="domc-page"
      className="absolute inset-0 flex flex-col justify-between overflow-hidden select-none z-10"
      style={{
        contain: "layout size style",
      }}
    >
      {children}
    </div>
  );
}

function Content({
  onRefresh,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"main"> & {
  onRefresh?: (complete: () => void) => Promise<void> | void;
}) {
  const y = useMotionValue(0);
  const rotate = useTransform(y, [0, 64], [0, 360], { clamp: false });
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const enableRefresh = Boolean(onRefresh);

  return (
    <div
      data-type="domc-content"
      className="h-full w-full relative flex-grow flex-shrink basis-0"
      style={{
        contain: "size style",
      }}
    >
      {enableRefresh && (
        <div className="absolute inset-0 pointer-events-none z-[-1]">
          <Refresher
            r={rotate}
            isPulling={isPulling}
            isRefreshing={isRefreshing}
          />
        </div>
      )}
      <motion.main
        drag={enableRefresh && "y"}
        dragConstraints={{ top: 0, bottom: isRefreshing ? 64 : 0 }}
        onDragStart={(e, info) => {
          setIsPulling(true);
        }}
        onDragEnd={(e, info) => {
          if (info.offset.y >= 160) {
            y.updateAndNotify(64, true);
            setIsRefreshing(true);
            if (onRefresh) {
              onRefresh(() => {
                setIsRefreshing(false);
              });
            } else {
              setTimeout(() => {
                setIsRefreshing(false);
              }, 2000);
            }
          } else {
            setIsPulling(false);
          }
        }}
        style={{ y }}
        className={classNames(
          "bg-white dark:bg-black absolute inset-0 overflow-hidden touch-pan-x touch-pan-y touch-pinch-zoom overflow-y-auto overscroll-y-contain z-0 will-change-scroll",
          className ?? ""
        )}
        // {...props}
      >
        {children}
      </motion.main>
    </div>
  );
}

Page.Content = Content;

export { Page };
