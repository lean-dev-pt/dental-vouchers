"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface PatientFormProps {
  clinicId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PatientForm({ clinicId, onSuccess, onCancel }: PatientFormProps) {
  const [name, setName] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: insertError } = await supabase
        .from("patients")
        .insert({
          name,
          year_of_birth: parseInt(yearOfBirth),
          clinic_id: clinicId,
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar paciente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-bold text-emerald-700">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nome completo do paciente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 rounded-xl h-12 font-medium transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearOfBirth" className="font-bold text-emerald-700">Ano de Nascimento</Label>
        <Input
          id="yearOfBirth"
          type="text"
          placeholder={new Date().getFullYear().toString()}
          value={yearOfBirth}
          onChange={(e) => {
            // Only allow numbers and max 4 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
            setYearOfBirth(value);
          }}
          pattern="\d{4}"
          inputMode="numeric"
          maxLength={4}
          required
          disabled={isLoading}
          className="border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 rounded-xl h-12 font-medium transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "A adicionar..." : "Adicionar Paciente"}
        </Button>
      </div>
    </form>
  );
}