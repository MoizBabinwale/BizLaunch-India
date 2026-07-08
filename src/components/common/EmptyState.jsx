import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title = "No data yet", description = "There is nothing to show here right now.", action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-sky">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
