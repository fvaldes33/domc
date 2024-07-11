import { useDownloadLogFile } from "@/hooks/useDownloadLogFile";
import { getRemoteApiEndpoint } from "@/utils/endpoint";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowEvent } from "@mantine/hooks";
import {
  IconAlertTriangle,
  IconChevronDown,
  IconChevronUp,
  IconLoader,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconRotate,
  IconRotate2,
  IconX,
} from "@tabler/icons-react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Fragment, useEffect, useRef, useState } from "react";
import type { Terminal } from "xterm";
import type { FitAddon } from "xterm-addon-fit";

export interface LogModalProps {
  show: boolean;
  onClose: () => void;
  url?: string;
  type?: string;
}

async function initializeTerminal(el: HTMLDivElement) {
  const Terminal = (await import("xterm")).Terminal;
  const CanvasAddon = (await import("xterm-addon-canvas")).CanvasAddon;
  const FitAddon = (await import("xterm-addon-fit")).FitAddon;

  const xterm = new Terminal({
    convertEol: true,
    fontSize: 8,
    theme: {
      background: "transparent",
    },
  });
  const fitAddon = new FitAddon();
  const canvasAddon = new CanvasAddon();

  xterm.loadAddon(fitAddon);
  xterm.loadAddon(canvasAddon);

  xterm.open(el);
  fitAddon.fit();
  return { xterm, fitAddon, canvasAddon };
}

export function LogModal({ url, show, type, onClose }: LogModalProps) {
  const [mounted, setMounted] = useState(false);
  const xtermRef = useRef<HTMLDivElement>(null);
  const fitAddOnRef = useRef<FitAddon>();
  const instanceRef = useRef<Terminal>();
  const [isRotateMessageVisible, setIsRotateMessageVisible] = useState(true);
  const [instance, setInstance] = useState<Terminal>();
  const [fontSize, setFontSize] = useState<number>(8);
  const [logData, setLogData] = useState<string>("");
  useWindowEvent("resize", () => {
    fitAddOnRef.current?.fit();
  });
  // const { data, isLoading, refetch, isRefetching, isError, error } =
  //   useDownloadLogFile({
  //     url,
  //     onSuccess: async (data) => {
  //       if (instance) {
  //         if (data.success) {
  //           instance.clear();
  //           instance.write(data.content);
  //         }
  //       } else {
  //         const Terminal = (await import("xterm")).Terminal;
  //         const CanvasAddon = (await import("xterm-addon-canvas")).CanvasAddon;
  //         const FitAddon = (await import("xterm-addon-fit")).FitAddon;

  //         const xterm = new Terminal({
  //           convertEol: true,
  //           fontSize: fontSize,
  //           theme: {
  //             background: "transparent",
  //           },
  //         });
  //         const fitAddon = new FitAddon();
  //         const canvasAddon = new CanvasAddon();

  //         xterm.loadAddon(fitAddon);
  //         xterm.loadAddon(canvasAddon);

  //         xterm.open(xtermRef.current!);
  //         fitAddon.fit();

  //         if (data.success) {
  //           xterm.write(data.content);
  //           xterm.scrollToBottom();
  //         }

  //         setInstance(xterm);
  //       }
  //     },
  //   });

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

  // const initializeTerminal = async () => {
  //   const Terminal = (await import("xterm")).Terminal;
  //   const CanvasAddon = (await import("xterm-addon-canvas")).CanvasAddon;
  //   const FitAddon = (await import("xterm-addon-fit")).FitAddon;

  //   const xterm = new Terminal({
  //     convertEol: true,
  //     fontSize: fontSize,
  //     theme: {
  //       background: "transparent",
  //     },
  //   });
  //   const fitAddon = new FitAddon();
  //   const canvasAddon = new CanvasAddon();

  //   xterm.loadAddon(fitAddon);
  //   xterm.loadAddon(canvasAddon);

  //   xterm.open(xtermRef.current!);
  //   fitAddon.fit();
  //   instanceRef.current = xterm;
  // };

  // const startStream = async () => {
  //   if (!url) return;
  //   await initializeTerminal();
  //   try {
  //     const remoteEndpoint = getRemoteApiEndpoint();
  //     const response = await fetch(
  //       `${remoteEndpoint}/api/stream-logs?url=${encodeURIComponent(url)}`
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const reader = response.body?.getReader();
  //     const decoder = new TextDecoder();

  //     if (!reader) {
  //       console.error("Unable to read stream");
  //       return;
  //     }

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       const chunk = decoder.decode(value, { stream: true });
  //       console.log(chunk);
  //       setLogData((prev) => prev + chunk);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching log:", error);
  //   }
  // };

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
            <Dialog.Panel className="relative flex flex-col w-full h-[95svh] pt-safe transform overflow-hidden border dark:border-gray-800 rounded-t-2xl bg-white dark:bg-gray-900 text-left transition-all">
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

              <div className="flex-1 flex flex-col relative">
                <Xterm>
                  {url && (
                    <>
                      <LogStream url={url} />
                      <LogStreamStatus />
                    </>
                  )}
                </Xterm>
              </div>
              {/* {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <IconLoader className="animate-spin" />
                </div>
              )} */}

              {/* {isError && (
                <div className="text-red-500">Something went wrong</div>
              )} */}
              {isRotateMessageVisible && (
                <div className="md:hidden w-full max-w-xs bg-slate-800 rounded-full absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white py-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="shrink-0 pl-4">
                      <IconRotate2 />
                    </span>
                    <p className="flex-1 px-3">Rotate phone to landscape</p>
                    <span className="shrink-0 pr-4">
                      <button
                        className="bg-black rounded-full p-1 h-8 w-8 flex items-center justify-center"
                        onClick={() => setIsRotateMessageVisible(false)}
                      >
                        <IconX size={14} />
                      </button>
                    </span>
                  </div>
                </div>
              )}

              {url && <XtermUtils url={url} />}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

const xtermInstanceAtom = atom<Terminal | null>(null);
const xtermWriteLnAtom = atom(null, (get, _set, update: string) => {
  const xterm = get(xtermInstanceAtom);
  if (xterm) {
    xterm.writeln(update);
  }
});
const xtermWriteAtom = atom(null, (get, _set, update: string) => {
  const xterm = get(xtermInstanceAtom);
  if (xterm) {
    xterm.write(update);
  }
});
const xtermStreamState = atom<"loading" | "error" | "success">("loading");
const xtermErrorAtom = atom<string | null>(null);
const xtermStreamAtom = atom(
  null,
  async (_get, set, data: { url: string; overwrite: boolean }) => {
    const { url, overwrite = true } = data;
    try {
      set(xtermStreamState, "loading");
      const remoteEndpoint = getRemoteApiEndpoint();
      const response = await fetch(
        `${remoteEndpoint}/api/stream-logs?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        console.error("Unable to read stream");
        set(xtermStreamState, "error");
        set(xtermErrorAtom, "Unable to read stream");
        return;
      }
      if (overwrite) {
        set(xtermWriteAtom, "");
      }
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        set(xtermWriteLnAtom, chunk);
      }
      set(xtermStreamState, "success");
    } catch (error) {
      console.error("Error fetching log:", error);
      set(xtermStreamState, "error");
      set(xtermErrorAtom, "Error fetching log");
    }
  }
);

function Xterm({ children }: { children: React.ReactNode }) {
  const mounted = useRef<boolean>(false);
  const xtermRef = useRef<HTMLDivElement>(null);
  const setXtermInstance = useSetAtom(xtermInstanceAtom);

  useEffect(() => {
    if (!xtermRef.current) return;
    if (!mounted.current) {
      initializeTerminal(xtermRef.current).then(({ xterm }) => {
        setXtermInstance(xterm);
      });
    }
    mounted.current = true;
  }, [setXtermInstance]);

  return (
    <>
      <div
        ref={xtermRef}
        className="w-screen overflow-auto flex-1 mb-safe"
      ></div>
      {children}
    </>
  );
}

function LogStream({ url }: { url: string }) {
  const xtermInstance = useAtomValue(xtermInstanceAtom);
  const stream = useSetAtom(xtermStreamAtom);

  useEffect(() => {
    if (!xtermInstance) return;
    stream({ url, overwrite: true });
  }, [xtermInstance, url, stream]);
  return null;
}

function LogStreamStatus() {
  const state = useAtomValue(xtermStreamState);
  const error = useAtomValue(xtermErrorAtom);
  if (state === "loading") {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white backdrop-blur-sm">
        <IconLoader className="animate-spin" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white backdrop-blur-sm">
        <div className="border border-ocean-2 rounded-md px-6 py-3 flex items-center gap-x-2">
          <IconAlertTriangle /> {error}
        </div>
      </div>
    );
  }

  return null;
}

function XtermUtils({ url }: { url: string }) {
  const xtermInstance = useAtomValue(xtermInstanceAtom);
  const [fontSize, setFontSize] = useState<number>(8);
  const stream = useSetAtom(xtermStreamAtom);

  const changeFontSize = (size: number) => {
    if (!xtermInstance) return;
    xtermInstance.options.fontSize = size;
    setFontSize(size);
  };

  const onRefetch = () => {
    if (!xtermInstance) return;
    stream({ url, overwrite: true });
  };

  return (
    <div className="z-50 py-4 px-6 bg-slate-800 rounded-full absolute bottom-4 mb-safe left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
      <button
        className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center"
        onClick={() => {
          xtermInstance?.scrollToTop();
        }}
      >
        <IconChevronUp size={20} />
      </button>
      <button
        className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center"
        onClick={() => {
          xtermInstance?.scrollToBottom();
        }}
      >
        <IconChevronDown size={20} />
      </button>
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
        onClick={onRefetch}
      >
        <IconRefresh
          size={20}
          // className={isRefetching ? "animate-spin" : ""}
        />
      </button>
    </div>
  );
}
