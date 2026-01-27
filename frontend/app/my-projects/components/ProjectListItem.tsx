"use client";

import Button from "../../components/Button";
import type { Project } from "../../services/projects.service";
import { formatBudget } from "../../utils/format";
import StatusBadge from "./StatusBadge";

export default function ProjectListItem({
  project,
  onView,
}: {
  project: Project;
  onView: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {project.title}
            </p>
            <StatusBadge status={project.status} />
          </div>

          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Budget: {formatBudget(project.budgetMin, project.budgetMax)} •
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(project.id)}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
