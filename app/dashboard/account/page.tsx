"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  Bell,
  Package,
  TrendingUp,
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

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [defaultVoucherAmount, setDefaultVoucherAmount] = useState<string>("");
  const [savingAmount, setSavingAmount] = useState(false);

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
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-1">
          <TabsTrigger
            value="geral"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg font-semibold transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger
            value="configuracoes"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg font-semibold transition-all"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
          <TabsTrigger
            value="subscricao"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg font-semibold transition-all"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Subscrição
          </TabsTrigger>
        </TabsList>

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
            {/* Notifications Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-600" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Preferências de notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <Label htmlFor="email-notifications" className="cursor-pointer">
                    Notificações por email
                  </Label>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <Label htmlFor="voucher-alerts" className="cursor-pointer">
                    Alertas de cheques
                  </Label>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-teal-800">Plano Profissional</h3>
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Gestão ilimitada de cheques dentista</p>
                    <p>✓ Relatórios avançados</p>
                    <p>✓ Suporte prioritário</p>
                    <p>✓ Múltiplos utilizadores</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Estatísticas de Utilização
                </CardTitle>
                <CardDescription>
                  Resumo da utilização este mês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-teal-700">0</p>
                    <p className="text-sm text-gray-600">Cheques processados</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-700">0</p>
                    <p className="text-sm text-gray-600">Pacientes ativos</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-violet-700">0</p>
                    <p className="text-sm text-gray-600">Médicos registados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Options Card */}
            <Card className="border-2 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-violet-600" />
                  Opções de Upgrade
                </CardTitle>
                <CardDescription>
                  Melhore o seu plano para mais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  disabled
                >
                  Em breve - Novos planos disponíveis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}