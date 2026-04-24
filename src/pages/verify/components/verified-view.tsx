import { Link } from "@tanstack/react-router";

import { Mailbox } from "@/components/pixel/mailbox";

export function VerifiedView() {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <Mailbox size={64} />
      <div className="flex flex-col gap-2">
        <h3>You're verified!</h3>
        <div className="text-base opacity-80">
          Your mailbox is confirmed. Welcome home.
        </div>
      </div>
      <Link to="/dashboard" className="pbtn lg">
        Go to dashboard →
      </Link>
    </div>
  );
}
