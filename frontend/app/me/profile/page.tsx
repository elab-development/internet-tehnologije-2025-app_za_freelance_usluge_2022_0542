"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../../components/Card";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import FullPageLoader from "../../components/common/FullPageLoader";
import { useRequireRole } from "../../hooks/useRequireRole";
import { updateMyProfile } from "../../services/freelancers.service";

export default function MyProfilePage() {
  const router = useRouter();
  const { isClient, allowed: canView } = useRequireRole("FREELANCER");

  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isClient) return <FullPageLoader />;
  if (!canView) return <FullPageLoader label="Redirecting..." />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSuccess(false);

    const input: { title?: string; bio?: string; githubUrl?: string } = {};
    if (title.trim()) input.title = title.trim();
    if (bio.trim()) input.bio = bio.trim();
    if (githubUrl.trim()) input.githubUrl = githubUrl.trim();

    if (Object.keys(input).length === 0) {
      return setErr("Unesi bar jedno polje.");
    }

    setLoading(true);
    try {
      await updateMyProfile(input);
      setSuccess(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Update failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-600">Update your freelancer profile.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back
          </Button>
        </div>

        <Card title="Profile Info">
          <form onSubmit={onSubmit} className="space-y-3">
            <InputField
              label="Title (e.g. Full-stack Developer)"
              value={title}
              onChange={setTitle}
              placeholder="e.g. React & Node.js Developer"
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Bio</label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your experience and skills..."
              />
            </div>

            <InputField
              label="GitHub URL (optional)"
              value={githubUrl}
              onChange={setGithubUrl}
              placeholder="https://github.com/username"
            />

            {err ? <p className="text-sm text-red-600">{err}</p> : null}
            {success ? (
              <p className="text-sm text-green-600">Profile updated successfully!</p>
            ) : null}

            <div className="flex gap-2">
              <Button type="submit" loading={loading} disabled={loading}>
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={() => {
                  setTitle("");
                  setBio("");
                  setGithubUrl("");
                  setErr(null);
                  setSuccess(false);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
