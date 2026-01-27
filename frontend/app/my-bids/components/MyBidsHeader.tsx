"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";

export default function MyBidsHeader() {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Bids</h1>
        <p className="text-sm text-gray-600">
          Bids you placed as a freelancer.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back
        </Button>
        <Button onClick={() => router.push("/projects")}>
          Browse projects
        </Button>
      </div>
    </div>
  );
}
