"use client";

export default function FullPageLoader(props: { label?: string }) {
  const label = props.label ?? "Loading...";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="rounded-xl border bg-white p-4 shadow-sm text-sm text-gray-700">
        {label}
      </div>
    </div>
  );
}
