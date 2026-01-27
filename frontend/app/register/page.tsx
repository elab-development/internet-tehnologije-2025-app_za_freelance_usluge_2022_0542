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
      const message = e instanceof Error ? e.message : "Register failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card title="Register" subtitle="Create an account">
        <form onSubmit={onSubmit} className="space-y-3">
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
              className="w-full rounded-md border px-3 py-2"
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
          {err ? <p className="text-red-600 text-sm">{err}</p> : null}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => router.push("/login")}
          >
            Back to login
          </button>
        </form>
      </Card>
    </div>
  );
}
