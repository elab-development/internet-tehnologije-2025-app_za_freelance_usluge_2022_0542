"use client";

import Button from "../Button";
import ProjectStatusBadge from "./ProjectStatusBadge";
import type { Project } from "../../services/projects.service";
import { formatBudget } from "../../utils/format";

type Props =
  | {
      project: Project;
      ctaLabel: string;
      onClick: () => void;
      onView?: never;
    }
  | {
      project: Project;
      onView: (id: string) => void;
      ctaLabel?: string;
      onClick?: never;
    };

export default function ProjectListItem(props: Props) {
  const { project } = props;

  const label = "ctaLabel" in props && props.ctaLabel ? props.ctaLabel : "View";

  const handleClick =
    "onClick" in props && props.onClick
      ? props.onClick
      : "onView" in props && props.onView
        ? () => props.onView(project.id)
        : undefined;

  return (
    <div className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {project.title}
            </p>
            <ProjectStatusBadge status={project.status} />
          </div>

          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Budget: {formatBudget(project.budgetMin, project.budgetMax)} •
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="shrink-0">
          <Button variant="outline" size="sm" onClick={handleClick}>
            {label}
          </Button>
        </div>
      </div>
    </div>
  );
}
