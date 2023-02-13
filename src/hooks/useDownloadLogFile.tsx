import { getRemoteApiEndpoint } from "@/utils/endpoint";
import { fireEvent } from "@/utils/fire-event";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type IDownloadLogResponse =
  | {
      success: true;
      content: string;
    }
  | {
      success: false;
      error: string;
    };

async function downloadLogFile({
  url,
}: {
  url?: string;
}): Promise<IDownloadLogResponse> {
  if (!url) {
    throw new Error("URL is required");
  }

  const remoteEndpoint = getRemoteApiEndpoint();

  const res = await fetch(`${remoteEndpoint}/api/download-logs`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      url,
    }),
  });

  fireEvent({
    name: "action_taken",
    params: {
      action_type: "downloadLogFile",
      action_result: res.ok,
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  const data = await res.json();
  return data;
}

type UseDownloadLogFileOptions = Omit<
  UseQueryOptions<
    IDownloadLogResponse,
    unknown,
    IDownloadLogResponse,
    (string | undefined)[]
  >,
  "initialData"
> & {
  url?: string;
};

export function useDownloadLogFile({
  url,
  ...options
}: UseDownloadLogFileOptions) {
  return useQuery({
    queryKey: ["logs", url],
    queryFn: () => downloadLogFile({ url }),
    enabled: Boolean(url),
    ...options,
  });
}
