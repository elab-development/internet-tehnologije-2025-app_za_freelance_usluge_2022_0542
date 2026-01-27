"use client";

import { useRouter } from "next/navigation";

import Card from "../../components/Card";
import Button from "../../components/Button";
import FullPageLoader from "../../components/common/FullPageLoader";
import { useRequireRole } from "../../hooks/useRequireRole";

import NewProjectForm from "./components/NewProjectForm";

export default function NewProjectPage() {
  const router = useRouter();
  const { isClient, allowed: canView } = useRequireRole("CLIENT");

  if (!isClient) return <FullPageLoader label="Loading..." />;

  // redirect happens in hook (to /login or /dashboard)
  if (!canView) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              New Project
            </h1>
            <p className="text-sm text-gray-600">
              Create a project and receive bids from freelancers.
            </p>
          </div>

          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back
          </Button>
        </div>

        <Card
          title="Project details"
          subtitle="Title and description are required. Budgets are optional."
        >
          <NewProjectForm />
        </Card>
      </div>
    </div>
  );
}
