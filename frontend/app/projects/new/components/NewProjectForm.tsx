"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { createProject } from "../../../services/projects.service";

function toOptionalInt(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return undefined;
  return Math.trunc(n);
}

export default function NewProjectForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const t = title.trim();
    const d = description.trim();

    if (t.length < 3) return setErr("Title must be at least 3 characters.");
    if (d.length < 10)
      return setErr("Description must be at least 10 characters.");

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
        title: t,
        description: d,
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
          className="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
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

      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" loading={loading} disabled={loading}>
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
