"use client";

import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/lib/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = "/";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
      />
    </div>
  );
}
