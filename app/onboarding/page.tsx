"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "annual";

  const [status, setStatus] = useState<"loading" | "creating" | "redirecting" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState<string | null>(null);

  useEffect(() => {
    async function completeOnboarding() {
      try {
        setStatus("loading");

        // Get current user
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User not found:", userError);
          setErrorMessage("Utilizador não encontrado. Por favor faça login novamente.");
          setStatus("error");
          setTimeout(() => router.push("/auth/login"), 3000);
          return;
        }

        // Check if clinic already exists (user might have refreshed the page)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("clinic_id")
          .eq("user_id", user.id)
          .single();

        if (existingProfile?.clinic_id) {
          // Clinic already created, go directly to checkout
          setStatus("redirecting");
          await initiateCheckout(plan);
          return;
        }

        // Create clinic and profile
        setStatus("creating");
        const clinicNameFromMetadata = user.user_metadata?.clinicName || "A Sua Clínica";
        setClinicName(clinicNameFromMetadata);

        const onboardingRes = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            clinicName: clinicNameFromMetadata,
            ownerName: user.user_metadata?.ownerName,
            phone: user.user_metadata?.phone,
            dpaConsent: user.user_metadata?.dpaConsent,
          }),
        });

        if (!onboardingRes.ok) {
          const errorData = await onboardingRes.json();
          throw new Error(errorData.error || "Erro ao criar clínica");
        }

        // Clinic created successfully, proceed to checkout
        setStatus("redirecting");
        await initiateCheckout(plan);

      } catch (error) {
        console.error("Onboarding error:", error);
        setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro");
        setStatus("error");
      }
    }

    completeOnboarding();
  }, [plan, router]);

  async function initiateCheckout(planType: string) {
    try {
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType }),
      });

      if (!checkoutRes.ok) {
        const errorData = await checkoutRes.json();
        throw new Error(errorData.error || "Erro ao iniciar checkout");
      }

      const checkoutData = await checkoutRes.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error("URL de checkout não encontrado");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Erro ao iniciar pagamento");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70 p-4">
      <Card className="w-full max-w-md border-2 border-teal-200 shadow-2xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center justify-center">
            {status === "error" ? (
              <div className="bg-red-100 p-4 rounded-2xl">
                <X className="h-12 w-12 text-red-600" />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl">
                {status === "loading" || status === "creating" ? (
                  <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-12 w-12 text-teal-600" />
                )}
              </div>
            )}
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {status === "error" ? "Erro" : "Email Confirmado!"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === "loading" && (
            <div className="text-center space-y-3">
              <p className="text-lg text-gray-700">
                A verificar informações...
              </p>
            </div>
          )}

          {status === "creating" && clinicName && (
            <div className="space-y-4">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-teal-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">A criar clínica:</p>
                    <p className="text-lg font-bold text-teal-700">{clinicName}</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-600">
                A preparar o seu perfil...
              </p>
            </div>
          )}

          {status === "redirecting" && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Tudo pronto!
                </p>
                <p className="text-gray-600">
                  A redirecionar para o pagamento...
                </p>
              </div>
              <div className="animate-pulse bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full w-3/4 mx-auto"></div>
            </div>
          )}

          {status === "error" && errorMessage && (
            <div className="space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
              <p className="text-center text-sm text-gray-600">
                A redirecionar para o login...
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Plano selecionado:</span>
            <span className="font-semibold text-teal-700">
              {plan === "monthly" ? "Mensal (€19/mês)" : "Anual (€190/ano)"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
