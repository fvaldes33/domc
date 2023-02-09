import { classNames } from "@/utils/classNames";
import { IconLoader } from "@tabler/icons-react";
import { motion, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const MotionIconLoader = motion(IconLoader);

export function Refresher({
  isPulling = false,
  isRefreshing = false,
  r,
}: {
  isPulling?: boolean;
  isRefreshing?: boolean;
  r: any;
}) {
  return (
    <div className="absolute w-full h-16 pointer-events-none z-[-1] top-0 left-0">
      <div
        data-type="refresher-content"
        className="flex flex-col items-center h-full"
      >
        <div
          data-type="refresher-pulling"
          className={classNames(
            "w-full items-center justify-center",
            isPulling || isRefreshing ? "flex" : "hidden"
          )}
        >
          {isRefreshing ? (
            <IconLoader className="animate-spin" />
          ) : (
            <MotionIconLoader style={{ rotate: r }} />
          )}
        </div>
      </div>
    </div>
  );
}
