"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const USERNAME_EMAIL_DOMAIN = "mychat.local";

export default function LoginPage() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = "/home";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const normalizeUsername = (value: string) => value.trim().toLowerCase();
  const buildAuthEmail = (name: string) => `${name}@${USERNAME_EMAIL_DOMAIN}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const normalized = normalizeUsername(username);
    if (!normalized || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    const email = buildAuthEmail(normalized);

    if (mode === "signUp") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: normalized },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage("Successfully registered.");
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else if (data.session) {
        window.location.href = "/home";
      } else {
        setMessage("Login successful. Redirecting...");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#e8f0fe] px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[38px] bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 backdrop-blur-sm md:grid-cols-[1.4fr_1fr] md:p-10">
        <div className="flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#0084ff] p-8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] md:p-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/90 shadow-sm shadow-white/10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">M</span>
              MYCHAT
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Welcome to MYCHAT</h1>
              <p className="max-w-xl text-sm leading-7 text-white/85">
              </p>
            </div>
            
          </div>
  
        </div>

        <div className="rounded-[32px] bg-[#f6f8fb] p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)] md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{mode === "signIn" ? "Sign in" : "Create account"}</p>
              <h2 className="text-3xl font-semibold text-slate-950">{mode === "signIn" ? "Username login" : "Register account"}</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signIn" ? "signUp" : "signIn");
                setError(null);
                setMessage(null);
              }}
              className="rounded-full bg-[#dbeafe] px-3 py-2 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#bfdbfe]"
            >
              {mode === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Please enter username"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0084ff] focus:ring-2 focus:ring-[#bfdbfe]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Please enter password"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0084ff] focus:ring-2 focus:ring-[#bfdbfe]"
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-[#0084ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0063d1] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Processing..." : mode === "signIn" ? "Sign In" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
