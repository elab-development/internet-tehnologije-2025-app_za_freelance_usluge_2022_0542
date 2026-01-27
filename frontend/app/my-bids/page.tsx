"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useIsClient } from "../hooks/useIsClient";

import { getMyBids, type Bid } from "../services/bid.service";

function StatusBadge({ status }: { status: Bid["status"] }) {
  const label =
    status === "PENDING"
      ? "Pending"
      : status === "ACCEPTED"
        ? "Accepted"
        : "Rejected";

  const cls =
    status === "PENDING"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "ACCEPTED"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-red-700 border-red-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export default function MyBidsPage() {
  const router = useRouter();
  const { user, isAuthed } = useAuth();
  const isClient = useIsClient();

  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const canView = useMemo(
    () => isAuthed && user?.role === "FREELANCER",
    [isAuthed, user?.role],
  );

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthed) {
      router.push("/login");
      return;
    }

    if (user?.role !== "FREELANCER") {
      router.push("/dashboard");
      return;
    }

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getMyBids();
        setBids(data.bids);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load bids";
        setErr(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [isClient, isAuthed, router, user?.role]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border bg-white p-4 shadow-sm text-sm text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Bids</h1>
            <p className="text-sm text-gray-600">
              Bids you placed as a freelancer.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back
            </Button>
            <Button onClick={() => router.push("/projects")}>
              Browse projects
            </Button>
          </div>
        </div>

        <Card
          title="Bids"
          subtitle={loading ? "Loading..." : `${bids.length} total`}
        >
          {err ? (
            <p className="text-sm text-red-600">{err}</p>
          ) : loading ? (
            <div className="space-y-3">
              <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          ) : bids.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                You haven’t placed any bids yet.
              </p>
              <div className="mt-3">
                <Button onClick={() => router.push("/projects")}>
                  Find projects
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((b) => {
                const projectTitle = b.project?.title ?? "Unknown project";
                const projectStatus = b.project?.status ?? null;
                const created = new Date(b.createdAt).toLocaleString();

                return (
                  <div
                    key={b.id}
                    className="rounded-xl border bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {projectTitle}
                          </p>
                          <StatusBadge status={b.status} />
                          {projectStatus ? (
                            <span className="text-xs rounded-full border px-2.5 py-1 bg-gray-50 text-gray-700">
                              {projectStatus}
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm text-gray-700">
                          <b>Price:</b> {b.price} RSD • <b>Deadline:</b>{" "}
                          {b.deadlineDays} day(s)
                        </p>

                        {b.coverLetter ? (
                          <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                            {b.coverLetter}
                          </p>
                        ) : null}

                        <p className="mt-2 text-xs text-gray-500">
                          Created: {created}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // ide na public project details page
                            if (b.projectId)
                              router.push(`/projects/${b.projectId}`);
                          }}
                        >
                          View project
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
