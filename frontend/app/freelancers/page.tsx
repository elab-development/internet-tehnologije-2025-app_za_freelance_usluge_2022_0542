"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../components/Card";
import Button from "../components/Button";
import InlineNotice from "../components/common/InlineNotice";
import SkeletonList from "../components/common/SkeletonList";
import FullPageLoader from "../components/common/FullPageLoader";

import { useIsClient } from "../hooks/useIsClient";
import { useAsync } from "../hooks/useAsync";
import {
  getFreelancers,
  type Freelancer,
} from "../services/freelancers.service";

type GitHubUser = {
  login: string;
  avatar_url: string;
  public_repos: number;
  name: string | null;
};

function extractGithubUsername(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[0] ?? null;
  } catch {
    return null;
  }
}

function GitHubBadge({ githubUrl }: { githubUrl: string }) {
  const [gh, setGh] = useState<GitHubUser | null>(null);

  useEffect(() => {
    const username = extractGithubUsername(githubUrl);
    if (!username) return;

    // GitHub API — eksterni API #2 (besplatan, bez ključa)
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: GitHubUser | null) => {
        if (data?.login) setGh(data);
      })
      .catch(() => null);
  }, [githubUrl]);

  if (!gh) {
    return (
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs text-blue-600 underline"
      >
        GitHub
      </a>
    );
  }

  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 flex items-center gap-2 rounded-lg border px-2 py-1 hover:bg-gray-50 transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={gh.avatar_url}
        alt={gh.login}
        className="h-6 w-6 rounded-full"
      />
      <div className="text-right">
        <p className="text-xs font-medium text-gray-900">{gh.login}</p>
        <p className="text-xs text-gray-500">{gh.public_repos} repos</p>
      </div>
    </a>
  );
}

function FreelancerCard({ freelancer }: { freelancer: Freelancer }) {
  const profile = freelancer.freelancerProfile;

  return (
    <div className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {profile?.title ?? freelancer.email}
          </p>
          {profile?.title ? (
            <p className="text-xs text-gray-500">{freelancer.email}</p>
          ) : null}

          {profile?.bio ? (
            <p className="mt-2 text-sm text-gray-700 line-clamp-2">
              {profile.bio}
            </p>
          ) : null}

          {profile?.skills && profile.skills.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {profile.skills.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  {s.skill.name}
                  {s.level ? ` · ${s.level}/5` : ""}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {profile?.githubUrl ? (
          <GitHubBadge githubUrl={profile.githubUrl} />
        ) : null}
      </div>
    </div>
  );
}

export default function FreelancersPage() {
  const router = useRouter();
  const isClient = useIsClient();

  const fn = useCallback(async () => {
    if (!isClient) return [] as Freelancer[];
    const data = await getFreelancers();
    return data.freelancers ?? [];
  }, [isClient]);

  const { data: freelancers, loading, error } = useAsync<Freelancer[]>(
    fn,
    isClient ? "client" : "ssr",
  );

  if (!isClient) return <FullPageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Freelancers</h1>
            <p className="text-sm text-gray-600">Browse available freelancers.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back
          </Button>
        </div>

        <Card
          title="All freelancers"
          subtitle={
            loading
              ? "Loading..."
              : `${freelancers?.length ?? 0} registered`
          }
        >
          {error ? (
            <InlineNotice variant="error" title="Failed to load">
              {error}
            </InlineNotice>
          ) : loading ? (
            <SkeletonList rows={4} rowHeightClass="h-20" />
          ) : !freelancers || freelancers.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm text-gray-700">No freelancers registered yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {freelancers.map((f) => (
                <FreelancerCard key={f.id} freelancer={f} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
