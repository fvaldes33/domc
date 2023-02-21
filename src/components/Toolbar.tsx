import { classNames } from "@/utils/classNames";

function Toolbar({
  border = false,
  position = "top",
  children,
}: {
  border?: boolean;
  position?: "bottom" | "top";
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames(
        position === "top" ? "pt-safe" : "pb-safe",
        border ? (position === "top" ? "border-b" : "border-t") : ""
      )}
    >
      <div
        className="p-1 w-full min-h-[44px] relative flex flex-row items-center justify-between overflow-hidden z-10 md:px-safe"
        style={{
          contain: "content",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export type TitleProps = React.ComponentPropsWithoutRef<"div"> & {
  centered?: boolean;
};
function Title({ centered = true, children }: TitleProps) {
  return (
    <div
      className={classNames(
        "absolute inset-0 text-base font-semibold p-1 dark:text-white",
        centered ? "text-center px-14" : "text-left"
      )}
    >
      <div className="flex items-center h-full">
        <div className="w-full truncate overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

Toolbar.Title = Title;

export { Toolbar };
