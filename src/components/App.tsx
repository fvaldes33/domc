import { classNames } from "@/utils/classNames";

interface AppProps extends React.ComponentPropsWithoutRef<"div"> {}

export function App({ children, ...props }: AppProps) {
  return (
    <div
      data-type="domc-app"
      className={classNames(
        "absolute inset-0 flex flex-col justify-between overflow-hidden z-0 bg-white text-black dark:bg-black dark:text-white",
        props.className ?? ""
      )}
      style={{
        contain: "layout size style",
      }}
    >
      {children}
    </div>
  );
}
