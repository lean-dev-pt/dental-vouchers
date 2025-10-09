import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, TrendingUp, Users, Sparkles, X, CheckCircle, TrendingDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Landing 1 Style */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Cheques Dentista Logo"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <span className="text-xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Cheques Dentista
              </span>
            </div>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold shadow-lg">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Ultra Simple - Landing 3 Style */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-teal-50/30 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Gestão de Cheques Dentista
            <span className="block mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              que Funciona
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Rastreie, analise e otimize o ciclo completo dos seus cheques dentista numa plataforma simples e poderosa.
          </p>

          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
              Começar Agora
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>

          <p className="text-gray-500 mt-6 text-lg">
            €19/mês ou €190/ano
          </p>
        </div>
      </section>

      {/* Value Props - Simple Row - Landing 3 Style */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rastreio Total</h3>
              <p className="text-gray-600 text-sm">
                Veja o estado de cada cheque em tempo real
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Análises Poderosas</h3>
              <p className="text-gray-600 text-sm">
                Relatórios automáticos e insights valiosos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Utilizador</h3>
              <p className="text-gray-600 text-sm">
                Toda a equipa com acesso organizado
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fácil de Usar</h3>
              <p className="text-gray-600 text-sm">
                Interface intuitiva, simples de usar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution - Before/After - Landing 2 Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Do Caos à Clareza
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja a diferença entre gerir cheques manualmente e com a nossa plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before */}
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <X className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900">Antes</h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Folhas de cálculo confusas e desorganizadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Cheques perdidos ou duplicados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Horas a procurar informação de pagamentos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Impossível saber o estado real em tempo real</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Stress constante com prazos e entregas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* After */}
            <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900">Depois</h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Dashboard visual com cores por estado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Cada cheque rastreado com histórico completo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Encontre qualquer informação em 3 segundos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Visibilidade total em qualquer dispositivo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Paz de espírito e controlo absoluto</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Demo Section - Landing 3 Style */}
      <section className="py-20 bg-gradient-to-br from-teal-50/30 to-cyan-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Veja Como Funciona
              </h2>
              <p className="text-lg text-gray-600">
                Demonstração completa da plataforma em ação
              </p>
            </div>

            <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl border-4 border-teal-200 shadow-2xl overflow-hidden aspect-video">
              {/* YouTube Embed */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/xrJxG6Vdu8g"
                title="Cheques Dentista Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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

      {/* Pricing Section - Landing 1 Style */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Preços Simples e Transparentes
            </h2>
            <p className="text-lg text-gray-600">
              Um único plano com tudo incluído. Sem surpresas, sem taxas escondidas.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-4 border-teal-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center py-4">
                <p className="text-sm font-bold uppercase tracking-wider">Plano Completo</p>
              </div>
              <CardContent className="p-8 lg:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Cheques ilimitados</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Pacientes ilimitados</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Médicos ilimitados</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Relatórios e análises completas</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Acesso móvel total</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Suporte incluído</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Atualizações automáticas</span>
                      </div>
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
          </div>
        </div>
      </section>

      {/* Final CTA Section - Landing 3 Style */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Vamos Simplificar a Gestão da Sua Clínica?
            </h2>
            <p className="text-xl text-teal-50 mb-10">
              Experimente uma forma moderna, visual e eficiente de gerir os seus cheques dentista.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
                Começar Agora
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer - Landing 3 Style */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Cheques Dentista Logo"
                width={32}
                height={32}
                className="rounded-xl"
              />
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
