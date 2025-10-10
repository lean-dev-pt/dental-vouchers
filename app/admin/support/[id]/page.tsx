"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Building2,
  Mail,
  Calendar,
  Receipt,
  CreditCard,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type TicketType = "bug" | "feature" | "question";
type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high";

interface SupportTicket {
  id: string;
  clinic_id: string;
  user_id: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  clinic: {
    name: string;
    created_at: string;
  };
  user: {
    email: string;
  };
}

interface SupportMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  author_type: "user" | "admin";
  message: string;
  created_at: string;
  author: {
    email: string;
  };
}

interface ClinicStats {
  voucher_count: number;
  subscription_status: string | null;
  subscription_plan: string | null;
}

const ticketTypeConfig = {
  bug: { label: "Bug", icon: Bug, gradient: "from-red-400 to-orange-500" },
  feature: { label: "Funcionalidade", icon: Lightbulb, gradient: "from-yellow-400 to-amber-500" },
  question: { label: "Pergunta", icon: HelpCircle, gradient: "from-blue-400 to-cyan-500" },
};

const ticketStatusConfig = {
  open: { label: "Aberto", gradient: "from-amber-400 to-orange-500", icon: AlertCircle },
  in_progress: { label: "Em Progresso", gradient: "from-violet-400 to-purple-500", icon: Clock },
  waiting_customer: { label: "Aguarda Resposta", gradient: "from-blue-400 to-indigo-500", icon: MessageSquare },
  resolved: { label: "Resolvido", gradient: "from-emerald-400 to-green-500", icon: CheckCircle },
  closed: { label: "Fechado", gradient: "from-pink-400 to-rose-500", icon: CheckCircle },
};

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [clinicStats, setClinicStats] = useState<ClinicStats | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSupportAdmin, setIsSupportAdmin] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/auth/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userData.user.id)
      .single();

    if (profile?.role !== "support_admin") {
      toast({
        title: "Acesso Negado",
        description: "Não tem permissões para aceder a esta área.",
        variant: "destructive",
      });
      router.push("/dashboard");
      return;
    }

    setIsSupportAdmin(true);
    fetchTicketDetails();
  };

  const fetchTicketDetails = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Fetch ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from("support_tickets")
      .select(`
        *,
        clinic:clinics(name, created_at)
      `)
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticketData) {
      console.error("Error fetching ticket:", ticketError);
      toast({
        title: "Erro",
        description: "Erro ao carregar ticket.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Fetch profile to get user name
    const { data: profileData } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", ticketData.user_id)
      .single();

    const ticketWithUser = {
      ...ticketData,
      user: { email: profileData?.name || "User" }
    };

    setTicket(ticketWithUser as SupportTicket);

    // Fetch messages
    const { data: messagesData, error: messagesError } = await supabase
      .from("support_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true});

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
    } else {
      const messagesWithAuthor = await Promise.all((messagesData || []).map(async (msg) => {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", msg.author_id)
          .single();
        return {
          ...msg,
          author: { email: profileData?.name || "User" }
        };
      }));
      setMessages(messagesWithAuthor as SupportMessage[]);
    }

    // Fetch clinic stats
    if (ticketData) {
      const { data: voucherData } = await supabase
        .from("vouchers")
        .select("id", { count: "exact" })
        .eq("clinic_id", ticketData.clinic_id);

      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("status, plan_type")
        .eq("clinic_id", ticketData.clinic_id)
        .single();

      setClinicStats({
        voucher_count: voucherData?.length || 0,
        subscription_status: subscriptionData?.status || null,
        subscription_plan: subscriptionData?.plan_type || null,
      });
    }

    setIsLoading(false);
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("support_tickets")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar estado.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Estado Atualizado",
      description: `Ticket marcado como ${ticketStatusConfig[newStatus].label}.`,
    });

    setTicket({ ...ticket, status: newStatus });
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    if (!ticket) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("support_tickets")
      .update({ priority: newPriority, updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar prioridade.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Prioridade Atualizada",
      description: `Prioridade alterada para ${newPriority === "high" ? "Alta" : newPriority === "medium" ? "Média" : "Baixa"}.`,
    });

    setTicket({ ...ticket, priority: newPriority });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    setIsSending(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("support_messages").insert({
      ticket_id: ticketId,
      author_id: userData.user?.id,
      author_type: "admin",
      message: newMessage,
    });

    if (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
      setIsSending(false);
      return;
    }

    // Update ticket status to waiting_customer if it was open
    if (ticket.status === "open" || ticket.status === "in_progress") {
      await supabase
        .from("support_tickets")
        .update({ status: "waiting_customer", updated_at: new Date().toISOString() })
        .eq("id", ticketId);
      setTicket({ ...ticket, status: "waiting_customer" });
    }

    setNewMessage("");
    setIsSending(false);
    fetchTicketDetails();

    toast({
      title: "Mensagem Enviada",
      description: "O cliente será notificado.",
    });
  };

  if (!isSupportAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70 p-6 flex items-center justify-center">
        <p className="text-gray-500">A carregar...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70 p-6 flex items-center justify-center">
        <p className="text-gray-500">Ticket não encontrado.</p>
      </div>
    );
  }

  const typeConfig = ticketTypeConfig[ticket.type];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push("/admin/support")}
          className="border-teal-200 hover:bg-teal-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Tickets
        </Button>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-extrabold mb-2">{ticket.subject}</h1>
                <div className="flex items-center gap-2 text-teal-100">
                  <Building2 className="h-4 w-4" />
                  <span className="font-semibold">{ticket.clinic.name}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={`bg-gradient-to-r ${typeConfig.gradient} text-white border-0`}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeConfig.label}
                </Badge>
                <Badge className="bg-white text-teal-700 border-0">
                  ID: {ticket.id.substring(0, 8)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Management */}
            <Card className="p-6 border-2 border-teal-100">
              <h2 className="font-bold text-lg mb-4">Gestão do Ticket</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Estado</label>
                  <Select value={ticket.status} onValueChange={(value) => handleStatusChange(value as TicketStatus)}>
                    <SelectTrigger className="border-2 border-teal-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ticketStatusConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Prioridade</label>
                  <Select value={ticket.priority} onValueChange={(value) => handlePriorityChange(value as TicketPriority)}>
                    <SelectTrigger className="border-2 border-teal-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Initial Description */}
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100">
              <h3 className="font-bold text-lg mb-3">Descrição Inicial</h3>
              <p className="text-gray-900 mb-4">{ticket.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(ticket.created_at).toLocaleString("pt-PT")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{ticket.user.email}</span>
                </div>
              </div>
            </Card>

            {/* Messages Thread */}
            <Card className="p-6 border-2 border-teal-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversação ({messages.length})
              </h3>
              <div className="space-y-4 mb-6">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Ainda não há mensagens neste ticket.</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-xl p-4 border-2 ${
                        message.author_type === "admin"
                          ? "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 ml-4"
                          : "bg-white border-gray-200 mr-4"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                          {message.author_type === "admin" ? "Equipa de Suporte (Você)" : "Cliente"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleString("pt-PT")}
                        </p>
                      </div>
                      <p className="text-gray-900">{message.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Box */}
              {ticket.status !== "closed" && (
                <div className="space-y-3 pt-4 border-t-2 border-teal-100">
                  <label className="text-sm font-semibold text-gray-700">Responder ao Cliente</label>
                  <Textarea
                    placeholder="Escreva a sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="border-2 border-teal-100"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                    >
                      {isSending ? "A enviar..." : "Enviar Mensagem"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Clinic Info */}
          <div className="space-y-6">
            {/* Clinic Details */}
            <Card className="p-6 border-2 border-teal-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informação da Clínica
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nome</p>
                  <p className="font-semibold text-gray-900">{ticket.clinic.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email de Contacto</p>
                  <p className="font-semibold text-gray-900">{ticket.user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cliente desde</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(ticket.clinic.created_at).toLocaleDateString("pt-PT")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Clinic Stats */}
            {clinicStats && (
              <Card className="p-6 border-2 border-teal-100">
                <h3 className="font-bold text-lg mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-semibold text-gray-700">Total Cheques</span>
                    </div>
                    <span className="text-lg font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {clinicStats.voucher_count}
                    </span>
                  </div>
                  {clinicStats.subscription_status && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-semibold text-gray-700">Subscrição</span>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-gradient-to-r from-violet-400 to-purple-500 text-white border-0">
                          {clinicStats.subscription_status}
                        </Badge>
                        {clinicStats.subscription_plan && (
                          <p className="text-xs text-gray-600 mt-1">
                            {clinicStats.subscription_plan === "monthly" ? "Mensal" : "Anual"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6 border-2 border-teal-100">
              <h3 className="font-bold text-lg mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-teal-200 hover:bg-teal-50"
                  onClick={() => handleStatusChange("in_progress")}
                  disabled={ticket.status === "in_progress"}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Marcar Em Progresso
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                  onClick={() => handleStatusChange("resolved")}
                  disabled={ticket.status === "resolved" || ticket.status === "closed"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar Resolvido
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-pink-200 hover:bg-pink-50"
                  onClick={() => handleStatusChange("closed")}
                  disabled={ticket.status === "closed"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Fechar Ticket
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
