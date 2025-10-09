"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Receipt,
  Clock,
  BarChart3,
  Shield,
  Smartphone,
  CheckCircle2,
  Star,
  Building2,
  ArrowRight,
  Zap,
  TrendingUp,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function Landing1() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-xl">
                <Receipt className="h-6 w-6 text-white" />
              </div>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20 lg:py-32">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200 opacity-20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 text-sm font-bold px-4 py-2 rounded-full border-2 border-teal-200">
                Solução Portuguesa para Clínicas Dentárias
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Gestão de Cheques Dentista
              <span className="block mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Simplificada e Segura
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A única plataforma que precisa para gerir o ciclo completo dos seus cheques dentista.
              Rastreamento automático, relatórios em tempo real, e pagamentos sempre organizados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <span className="text-sm text-gray-500">
                Apenas €19/mês • Sem período de teste
              </span>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <span>Seguro e Conformidade RGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-teal-600" />
                <span>Dados Encriptados</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                <span>Para Clínicas Portuguesas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Confiado por Clínicas em Todo o País
            </h2>
            <p className="text-gray-600">
              Junte-se às clínicas que já economizam horas todas as semanas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Finalmente uma solução que entende o sistema português. Reduzimos o tempo administrativo em 70% e nunca mais perdemos um cheque."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    MC
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Dra. Maria Costa</p>
                    <p className="text-sm text-gray-500">Clínica DentaCare, Lisboa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Os relatórios em tempo real mudaram completamente como gerimos os pagamentos da ARS. Visibilidade total em segundos."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    JS
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Dr. João Santos</p>
                    <p className="text-sm text-gray-500">SmileClinic, Porto</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Interface intuitiva e suporte excecional. Implementámos em menos de uma hora e toda a equipa adora usar."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    AF
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Ana Ferreira</p>
                    <p className="text-sm text-gray-500">Gestora, DentalPro, Braga</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Tudo o Que Precisa Numa Única Plataforma
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Funcionalidades desenhadas especificamente para o fluxo de trabalho das clínicas dentárias portuguesas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-2 border-teal-100 hover:shadow-xl transition-all hover:scale-105 transform">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-teal-400 to-cyan-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Rastreamento Completo
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Acompanhe cada cheque desde a entrega até ao pagamento final. 6 estados do ciclo de vida com histórico completo.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-emerald-100 hover:shadow-xl transition-all hover:scale-105 transform">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-emerald-400 to-green-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Relatórios em Tempo Real
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dashboards visuais com métricas de desempenho por médico, análise de fluxo de caixa e exportação CSV.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-violet-100 hover:shadow-xl transition-all hover:scale-105 transform">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-violet-400 to-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Acesso Móvel
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Interface mobile-first para gerir cheques em qualquer lugar. Trabalhe do consultório, casa ou em movimento.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 border-blue-100 hover:shadow-xl transition-all hover:scale-105 transform">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Segurança RGPD
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Conformidade total com regulamentos europeus. Dados encriptados, backups automáticos e auditoria completa.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 border-pink-100 hover:shadow-xl transition-all hover:scale-105 transform">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Entrada Rápida
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Adicione até 3 cheques simultaneamente com valores pré-configurados. Interface otimizada para velocidade.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 border-amber-100 hover:shadow-xl transition-all hover:scale-105 transform">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Análise de Desempenho
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Métricas individuais por médico, tempos de processamento e identificação de gargalos no fluxo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
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
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-6">
                      Cheques Dentista Pro
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Utilizadores ilimitados</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Cheques ilimitados</span>
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
                        <span className="text-gray-700">Suporte prioritário por email</span>
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

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Pronto Para Simplificar a Gestão da Sua Clínica?
            </h2>
            <p className="text-lg text-teal-50 mb-8">
              Junte-se às clínicas que já transformaram a forma como gerem os seus cheques dentista.
              Configure em minutos, comece a poupar tempo hoje.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                Começar Agora - Apenas €19/mês
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-teal-100 mt-4">
              Sem cartão de crédito necessário para começar
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-xl">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">
                  Cheques Dentista
                </span>
              </div>
              <p className="text-sm text-gray-400">
                A solução completa para gestão de vouchers dentários em Portugal.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Segurança</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Contacto</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 Cheques Dentista. Todos os direitos reservados. RGPD Compliant.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
