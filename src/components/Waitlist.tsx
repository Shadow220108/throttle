"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

export default function Waitlist() {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, null);

  if (state?.ok) {
    return (
      <p className="rounded-xl bg-hc-green/15 p-4 text-center font-bold text-hc-dark" role="status">
        ✈️ {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-xl border-2 border-hc-muted/40 px-4 py-3 text-lg text-hc-dark placeholder:text-hc-muted focus:border-hc-blue focus:outline-none"
      />
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-hc-red px-6 py-3 text-lg font-bold text-white shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-60"
      >
        {pending ? "Sending…" : "RSVP"}
      </button>
      {state && !state.ok && (
        <p className="text-sm font-bold text-hc-red sm:basis-full" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
