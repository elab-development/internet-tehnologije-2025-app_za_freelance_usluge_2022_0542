import { prisma } from "../prisma";
import { HttpError } from "../utils/http";

export async function acceptBidService(params: {
  bidId: string;
  clientId: string;
}) {
  const { bidId, clientId } = params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const bid = await tx.bid.findUnique({
        where: { id: bidId },
        include: { project: true },
      });

      if (!bid) return { status: 404 as const, message: "Bid not found" };
      if (bid.project.clientId !== clientId)
        return { status: 403 as const, message: "Forbidden" };
      if (bid.project.status !== "OPEN")
        return { status: 400 as const, message: "Project is not open" };
      if (bid.status !== "PENDING")
        return { status: 409 as const, message: "Bid is not pending" };

      const accepted = await tx.bid.updateMany({
        where: { id: bidId, status: "PENDING" },
        data: { status: "ACCEPTED" },
      });

      if (accepted.count !== 1)
        return { status: 409 as const, message: "Bid already processed" };

      await tx.bid.updateMany({
        where: {
          projectId: bid.projectId,
          id: { not: bidId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      await tx.project.update({
        where: { id: bid.projectId },
        data: { status: "IN_PROGRESS" },
      });

      return { status: 200 as const, message: "OK" };
    });

    if (result.status !== 200)
      throw new HttpError(result.status, result.message);
    return { ok: true as const };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(500, "Failed to accept bid");
  }
}
