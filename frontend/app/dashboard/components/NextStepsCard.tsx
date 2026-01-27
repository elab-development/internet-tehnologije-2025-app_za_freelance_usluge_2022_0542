"use client";

import Card from "../../components/Card";
import Button from "../../components/Button";

export default function NextStepsCard(props: {
  role: string;
  onProjects: () => void;
  onNewProject?: () => void;
  onProfile?: () => void;
}) {
  const { role, onProjects, onNewProject, onProfile } = props;

  return (
    <Card title="Next steps" subtitle="Collapse this when showing the app.">
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-900">
          Show checklist
        </summary>

        <div className="mt-3">
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
            <li>
              <b>Client:</b> Create Project + My Projects
            </li>
            <li>
              <b>Freelancer:</b> Browse Projects + Place Bid
            </li>
            <li>
              <b>Client:</b> View Bids + Accept Bid
            </li>
            <li>
              <b>Freelancer:</b> Profile + Skills + Freelancer list
            </li>
          </ol>

          <div className="mt-4 flex gap-2 flex-wrap">
            <Button onClick={onProjects}>Go to Projects</Button>

            {role === "CLIENT" && onNewProject ? (
              <Button variant="outline" onClick={onNewProject}>
                New Project
              </Button>
            ) : null}

            {role === "FREELANCER" && onProfile ? (
              <Button variant="outline" onClick={onProfile}>
                My Profile
              </Button>
            ) : null}
          </div>
        </div>
      </details>
    </Card>
  );
}
