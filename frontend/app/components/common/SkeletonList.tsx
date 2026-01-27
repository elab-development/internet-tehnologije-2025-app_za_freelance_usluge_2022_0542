"use client";

import React from "react";

export default function SkeletonList(props: {
  rows?: number;
  rowHeightClass?: string;
}) {
  const rows = props.rows ?? 3;
  const rowHeightClass = props.rowHeightClass ?? "h-16";

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${rowHeightClass} rounded-lg bg-gray-100 animate-pulse`}
        />
      ))}
    </div>
  );
}
