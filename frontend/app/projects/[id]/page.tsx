"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";

import { useProjectDetail } from "./hooks/useProjectDetail";
import ProjectDetailsCard from "./components/ProjectDetailsCard";
import BidFormCard from "./components/BidFormCard";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  const { user, isAuthed } = useAuth();
  const { isClient, project, loading, err } = useProjectDetail(projectId);

  const isFreelancer = useMemo(
    () => isAuthed && user?.role === "FREELANCER",
    [isAuthed, user?.role],
  );

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border bg-white p-4 shadow-sm text-sm text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Project</h1>
            <p className="text-sm text-gray-600">Details and actions.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/projects")}>
              Back
            </Button>
            {user?.role === "CLIENT" ? (
              <Button onClick={() => router.push("/my-projects")}>
                My projects
              </Button>
            ) : null}
          </div>
        </div>

        <ProjectDetailsCard loading={loading} err={err} project={project} />

        {/* Freelancer-only bid form */}
        {projectId && isFreelancer ? (
          <BidFormCard projectId={projectId} />
        ) : null}
      </div>
    </div>
  );
}
