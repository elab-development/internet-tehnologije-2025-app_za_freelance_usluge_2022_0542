"use client";

type Role = "CLIENT" | "FREELANCER" | "ADMIN";

export default function RoleBadge({ role }: { role: Role }) {
  const label =
    role === "CLIENT"
      ? "Client"
      : role === "FREELANCER"
        ? "Freelancer"
        : "Admin";

  const classes =
    role === "CLIENT"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : role === "FREELANCER"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-purple-50 text-purple-700 border-purple-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}
