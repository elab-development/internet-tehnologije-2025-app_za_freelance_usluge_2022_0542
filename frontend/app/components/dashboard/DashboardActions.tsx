"use client";

import Button from "../Button";

type Action = {
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
};

export default function DashboardActions({ actions }: { actions: Action[] }) {
  const [first, ...rest] = actions;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quick actions</h2>
          <p className="mt-1 text-sm text-gray-600">
            Do the high-impact stuff first. If you don’t ship Projects + Bids,
            your app is just a login form.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          MVP
        </span>
      </div>

      {first ? (
        <div className="mt-5 rounded-2xl border border-black bg-black p-5 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{first.title}</p>
              <p className="mt-1 text-sm text-white/80">{first.desc}</p>
            </div>
            <div className="shrink-0">
              <Button onClick={first.onClick}>{first.cta}</Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {rest.map((a) => (
          <div
            key={a.title}
            className="rounded-xl border bg-white p-4 hover:shadow-sm transition"
          >
            <p className="text-sm font-semibold text-gray-900">{a.title}</p>
            <p className="mt-1 text-sm text-gray-600">{a.desc}</p>
            <div className="mt-4">
              <Button fullWidth variant="outline" size="md" onClick={a.onClick}>
                {a.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
