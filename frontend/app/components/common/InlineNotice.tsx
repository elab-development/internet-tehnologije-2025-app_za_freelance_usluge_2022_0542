"use client";

import React from "react";

export default function InlineNotice(props: {
  variant?: "error" | "info";
  title?: string;
  children: React.ReactNode;
}) {
  const variant = props.variant ?? "info";

  const boxClass =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <div className={`rounded-lg border p-3 text-sm ${boxClass}`}>
      {props.title ? (
        <div className="font-semibold mb-1">{props.title}</div>
      ) : null}
      <div>{props.children}</div>
    </div>
  );
}
