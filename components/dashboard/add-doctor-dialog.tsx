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
import { DoctorForm } from "./doctor-form";

interface AddDoctorDialogProps {
  clinicId: string;
  onDoctorAdded: () => void;
}

export function AddDoctorDialog({ clinicId, onDoctorAdded }: AddDoctorDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onDoctorAdded();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Médico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Médico</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo médico. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <DoctorForm
          clinicId={clinicId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}