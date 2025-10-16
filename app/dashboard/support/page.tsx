"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Plus,
  Search,
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Gift,
  Zap,
  CircleHelp,
  Wrench,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type TicketType = "bug" | "feature" | "question";
type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high";

interface SupportArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
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

const categoryConfig = {
  "getting-started": { label: "Primeiros Passos", gradient: "from-teal-400 to-cyan-500", icon: Gift },
  "features": { label: "Funcionalidades", gradient: "from-violet-400 to-purple-500", icon: Zap },
  "faq": { label: "FAQ", gradient: "from-blue-400 to-indigo-500", icon: CircleHelp },
  "troubleshooting": { label: "Resolução de Problemas", gradient: "from-amber-400 to-orange-500", icon: Wrench },
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("help");
  const [articles, setArticles] = useState<SupportArticle[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<SupportArticle | null>(null);
  const [ticketMessages, setTicketMessages] = useState<{id: string; author_type: string; message: string; created_at: string; author: {email: string}}[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
    type: "question" as TicketType,
    subject: "",
    description: "",
  });

  useEffect(() => {
    fetchArticles();
    fetchTickets();
  }, []);

  const fetchArticles = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_articles")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }

    setArticles(data || []);
  };

  const fetchTickets = async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase
      .from("support_tickets")
      .select("*, message_count:support_messages(count)")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      return;
    }

    const ticketsWithCount = data?.map(ticket => ({
      ...ticket,
      message_count: ticket.message_count?.[0]?.count || 0
    })) || [];

    setTickets(ticketsWithCount);
  };

  const fetchTicketMessages = async (ticketId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    const messagesWithAuthor = await Promise.all((data || []).map(async (msg) => {
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

    setTicketMessages(messagesWithAuthor);
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha o assunto e descrição.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("clinic_id")
      .eq("user_id", userData.user?.id)
      .single();

    if (!profile) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar a clínica.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("support_tickets").insert({
      clinic_id: profile.clinic_id,
      user_id: userData.user?.id,
      type: newTicket.type,
      subject: newTicket.subject,
      description: newTicket.description,
      status: "open",
      priority: "medium",
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Erro ao criar ticket",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket criado!",
      description: "A nossa equipa irá responder em breve.",
    });

    setIsNewTicketOpen(false);
    setNewTicket({ type: "question", subject: "", description: "" });
    fetchTickets();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("support_messages").insert({
      ticket_id: selectedTicket.id,
      author_id: userData.user?.id,
      author_type: "user",
      message: newMessage,
    });

    if (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    fetchTicketMessages(selectedTicket.id);
    fetchTickets();
  };

  const handleMarkAsResolved = async () => {
    if (!selectedTicket) return;

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("support_tickets")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
        resolved_by: userData.user?.id,
      })
      .eq("id", selectedTicket.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao marcar ticket como resolvido.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket resolvido!",
      description: "O ticket foi marcado como resolvido.",
    });

    setSelectedTicket({ ...selectedTicket, status: "resolved" });
    fetchTickets();
  };

  const handleReopenTicket = async () => {
    if (!selectedTicket) return;

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("support_tickets")
      .update({
        status: "open",
        reopened_at: new Date().toISOString(),
        reopened_by: userData.user?.id,
      })
      .eq("id", selectedTicket.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao reabrir ticket.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket reaberto!",
      description: "O ticket foi reaberto e pode receber novas mensagens.",
    });

    setSelectedTicket({ ...selectedTicket, status: "open" });
    fetchTickets();
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group articles by category
  const articlesByCategory = Object.keys(categoryConfig).reduce((acc, category) => {
    acc[category] = filteredArticles.filter(article => article.category === category);
    return acc;
  }, {} as Record<string, SupportArticle[]>);

  // Count articles per category
  const categoryCounts = Object.keys(categoryConfig).reduce((acc, category) => {
    acc[category] = articles.filter(article => article.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Scroll to category section
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-3 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="p-1.5 sm:p-3 bg-white/20 rounded-xl">
            <HelpCircle className="h-5 w-5 sm:h-8 sm:w-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold">Centro de Suporte</h1>
            <p className="text-pink-100 mt-0.5 sm:mt-1 text-xs sm:text-base">Como podemos ajudar?</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 p-1 text-gray-600 w-auto border border-pink-100">
            <TabsTrigger
              value="help"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <BookOpen className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline data-[state=active]:inline data-[state=active]:ml-2 md:data-[state=active]:ml-0">Ajuda</span>
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <MessageSquare className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline data-[state=active]:inline data-[state=active]:ml-2 md:data-[state=active]:ml-0">Os Meus Tickets ({tickets.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Help Center Tab */}
        <TabsContent value="help" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 px-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-pink-100 focus:border-pink-300"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px] border-2 border-pink-100">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sticky Category Navigation */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-2 border-pink-100 rounded-xl p-3 sm:p-4 shadow-lg">
            <ScrollArea className="w-full">
              <div className="flex gap-2 sm:gap-3">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const count = categoryCounts[key] || 0;
                  return (
                    <Button
                      key={key}
                      onClick={() => scrollToCategory(key)}
                      variant="outline"
                      className={`flex items-center gap-2 whitespace-nowrap border-2 hover:scale-105 transition-all duration-300 ${
                        selectedCategory === key
                          ? `bg-gradient-to-r ${config.gradient} text-white border-transparent hover:opacity-90`
                          : "hover:border-pink-300"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-semibold hidden sm:inline">{config.label}</span>
                      <Badge variant="secondary" className="ml-1 bg-white/20 text-current border-0 text-xs">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </div>

          {/* Articles by Category */}
          <div className="space-y-12">
            {Object.entries(categoryConfig).map(([category, config]) => {
              const categoryArticles = articlesByCategory[category] || [];
              const Icon = config.icon;

              if (categoryArticles.length === 0) return null;

              return (
                <div key={category} id={`category-${category}`} className="scroll-mt-32">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-4 sm:gap-3 sm:mb-6">
                    <div className={`p-2 sm:p-3 bg-gradient-to-r ${config.gradient} rounded-xl`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-xl sm:text-2xl font-extrabold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {config.label}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">{categoryArticles.length} artigos</p>
                    </div>
                  </div>

                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {categoryArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="relative p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 cursor-pointer hover:z-10 hover:-translate-y-1"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div className="space-y-2 sm:space-y-3">
                          <div className="space-y-1 sm:space-y-2">
                            <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-0 w-fit text-xs`}>
                              {config.label}
                            </Badge>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">{article.title}</h3>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 line-clamp-3">{article.content.substring(0, 150)}...</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Separator className="mt-8 sm:mt-12" />
                </div>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum artigo encontrado.</p>
            </div>
          )}
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          {/* New Ticket Button */}
          <div className="flex justify-end">
            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Ticket</DialogTitle>
                  <DialogDescription>
                    Descreva o seu problema ou sugestão. Responderemos em breve.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Tipo</label>
                    <Select value={newTicket.type} onValueChange={(value) => setNewTicket({ ...newTicket, type: value as TicketType })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ticketTypeConfig).map(([key, config]) => {
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
                    <label className="text-sm font-semibold">Assunto</label>
                    <Input
                      placeholder="Ex: Erro ao criar cheque dentista"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Descrição</label>
                    <Textarea
                      placeholder="Descreva o problema ou sugestão em detalhe..."
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateTicket}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                  >
                    {isSubmitting ? "A criar..." : "Criar Ticket"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const typeConfig = ticketTypeConfig[ticket.type];
              const statusConfig = ticketStatusConfig[ticket.status];
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={ticket.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-pink-100 cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    fetchTicketMessages(ticket.id);
                  }}
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
                        <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
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

          {tickets.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Ainda não criou nenhum ticket.</p>
              <Button
                onClick={() => setIsNewTicketOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Ticket
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 flex-wrap">
                {selectedTicket.subject}
              </DialogTitle>
              <div className="flex items-center gap-2 pt-2">
                <Badge className={`bg-gradient-to-r ${ticketTypeConfig[selectedTicket.type].gradient} text-white border-0`}>
                  {ticketTypeConfig[selectedTicket.type].label}
                </Badge>
                <Badge className={`bg-gradient-to-r ${ticketStatusConfig[selectedTicket.status].gradient} text-white border-0`}>
                  {ticketStatusConfig[selectedTicket.status].label}
                </Badge>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {/* Initial Description */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Descrição inicial:</p>
                <p className="text-gray-900">{selectedTicket.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(selectedTicket.created_at).toLocaleString("pt-PT")}
                </p>
              </div>

              {/* Messages */}
              {ticketMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl p-4 border-2 ${
                    message.author_type === "admin"
                      ? "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">
                      {message.author_type === "admin" ? "Equipa de Suporte" : "Você"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString("pt-PT")}
                    </p>
                  </div>
                  <p className="text-gray-900">{message.message}</p>
                </div>
              ))}
            </div>

            {/* Status Actions */}
            <div className="pt-4 border-t space-y-3">
              {/* Resolved/Closed Notice */}
              {(selectedTicket.status === "resolved" || selectedTicket.status === "closed") && (
                <div className={`rounded-xl p-4 border-2 ${
                  selectedTicket.status === "resolved"
                    ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                }`}>
                  <p className="text-sm font-semibold text-gray-700">
                    {selectedTicket.status === "resolved"
                      ? "✓ Este ticket foi marcado como resolvido."
                      : "🔒 Este ticket foi fechado e não pode receber mais mensagens."}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {selectedTicket.status === "resolved" && (
                  <Button
                    onClick={handleReopenTicket}
                    variant="outline"
                    className="flex-1 border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                  >
                    Reabrir Ticket
                  </Button>
                )}
                {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" && (
                  <Button
                    onClick={handleMarkAsResolved}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  >
                    Marcar como Resolvido
                  </Button>
                )}
              </div>
            </div>

            {/* Reply Box */}
            {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
              <div className="space-y-2 pt-4 border-t">
                <Textarea
                  placeholder="Escreva a sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                  >
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Article Detail Dialog */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col">
            <DialogHeader>
              <div className="space-y-3">
                <Badge className={`bg-gradient-to-r ${categoryConfig[selectedArticle.category as keyof typeof categoryConfig].gradient} text-white border-0 w-fit`}>
                  {categoryConfig[selectedArticle.category as keyof typeof categoryConfig].label}
                </Badge>
                <DialogTitle className="text-2xl font-extrabold text-gray-900">
                  {selectedArticle.title}
                </DialogTitle>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 pr-4">
              <div className="py-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedArticle.content}</p>
                </div>
              </div>
            </ScrollArea>

            <div className="pt-4 border-t flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Publicado em {new Date(selectedArticle.created_at).toLocaleDateString("pt-PT")}
              </p>
              <Button
                onClick={() => setSelectedArticle(null)}
                variant="outline"
                className="border-2 border-pink-100 hover:border-pink-300"
              >
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
