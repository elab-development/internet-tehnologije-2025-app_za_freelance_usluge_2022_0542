"use client";

import { useMemo } from "react";
import type { StoredUser } from "../../hooks/useAuth";

export type DashboardAction = {
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
};

export function useDashboardActions(
  user: StoredUser | null,
  nav: {
    push: (path: string) => void;
    openHealth: () => void;
  },
) {
  return useMemo<DashboardAction[]>(() => {
    if (!user) return [];

    if (user.role === "CLIENT") {
      return [
        {
          title: "Create a project",
          desc: "Post a new project and start receiving bids.",
          cta: "New project",
          onClick: () => nav.push("/projects/new"),
        },
        {
          title: "My projects",
          desc: "Review your projects and pick the best proposal.",
          cta: "Open my projects",
          onClick: () => nav.push("/my-projects"),
        },
        {
          title: "Browse freelancers",
          desc: "Find talent by skills and profile strength.",
          cta: "Explore freelancers",
          onClick: () => nav.push("/freelancers"),
        },
      ];
    }

    if (user.role === "FREELANCER") {
      return [
        {
          title: "Find projects",
          desc: "Browse open projects and place bids.",
          cta: "Browse projects",
          onClick: () => nav.push("/projects"),
        },
        {
          title: "My bids",
          desc: "Track proposals you’ve sent and their status.",
          cta: "View my bids",
          onClick: () => nav.push("/my-bids"),
        },
        {
          title: "My profile",
          desc: "Improve your profile to win more projects.",
          cta: "Edit profile",
          onClick: () => nav.push("/me/profile"),
        },
      ];
    }

    return [
      {
        title: "Users",
        desc: "Review accounts and roles.",
        cta: "Manage users",
        onClick: () => nav.push("/admin/users"),
      },
      {
        title: "Projects",
        desc: "Monitor platform activity and statuses.",
        cta: "Manage projects",
        onClick: () => nav.push("/admin/projects"),
      },
      {
        title: "System health",
        desc: "Quick sanity checks and environment info.",
        cta: "Open health",
        onClick: nav.openHealth,
      },
    ];
  }, [user, nav]);
}
