import { apiFetch } from "./api";

export type PlatformStats = {
  projects: {
    total: number;
    byStatus: {
      OPEN: number;
      IN_PROGRESS: number;
      DONE: number;
      CANCELLED: number;
    };
  };
  bids: {
    total: number;
    byStatus: {
      PENDING: number;
      ACCEPTED: number;
      REJECTED: number;
    };
  };
  users: {
    total: number;
    byRole: {
      CLIENT: number;
      FREELANCER: number;
      ADMIN: number;
    };
  };
};

export async function getPlatformStats(): Promise<PlatformStats> {
  return apiFetch("/stats", { method: "GET" }) as Promise<PlatformStats>;
}
