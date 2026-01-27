"use client";

import type { BidStatus } from "../../services/bid.service";

function label(status: BidStatus) {
  return status === "PENDING"
    ? "Pending"
    : status === "ACCEPTED"
      ? "Accepted"
      : "Rejected";
}

function cls(status: BidStatus) {
  return status === "PENDING"
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : status === "ACCEPTED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";
}

export default function BidStatusBadge(props: { status: BidStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls(
        props.status,
      )}`}
    >
      {label(props.status)}
    </span>
  );
}
