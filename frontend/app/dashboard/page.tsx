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

  // Auth + role (tipovi korisnika): koristi se za role-based UI i logout
  const { user, isAuthed, logout } = useAuth();

  // Next/SSR: čekamo klijentski render pre pristupa user/session stanju
  const isClient = useIsClient();

  // Zaštita rute: dashboard nije dostupan bez login-a
  useEffect(() => {
    if (isClient && !isAuthed) router.push("/login");
  }, [isClient, isAuthed, router]);

  // Pomoćna akcija (dodatna funkcionalnost): otvara health endpoint
  const openHealth = useMemo(
    () => () => window.open("http://localhost:4000/health", "_blank"),
    [],
  );

  // Prosleđivanje navigacije u hook koji generiše dashboard akcije
  const nav = useMemo(
    () => ({
      push: (path: string) => router.push(path),
      openHealth,
    }),
    [router, openHealth],
  );

  // Funkcionalnost: akcije se formiraju na osnovu role korisnika
  const actions = useDashboardActions(user, nav);

  if (!isClient) return <FullPageLoader label="Loading dashboard..." />;
  if (!user) return null;

  // Role-based CTA: različite rute zavisno od tipa korisnika
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
          // Logout: briše sesiju, zatim preusmerava na login
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
