import React from "react";

export default function Card(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  const base = "w-full rounded-xl border p-6 shadow-sm bg-white text-gray-900";

  return (
    <div className={[base, props.className ?? ""].join(" ")}>
      <h2
        className={["text-2xl font-semibold", props.titleClassName ?? ""].join(
          " ",
        )}
      >
        {props.title}
      </h2>

      {props.subtitle ? (
        <p
          className={["mt-1 text-gray-600", props.subtitleClassName ?? ""].join(
            " ",
          )}
        >
          {props.subtitle}
        </p>
      ) : null}

      <div className="mt-4">{props.children}</div>
    </div>
  );
}
