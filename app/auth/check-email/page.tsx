"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendMessage(null);
    setResendError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          setResendError("Por favor aguarde alguns segundos antes de reenviar");
        } else {
          setResendError(error.message);
        }
      } else {
        setResendMessage("Email reenviado com sucesso! Verifique a sua caixa de entrada.");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      setResendError("Erro ao reenviar email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70 p-4">
      <Card className="w-full max-w-md border-2 border-teal-200 shadow-2xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl">
              <Mail className="h-12 w-12 text-teal-600" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Verifique o Seu Email
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Enviámos um link de confirmação para
            </CardDescription>
            {email && (
              <p className="text-lg font-semibold text-teal-700 mt-2">
                {email}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="flex items-start gap-3 text-left bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
              <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">Próximos Passos:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abra o seu email</li>
                  <li>Clique no link de confirmação</li>
                  <li>Será redirecionado para completar o registo</li>
                </ol>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Não recebeu o email? Verifique a pasta de spam ou lixo eletrónico.
            </p>
          </div>

          {resendMessage && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700 font-medium">{resendMessage}</p>
            </div>
          )}

          {resendError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 font-medium">{resendError}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {isResending ? "A enviar..." : "Reenviar Email"}
            </Button>

            <Link href="/auth/login" className="block">
              <Button
                variant="outline"
                className="w-full border-2 border-teal-300 text-teal-700 hover:bg-teal-50 font-semibold py-6 rounded-xl"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar ao Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
