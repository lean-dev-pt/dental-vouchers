"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Settings,
  CreditCard,
  Package,
  Crown,
  Euro,
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  role: string;
  clinic_id: string;
  clinic?: {
    id: string;
    name: string;
    default_voucher_amount?: number;
  };
}

interface Subscription {
  id: string;
  clinic_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan_type: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
}

function AccountPageContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'geral';

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [defaultVoucherAmount, setDefaultVoucherAmount] = useState<string>("");
  const [savingAmount, setSavingAmount] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();

        // Get user auth data
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.email) {
          setUserEmail(authData.user.email);
        }

        // Get profile with clinic data
        const { data: profileData } = await supabase
          .from("profiles")
          .select(`
            *,
            clinic:clinics(*)
          `)
          .eq("user_id", authData?.user?.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          // Set the default voucher amount from clinic data
          if (profileData.clinic?.default_voucher_amount) {
            const formattedAmount = profileData.clinic.default_voucher_amount
              .toFixed(2)
              .replace('.', ',');
            setDefaultVoucherAmount(formattedAmount);
          }

          // Fetch subscription data
          const { data: subscriptionData } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("clinic_id", profileData.clinic_id)
            .single();

          if (subscriptionData) {
            setSubscription(subscriptionData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "from-purple-400 to-violet-500";
      case "doctor":
        return "from-emerald-400 to-green-500";
      case "staff":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "doctor":
        return "Médico";
      case "staff":
        return "Funcionário";
      default:
        return role;
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Replace dot with comma
    value = value.replace('.', ',');

    // Only allow numbers and one comma
    const regex = /^\d*,?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setDefaultVoucherAmount(value);
    }
  };

  const saveDefaultAmount = async () => {
    if (!profile?.clinic_id) return;

    setSavingAmount(true);
    try {
      const supabase = createClient();

      // Convert comma to dot for database storage
      const numericAmount = parseFloat(defaultVoucherAmount.replace(',', '.')) || 0;

      const { error } = await supabase
        .from("clinics")
        .update({ default_voucher_amount: numericAmount })
        .eq("id", profile.clinic_id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        clinic: prev.clinic ? {
          ...prev.clinic,
          default_voucher_amount: numericAmount
        } : undefined
      } : null);

      // Show success (you could add a toast here)
      console.log("Valor guardado com sucesso");
    } catch (error) {
      console.error("Error saving default amount:", error);
    } finally {
      setSavingAmount(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await res.json();

      console.log('Portal API response:', { status: res.status, data });

      if (!res.ok) {
        const errorMessage = data.error || 'Erro desconhecido';
        alert(`Erro ao abrir portal de subscrição: ${errorMessage}\n\nPor favor contacte o suporte se o problema persistir.`);
        console.error('Portal API error:', { status: res.status, error: data.error });
        return;
      }

      if (data.url) {
        console.log('Redirecting to Stripe Customer Portal:', data.url);
        window.location.href = data.url;
      } else {
        alert('Erro: Não foi possível obter o URL do portal de subscrição.\n\nPor favor contacte o suporte.');
        console.error('Portal session created but no URL returned:', data);
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Erro de conexão ao tentar abrir o portal de subscrição.\n\nVerifique sua conexão com a internet e tente novamente.');
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleCheckout = async (planType: 'monthly' | 'annual') => {
    setLoadingCheckout(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoadingCheckout(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'from-emerald-400 to-green-500', text: 'Ativa' };
      case 'trialing':
        return { color: 'from-blue-400 to-cyan-500', text: 'Em Teste' };
      case 'past_due':
        return { color: 'from-amber-400 to-orange-500', text: 'Pagamento Pendente' };
      case 'canceled':
        return { color: 'from-gray-400 to-gray-500', text: 'Cancelada' };
      case 'incomplete':
        return { color: 'from-violet-400 to-purple-500', text: 'Incompleta' };
      default:
        return { color: 'from-gray-400 to-gray-500', text: status };
    }
  };

  const getPlanDisplayName = (planType: string | null) => {
    switch (planType) {
      case 'monthly':
        return 'Mensal (€19/mês)';
      case 'annual':
        return 'Anual (€190/ano)';
      default:
        return 'Plano Desconhecido';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-teal-600">A carregar...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 bg-gradient-to-r from-teal-50/70 via-white to-cyan-50/70 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-teal-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Conta
        </h1>
        <p className="text-gray-600 mt-2">Gerir informações da conta e preferências</p>
      </div>

      {/* Tabs Component */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="inline-flex w-auto bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-1">
            <TabsTrigger
              value="geral"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg font-semibold transition-all px-4 py-2"
            >
              <User className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline data-[state=active]:inline data-[state=active]:ml-2 md:data-[state=active]:ml-0">Geral</span>
            </TabsTrigger>
            <TabsTrigger
              value="configuracoes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg font-semibold transition-all px-4 py-2"
            >
              <Settings className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline data-[state=active]:inline data-[state=active]:ml-2 md:data-[state=active]:ml-0">Configurações</span>
            </TabsTrigger>
            <TabsTrigger
              value="subscricao"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg font-semibold transition-all px-4 py-2"
            >
              <CreditCard className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline data-[state=active]:inline data-[state=active]:ml-2 md:data-[state=active]:ml-0">Subscrição</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Geral Tab */}
        <TabsContent value="geral">
          <div className="grid gap-6">
            {/* User Information Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Informações do Utilizador
                </CardTitle>
                <CardDescription>
                  Dados pessoais e de autenticação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={profile?.name || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userEmail || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Função</Label>
                  <div className="flex items-center gap-3">
                    <Badge className={`bg-gradient-to-r ${getRoleBadgeColor(profile?.role || "")} text-white border-0 px-4 py-1`}>
                      {getRoleDisplayName(profile?.role || "")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinic Information Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Informações da Clínica
                </CardTitle>
                <CardDescription>
                  Dados da clínica associada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Nome da Clínica</Label>
                  <Input
                    id="clinic-name"
                    value={profile?.clinic?.name || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações Tab */}
        <TabsContent value="configuracoes">
          <div className="grid gap-6">

            {/* Business Settings Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-emerald-600" />
                  Configurações de Negócio
                </CardTitle>
                <CardDescription>
                  Definições relacionadas com o negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="default-voucher-amount">
                    Valor por defeito dos Cheques
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                      <Input
                        id="default-voucher-amount"
                        type="text"
                        value={defaultVoucherAmount}
                        onChange={handleAmountChange}
                        placeholder="40,00"
                        className="pl-8"
                      />
                    </div>
                    <Button
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                      onClick={saveDefaultAmount}
                      disabled={savingAmount}
                    >
                      {savingAmount ? "A guardar..." : "Guardar"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Este valor será usado automaticamente ao criar novos cheques
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscrição Tab */}
        <TabsContent value="subscricao">
          <div className="grid gap-6">
            {/* Current Plan Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  Plano Atual
                </CardTitle>
                <CardDescription>
                  Detalhes da sua subscrição
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {subscription ? (
                  <>
                    <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-teal-800">
                          {getPlanDisplayName(subscription.plan_type)}
                        </h3>
                        <Badge className={`bg-gradient-to-r ${getStatusBadge(subscription.status).color} text-white`}>
                          <Crown className="w-3 h-3 mr-1" />
                          {getStatusBadge(subscription.status).text}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p>✓ Gestão ilimitada de cheques dentista</p>
                        <p>✓ Relatórios avançados</p>
                        <p>✓ Suporte prioritário</p>
                        <p>✓ Múltiplos utilizadores</p>
                      </div>
                      <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Período atual:</span>
                          <span className="font-medium">{formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Renovação:</span>
                          <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
                        </div>
                        {subscription.cancel_at_period_end && (
                          <div className="flex justify-between text-amber-600">
                            <span>Status:</span>
                            <span className="font-medium">Cancelará no final do período</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      onClick={handleManageSubscription}
                      disabled={loadingPortal}
                    >
                      {loadingPortal ? "A carregar..." : "Gerir Subscrição"}
                    </Button>
                  </>
                ) : (
                  <div className="py-8">
                    <div className="text-center mb-8">
                      <Package className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete a sua subscrição</h3>
                      <p className="text-gray-600 mb-4">Escolha um plano para aceder a todas as funcionalidades do Cheques Dentista</p>
                      <div className="inline-block bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-2">
                        <p className="text-amber-800 font-semibold">⚠️ Sem subscrição ativa, o acesso ao dashboard está limitado</p>
                      </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {/* Monthly Plan */}
                      <div className="border-2 border-teal-200 rounded-2xl p-6 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-teal-800 mb-2">Plano Mensal</h4>
                          <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">€19</span>
                            <span className="text-gray-600">/mês</span>
                          </div>
                        </div>
                        <div className="space-y-3 mb-6">
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-teal-500">✓</span> Gestão ilimitada de cheques
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-teal-500">✓</span> Múltiplos utilizadores
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-teal-500">✓</span> Relatórios avançados
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-teal-500">✓</span> Suporte prioritário
                          </p>
                        </div>
                        <Button
                          onClick={() => handleCheckout('monthly')}
                          disabled={loadingCheckout}
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          {loadingCheckout ? "A carregar..." : "Começar Agora"}
                        </Button>
                      </div>

                      {/* Annual Plan */}
                      <div className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative">
                        <div className="absolute -top-3 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          POUPE 17%
                        </div>
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-purple-800 mb-2">Plano Anual</h4>
                          <div className="flex items-baseline justify-center gap-2 mb-1">
                            <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">€190</span>
                            <span className="text-gray-600">/ano</span>
                          </div>
                          <p className="text-sm text-gray-600">Apenas €15,83/mês</p>
                        </div>
                        <div className="space-y-3 mb-6">
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-500">✓</span> Gestão ilimitada de cheques
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-500">✓</span> Múltiplos utilizadores
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-500">✓</span> Relatórios avançados
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-500">✓</span> Suporte prioritário
                          </p>
                          <p className="flex items-center gap-2 text-purple-700 font-semibold">
                            <span className="text-purple-500">✓</span> Poupe €38/ano
                          </p>
                        </div>
                        <Button
                          onClick={() => handleCheckout('annual')}
                          disabled={loadingCheckout}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          {loadingCheckout ? "A carregar..." : "Começar Agora"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-8">
                      Pagamento seguro processado pela Stripe • Cancele a qualquer momento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-teal-600">A carregar...</div>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  );
}