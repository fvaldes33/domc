/* eslint-disable @next/next/no-img-element */
import { classNames } from "@/utils/classNames";
import { IconLoader } from "@tabler/icons-react";
import { motion, MotionValue } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import waves from "@/assets/waves.gif";

const MotionIconLoader = motion(IconLoader);

interface RefresherProps {
  isPulling?: boolean;
  isRefreshing?: boolean;
}

export const Refresher = forwardRef<HTMLDivElement, RefresherProps>(
  function Refresher({ isPulling, isRefreshing, ...props }, ref) {
    return (
      <div
        className="absolute w-full h-16 pointer-events-none z-[-1] top-0 left-0"
        ref={ref}
        {...props}
      >
        <div
          data-type="refresher-content"
          className="flex flex-col items-center h-full"
        >
          <div
            data-type="refresher-pulling"
            className={classNames(
              "w-full h-full items-center justify-center relative z-20 ",
              isPulling || isRefreshing ? "flex" : "hidden"
            )}
          >
            {isRefreshing ? (
              <IconLoader className="animate-spin" />
            ) : (
              <IconLoader
                style={{
                  transform: `rotate(var(--refresh-rotation))`,
                }}
              />
            )}
          </div>
          <motion.div
            className="absolute inset-0 -mx-4 overflow-visible z-10"
            style={{
              opacity: "var(--refresh-opacity, 0)",
            }}
          >
            <img src={waves.src} className="dark:invert" alt="" />
          </motion.div>
        </div>
      </div>
    );
  }
);
