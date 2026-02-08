"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Početna (root) stranica aplikacije.
 * Po zahtevu projekta, aplikacija počinje od login stranice,
 * pa se ovde radi automatski redirect na /login.
 */
export default function Home() {
  const router = useRouter();

  // Routing funkcionalnost: preusmeravanje na login page
  useEffect(() => {
    router.push("/login");
  }, [router]);

  // Kratak placeholder dok se redirect ne izvrši
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-600">Redirecting to login...</p>
    </div>
  );
}
