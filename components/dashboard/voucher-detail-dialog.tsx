"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import {
  Eye,
  Clock,
  HandHeart,
  CheckCircle,
  Send,
  Banknote,
  UserCheck,
  ArrowRight,
  Calendar,
  User,
  Stethoscope,
  Euro,
  Ban,
  AlertTriangle,
  XCircle,
  Receipt,
  Activity
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Voucher {
  id: string;
  number: string;
  patient_id: string;
  doctor_id: string;
  status: string;
  amount: number;
  created_at: string;
  received_at?: string;
  used_at?: string;
  submitted_at?: string;
  paid_ars_at?: string;
  paid_doctor_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  patient?: {
    name: string;
  };
  doctor?: {
    name: string;
  };
}

interface StatusHistory {
  id: string;
  previous_status: string | null;
  new_status: string;
  changed_at: string;
  changed_by?: string;
}

interface VoucherDetailDialogProps {
  voucher: Voucher;
  onStatusChange?: () => void;
}

const statusConfig = {
  pendente_entrega: {
    label: "Pendente de Entrega",
    nextStatus: "recebido",
    nextLabel: "Marcar como Recebido",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    gradient: "from-amber-400 to-orange-500",
    buttonClass: "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
  },
  recebido: {
    label: "Recebido",
    nextStatus: "utilizado",
    nextLabel: "Marcar como Utilizado",
    icon: HandHeart,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    gradient: "from-teal-400 to-cyan-500",
    buttonClass: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
  },
  utilizado: {
    label: "Utilizado",
    nextStatus: "submetido",
    nextLabel: "Submeter à ARS",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    gradient: "from-emerald-400 to-green-500",
    buttonClass: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
  },
  submetido: {
    label: "Submetido",
    nextStatus: "pago_ars",
    nextLabel: "Registar Pagamento ARS",
    icon: Send,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    gradient: "from-violet-400 to-purple-500",
    buttonClass: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
  },
  pago_ars: {
    label: "Pago pela ARS",
    nextStatus: "pago_medico",
    nextLabel: "Registar Pagamento ao Médico",
    icon: Banknote,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    gradient: "from-blue-400 to-indigo-500",
    buttonClass: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
  },
  pago_medico: {
    label: "Pago ao Médico",
    nextStatus: null,
    nextLabel: null,
    icon: UserCheck,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    gradient: "from-pink-400 to-rose-500",
    buttonClass: ""
  },
  cancelado: {
    label: "Cancelado",
    nextStatus: null,
    nextLabel: null,
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradient: "from-red-400 to-red-500",
    buttonClass: ""
  }
};

export function VoucherDetailDialog({
  voucher,
  onStatusChange
}: VoucherDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const { toast } = useToast();

  const config = statusConfig[voucher.status as keyof typeof statusConfig];

  useEffect(() => {
    if (open) {
      loadStatusHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, voucher.id]);

  const loadStatusHistory = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("voucher_status_history")
      .select("*")
      .eq("voucher_id", voucher.id)
      .order("changed_at", { ascending: true });

    if (!error && data) {
      setStatusHistory(data);
    }
  };

  const handleStatusTransition = async (newStatus: string) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("vouchers")
        .update({ status: newStatus })
        .eq("id", voucher.id);

      if (error) throw error;

      toast({
        title: "Estado atualizado",
        description: `Cheque atualizado para ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
      });

      setShowForwardDialog(false);
      if (onStatusChange) onStatusChange();
      loadStatusHistory();
    } catch (error) {
      toast({
        title: "Erro ao atualizar estado",
        description: (error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o estado do cheque"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancellation = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const updateData: Record<string, string> = { status: "cancelado" };
      if (cancellationReason.trim()) {
        updateData.cancellation_reason = cancellationReason.trim();
      }

      const { error } = await supabase
        .from("vouchers")
        .update(updateData)
        .eq("id", voucher.id);

      if (error) throw error;

      toast({
        title: "Cheque cancelado",
        description: "O cheque foi cancelado com sucesso",
      });

      setShowCancelDialog(false);
      setCancellationReason("");
      if (onStatusChange) onStatusChange();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao cancelar cheque",
        description: (error instanceof Error ? error.message : "Ocorreu um erro ao cancelar o cheque"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(true)}
              className="h-9 w-9 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              <Eye className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver Detalhes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-2xl font-bold flex items-center gap-3">
              <Receipt className="h-7 w-7" />
              Detalhes do Cheque
            </DialogTitle>
            <DialogDescription className="text-white/90 mt-2">
              Cheque #{voucher.number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Status and Amount */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">Estado Atual:</span>
                <span className={`px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-sm`}>
                  {config.label}
                </span>
              </div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                €{voucher.amount.toFixed(2)}
              </div>
            </div>

            {/* Details Section */}
            <Card className="p-5 space-y-4 border-2 border-teal-200">
              <h3 className="font-bold text-lg text-teal-700 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Informações Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Paciente</p>
                    <p className="font-bold text-gray-800">{voucher.patient?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Médico</p>
                    <p className="font-bold text-gray-800">{voucher.doctor?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Criação</p>
                    <p className="font-bold text-gray-800">{formatDate(voucher.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Euro className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Valor</p>
                    <p className="font-bold text-gray-800">€{voucher.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline Section */}
            <Card className="p-5 space-y-4 border-2 border-teal-200">
              <h3 className="font-bold text-lg text-teal-700 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico do Ciclo de Vida
              </h3>

              <div className="relative">
                {(() => {
                  // Build the actual timeline based on history
                  const actualStates: string[] = [];
                  const stateTimestamps: Record<string, string> = {};

                  // Find initial state from history
                  const initialState = statusHistory.find(h => h.previous_status === null);
                  if (initialState) {
                    actualStates.push(initialState.new_status);
                    stateTimestamps[initialState.new_status] = initialState.changed_at;
                  } else if (voucher.status === "pendente_entrega") {
                    // Fallback for pendente_entrega vouchers without history
                    actualStates.push("pendente_entrega");
                    stateTimestamps["pendente_entrega"] = voucher.created_at;
                  } else if (voucher.status === "recebido" && voucher.received_at) {
                    // Fallback for recebido vouchers without history
                    actualStates.push("recebido");
                    stateTimestamps["recebido"] = voucher.received_at;
                  }

                  // Add subsequent states from history
                  statusHistory.forEach(h => {
                    if (h.previous_status && !actualStates.includes(h.new_status)) {
                      actualStates.push(h.new_status);
                      stateTimestamps[h.new_status] = h.changed_at;
                    }
                  });

                  // If current status not in history, add it
                  if (!actualStates.includes(voucher.status) && voucher.status !== "cancelado") {
                    actualStates.push(voucher.status);
                    // Use appropriate timestamp field
                    if (voucher.status === "pendente_entrega") {
                      stateTimestamps["pendente_entrega"] = voucher.created_at;
                    } else if (voucher.status === "recebido" && voucher.received_at) {
                      stateTimestamps["recebido"] = voucher.received_at;
                    } else if (voucher.status === "utilizado" && voucher.used_at) {
                      stateTimestamps["utilizado"] = voucher.used_at;
                    } else if (voucher.status === "submetido" && voucher.submitted_at) {
                      stateTimestamps["submetido"] = voucher.submitted_at;
                    } else if (voucher.status === "pago_ars" && voucher.paid_ars_at) {
                      stateTimestamps["pago_ars"] = voucher.paid_ars_at;
                    } else if (voucher.status === "pago_medico" && voucher.paid_doctor_at) {
                      stateTimestamps["pago_medico"] = voucher.paid_doctor_at;
                    }
                  }

                  // Add future possible states (grayed out)
                  const futureStates: string[] = [];
                  let nextStatus = statusConfig[voucher.status as keyof typeof statusConfig]?.nextStatus;
                  while (nextStatus && !actualStates.includes(nextStatus)) {
                    futureStates.push(nextStatus);
                    nextStatus = statusConfig[nextStatus as keyof typeof statusConfig]?.nextStatus;
                  }

                  const allStatesToShow = [...actualStates, ...futureStates];

                  return allStatesToShow.map((status, index) => {
                    const statusInfo = statusConfig[status as keyof typeof statusConfig];
                    if (!statusInfo) return null;

                    const Icon = statusInfo.icon;
                    const isCurrent = status === voucher.status;
                    const isCompleted = actualStates.includes(status) && !isCurrent;
                    const isFuture = futureStates.includes(status);
                    const timestamp = stateTimestamps[status];

                    return (
                      <div key={status} className="flex items-start mb-6 last:mb-0">
                        <div className="relative flex items-center">
                          {/* Connector Line */}
                          {index < allStatesToShow.length - 1 && (
                            <div
                              className={`absolute top-10 left-5 w-0.5 h-16 ${
                                isCompleted ? 'bg-teal-400' : 'bg-gray-300'
                              }`}
                            />
                          )}

                          {/* Status Icon Circle */}
                          <div
                            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                              isCurrent
                                ? `bg-gradient-to-br ${statusInfo.gradient} shadow-lg ring-4 ring-offset-2 ring-teal-300`
                                : isCompleted
                                ? `bg-gradient-to-br ${statusInfo.gradient}`
                                : 'bg-gray-200'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${!isFuture ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                        </div>

                        {/* Status Info */}
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold ${
                              isCurrent ? statusInfo.color : isCompleted ? 'text-gray-700' : 'text-gray-400'
                            }`}>
                              {statusInfo.label}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-1 text-xs font-bold bg-teal-100 text-teal-700 rounded-full">
                                ATUAL
                              </span>
                            )}
                          </div>
                          {timestamp && (
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Cancelled State */}
                {voucher.status === "cancelado" && (
                  <div className="flex items-start mb-6 border-t-2 border-red-200 pt-6 mt-6">
                    <div className="relative flex items-center">
                      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-lg ring-4 ring-offset-2 ring-red-300">
                        <Ban className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-red-600">
                          Cancelado
                        </h4>
                        <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                          ESTADO FINAL
                        </span>
                      </div>
                      {voucher.cancelled_at && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(voucher.cancelled_at)}
                        </p>
                      )}
                      {voucher.cancellation_reason && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Motivo:</span> {voucher.cancellation_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions Section */}
            {voucher.status !== "cancelado" && (
              <Card className="p-5 space-y-4 border-2 border-teal-200 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
                <h3 className="font-bold text-lg text-teal-700">Ações Disponíveis</h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  {config.nextStatus && (
                    <Button
                      onClick={() => setShowForwardDialog(true)}
                      disabled={isLoading}
                      className={`flex-1 ${config.buttonClass} text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      {config.nextLabel}
                    </Button>
                  )}

                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 font-bold"
                  >
                    <Ban className="h-5 w-5 mr-2" />
                    Cancelar Cheque
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Cancelamento
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este cheque? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">
                Motivo do cancelamento (opcional)
              </Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo do cancelamento..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancellationReason("");
              }}
              disabled={isLoading}
            >
              Manter Cheque
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancellation}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isLoading ? "A cancelar..." : "Cancelar Cheque"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forward Transition Confirmation Dialog */}
      {config.nextStatus && (
        <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-teal-600" />
                Confirmar Transição
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja avançar o estado deste cheque de{" "}
                <span className="font-semibold">{config.label}</span> para{" "}
                <span className="font-semibold">
                  {statusConfig[config.nextStatus as keyof typeof statusConfig].label}
                </span>
                ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowForwardDialog(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleStatusTransition(config.nextStatus!)}
                disabled={isLoading}
                className={`${config.buttonClass} text-white`}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {isLoading ? "A processar..." : config.nextLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}