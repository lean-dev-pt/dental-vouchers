"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { translateError } from "@/lib/error-messages";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Por favor introduza um endereço de email válido");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Check user role to determine redirect destination
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", userData.user.id)
          .single();

        // Redirect support admins to admin area
        if (profile?.role === "support_admin") {
          router.push("/admin/support");
        } else {
          // Regular users go to dashboard
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      setError(translateError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-teal-200 shadow-2xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl">
              <LogIn className="h-10 w-10 text-teal-600" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Entrar
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Introduza o seu email para aceder à sua conta
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input
                  id="email"
                  type="text"
                  inputMode="email"
                  placeholder="exemplo@clinica.pt"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 focus:border-teal-400"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-semibold">Palavra-passe</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm text-teal-600 hover:text-teal-700 underline-offset-4 hover:underline"
                  >
                    Esqueceu-se da palavra-passe?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 focus:border-teal-400"
                />
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
                {isLoading ? "A entrar..." : "Entrar"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Ainda não tem conta?{" "}
              <Link
                href="/auth/sign-up"
                className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-4"
              >
                Registar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
