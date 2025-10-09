"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VoucherForm } from "./voucher-form";

interface AddVoucherDialogProps {
  clinicId: string;
  onVoucherAdded: () => void;
}

export function AddVoucherDialog({ clinicId, onVoucherAdded }: AddVoucherDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onVoucherAdded();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Cheque
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cheque Dentista</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo cheque dentista. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <VoucherForm
          clinicId={clinicId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}