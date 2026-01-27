import type { Project } from "../../services/projects.service";
import { formatProjectStatus, statusBadgeClass } from "../../utils/format";

export default function StatusBadge({ status }: { status: Project["status"] }) {
  const label = formatProjectStatus(status);
  const cls = statusBadgeClass(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}
