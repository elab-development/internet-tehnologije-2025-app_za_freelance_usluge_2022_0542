import { apiFetch } from "./api";
import type { Project } from "./projects.service";

export type CreateBidInput = {
  price: number;
  deadlineDays: number;
  coverLetter?: string;
};

export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Bid = {
  id: string;
  projectId: string;
  freelancerId: string;
  price: number;
  deadlineDays: number;
  coverLetter: string | null;
  status: BidStatus;
  createdAt: string;

  // present only on some endpoints (e.g. client viewing bids)
  freelancer?: { id: string; email: string; role: string };

  // present only on /me/bids endpoint (backend includes project: true)
  project?: Project & { clientId?: string };
};

export async function createBid(projectId: string, input: CreateBidInput) {
  return apiFetch(`/projects/${projectId}/bids`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getBidsForProject(projectId: string) {
  const data = await apiFetch(`/projects/${projectId}/bids`, { method: "GET" });
  return data as { bids: Bid[] };
}

export async function acceptBid(bidId: string) {
  return apiFetch(`/bids/${bidId}/accept`, {
    method: "POST",
  });
}

export async function getMyBids() {
  const data = await apiFetch(`/me/bids`, { method: "GET" });
  return data as { bids: Bid[] };
}
