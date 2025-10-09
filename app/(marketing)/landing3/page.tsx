"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Receipt,
  Clock,
  TrendingUp,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function Landing3() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Minimal Header */}
      <header className="border-b bg-white py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-xl">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Cheques Dentista</span>
            </div>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600 hover:text-teal-600 font-medium">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Ultra Simple */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-teal-50/30 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Gestão de Cheques Dentista
            <span className="block mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              que Funciona
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Rastreie, analise e otimize o ciclo completo dos seus vouchers dentários numa plataforma simples e poderosa.
          </p>

          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
              Começar Agora
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>

          <p className="text-gray-500 mt-6 text-lg">
            €19/mês ou €190/ano • Configure em 5 minutos
          </p>
        </div>
      </section>

      {/* Value Props - Simple Row */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rastreamento Total</h3>
              <p className="text-gray-600 text-sm">
                Veja o estado de cada cheque em tempo real
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Poderosos</h3>
              <p className="text-gray-600 text-sm">
                Relatórios automáticos e insights valiosos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile-First</h3>
              <p className="text-gray-600 text-sm">
                Aceda de qualquer lugar, qualquer dispositivo
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Seguro</h3>
              <p className="text-gray-600 text-sm">
                Conformidade RGPD e dados encriptados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Demo Embed Placeholder */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Veja Como Funciona
              </h2>
              <p className="text-lg text-gray-600">
                30 segundos para entender por que é diferente
              </p>
            </div>

            <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl border-4 border-teal-200 shadow-2xl overflow-hidden aspect-video">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white rounded-full p-6 shadow-xl mb-4 inline-block">
                    <Receipt className="h-12 w-12 text-teal-600" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    Demonstração do Dashboard em Ação
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Vídeo de 30 segundos mostrando interface real
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing High Up */}
      <section className="py-20 bg-white border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Preço Transparente
              </h2>
              <p className="text-lg text-gray-600">
                Sem truques. Sem taxas escondidas. Apenas um preço justo.
              </p>
            </div>

            <Card className="border-4 border-teal-200 shadow-2xl">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-3 mb-3">
                    <span className="text-6xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      €19
                    </span>
                    <span className="text-2xl text-gray-600 font-medium">/mês</span>
                  </div>
                  <p className="text-gray-500 text-lg mb-3">Faturado mensalmente</p>
                  <div className="inline-block bg-teal-50 border-2 border-teal-200 rounded-xl px-6 py-3">
                    <p className="text-teal-700 font-bold">
                      ou €190/ano <span className="text-teal-600">(poupe €38)</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3 justify-center">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">Utilizadores ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">Cheques ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">Todos os recursos incluídos</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">Suporte prioritário</span>
                  </div>
                </div>

                <Link href="/auth/sign-up" className="block">
                  <Button size="lg" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-xl py-7 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    Começar Agora
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>

                <p className="text-center text-gray-500 mt-6 text-sm">
                  Cancele a qualquer momento. Sem perguntas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof - Simple */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Junte-se às Clínicas Que Já Poupam Tempo
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Mais de 50 clínicas dentárias em Portugal já confiam na nossa plataforma
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-teal-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    70%
                  </div>
                  <p className="text-gray-700 font-medium">
                    Redução no tempo administrativo
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-teal-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                    0
                  </div>
                  <p className="text-gray-700 font-medium">
                    Cheques perdidos ou esquecidos
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-teal-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    5min
                  </div>
                  <p className="text-gray-700 font-medium">
                    Para configurar e começar a usar
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Começar Agora - €19/mês
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Pronto Para Começar?
            </h2>
            <p className="text-xl text-teal-50 mb-10">
              Configure em 5 minutos. Comece a poupar tempo hoje.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
                Começar Agora
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <p className="text-teal-100 mt-6 text-sm">
              Sem cartão de crédito necessário
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-xl">
                <Receipt className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">Cheques Dentista</span>
            </div>
            <p className="text-sm">
              © 2025 Cheques Dentista. Feito em Portugal. RGPD Compliant.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-teal-400 transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">Termos</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
