"use client";

import { useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useAsync } from "../../hooks/useAsync";
import { useIsClient } from "../../hooks/useIsClient";
import { getPlatformStats } from "../../services/stats.service";
import Card from "../Card";

const PROJECT_COLORS: Record<string, string> = {
  OPEN: "#10b981",
  IN_PROGRESS: "#3b82f6",
  DONE: "#6b7280",
  CANCELLED: "#ef4444",
};

const BID_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  ACCEPTED: "#10b981",
  REJECTED: "#ef4444",
};

export default function StatsCharts() {
  const isClient = useIsClient();

  const fn = useCallback(async () => {
    if (!isClient) return null;
    return getPlatformStats();
  }, [isClient]);

  const { data: stats, loading } = useAsync(fn, isClient ? "stats" : "ssr");

  if (!isClient || loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const projectData = Object.entries(stats.projects.byStatus)
    .map(([status, count]) => ({ name: status, value: count }))
    .filter((e) => e.value > 0);

  const bidData = Object.entries(stats.bids.byStatus)
    .map(([status, count]) => ({ name: status, value: count }))
    .filter((e) => e.value > 0);

  const hasProjectData = stats.projects.total > 0;
  const hasBidData = stats.bids.total > 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card
        title="Projects by status"
        subtitle={`${stats.projects.total} total`}
      >
        {hasProjectData ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={projectData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {projectData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={PROJECT_COLORS[entry.name] ?? "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[180px] flex-col items-center justify-center gap-1">
            <span className="text-2xl">📋</span>
            <span className="text-sm text-gray-400">No projects yet</span>
          </div>
        )}
      </Card>

      <Card title="Bids by status" subtitle={`${stats.bids.total} total`}>
        {hasBidData ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bidData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {bidData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={BID_COLORS[entry.name] ?? "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[180px] flex-col items-center justify-center gap-1">
            <span className="text-2xl">🤝</span>
            <span className="text-sm text-gray-400">No bids yet</span>
          </div>
        )}
      </Card>
    </div>
  );
}
