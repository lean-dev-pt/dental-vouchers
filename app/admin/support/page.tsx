"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Shield,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TicketType = "bug" | "feature" | "question";
type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";

interface SupportTicket {
  id: string;
  clinic_id: string;
  user_id: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: string;
  created_at: string;
  updated_at: string;
  clinic: {
    name: string;
  };
  user: {
    email: string;
  };
  message_count?: number;
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

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSupportAdmin, setIsSupportAdmin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/admin/login");
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
      router.push("/");
      return;
    }

    setIsSupportAdmin(true);
    fetchTickets();
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        clinic:clinics(name),
        message_count:support_messages(count)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tickets.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Fetch user names separately to avoid RLS issues
    const ticketsWithUsers = await Promise.all(
      (data || []).map(async (ticket) => {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", ticket.user_id)
          .single();

        return {
          ...ticket,
          user: { email: profileData?.name || "User" },
          message_count: Array.isArray(ticket.message_count) && ticket.message_count[0]?.count || 0,
        };
      })
    );

    setTickets(ticketsWithUsers as SupportTicket[]);
    setIsLoading(false);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesType = filterType === "all" || ticket.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    in_progress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  };

  if (!isSupportAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Administração de Suporte</h1>
              <p className="text-teal-100 mt-1">Gerir todos os tickets de suporte</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-100">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Total de Tickets</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.total}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Abertos</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.open}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-100">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Em Progresso</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {stats.in_progress}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-100">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Resolvidos</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {stats.resolved}
              </p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 border-2 border-teal-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por assunto, clínica ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-teal-100 focus:border-teal-300"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-[200px] border-2 border-teal-100">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                {Object.entries(ticketStatusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-[200px] border-2 border-teal-100">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {Object.entries(ticketTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tickets Table */}
        <Card className="border-2 border-teal-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50">
                  <TableHead className="font-bold">Clínica</TableHead>
                  <TableHead className="font-bold">Assunto</TableHead>
                  <TableHead className="font-bold">Tipo</TableHead>
                  <TableHead className="font-bold">Estado</TableHead>
                  <TableHead className="font-bold">Prioridade</TableHead>
                  <TableHead className="font-bold">Mensagens</TableHead>
                  <TableHead className="font-bold">Criado</TableHead>
                  <TableHead className="font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      A carregar tickets...
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhum ticket encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => {
                    const typeConfig = ticketTypeConfig[ticket.type];
                    const statusConfig = ticketStatusConfig[ticket.status];
                    const TypeIcon = typeConfig.icon;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow
                        key={ticket.id}
                        className="hover:bg-teal-50/50 cursor-pointer"
                        onClick={() => router.push(`/admin/support/${ticket.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{ticket.clinic.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate font-medium">{ticket.subject}</div>
                          <div className="text-xs text-gray-500 truncate">{ticket.user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`bg-gradient-to-r ${typeConfig.gradient} text-white border-0`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`bg-gradient-to-r ${statusConfig.gradient} text-white border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ticket.priority === "high" ? "destructive" : "outline"}>
                            {ticket.priority === "high" ? "Alta" : ticket.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-semibold">{ticket.message_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(ticket.created_at).toLocaleDateString("pt-PT")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/support/${ticket.id}`);
                            }}
                            className="border-teal-200 hover:bg-teal-50"
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {filteredTickets.map((ticket) => {
            const typeConfig = ticketTypeConfig[ticket.type];
            const statusConfig = ticketStatusConfig[ticket.status];
            const TypeIcon = typeConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={ticket.id}
                className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-teal-100 cursor-pointer"
                onClick={() => router.push(`/admin/support/${ticket.id}`)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={`bg-gradient-to-r ${typeConfig.gradient} text-white border-0`}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeConfig.label}
                        </Badge>
                        <Badge className={`bg-gradient-to-r ${statusConfig.gradient} text-white border-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{ticket.subject}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-semibold">{ticket.clinic.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{ticket.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(ticket.created_at).toLocaleDateString("pt-PT")}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.message_count || 0} mensagens
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
