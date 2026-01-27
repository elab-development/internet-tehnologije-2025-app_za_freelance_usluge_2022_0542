import type { Project } from "../services/projects.service";
import { formatProjectStatus, statusBadgeClass } from "../utils/format";

export default function ProjectStatusBadge({
  status,
}: {
  status: Project["status"];
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(
        status,
      )}`}
    >
      {formatProjectStatus(status)}
    </span>
  );
}
