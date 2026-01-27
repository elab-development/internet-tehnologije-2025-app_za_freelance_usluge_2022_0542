"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import Button from "../components/Button";
import Card from "../components/Card";

import RoleBadge from "../components/dashboard/RoleBadge";
import StatCard from "../components/dashboard/StatCard";
import DashboardActions from "../components/dashboard/DashboardActions";

import { useAuth } from "../hooks/useAuth";
import { useIsClient } from "../hooks/useIsClient";

type Role = "CLIENT" | "FREELANCER" | "ADMIN";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthed, logout } = useAuth();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && !isAuthed) router.push("/login");
  }, [isClient, isAuthed, router]);

  const actions = useMemo(() => {
    if (!user) return [];

    if (user.role === "CLIENT") {
      return [
        {
          title: "Create a project",
          desc: "Post a new project and start receiving bids.",
          cta: "New project",
          onClick: () => router.push("/projects/new"),
        },
        {
          title: "My projects",
          desc: "Review your projects and pick the best proposal.",
          cta: "Open my projects",
          onClick: () => router.push("/my-projects"),
        },
        {
          title: "Browse freelancers",
          desc: "Find talent by skills and profile strength.",
          cta: "Explore freelancers",
          onClick: () => router.push("/freelancers"),
        },
      ];
    }

    if (user.role === "FREELANCER") {
      return [
        {
          title: "Find projects",
          desc: "Browse open projects and place bids.",
          cta: "Browse projects",
          onClick: () => router.push("/projects"),
        },
        {
          title: "My bids",
          desc: "Track proposals you’ve sent and their status.",
          cta: "View my bids",
          onClick: () => router.push("/my-bids"),
        },
        {
          title: "My profile",
          desc: "Improve your profile to win more projects.",
          cta: "Edit profile",
          onClick: () => router.push("/me/profile"),
        },
      ];
    }

    // ADMIN
    return [
      {
        title: "Users",
        desc: "Review accounts and roles.",
        cta: "Manage users",
        onClick: () => router.push("/admin/users"),
      },
      {
        title: "Projects",
        desc: "Monitor platform activity and statuses.",
        cta: "Manage projects",
        onClick: () => router.push("/admin/projects"),
      },
      {
        title: "System health",
        desc: "Quick sanity checks and environment info.",
        cta: "Open health",
        onClick: () => window.open("http://localhost:4000/health", "_blank"),
      },
    ];
  }, [router, user]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border bg-white p-4 shadow-sm text-sm text-gray-700">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
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
            <Button variant="outline" onClick={() => router.push("/projects")}>
              Explore
            </Button>

            <Button
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            title="Account"
            value="Active"
            hint="Authenticated session"
          />
          <StatCard
            title="Role"
            value={user.role}
            hint="Access is role-based"
          />
          <StatCard
            title="Next step"
            value="Build core"
            hint="Projects → Bids → Accept"
          />
        </div>

        <DashboardActions actions={actions} />

        <Card
          title="What you should build next"
          subtitle="This is the shortest path to meeting all requirements."
        >
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
            <li>
              <b>Client:</b> Create Project + My Projects
            </li>
            <li>
              <b>Freelancer:</b> Browse Projects + Place Bid
            </li>
            <li>
              <b>Client:</b> View Bids + Accept Bid (transaction)
            </li>
            <li>
              <b>Freelancer:</b> Profile + Skills + Freelancer list
            </li>
          </ol>

          <div className="mt-4 flex gap-2 flex-wrap">
            <Button onClick={() => router.push("/projects")}>
              Go to Projects
            </Button>

            {user.role === "CLIENT" ? (
              <Button
                variant="outline"
                onClick={() => router.push("/projects/new")}
              >
                New Project
              </Button>
            ) : null}

            {user.role === "FREELANCER" ? (
              <Button
                variant="outline"
                onClick={() => router.push("/me/profile")}
              >
                My Profile
              </Button>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
