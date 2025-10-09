"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Receipt,
  Clock,
  HandHeart,
  CheckCircle,
  Send,
  Banknote,
  UserCheck,
  ArrowRight,
  PlayCircle,
  X,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Eye
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Landing2() {
  const [activeTab, setActiveTab] = useState<'recebido' | 'utilizado' | 'pago'>('recebido');

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

      {/* Hero Section - Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/30 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy + CTA */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 text-sm font-bold px-4 py-2 rounded-full border-2 border-teal-200 mb-6">
                <Sparkles className="h-4 w-4" />
                Novo em Portugal
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Menos Papelada,
                <span className="block mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Mais Sorrisos
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Transforme o caos dos cheques dentista numa experiência visual e organizada.
                Veja o estado de cada voucher em tempo real com a nossa interface colorida e intuitiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-bold text-lg px-8 py-6 rounded-xl w-full sm:w-auto">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Ver Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    70%
                  </div>
                  <div className="text-gray-600 font-medium">Tempo Poupado</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-gray-600 font-medium">Sem Erros</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-gray-600 font-medium">Acesso Total</div>
                </div>
              </div>
            </div>

            {/* Right: Animated Dashboard Preview */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-teal-200 opacity-20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-cyan-200 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative bg-white rounded-2xl shadow-2xl p-4 border-2 border-teal-200">
                  {/* Mini Dashboard Preview */}
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Receipt className="h-6 w-6" />
                        <span className="font-bold text-lg">Dashboard</span>
                      </div>
                      <div className="text-teal-100 text-sm">Vista em tempo real</div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gradient-to-br from-teal-400 to-cyan-500 p-1.5 rounded-lg">
                            <HandHeart className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-2 py-1 rounded-full">Recebido</span>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-800">23</div>
                        <div className="text-sm font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                          €1,035.00
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-1.5 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold bg-gradient-to-r from-emerald-400 to-green-400 text-white px-2 py-1 rounded-full">Utilizado</span>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-800">18</div>
                        <div className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                          €810.00
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gradient-to-br from-violet-400 to-purple-500 p-1.5 rounded-lg">
                            <Send className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-white px-2 py-1 rounded-full">Submetido</span>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-800">15</div>
                        <div className="text-sm font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                          €675.00
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-1.5 rounded-lg">
                            <Banknote className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-2 py-1 rounded-full">Pago ARS</span>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-800">12</div>
                        <div className="text-sm font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                          €540.00
                        </div>
                      </div>
                    </div>

                    {/* Mini Table */}
                    <div className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-500">Cheque #45123</span>
                          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-2 py-1 rounded-full font-bold">Recebido</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-500">Cheque #45122</span>
                          <span className="bg-gradient-to-r from-emerald-400 to-green-400 text-white px-2 py-1 rounded-full font-bold">Utilizado</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-500">Cheque #45121</span>
                          <span className="bg-gradient-to-r from-violet-400 to-purple-400 text-white px-2 py-1 rounded-full font-bold">Submetido</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution - Before/After */}
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

      {/* Interactive Lifecycle Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Acompanhe Cada Etapa do Ciclo de Vida
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Clique para ver como rastreamos cada estado do seu cheque dentista
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <button
                onClick={() => setActiveTab('recebido')}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  activeTab === 'recebido'
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <HandHeart className="inline h-5 w-5 mr-2" />
                Recebido
              </button>
              <button
                onClick={() => setActiveTab('utilizado')}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  activeTab === 'utilizado'
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <CheckCircle className="inline h-5 w-5 mr-2" />
                Utilizado
              </button>
              <button
                onClick={() => setActiveTab('pago')}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  activeTab === 'pago'
                    ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <UserCheck className="inline h-5 w-5 mr-2" />
                Pago
              </button>
            </div>

            {/* Tab Content */}
            <Card className="border-2 border-teal-200 shadow-xl">
              <CardContent className="p-8">
                {activeTab === 'recebido' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-teal-400 to-cyan-500 p-4 rounded-2xl">
                        <HandHeart className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-900">Estado: Recebido</h3>
                        <p className="text-gray-600">O cheque chegou à clínica e foi registado no sistema</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Quando um paciente entrega um cheque dentista, regista-o imediatamente no sistema.
                        O estado &ldquo;Recebido&rdquo; ativa automaticamente:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Associação ao paciente e médico</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Rastreamento de data de validade</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Adição aos relatórios de performance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'utilizado' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-4 rounded-2xl">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-900">Estado: Utilizado</h3>
                        <p className="text-gray-600">O paciente usou o cheque para tratamento dentário</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Quando o tratamento é concluído e o cheque é consumido, mude o estado para &ldquo;Utilizado&rdquo;.
                        Isto prepara o cheque para:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Submissão à ARS para reembolso</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Contabilização no total utilizado do médico</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Alertas se próximo da validade</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'pago' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-4 rounded-2xl">
                        <UserCheck className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-900">Estado: Pago ao Médico</h3>
                        <p className="text-gray-600">O médico recebeu o pagamento final</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        O estado final do ciclo de vida. Quando marca como &ldquo;Pago ao Médico&rdquo;:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Ciclo completo registado no histórico</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Adicionado aos relatórios financeiros</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Auditoria completa disponível</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Um Preço, Tudo Incluído
            </h2>
            <p className="text-lg text-gray-600">
              Sem truques, sem taxas escondidas. Apenas gestão profissional.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-4 border-teal-300 shadow-2xl">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center py-6">
                <Sparkles className="h-8 w-8 mx-auto mb-2" />
                <p className="text-lg font-extrabold">Tudo o Que Precisa</p>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      €19
                    </span>
                    <span className="text-gray-600 font-medium text-xl">/mês</span>
                  </div>
                  <p className="text-gray-500 mb-6">ou €190/ano (poupe €38)</p>

                  <Link href="/auth/sign-up" className="block">
                    <Button size="lg" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all mb-4">
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <p className="text-sm text-gray-500">
                    Configure em 5 minutos
                  </p>
                </div>

                <div className="space-y-3 border-t pt-6">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700">Interface visual colorida</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700">Rastreamento em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700">Utilizadores ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700">Relatórios e analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Veja a Diferença em Tempo Real
            </h2>
            <p className="text-lg text-teal-50 mb-8">
              Experimente uma forma moderna, visual e eficiente de gerir os seus cheques dentista
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-2 rounded-xl">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">Cheques Dentista</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              © 2025 Cheques Dentista. Feito em Portugal para clínicas portuguesas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
