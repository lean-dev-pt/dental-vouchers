import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  variant?: 'default' | 'compact';
  showAnnual?: boolean;
  className?: string;
}

export function PricingCard({
  variant = 'default',
  showAnnual = true,
  className = ''
}: PricingCardProps) {
  const features = [
    "Utilizadores ilimitados",
    "Cheques ilimitados",
    "Relatórios e análises completas",
    "Acesso móvel total",
    "Suporte prioritário por email",
    "Atualizações automáticas"
  ];

  if (variant === 'compact') {
    return (
      <Card className={`border-4 border-teal-200 shadow-2xl ${className}`}>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                €19
              </span>
              <span className="text-gray-600 font-medium text-xl">/mês</span>
            </div>
            {showAnnual && (
              <p className="text-gray-500">ou €190/ano (poupe €38)</p>
            )}
          </div>

          <Link href="/auth/sign-up" className="block">
            <Button size="lg" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="text-center text-sm text-gray-500 mt-4">
            Cancele a qualquer momento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-4 border-teal-200 shadow-2xl overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center py-4">
        <p className="text-sm font-bold uppercase tracking-wider">Plano Completo</p>
      </div>
      <CardContent className="p-8 lg:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6">
              Cheques Dentista Pro
            </h3>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-teal-100">
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  €19
                </span>
                <span className="text-gray-600 font-medium">/mês</span>
              </div>
              <p className="text-sm text-gray-500">faturado mensalmente</p>
            </div>

            {showAnnual && (
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-extrabold text-teal-700">
                    €190
                  </span>
                  <span className="text-gray-600 font-medium">/ano</span>
                </div>
                <p className="text-sm font-bold text-teal-700">
                  Poupe €38 por ano
                </p>
              </div>
            )}

            <Link href="/auth/sign-up" className="block">
              <Button size="lg" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <p className="text-center text-sm text-gray-500 mt-4">
              Cancele a qualquer momento
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
