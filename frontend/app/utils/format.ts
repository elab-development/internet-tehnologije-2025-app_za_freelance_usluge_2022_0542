export function formatBudget(min: number | null, max: number | null) {
  if (min == null && max == null) return "Not specified";
  if (min != null && max == null) return `From ${min}`;
  if (min == null && max != null) return `Up to ${max}`;
  return `${min} - ${max}`;
}

export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export function formatProjectStatus(status: ProjectStatus) {
  return status === "OPEN"
    ? "Open"
    : status === "IN_PROGRESS"
      ? "In progress"
      : status === "DONE"
        ? "Done"
        : "Cancelled";
}

export function statusBadgeClass(status: ProjectStatus) {
  return status === "OPEN"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : status === "IN_PROGRESS"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : status === "DONE"
        ? "bg-gray-100 text-gray-800 border-gray-200"
        : "bg-red-50 text-red-700 border-red-200";
}
