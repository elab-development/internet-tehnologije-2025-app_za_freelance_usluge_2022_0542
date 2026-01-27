"use client";

import Button from "../../components/Button";

export default function ProjectsHeader({
  onBack,
  right,
}: {
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <p className="text-sm text-gray-600">
          Browse open projects. Freelancers can place bids.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        {right}
      </div>
    </div>
  );
}
