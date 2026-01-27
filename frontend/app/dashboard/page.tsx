"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import FullPageLoader from "../components/common/FullPageLoader";
import DashboardActions from "../components/dashboard/DashboardActions";

import { useAuth } from "../hooks/useAuth";
import { useIsClient } from "../hooks/useIsClient";

import { useDashboardActions } from "./hooks/useDashboardActions";
import DashboardTopBar from "./components/DashboardTopBar";
import DashboardHeroCard from "./components/DashboardHeroCard";
import DashboardStatsRow from "./components/DashboardStatsRow";
import NextStepsCard from "./components/NextStepsCard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthed, logout } = useAuth();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && !isAuthed) router.push("/login");
  }, [isClient, isAuthed, router]);

  const openHealth = useMemo(
    () => () => window.open("http://localhost:4000/health", "_blank"),
    [],
  );

  // Keep nav object stable-ish
  const nav = useMemo(
    () => ({
      push: (path: string) => router.push(path),
      openHealth,
    }),
    [router, openHealth],
  );

  const actions = useDashboardActions(user, nav);

  if (!isClient) return <FullPageLoader label="Loading dashboard..." />;
  if (!user) return null;

  const primaryCta = () => {
    if (user.role === "CLIENT") router.push("/projects/new");
    else if (user.role === "FREELANCER") router.push("/projects");
    else router.push("/admin/projects");
  };

  const secondaryCta = () => {
    if (user.role === "CLIENT") router.push("/my-projects");
    else if (user.role === "FREELANCER") router.push("/my-bids");
    else router.push("/admin/users");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardTopBar
        user={user}
        onExplore={() => router.push("/projects")}
        onLogout={() => {
          logout();
          router.push("/login");
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <DashboardHeroCard
          user={user}
          onPrimary={primaryCta}
          onSecondary={secondaryCta}
        />

        <DashboardStatsRow user={user} />

        <DashboardActions actions={actions} />

        <NextStepsCard
          role={user.role}
          onProjects={() => router.push("/projects")}
          onNewProject={() => router.push("/projects/new")}
          onProfile={() => router.push("/me/profile")}
        />
      </div>
    </div>
  );
}
