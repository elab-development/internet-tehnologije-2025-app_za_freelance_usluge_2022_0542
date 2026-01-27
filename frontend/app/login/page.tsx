"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { login } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

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
      const message = e instanceof Error ? e.message : "Login failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card title="Login" subtitle="Sign in to continue">
        <form onSubmit={onSubmit} className="space-y-3">
          <InputField label="Email" value={email} onChange={setEmail} />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          {err ? <p className="text-red-600 text-sm">{err}</p> : null}
          <Button type="submit" fullWidth loading={loading}>
            Login
          </Button>

          <button
            type="button"
            className="text-sm underline"
            onClick={() => router.push("/register")}
          >
            Create account
          </button>
        </form>
      </Card>
    </div>
  );
}
