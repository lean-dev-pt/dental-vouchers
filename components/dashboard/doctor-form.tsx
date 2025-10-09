"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface DoctorFormProps {
  clinicId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DoctorForm({ clinicId, onSuccess, onCancel }: DoctorFormProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: insertError } = await supabase
        .from("doctors")
        .insert({
          name,
          clinic_id: clinicId,
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar médico");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-bold text-violet-700">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nome completo do médico"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="border-2 border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 rounded-xl h-12 font-medium transition-all"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-bold rounded-xl transition-all"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "A adicionar..." : "Adicionar Médico"}
        </Button>
      </div>
    </form>
  );
}