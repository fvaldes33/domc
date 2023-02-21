import { forceIapAtom } from "@/utils/iap";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useSetAtom } from "jotai";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";
import { useMissionControl } from "./MissionControlProvider";

type LinkComponent = React.ForwardRefExoticComponent<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
      forcePaid?: boolean;
    } & React.RefAttributes<HTMLAnchorElement>
>;

const HapticLink: LinkComponent = forwardRef(function HapticLink(
  { children, forcePaid = true, ...props },
  ref
) {
  const { isPaid } = useMissionControl();
  const setForceIAP = useSetAtom(forceIapAtom);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e, ...args) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({
        style: ImpactStyle.Light,
      });

      if (
        forcePaid &&
        !isPaid &&
        !["/", "/settings"].includes(props.href as string)
      ) {
        e.preventDefault();
        setForceIAP(true);
      }
    }

    if (props.onClick) {
      props.onClick(e, ...args);
    }
  };

  return (
    <Link ref={ref} {...props} onClick={onClick}>
      {children}
    </Link>
  );
});

export default HapticLink;
