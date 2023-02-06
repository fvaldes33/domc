import { IApp } from "dots-wrapper/dist/app";
import { useCallback } from "react";

export function AppStatus({ app }: { app: IApp }) {
  const getCurrentStatus = useCallback(() => {
    if (!app) return null;
    const current = app.in_progress_deployment ?? app.active_deployment;
    switch (current.phase) {
      case "PENDING_BUILD":
      case "BUILDING":
      case "PENDING_DEPLOY":
      case "DEPLOYING":
        return (
          <div className="h-3 w-3 bg-yellow-600 rounded-full ring-1 ring-offset-2 ring-yellow-600 mr-2"></div>
        );
      case "ERROR":
      case "CANCELED":
        return (
          <div className="h-3 w-3 bg-red-600 rounded-full ring-1 ring-offset-2 ring-red-600 mr-2"></div>
        );
      default:
        return (
          <div className="h-3 w-3 bg-green-600 rounded-full ring-1 ring-offset-2 ring-green-600 mr-2"></div>
        );
    }
  }, [app]);

  return (
    <div className="flex items-center text-xs">
      {getCurrentStatus()}
      <p className="capitalize">
        {app.in_progress_deployment?.phase.toLowerCase() ??
          app.active_deployment.phase.toLowerCase()}
      </p>
    </div>
  );
}
