import React from "react";

export default function Card(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full rounded-xl border bg-white p-6 shadow-sm ${props.className ?? ""}`}
    >
      <h1 className="text-2xl font-semibold">{props.title}</h1>
      {props.subtitle ? (
        <p className="text-gray-600 mt-1">{props.subtitle}</p>
      ) : null}
      <div className="mt-4">{props.children}</div>
    </div>
  );
}
