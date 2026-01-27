"use client";

import React, { useMemo, useState } from "react";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { createProject } from "../../../services/projects.service";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";

function toOptionalInt(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return undefined;
  return Math.trunc(n);
}

export default function NewProjectForm() {
  const router = useRouter();
  const { user, isAuthed } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canCreate = useMemo(
    () => isAuthed && user?.role === "CLIENT",
    [isAuthed, user?.role],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!canCreate) {
      setErr("Only CLIENT users can create projects.");
      return;
    }

    const bMin = toOptionalInt(budgetMin);
    const bMax = toOptionalInt(budgetMax);

    if (bMin !== undefined && bMin < 0)
      return setErr("budgetMin must be a positive integer.");
    if (bMax !== undefined && bMax < 0)
      return setErr("budgetMax must be a positive integer.");
    if (bMin !== undefined && bMax !== undefined && bMin > bMax)
      return setErr("budgetMin cannot be greater than budgetMax.");

    setLoading(true);
    try {
      await createProject({
        title,
        description,
        budgetMin: bMin,
        budgetMax: bMax,
      });
      router.push("/my-projects");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Create project failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <InputField
        label="Title (min 3)"
        value={title}
        onChange={setTitle}
        placeholder="e.g. Build a landing page"
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">
          Description (min 10)
        </label>
        <textarea
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe goals, scope, stack, deadlines..."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField
          label="Budget min (optional)"
          value={budgetMin}
          onChange={setBudgetMin}
          placeholder="e.g. 200"
        />
        <InputField
          label="Budget max (optional)"
          value={budgetMax}
          onChange={setBudgetMax}
          placeholder="e.g. 600"
        />
      </div>

      {!canCreate ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
          You are logged in as <b>{user?.role ?? "Unknown"}</b>. Only{" "}
          <b>CLIENT</b> users can create projects.
        </p>
      ) : null}

      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" loading={loading} disabled={!canCreate}>
          Create project
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setTitle("");
            setDescription("");
            setBudgetMin("");
            setBudgetMax("");
            setErr(null);
          }}
          disabled={loading}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
