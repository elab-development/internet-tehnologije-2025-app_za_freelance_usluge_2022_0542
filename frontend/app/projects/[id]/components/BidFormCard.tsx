"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../../../components/Card";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";

import { useAuth } from "../../../hooks/useAuth";
import { createBid } from "../../../services/bid.service";

function toPositiveIntOrNull(value: string): number | null {
  const t = value.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  return i > 0 ? i : null;
}

export default function BidFormCard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { user, isAuthed } = useAuth();

  const isFreelancer = isAuthed && user?.role === "FREELANCER";

  const [price, setPrice] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!isAuthed) {
      router.push("/login");
      return;
    }

    if (!isFreelancer) {
      setErr("Only FREELANCER users can place bids.");
      return;
    }

    const p = toPositiveIntOrNull(price);
    const d = toPositiveIntOrNull(deadlineDays);

    if (p == null) return setErr("Price must be a positive integer.");
    if (d == null) return setErr("Deadline days must be a positive integer.");

    setLoading(true);
    try {
      await createBid(projectId, {
        price: p,
        deadlineDays: d,
        coverLetter: coverLetter.trim() ? coverLetter.trim() : undefined,
      });
      router.push("/my-bids");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Bid failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  // Not authed → show CTA instead of hiding everything
  if (!isAuthed) {
    return (
      <Card
        title="Place a bid"
        subtitle="Login as a freelancer to submit a bid."
      >
        <Button onClick={() => router.push("/login")}>Login to bid</Button>
      </Card>
    );
  }

  // Authed but wrong role → show message (don’t hide the whole card)
  if (!isFreelancer) {
    return (
      <Card title="Place a bid" subtitle="Only freelancers can submit bids.">
        <p className="text-sm text-gray-700">
          You are logged in as <b>{user?.role ?? "Unknown"}</b>.
        </p>
        <div className="mt-3">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </Card>
    );
  }

  // Freelancer → show form
  return (
    <Card title="Place a bid" subtitle="Compete on price and deadline.">
      <form onSubmit={onSubmit} className="space-y-3">
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
            className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Explain your approach briefly..."
          />
        </div>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" loading={loading} disabled={loading}>
            Submit bid
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setPrice("");
              setDeadlineDays("");
              setCoverLetter("");
              setErr(null);
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
