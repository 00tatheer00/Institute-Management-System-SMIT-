"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function EventRsvpButton({ eventTitle, isOpen }: { eventTitle: string; isOpen: boolean }) {
  const [registered, setRegistered] = useState(false);

  if (!isOpen) {
    return (
      <Button disabled className="w-full text-xs h-9">
        Registration Capacity Reached
      </Button>
    );
  }

  if (registered) {
    return (
      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        Seat Confirmed! Gate pass ready.
      </div>
    );
  }

  return (
    <Button
      className="w-full text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold"
      onClick={() => setRegistered(true)}
    >
      Confirm Free RSVP
    </Button>
  );
}
