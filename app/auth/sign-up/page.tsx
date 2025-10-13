import { Suspense } from "react";
import { SignUpForm } from "@/components/sign-up-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // If user is already logged in, redirect to dashboard
  if (data?.claims) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70">
      <div className="w-full max-w-2xl">
        <Suspense fallback={<div>A carregar...</div>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
