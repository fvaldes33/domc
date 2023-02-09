import {
  IconActivity,
  IconCircleCheck,
  IconCircleX,
  IconFileCode,
  IconFileUnknown,
  IconLoader,
  IconStatusChange,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { AppDeploymentLogType } from "dots-wrapper/dist/app";
import { Button } from "konsta/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { AppRollback } from "@/components/AppRollback";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import {
  useGetAppDeployment,
  useGetAppDeploymentLogs,
  useGetAppDetails,
} from "@/hooks/useApps";
import { DeploymentPhaseMap } from "@/utils/deployment-phases";
import toast from "react-hot-toast";
import { useState } from "react";
import { LogModal, LogModalProps } from "@/components/LogModal";

export default function DeploymentDetails() {
  const { query } = useRouter();
  const { data: app } = useGetAppDetails({
    app_id: query.appId as string,
  });
  const { data, isLoading, isError, refetch } = useGetAppDeployment({
    app_id: query.appId as string,
    deployment_id: query.deployId as string,
  });
  const getAppDeploymentLogs = useGetAppDeploymentLogs();

  const [logModalProps, setLogModalProps] = useState<
    Omit<LogModalProps, "onClose">
  >({
    show: false,
  });

  if (isError) {
    return (
      <Page>
        <MainNavbar />
        <Page.Content>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4">
              <p className="text-2xl font-bold">Sorry</p>
              <p className="mb-2">Something went wrong!</p>
              <Link href="/" passHref>
                <Button large tonal>
                  Go back
                </Button>
              </Link>
            </div>
          </div>
        </Page.Content>
      </Page>
    );
  }

  const Phase =
    DeploymentPhaseMap.get(data?.deployment.phase ?? "") ??
    (() => <IconFileUnknown />);

  const getLogsForComponent = (
    type: AppDeploymentLogType,
    component_name: string
  ) => {
    if (!app || !data) return;

    getAppDeploymentLogs.mutate(
      {
        app_id: app?.id,
        deployment_id: data.deployment.id,
        component_name,
        type,
      },
      {
        onSuccess: (data) => {
          if (data.historic_urls.length) {
            const [url] = data.historic_urls;
            setLogModalProps({
              show: true,
              url,
              type,
            });
          }
        },
        onError: (error: any) => {
          console.log("getLogsForComponent", error);
          toast.error(error.message);
        },
      }
    );
  };

  const renderOutcome = () => {
    const wasSuccessful = data?.deployment.progress.steps.every(
      (s) => s.status === "SUCCESS"
    );
    if (wasSuccessful) {
      return (
        <div className="flex items-center">
          <IconCircleCheck size={24} className="text-green-600" />
          <p className="ml-2">Deployed successfully!</p>
        </div>
      );
    }

    const errorStep = data?.deployment.progress.steps.find(
      (s) => s.status === "ERROR"
    );
    return (
      <>
        <div className="flex items-center">
          <IconCircleX size={24} className="text-red-600" />
          <p className="ml-2">
            {/* @ts-ignore */}
            {errorStep?.status}: {errorStep?.reason.code}
          </p>
        </div>
        {/* <div>
          <button className="h-8 bg-indigo-100 rounded-md flex items-center justify-center text-sm text-indigo-600 px-4">
            Retry
          </button>
        </div> */}
      </>
    );
  };

  return (
    <Page>
      <MainNavbar title={app?.spec.name ?? ""} />
      <Page.Content
        onRefresh={async (complete) => {
          await refetch();
          complete();
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                <IconActivity className="" size={20} strokeWidth={1.5} />
                <span className="ml-2 uppercase">Deployment</span>
              </p>
            </div>

            <div className="px-4 mb-4">
              <div className="p-4 bg-indigo-50 rounded-lg text-slate-800 flex items-start">
                <Phase />
                <p className="ml-2">
                  {data.deployment.cause === "manual"
                    ? "forced a rebuild and deployment"
                    : data.deployment.cause}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                <IconStatusChange className="" size={20} strokeWidth={1.5} />
                <span className="ml-2 uppercase">Status</span>
              </p>
              <div className="p-4 flex items-center justify-between">
                {renderOutcome()}
              </div>
            </div>

            {data.deployment.spec?.services?.map((service) => {
              const source =
                service.github?.deploy_on_push ??
                service.gitlab?.deploy_on_push ??
                service.git?.repo_clone_url;
              const branch =
                service.github?.branch ??
                service.gitlab?.branch ??
                service.git?.branch;

              return (
                <div className="" key={service.name}>
                  <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
                    <IconFileCode className="" size={20} strokeWidth={1.5} />
                    <span className="ml-2 uppercase">Trigger</span>
                  </p>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p>Source</p>
                    <p className="text-gray-600 dark:text-gray-200">
                      {source ? "Push" : "Unknown"}
                    </p>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p>Branch</p>
                    <p className="text-gray-600 dark:text-gray-200">{branch}</p>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p>Time</p>
                    <p className="text-gray-600 dark:text-gray-200">
                      {dayjs(data.deployment.created_at).format(
                        "MMM DD, YYYY HH:mm:ss A"
                      )}
                    </p>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p>Build Log</p>
                    <button
                      onClick={() => getLogsForComponent("BUILD", service.name)}
                      className="text-sm px-4 bg-ocean-2 text-white rounded-md h-8 flex items-center justify-center font-semibold transform transition-transform duration-75 active:scale-95"
                    >
                      Open
                    </button>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p>Deploy Log</p>
                    <button
                      onClick={() =>
                        getLogsForComponent("DEPLOY", service.name)
                      }
                      className="text-sm px-4 bg-ocean-2 text-white rounded-md h-8 flex items-center justify-center font-semibold transform transition-transform duration-75 active:scale-95"
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </Page.Content>
      {data && (
        <AppRollback
          appId={query.appId as string}
          deployment={data.deployment}
        />
      )}
      <LogModal
        {...logModalProps}
        onClose={() => {
          setLogModalProps({
            show: false,
            url: undefined,
            type: undefined,
          });
        }}
      />
      {getAppDeploymentLogs.isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <IconLoader className="animate-spin" />
        </div>
      )}
    </Page>
  );
}
