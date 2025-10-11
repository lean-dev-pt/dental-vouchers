"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

interface EmailConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
}

export function EmailConfirmationDialog({
  open,
  onClose,
  userEmail,
}: EmailConfirmationDialogProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);

    try {
      const res = await fetch("/api/resend-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao reenviar email");
      }

      setResendSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reenviar email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="border-2 border-teal-200">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl">
              <Mail className="h-10 w-10 text-teal-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Confirme o Seu Email
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Por favor, verifique o seu email para confirmar a sua conta.
            <br />
            <span className="font-semibold text-gray-700 mt-2 block">
              {userEmail}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {resendSuccess && (
          <div className="flex items-center gap-2 p-3 bg-teal-50 border-2 border-teal-200 rounded-xl">
            <CheckCircle className="h-5 w-5 text-teal-600" />
            <p className="text-sm text-teal-700 font-medium">
              Email de confirmação reenviado com sucesso!
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isResending || resendSuccess}
            className="w-full sm:w-auto border-2 border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A reenviar...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Reenviado
              </>
            ) : (
              "Reenviar Email de Confirmação"
            )}
          </Button>
          <AlertDialogAction className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
