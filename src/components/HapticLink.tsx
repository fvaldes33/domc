import { useGetPreference } from "@/hooks/usePreferences";
import { ENABLE_HAPTIC_FEEDBACK } from "@/utils/const";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

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
  const { data: enabledHapticFeedback } = useGetPreference<boolean>({
    key: ENABLE_HAPTIC_FEEDBACK,
    defaultValue: true,
  });

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e, ...args) => {
    if (Capacitor.isNativePlatform() && enabledHapticFeedback) {
      Haptics.impact({
        style: ImpactStyle.Light,
      });
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
