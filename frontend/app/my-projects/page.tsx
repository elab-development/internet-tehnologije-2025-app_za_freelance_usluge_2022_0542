"use client";

import { useRouter } from "next/navigation";

import Card from "../components/Card";
import Button from "../components/Button";
import { useMyProjects } from "./hooks/useMyProjects";
import MyProjectsHeader from "./components/MyProjectsHeader";
import ProjectListItem from "./components/ProjectListItem";

export default function MyProjectsPage() {
  const router = useRouter();
  const { isClient, canView, projects, loading, err } = useMyProjects();

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border bg-white p-4 shadow-sm text-sm text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <MyProjectsHeader
          onBack={() => router.push("/dashboard")}
          onNewProject={() => router.push("/projects/new")}
        />

        <Card
          title="Projects"
          subtitle={loading ? "Loading..." : `${projects.length} total`}
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
              <p className="text-sm text-gray-700">
                You don’t have any projects yet.
              </p>
              <div className="mt-3">
                <Button onClick={() => router.push("/projects/new")}>
                  Create your first project
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectListItem
                  key={p.id}
                  project={p}
                  onView={(id) => router.push(`/my-projects/${id}`)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
