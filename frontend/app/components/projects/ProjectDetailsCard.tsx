"use client";

import Card from "../Card";
import type { Project } from "../../services/projects.service";
import { formatBudget } from "../../utils/format";
import ProjectStatusBadge from "./ProjectStatusBadge";
import InlineNotice from "../common/InlineNotice";

export default function ProjectDetailsCard(props: {
  subtitle: string;
  loading: boolean;
  err: string | null;
  project: (Project & { clientId: string }) | null;
}) {
  const { subtitle, loading, err, project } = props;

  return (
    <Card title="Details" subtitle={subtitle}>
      {err ? (
        <InlineNotice variant="error" title="Failed to load">
          {err}
        </InlineNotice>
      ) : loading ? (
        <div className="space-y-3">
          <div className="h-6 rounded bg-gray-100 animate-pulse" />
          <div className="h-20 rounded bg-gray-100 animate-pulse" />
        </div>
      ) : !project ? (
        <p className="text-sm text-gray-700">Project not found.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-gray-900">
              {project.title}
            </p>
            <ProjectStatusBadge status={project.status} />
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-line">
            {project.description}
          </p>

          <p className="text-sm text-gray-600">
            Budget: <b>{formatBudget(project.budgetMin, project.budgetMax)}</b>
          </p>

          <p className="text-xs text-gray-500">
            Created: {new Date(project.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </Card>
  );
}
