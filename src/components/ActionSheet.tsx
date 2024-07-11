import { classNames } from "@/utils/classNames";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface ActionSheetProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function ActionSheet({ show, onClose, children }: ActionSheetProps) {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
        </Transition.Child>
        <div className="fixed bottom-4 inset-x-4 pb-safe">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-full"
          >
            <Dialog.Panel className="w-full mx-auto max-w-md transform overflow-hidden border dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 text-left transition-all">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

function ActionSheetLabel({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="flex items-center justify-center h-16 border-b dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 px-4">
      {children}
    </div>
  );
}

function ActionSheetContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={classNames(
        "border-b dark:border-gray-700 px-4",
        className ?? ""
      )}
    >
      {children}
    </div>
  );
}

function ActionSheetButton({
  children,
  className,
  border = true,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { border?: boolean }) {
  return (
    <button
      className={classNames(
        "flex items-center justify-center text-center w-full p-4 h-16 font-semibold dark:text-white",
        className ?? "",
        border ? "border-b dark:border-gray-700" : ""
      )}
      {...props}
    >
      {children}
    </button>
  );
}

ActionSheet.Label = ActionSheetLabel;
ActionSheet.Button = ActionSheetButton;
ActionSheet.Content = ActionSheetContent;
export { ActionSheet };
