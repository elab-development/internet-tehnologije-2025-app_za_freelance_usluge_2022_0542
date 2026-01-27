"use client";

import StatCard from "../../components/dashboard/StatCard";
import type { StoredUser } from "../../hooks/useAuth";

export default function DashboardStatsRow(props: { user: StoredUser }) {
  const { user } = props;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard title="Account" value="Active" hint="Authenticated session" />
      <StatCard title="Role" value={user.role} hint="Access is role-based" />
      <StatCard title="Next step" value="Projects → Bids" hint="Core flow" />
    </div>
  );
}
