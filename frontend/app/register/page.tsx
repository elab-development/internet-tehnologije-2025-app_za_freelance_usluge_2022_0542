"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";

import { register } from "../services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"FREELANCER" | "CLIENT">("CLIENT");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      await register(email, password, role);
      router.push("/login");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Registracija neuspešna";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card title="Register" subtitle="Create an account">
          <form onSubmit={onSubmit} className="space-y-4">
            <InputField label="Email" value={email} onChange={setEmail} />
            <InputField
              label="Password (min 6)"
              type="password"
              value={password}
              onChange={setPassword}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={role}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "CLIENT" || value === "FREELANCER") {
                    setRole(value);
                  }
                }}
              >
                <option value="CLIENT">Client</option>
                <option value="FREELANCER">Freelancer</option>
              </select>
            </div>

            {err ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </p>
            ) : null}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              loading={loading}
            >
              Register
            </Button>

            <button
              type="button"
              className="w-full text-center text-sm underline underline-offset-4 hover:opacity-80"
              onClick={() => router.push("/login")}
            >
              Back to login
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
