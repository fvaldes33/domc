import { classNames } from "@/utils/classNames";

export function Footer({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={classNames("relative w-full z-10", className ?? "")}
      role="contentinfo"
      {...props}
    >
      {children}
    </div>
  );
}
