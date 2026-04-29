"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 text-slate-500">
        Loading your messenger homepage...
      </div>
    );
  }

  const displayName =
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "Guest";

  return (
    <main className="min-h-screen bg-[#f0f2f5] px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[34px] bg-white shadow-[0_35px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 md:grid-cols-[320px_1fr]">
        <aside className="border-r border-slate-200 bg-[#f7f9fb] p-6">
          <div className="flex items-center justify-between gap-3 rounded-[28px] bg-[#0084ff] px-4 py-3 text-white shadow-sm shadow-[#0b5ac4]/20">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Chats</p>
              <h2 className="text-xl font-semibold">myChat</h2>
            </div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-white">M</div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0084ff] focus:ring-2 focus:ring-[#bfdbfe]"
            />
          </div>

          <div className="mt-6 space-y-4">
            {[
              { name: "Alex", message: "Are we meeting today?", time: "2m" },
              { name: "Jade", message: "Great, I finished it.", time: "10m" },
              { name: "Sam", message: "Thanks!", time: "1h" },
            ].map((item) => (
              <div key={item.name} className="group flex items-center justify-between gap-4 rounded-[24px] bg-white px-4 py-4 shadow-sm transition hover:bg-[#eef4ff]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#dbeafe] text-lg font-bold text-[#1d4ed8]">{item.name[0]}</div>
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.message}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-64px)] flex-col bg-[#e9efff] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 rounded-[28px] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
              <h1 className="text-2xl font-semibold text-slate-950">{displayName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#1d4ed8]">Online</div>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 flex-1 overflow-hidden rounded-[36px] bg-[#f3f6ff] p-6 shadow-inner shadow-slate-200/20">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-4 overflow-y-auto pr-2">
                <div className="max-w-[72%] rounded-[28px] bg-white px-5 py-4 text-sm text-slate-900 shadow-sm">
                  <div className="text-slate-600">Hey {displayName}, welcome to your Messenger-style homepage!</div>
                  <div className="mt-2 text-xs text-slate-400">10:12 AM</div>
                </div>
                <div className="ml-auto max-w-[70%] rounded-[28px] bg-[#0084ff] px-5 py-4 text-sm text-white shadow-sm">
                  <div>Everything is set. Use the left panel to choose a chat.</div>
                  <div className="mt-2 text-right text-xs text-slate-200">10:14 AM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <input
                type="text"
                disabled
                value="Type a message..."
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />
              <button className="rounded-full bg-[#0084ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0063d1]">Send</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
