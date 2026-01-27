"use client";

import Button from "../../components/Button";

export default function MyProjectsHeader({
  onBack,
  onNewProject,
}: {
  onBack: () => void;
  onNewProject: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Projects</h1>
        <p className="text-sm text-gray-600">
          Projects you created as a client.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNewProject}>New project</Button>
      </div>
    </div>
  );
}
