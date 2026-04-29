"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    });
  }, []);

  if (!user) {
    return <div className="p-10 text-slate-500">Loading...</div>;
  }

  const displayName =
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "Guest";

  return (
    <main className="min-h-screen bg-[#f0f2f5] px-4 py-8 text-slate-900">
      <h1 className="text-3xl font-semibold">Welcome, {displayName}</h1>
      <p className="mt-4 text-slate-600">Your chats will appear here...</p>
    </main>
  );
}
