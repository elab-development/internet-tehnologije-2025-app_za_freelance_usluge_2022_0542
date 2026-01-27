"use client";

import Button from "../../components/Button";
import RoleBadge from "../../components/dashboard/RoleBadge";
import type { StoredUser } from "../../hooks/useAuth";

type Role = "CLIENT" | "FREELANCER" | "ADMIN";

export default function DashboardTopBar(props: {
  user: StoredUser;
  onExplore: () => void;
  onLogout: () => void;
}) {
  const { user, onExplore, onLogout } = props;

  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-gray-50 text-sm font-bold">
            FA
          </div>
          <div>
            <p className="text-sm text-gray-600">Welcome back</p>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">
                {user.email}
              </h1>
              <RoleBadge role={user.role as Role} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExplore}>
            Explore
          </Button>
          <Button onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
