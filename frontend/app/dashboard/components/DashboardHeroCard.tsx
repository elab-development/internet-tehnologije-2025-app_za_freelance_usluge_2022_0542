"use client";

import Button from "../../components/Button";
import type { StoredUser } from "../../hooks/useAuth";

export default function DashboardHeroCard(props: {
  user: StoredUser;
  onPrimary: () => void;
  onSecondary?: () => void;
}) {
  const { user, onPrimary, onSecondary } = props;

  const isClient = user.role === "CLIENT";
  const isFreelancer = user.role === "FREELANCER";

  const title = isClient
    ? "Post a project and receive bids"
    : isFreelancer
      ? "Find projects and place bids"
      : "Admin dashboard";

  const subtitle = isClient
    ? "Create one clear brief. Freelancers compete on price and deadline."
    : isFreelancer
      ? "Browse open projects and send strong proposals."
      : "Manage users, projects, and system status.";

  const primaryLabel = isClient
    ? "Create project"
    : isFreelancer
      ? "Browse projects"
      : "Manage projects";

  const secondaryLabel = isClient
    ? "My projects"
    : isFreelancer
      ? "My bids"
      : "Users";

  return (
    <div className="rounded-2xl bg-black p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>

      <p className="mt-2 max-w-2xl text-sm text-white/80">{subtitle}</p>

      <div className="mt-5 flex gap-2 flex-wrap">
        <Button onClick={onPrimary} variant="inverted">
          {primaryLabel}
        </Button>

        {onSecondary ? (
          <Button
            variant="ghost"
            onClick={onSecondary}
            className="text-white border border-white/30 hover:bg-white/10"
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
