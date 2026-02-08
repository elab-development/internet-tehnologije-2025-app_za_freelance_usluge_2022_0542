"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";

import { login } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

/**
 * Login stranica:
 * - jedna od 3 različite stranice
 * - koristi reusable komponente
 * - implementira autentifikaciju korisnika
 */
export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      setSession(data.token, data.user);
      router.push("/dashboard");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Login neuspešan";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card title="Login" subtitle="Sign in to continue">
          <form onSubmit={onSubmit} className="space-y-4">
            <InputField label="Email" value={email} onChange={setEmail} />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />

            {err ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </p>
            ) : null}

            <Button type="submit" fullWidth loading={loading}>
              Login
            </Button>

            <button
              type="button"
              className="w-full text-center text-sm underline underline-offset-4 hover:opacity-80"
              onClick={() => router.push("/register")}
            >
              Create account
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
