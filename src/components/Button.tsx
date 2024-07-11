import { IconLoader } from "@tabler/icons-react";
import React, { forwardRef } from "react";

import { classNames } from "@/utils/classNames";
import type { PolymorphicRef, PolymorphicComponentProps } from "@/types";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useGetPreference } from "@/hooks/usePreferences";
import { ENABLE_HAPTIC_FEEDBACK } from "@/utils/const";

export interface ButtonBaseProps {
  variant?: "primary" | "outline" | "light" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  square?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  full?: boolean;
  block?: boolean;
}

export type ButtonProps<C extends React.ElementType> =
  PolymorphicComponentProps<C, ButtonBaseProps>;

type ButtonComponent = <C extends React.ElementType = "button">(
  props: ButtonProps<C>
) => React.ReactElement | null;

const defaultWrapperClass = [
  "appearance-none",
  "inline-block",
  "relative",
  "font-semibold",
  "rounded-md",
  "overflow-hidden",
  "whitespace-nowrap",
  "leading-none",
  "select-none",
  "w-auto",
  "ease transition-all duration-75",
  "active:scale-95",
  "focus:outline-none focus:ring-2",
  "disabled:opacity-50",
];

const sizeMap = {
  xs: ["h-6", "text-xs", "px-3"],
  sm: ["h-8", "text-xs", "px-4"],
  md: ["h-11", "text-sm", "px-6"],
  lg: ["h-12", "text-base", "px-8"],
};

const variantClasses = {
  primary: [
    "bg-ocean-2",
    "text-white",
    "focus:ring-ocean-2 focus:ring-offset-2 focus:ring-ocean-2",
  ],
  light: [
    "text-ocean-2",
    "bg-white",
    "focus:ring-ocean-2 focus:ring-offset-2 focus:ring-ocean-2",
  ],
  danger: [
    "bg-red-600",
    "text-white",
    "focus:ring-red-600 focus:ring-offset-2 focus:ring-ocean-2",
  ],
  outline: [
    "border",
    "border-ocean-2",
    "text-ocean-2 dark:text-white",
    "focus:ring-ocean-2 focus:ring-offset-2 focus:ring-ocean-2",
  ],
};

const Button: ButtonComponent = forwardRef(function Button<
  C extends React.ElementType = "button"
>(
  {
    component,
    children,
    variant = "primary",
    size = "md",
    loading = false,
    square = false,
    leftIcon,
    rightIcon,
    className,
    full,
    block,
    ...props
  }: ButtonProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component || "button";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeMap[size];
  const { data: enabledHapticFeedback } = useGetPreference<boolean>({
    key: ENABLE_HAPTIC_FEEDBACK,
    defaultValue: true,
  });

  const renderLeftSection = () => {
    if (loading) {
      return (
        <IconLoader size={16} className="mr-2 animate-spin transition-all" />
      );
    }

    return leftIcon;
  };

  const onClick: React.MouseEventHandler = (...args) => {
    if (Capacitor.isNativePlatform() && enabledHapticFeedback) {
      Haptics.impact({
        style: ImpactStyle.Light,
      });
    }

    if (props.onClick) {
      props.onClick(...args);
    }
  };

  return (
    <Component
      {...props}
      onClick={onClick}
      ref={ref}
      disabled={loading}
      className={classNames(
        defaultWrapperClass.join(" "),
        variantClass.join(" "),
        square
          ? `aspect-square ${sizeClass.slice(0, 1).join(" ")}`
          : sizeClass.join(" "),
        className,
        full ? "!w-full !rounded-none" : "",
        block ? "!w-full" : ""
      )}
    >
      <div
        className={classNames("flex items-center justify-center h-full w-full")}
      >
        {renderLeftSection()}
        <span>{children}</span>
        {rightIcon && rightIcon}
      </div>
    </Component>
  );
});

export { Button };
