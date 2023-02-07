import { Dialog, Transition } from "@headlessui/react";
import { IconX } from "@tabler/icons-react";
import { Fragment, useEffect, useRef, useState } from "react";

export interface LogModalProps {
  show: boolean;
  onClose: () => void;
  contents?: string;
  type?: string;
}

export function LogModal({ contents, show, type, onClose }: LogModalProps) {
  const xtermRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<any>(null);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  const loadLogs = async () => {
    if (!contents) return;

    setShowLogs(true);

    const Terminal = (await import("xterm")).Terminal;
    const CanvasAddon = (await import("xterm-addon-canvas")).CanvasAddon;
    const FitAddon = (await import("xterm-addon-fit")).FitAddon;

    const xterm = new Terminal({
      convertEol: true,
      fontSize: 10,
      theme: {
        background: "transparent",
      },
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new CanvasAddon());

    xterm.open(xtermRef.current!);
    fitAddon.fit();

    xterm.write(contents);

    setTerminal(xterm);
  };

  const onBeforeClose = () => {
    setShowLogs(false);
    terminal && terminal.dispose();
    onClose();
  };

  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={onBeforeClose}>
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
        <div className="fixed inset-x-0 bottom-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-full"
          >
            <Dialog.Panel className="relative flex flex-col w-full h-[95vh] pt-safe pb-safe transform overflow-hidden border dark:border-gray-800 rounded-t-2xl bg-white dark:bg-gray-900 text-left transition-all">
              <button
                onClick={onBeforeClose}
                className="h-8 w-8 bg-black text-white flex items-center justify-center rounded-full top-3 right-4 absolute"
              >
                <IconX />
              </button>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 p-4 border-b flex-shrink-0 dark:text-white"
              >
                <span>Log - {type}</span>
              </Dialog.Title>
              {!showLogs && (
                <div className="p-4 flex flex-col items-center">
                  <button
                    onClick={loadLogs}
                    className="px-2 py-1 bg-ocean-2 text-white rounded-md"
                  >
                    Show
                  </button>
                </div>
              )}
              <div
                ref={xtermRef}
                className="max-w-full overflow-y-auto flex-1"
              ></div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
