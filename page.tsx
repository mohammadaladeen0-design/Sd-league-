"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const supabase = createClient();

  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [cooldown, setCooldown] = useState(0);

  async function resend() {
    if (!email || cooldown > 0) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    setStatus(error ? "error" : "sent");
    if (!error) {
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card w-full max-w-sm text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-text-dim text-sm mb-6">
          We sent a verification link to <span className="text-text font-medium">{email || "your email"}</span>.
          Click it to activate your account, then come back and log in.
        </p>

        {status === "sent" && (
          <div className="bg-brand/10 border border-brand/30 text-brand text-sm rounded-lg px-3 py-2 mb-4">
            Verification email resent.
          </div>
        )}
        {status === "error" && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-3 py-2 mb-4">
            Couldn&apos;t resend right now. Try again shortly.
          </div>
        )}

        <button onClick={resend} disabled={cooldown > 0} className="btn-ghost">
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </button>
      </div>
    </div>
  );
}
