"use client";

import Card from "../../../components/Card";
import Button from "../../../components/Button";
import type { Bid } from "../../../services/bid.service";
import type { Project } from "../../../services/projects.service";

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
      {actionErr ? <p className="text-sm text-red-600">{actionErr}</p> : null}

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      ) : bids.length === 0 ? (
        <p className="text-sm text-gray-700">No bids yet.</p>
      ) : (
        <div className="space-y-3">
          {bids.map((b) => (
            <div key={b.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {b.freelancer?.email ?? "Freelancer"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Price: <b>{b.price}</b> • Deadline:{" "}
                    <b>{b.deadlineDays} days</b> • Status: <b>{b.status}</b>
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
                    disabled={
                      project?.status !== "OPEN" ||
                      b.status !== "PENDING" ||
                      acceptingId === b.id
                    }
                    loading={acceptingId === b.id}
                    onClick={() => onAccept(b.id)}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
