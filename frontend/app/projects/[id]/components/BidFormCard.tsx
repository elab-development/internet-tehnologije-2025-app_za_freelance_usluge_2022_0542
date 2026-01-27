"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../../../components/Card";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";

import { useAuth } from "../../../hooks/useAuth";
import { createBid } from "../../../services/bid.service";

function toIntOrNull(value: string): number | null {
  const t = value.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

export default function BidFormCard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { user, isAuthed } = useAuth();

  const canBid = useMemo(
    () => isAuthed && user?.role === "FREELANCER",
    [isAuthed, user?.role],
  );

  const [price, setPrice] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [bidErr, setBidErr] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState(false);

  async function onSubmitBid(e: React.FormEvent) {
    e.preventDefault();
    setBidErr(null);

    if (!canBid) {
      router.push("/login");
      return;
    }

    const p = toIntOrNull(price);
    const d = toIntOrNull(deadlineDays);

    if (p == null || p < 1)
      return setBidErr("Price must be a positive integer.");
    if (d == null || d < 1)
      return setBidErr("Deadline days must be a positive integer.");

    setBidLoading(true);
    try {
      await createBid(projectId, {
        price: p,
        deadlineDays: d,
        coverLetter: coverLetter.trim() ? coverLetter.trim() : undefined,
      });
      router.push("/projects");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Bid failed";
      setBidErr(message);
    } finally {
      setBidLoading(false);
    }
  }

  if (!canBid) {
    // Bitno: freelancer je ulogovan ali ne može? onda je role problem.
    return null;
  }

  return (
    <Card title="Place a bid" subtitle="Compete on price and deadline.">
      <form onSubmit={onSubmitBid} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField
            label="Price (RSD)"
            value={price}
            onChange={setPrice}
            placeholder="e.g. 30000"
          />
          <InputField
            label="Deadline (days)"
            value={deadlineDays}
            onChange={setDeadlineDays}
            placeholder="e.g. 7"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">
            Cover letter (optional)
          </label>
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Explain your approach briefly..."
          />
        </div>

        {bidErr ? <p className="text-sm text-red-600">{bidErr}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" loading={bidLoading}>
            Submit bid
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={bidLoading}
            onClick={() => {
              setPrice("");
              setDeadlineDays("");
              setCoverLetter("");
              setBidErr(null);
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
