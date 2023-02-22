import { useDownloadLogFile } from "@/hooks/useDownloadLogFile";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowEvent } from "@mantine/hooks";
import {
  IconLoader,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconRotate,
  IconRotate2,
  IconX,
} from "@tabler/icons-react";
import { Fragment, useEffect, useRef, useState } from "react";
import type { Terminal } from "xterm";
import type { FitAddon } from "xterm-addon-fit";

export interface LogModalProps {
  show: boolean;
  onClose: () => void;
  url?: string;
  type?: string;
}

export function LogModal({ url, show, type, onClose }: LogModalProps) {
  const xtermRef = useRef<HTMLDivElement>(null);
  const fitAddOnRef = useRef<FitAddon>();

  const [instance, setInstance] = useState<Terminal>();
  const [fontSize, setFontSize] = useState<number>(8);
  useWindowEvent("resize", () => {
    fitAddOnRef.current?.fit();
  });
  const { data, isLoading, refetch, isRefetching } = useDownloadLogFile({
    url,
    onSuccess: async (data) => {
      if (instance) {
        if (data.success) {
          instance.clear();
          instance.write(data.content);
        }
      } else {
        const Terminal = (await import("xterm")).Terminal;
        const CanvasAddon = (await import("xterm-addon-canvas")).CanvasAddon;
        const FitAddon = (await import("xterm-addon-fit")).FitAddon;

        const xterm = new Terminal({
          convertEol: true,
          fontSize: fontSize,
          theme: {
            background: "transparent",
          },
        });
        const fitAddon = new FitAddon();
        const canvasAddon = new CanvasAddon();

        xterm.loadAddon(fitAddon);
        xterm.loadAddon(canvasAddon);

        xterm.open(xtermRef.current!);
        fitAddon.fit();

        if (data.success) {
          xterm.write(data.content);
          xterm.scrollToBottom();
        }

        setInstance(xterm);
      }
    },
  });

  useEffect(() => {
    if (!show) {
      setInstance(undefined);
    }

    return () => {
      setInstance(undefined);
    };
  }, [show]);

  const changeFontSize = (size: number) => {
    if (!instance) return;
    instance.options.fontSize = size;
    // instance.resize(instance.cols, instance.rows);
    setFontSize(size);
    // refetch();
  };

  const onBeforeClose = () => {
    instance && instance.dispose();
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
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white capitalize"
                >
                  <span>{type?.toLowerCase()} Log</span>
                </Dialog.Title>
              </div>
              <div
                ref={xtermRef}
                className="w-[200vw] overflow-auto flex-1 mb-safe"
              ></div>
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <IconLoader className="animate-spin" />
                </div>
              )}

              <div className="md:hidden bg-slate-800 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white px-6 py-2 text-sm">
                <div className="flex items-center space-x-2">
                  <IconRotate2 />
                  <p>Rotate phone to landscape</p>
                </div>
              </div>

              <div className="z-50 py-4 px-6 bg-slate-800 rounded-full absolute bottom-4 mb-safe left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                <button
                  className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center"
                  onClick={() => {
                    const newFontSize = Math.max(8, fontSize - 1);
                    changeFontSize(newFontSize);
                  }}
                >
                  <IconMinus size={20} />
                </button>
                <button
                  className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center"
                  onClick={() => {
                    changeFontSize(fontSize + 2);
                  }}
                >
                  <IconPlus size={20} />
                </button>
                <button
                  className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center"
                  onClick={() => refetch()}
                >
                  <IconRefresh
                    size={20}
                    className={isRefetching ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
