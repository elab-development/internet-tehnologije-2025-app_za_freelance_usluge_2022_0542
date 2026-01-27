-- CreateIndex
CREATE INDEX "Bid_projectId_idx" ON "Bid"("projectId");

-- CreateIndex
CREATE INDEX "Bid_freelancerId_idx" ON "Bid"("freelancerId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");
