"use client";

import Card from "../components/Card";
import Button from "../components/Button";

import InlineNotice from "../components/common/InlineNotice";
import SkeletonList from "../components/common/SkeletonList";
import FullPageLoader from "../components/common/FullPageLoader";

import { useMyBids } from "./hooks/useMyBids";
import MyBidsHeader from "./components/MyBidsHeader";
import BidListItem from "../components/bids/BidListItem";

import { useRouter } from "next/navigation";

export default function MyBidsPage() {
  const { isClient, canView, bids, loading, err } = useMyBids();

  const router = useRouter();

  if (!isClient) return <FullPageLoader />;

  // redirect happens in hook
  if (!canView) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <MyBidsHeader />

        <Card
          title="Bids"
          subtitle={loading ? "Loading..." : `${bids.length} total`}
        >
          {err ? (
            <InlineNotice variant="error" title="Failed to load">
              {err}
            </InlineNotice>
          ) : loading ? (
            <SkeletonList rows={3} rowHeightClass="h-16" />
          ) : bids.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                You haven’t placed any bids yet.
              </p>
              <div className="mt-3">
                <Button onClick={() => router.push("/projects")}>
                  Find projects
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((b) => (
                <BidListItem key={b.id} bid={b} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
