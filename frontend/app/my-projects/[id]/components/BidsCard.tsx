"use client";

import Card from "../../../components/Card";
import Button from "../../../components/Button";
import type { Bid } from "../../../services/bid.service";
import type { Project } from "../../../services/projects.service";
import BidStatusBadge from "../../../components/bids/BidStatusBadge";
import InlineNotice from "../../../components/common/InlineNotice";
import SkeletonList from "../../../components/common/SkeletonList";

export default function BidsCard({
  loading,
  bids,
  project,
  actionErr,
  acceptingId,
  onAccept,
}: {
  loading: boolean;
  bids: Bid[];
  project: (Project & { clientId: string }) | null;
  actionErr: string | null;
  acceptingId: string | null;
  onAccept: (bidId: string) => void;
}) {
  return (
    <Card
      title="Bids"
      subtitle={loading ? "Loading..." : `${bids.length} total`}
    >
      {actionErr ? (
        <InlineNotice variant="error" title="Action failed">
          {actionErr}
        </InlineNotice>
      ) : null}

      {loading ? (
        <SkeletonList rows={2} rowHeightClass="h-16" />
      ) : bids.length === 0 ? (
        <p className="text-sm text-gray-700">No bids yet.</p>
      ) : (
        <div className="space-y-3">
          {bids.map((b) => {
            const acceptDisabled =
              project?.status !== "OPEN" ||
              b.status !== "PENDING" ||
              acceptingId === b.id;

            return (
              <div key={b.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {b.freelancer?.email ?? "Freelancer"}
                      </p>
                      <BidStatusBadge status={b.status} />
                    </div>

                    <p className="text-xs text-gray-600">
                      Price: <b>{b.price}</b> • Deadline:{" "}
                      <b>{b.deadlineDays} days</b>
                    </p>

                    {b.coverLetter ? (
                      <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
                        {b.coverLetter}
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      disabled={acceptDisabled}
                      loading={acceptingId === b.id}
                      onClick={() => onAccept(b.id)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
