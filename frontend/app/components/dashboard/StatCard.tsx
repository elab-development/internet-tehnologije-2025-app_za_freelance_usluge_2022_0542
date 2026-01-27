"use client";

export default function StatCard(props: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">{props.title}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{props.value}</p>
      {props.hint ? (
        <p className="mt-1 text-xs text-gray-500">{props.hint}</p>
      ) : null}
    </div>
  );
}
