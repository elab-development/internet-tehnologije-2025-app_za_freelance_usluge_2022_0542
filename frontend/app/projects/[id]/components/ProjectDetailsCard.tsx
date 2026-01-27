import Card from "../../../components/Card";
import type { Project } from "../../../services/projects.service";
import { formatBudget } from "../../../utils/format";

export default function ProjectDetailsCard({
  loading,
  err,
  project,
}: {
  loading: boolean;
  err: string | null;
  project: (Project & { clientId: string }) | null;
}) {
  return (
    <Card title="Details" subtitle="Public project information">
      {err ? (
        <p className="text-sm text-red-600">{err}</p>
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
            <span className="text-xs rounded-full border px-2.5 py-1 bg-gray-50 text-gray-700">
              {project.status}
            </span>
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
