"use client";

import { useParams, useRouter } from "next/navigation";

import Button from "../../components/Button";
import { useMyProjectDetail } from "./hooks/useMyProjectDetail";
import ProjectDetailsCard from "../../components/projects/ProjectDetailsCard";
import BidsCard from "./components/BidsCard";
import FullPageLoader from "@/app/components/common/FullPageLoader";

export default function MyProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  const {
    isClient,
    canView,
    project,
    bids,
    loading,
    err,
    actionErr,
    acceptingId,
    onAccept,
  } = useMyProjectDetail(projectId);

  if (!isClient) return <FullPageLoader />;

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Project</h1>
            <p className="text-sm text-gray-600">Client view with bids.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/my-projects")}
            >
              Back
            </Button>
          </div>
        </div>

        <ProjectDetailsCard
          subtitle="Your project information"
          loading={loading}
          err={err}
          project={project}
        />

        <BidsCard
          loading={loading}
          bids={bids}
          project={project}
          actionErr={actionErr}
          acceptingId={acceptingId}
          onAccept={onAccept}
        />
      </div>
    </div>
  );
}
