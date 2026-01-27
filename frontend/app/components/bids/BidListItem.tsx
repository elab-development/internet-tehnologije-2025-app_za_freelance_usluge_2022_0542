"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";

import Button from "../Button";
import type { Bid } from "../../services/bid.service";
import BidStatusBadge from "./BidStatusBadge";
import ProjectStatusBadge from "../projects/ProjectStatusBadge";

export default function BidListItem({ bid }: { bid: Bid }) {
  const router = useRouter();

  const projectTitle = bid.project?.title ?? "Unknown project";
  const projectStatus = bid.project?.status ?? null;

  const created = useMemo(
    () => new Date(bid.createdAt).toLocaleString(),
    [bid.createdAt],
  );

  return (
    <div className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {projectTitle}
            </p>

            <BidStatusBadge status={bid.status} />

            {projectStatus ? (
              <ProjectStatusBadge status={projectStatus} />
            ) : null}
          </div>

          <p className="mt-2 text-sm text-gray-700">
            <b>Price:</b> {bid.price} RSD • <b>Deadline:</b> {bid.deadlineDays}{" "}
            day(s)
          </p>

          {bid.coverLetter ? (
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
              {bid.coverLetter}
            </p>
          ) : null}

          <p className="mt-2 text-xs text-gray-500">Created: {created}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (bid.projectId) router.push(`/projects/${bid.projectId}`);
            }}
          >
            View project
          </Button>
        </div>
      </div>
    </div>
  );
}
