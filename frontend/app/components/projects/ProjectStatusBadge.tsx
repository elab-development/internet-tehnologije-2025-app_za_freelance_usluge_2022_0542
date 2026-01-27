"use client";

import {
  formatProjectStatus,
  statusBadgeClass,
  type ProjectStatus,
} from "../../utils/format";

export default function ProjectStatusBadge(props: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(
        props.status,
      )}`}
    >
      {formatProjectStatus(props.status)}
    </span>
  );
}
