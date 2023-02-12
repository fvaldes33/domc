import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

type LinkComponent = React.ForwardRefExoticComponent<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
    } & React.RefAttributes<HTMLAnchorElement>
>;

const HapticLink: LinkComponent = forwardRef(function HapticLink(
  { children, ...props },
  ref
) {
  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (...args) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({
        style: ImpactStyle.Light,
      });
    }

    if (props.onClick) {
      props.onClick(...args);
    }
  };

  return (
    <Link ref={ref} {...props} onClick={onClick}>
      {children}
    </Link>
  );
});

export default HapticLink;
