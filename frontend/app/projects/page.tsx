"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

import { useOpenProjects } from "./hooks/useOpenProjects";
import ProjectsHeader from "./components/ProjectsHeader";
import ProjectListItem from "./components/ProjectListItem";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isAuthed } = useAuth();
  const { isClient, projects, loading, err } = useOpenProjects();

  const ctaLabel = useMemo(() => {
    if (!isAuthed) return "Login to continue";
    if (user?.role === "FREELANCER") return "View & bid";
    return "View";
  }, [isAuthed, user?.role]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border bg-white p-4 shadow-sm text-sm text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <ProjectsHeader
          onBack={() => router.push("/dashboard")}
          right={
            user?.role === "CLIENT" ? (
              <Button onClick={() => router.push("/projects/new")}>
                New project
              </Button>
            ) : null
          }
        />

        <Card
          title="Open projects"
          subtitle={loading ? "Loading..." : `${projects.length} available`}
        >
          {err ? (
            <p className="text-sm text-red-600">{err}</p>
          ) : loading ? (
            <div className="space-y-3">
              <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm text-gray-700">No open projects yet.</p>
              {user?.role === "CLIENT" ? (
                <div className="mt-3">
                  <Button onClick={() => router.push("/projects/new")}>
                    Create the first project
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectListItem
                  key={p.id}
                  project={p}
                  ctaLabel={ctaLabel}
                  onClick={() => {
                    if (!isAuthed) router.push("/login");
                    else router.push(`/projects/${p.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
