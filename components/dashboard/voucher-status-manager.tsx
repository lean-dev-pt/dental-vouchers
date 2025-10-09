"use client";

import { useState } from "react";
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
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  HandHeart,
  Send,
  Banknote,
  UserCheck,
  ArrowRightCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoucherStatusManagerProps {
  voucherId: string;
  currentStatus: string;
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
    buttonClass: ""
  }
};

export function VoucherStatusManager({
  voucherId,
  currentStatus,
  onStatusChange
}: VoucherStatusManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const { toast } = useToast();

  const config = statusConfig[currentStatus as keyof typeof statusConfig];
  if (!config) return null;

  const handleStatusTransition = async (newStatus: string) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("vouchers")
        .update({ status: newStatus })
        .eq("id", voucherId);

      if (error) throw error;

      toast({
        title: "Estado atualizado",
        description: `Cheque atualizado para ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
      });

      if (onStatusChange) onStatusChange();
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
        .eq("id", voucherId);

      if (error) throw error;

      toast({
        title: "Cheque cancelado",
        description: "O cheque foi cancelado com sucesso",
      });

      setShowCancelDialog(false);
      setCancellationReason("");
      if (onStatusChange) onStatusChange();
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

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Icon Buttons Only */}
        {config.nextStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowForwardDialog(true)}
                disabled={isLoading}
                className="h-9 w-9 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <ArrowRightCircle className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{config.nextLabel}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

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
                ? Esta ação não pode ser desfeita.
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
                onClick={() => {
                  handleStatusTransition(config.nextStatus!);
                  setShowForwardDialog(false);
                }}
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
    </TooltipProvider>
  );
}