import {
  IconQuestionCircle,
  IconClockCancel,
  IconTools,
  IconUpload,
  IconCheck,
  IconX,
  IconLoader,
} from "@tabler/icons-react";

export const DeploymentPhaseMap = new Map<string, React.FC>([
  [
    "ACTIVE",
    () => (
      <span className="px-2 py-1 bg-green-400 text-white text-sm rounded-md uppercase">
        Live
      </span>
    ),
  ],
  ["UNKNOWN", () => <IconQuestionCircle />],
  ["PENDING_BUILD", () => <IconClockCancel />],
  ["PENDING_DEPLOY", () => <IconClockCancel />],
  ["BUILDING", () => <IconLoader className="animate-spin" />],
  ["DEPLOYING", () => <IconLoader className="animate-spin" />],
  ["SUPERSEDED", () => <IconCheck />],
  ["ERROR", () => <IconX />],
  ["CANCELED", () => <IconClockCancel />],
]);
