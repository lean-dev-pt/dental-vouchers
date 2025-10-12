"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Building2, User, ArrowRight } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [dpaConsent, setDpaConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'annual';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Validation
    if (password !== repeatPassword) {
      setError("As palavras-passe não coincidem");
      setIsLoading(false);
      return;
    }

    if (!clinicName.trim()) {
      setError("O nome da clínica é obrigatório");
      setIsLoading(false);
      return;
    }

    if (!dpaConsent) {
      setError("Deve aceitar o Acordo de Processamento de Dados para continuar");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user with clinic info in metadata
      console.log("Attempting signup with email:", email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            clinicName: clinicName.trim(),
            ownerName: ownerName.trim() || null,
            phone: phone.trim() || null,
            dpaConsent: dpaConsent,
            plan: plan,
          },
        },
      });

      console.log("Signup response:", { authData, authError });

      if (authError) {
        console.error("Signup error:", authError);
        throw authError;
      }
      if (!authData.user) {
        console.error("No user in signup response");
        throw new Error("Falha ao criar utilizador");
      }

      console.log("User created successfully:", authData.user.id);

      // Redirect to check-email page
      window.location.href = `/auth/check-email?email=${encodeURIComponent(email)}`;
    } catch (error: unknown) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-teal-200 shadow-2xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl">
              <Building2 className="h-10 w-10 text-teal-600" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Criar Conta
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {plan === 'monthly' ? 'Plano Mensal (€19/mês)' : 'Plano Anual (€190/ano)'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">
              {/* Clinic Information Section */}
              <div className="space-y-4 pb-4 border-b-2 border-teal-100">
                <h3 className="font-bold text-sm text-teal-700 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Informações da Clínica
                </h3>

                <div className="grid gap-2">
                  <Label htmlFor="clinic-name" className="font-semibold">
                    Nome da Clínica <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clinic-name"
                    type="text"
                    placeholder="ex: Clínica Dentária Lisboa"
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="border-2 focus:border-teal-400"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="owner-name" className="font-semibold">
                    Nome do Responsável <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="owner-name"
                    type="text"
                    placeholder="ex: Dr. João Silva"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="border-2 focus:border-teal-400"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Telefone <span className="text-gray-400 text-xs">(opcional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="ex: 21 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-2 focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Account Information Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-teal-700 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados de Acesso
                </h3>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-semibold">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@clinica.pt"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 focus:border-teal-400"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-semibold">Palavra-passe <span className="text-red-500">*</span></Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 focus:border-teal-400"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="font-semibold">Repetir Palavra-passe <span className="text-red-500">*</span></Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="border-2 focus:border-teal-400"
                  />
                </div>
              </div>

              {/* DPA Consent Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-teal-50 border-2 border-teal-200 rounded-xl">
                <input
                  type="checkbox"
                  id="dpa-consent"
                  checked={dpaConsent}
                  onChange={(e) => setDpaConsent(e.target.checked)}
                  className="mt-1 h-5 w-5 text-teal-600 border-2 border-teal-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="dpa-consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  <span className="font-semibold text-gray-900">Declaro que</span> a minha clínica obteve todos os consentimentos necessários
                  dos pacientes e médicos dentistas para o tratamento dos seus dados pessoais, incluindo consentimento parental
                  para menores de 16 anos, conforme o RGPD. Li e aceito o{" "}
                  <Link href="/dpa" target="_blank" className="text-teal-600 font-semibold hover:underline">
                    Acordo de Processamento de Dados
                  </Link>
                  .
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all mt-2"
                disabled={isLoading}
              >
                {isLoading ? "A processar..." : "Criar Conta e Continuar"}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Ao criar conta, será redirecionado para o pagamento seguro via Stripe
              </p>
            </div>
            <div className="mt-6 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
