"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface VoucherFormProps {
  clinicId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
}

const voucherStates = [
  { value: "recebido", label: "Recebido" },
  { value: "pendente_entrega", label: "Pendente de Entrega" },
];

export function VoucherForm({ clinicId, onSuccess, onCancel }: VoucherFormProps) {
  const [voucherCount, setVoucherCount] = useState(1);
  const [numbers, setNumbers] = useState<string[]>(["", "", ""]);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("recebido");
  const [expiryDate, setExpiryDate] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state for patient selection
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");

  // Form validation
  const [formErrors, setFormErrors] = useState<{ patient?: string; doctor?: string; numbers?: string }>({});

  const loadPatientsAndDoctors = useCallback(async () => {
    setIsLoadingData(true);
    const supabase = createClient();

    try {
      // Load clinic data to get default voucher amount
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinics")
        .select("default_voucher_amount")
        .eq("id", clinicId)
        .single();

      if (clinicError) throw clinicError;

      // Set default amount from clinic, converting to comma format
      if (clinicData?.default_voucher_amount) {
        setAmount(clinicData.default_voucher_amount.toFixed(2).replace('.', ','));
      } else {
        setAmount("45,00"); // Fallback to 45,00 if not set
      }

      // Set default expiry date to 12 months from now
      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
      setExpiryDate(defaultExpiry.toISOString().split('T')[0]);

      // Load patients
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("id, name")
        .eq("clinic_id", clinicId)
        .order("name");

      if (patientsError) throw patientsError;
      setPatients(patientsData || []);

      // Load doctors
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("doctors")
        .select("id, name")
        .eq("clinic_id", clinicId)
        .order("name");

      if (doctorsError) throw doctorsError;
      setDoctors(doctorsData || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erro ao carregar dados");
    } finally {
      setIsLoadingData(false);
    }
  }, [clinicId]);

  useEffect(() => {
    void loadPatientsAndDoctors();
  }, [loadPatientsAndDoctors]);

  const handlePatientSelect = (patient: Patient) => {
    setPatientId(patient.id);
    setSelectedPatientName(patient.name);
    setFormErrors((prev) => ({ ...prev, patient: undefined }));
    setOpenPatientDialog(false);
    setPatientSearch("");
  };

  const handleDoctorSelect = (id: string) => {
    setDoctorId(id);
    setFormErrors((prev) => ({ ...prev, doctor: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const validationErrors: { patient?: string; doctor?: string; numbers?: string } = {};

    if (!patientId) {
      validationErrors.patient = "Selecione um paciente.";
    }

    if (!doctorId) {
      validationErrors.doctor = "Selecione um médico.";
    }

    // Validate all required numbers are filled
    const filledNumbers = numbers.slice(0, voucherCount).filter(n => n.trim());
    if (filledNumbers.length !== voucherCount) {
      validationErrors.numbers = `Por favor, preencha todos os ${voucherCount} números de cheque`;
    }

    // Check for duplicate numbers within the form
    const uniqueNumbers = new Set(filledNumbers);
    if (uniqueNumbers.size !== filledNumbers.length) {
      validationErrors.numbers = "Os números dos cheques devem ser únicos";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // Build array of vouchers to insert
      const vouchersToInsert = numbers
        .slice(0, voucherCount)
        .filter(num => num.trim() !== '')
        .map(number => ({
          number,
          patient_id: patientId,
          doctor_id: doctorId,
          clinic_id: clinicId,
          amount: parseFloat(amount.replace(',', '.')),
          status,
          expiry_date: expiryDate,
        }));

      // Batch insert to database
      const { error: insertError } = await supabase
        .from("vouchers")
        .insert(vouchersToInsert);

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar cheque(s)");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  if (isLoadingData) {
    return <p className="text-sm text-muted-foreground">A carregar dados...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quantity Selector */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="font-bold text-teal-700">Quantidade de Cheques</Label>
          <Select
            value={voucherCount.toString()}
            onValueChange={(value) => setVoucherCount(parseInt(value))}
            disabled={isLoading}
          >
            <SelectTrigger
              id="quantity"
              className="h-12 border-2 border-teal-200 focus:border-teal-400 rounded-xl font-medium"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Cheque</SelectItem>
              <SelectItem value="2">2 Cheques</SelectItem>
              <SelectItem value="3">3 Cheques</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Individual Number Fields */}
        <div className="space-y-3">
          {Array.from({ length: voucherCount }, (_, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`number-${index}`} className="font-bold text-teal-700">
                Número do Cheque {index + 1}
              </Label>
              <Input
                id={`number-${index}`}
                type="text"
                placeholder={`Ex: CHQ-2024-00${index + 1}`}
                value={numbers[index]}
                onChange={(e) => {
                  const newNumbers = [...numbers];
                  newNumbers[index] = e.target.value;
                  setNumbers(newNumbers);
                  // Clear numbers error when user starts typing
                  if (formErrors.numbers) {
                    setFormErrors((prev) => ({ ...prev, numbers: undefined }));
                  }
                }}
                required
                disabled={isLoading}
                className="border-2 border-teal-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 rounded-xl h-12 font-medium transition-all"
              />
            </div>
          ))}
          {formErrors.numbers && (
            <p className="text-sm text-red-600 font-medium">
              {formErrors.numbers}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient" className="font-bold text-teal-700">Paciente</Label>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start h-12 border-2 border-teal-200 hover:border-teal-400 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 font-medium rounded-xl transition-all",
              !selectedPatientName && "text-gray-400",
              formErrors.patient && "border-red-400 hover:border-red-500"
            )}
            onClick={() => setOpenPatientDialog(true)}
            disabled={isLoading}
          >
            <User className="mr-2 h-4 w-4 text-teal-600" />
            {selectedPatientName || "Selecionar paciente"}
          </Button>
          {formErrors.patient && (
            <p className="text-sm text-red-600 font-medium mt-1">
              {formErrors.patient}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor" className="font-bold text-teal-700">Médico</Label>
          <Select
            value={doctorId || undefined}
            onValueChange={handleDoctorSelect}
            disabled={isLoading}
          >
            <SelectTrigger
              id="doctor"
              aria-invalid={Boolean(formErrors.doctor)}
              aria-describedby={formErrors.doctor ? "doctor-error" : undefined}
              className={cn(
                "w-full h-12 border-2 border-teal-200 focus:border-teal-400 rounded-xl font-medium",
                formErrors.doctor && "border-red-400 focus:border-red-500"
              )}
            >
              <SelectValue placeholder="Selecione um médico" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.doctor && (
            <p id="doctor-error" className="text-sm text-red-600 font-medium mt-1">
              {formErrors.doctor}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="font-bold text-teal-700">Valor (€)</Label>
          <Input
            id="amount"
            type="text"
            placeholder="0,00"
            value={amount}
            onChange={(e) => {
              let value = e.target.value;
              // Replace dot with comma
              value = value.replace('.', ',');
              // Only allow numbers and one comma
              const regex = /^\d*,?\d{0,2}$/;
              if (regex.test(value) || value === '') {
                setAmount(value);
              }
            }}
            required
            disabled={isLoading}
            className="border-2 border-teal-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 rounded-xl h-12 font-medium transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry" className="font-bold text-teal-700">Data de Validade</Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-600" />
            <Input
              id="expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={isLoading}
              className="pl-10 border-2 border-teal-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 rounded-xl h-12 font-medium transition-all"
            />
          </div>
          <p className="text-xs text-gray-500">Os cheques dentista têm validade de 12 meses</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="font-bold text-teal-700">Estado</Label>
          <Select value={status} onValueChange={setStatus} disabled={isLoading}>
            <SelectTrigger id="status" className="h-12 border-2 border-teal-200 focus:border-teal-400 rounded-xl font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voucherStates.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            disabled={isLoading || patients.length === 0 || doctors.length === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading
              ? `A adicionar ${voucherCount} ${voucherCount === 1 ? 'cheque' : 'cheques'}...`
              : `Adicionar ${voucherCount} ${voucherCount === 1 ? 'Cheque' : 'Cheques'}`}
          </Button>
        </div>
      </form>

      {/* Patient Selection Dialog */}
      <Dialog open={openPatientDialog} onOpenChange={setOpenPatientDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecionar Paciente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-teal-500" />
              <Input
                placeholder="Pesquisar paciente..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="pl-10 h-12 border-2 border-teal-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 rounded-xl font-medium"
              />
            </div>
            <ScrollArea className="h-[300px] rounded-xl border-2 border-teal-100 p-3 bg-gradient-to-b from-white to-teal-50/30">
              {filteredPatients.length > 0 ? (
                <div className="space-y-2">
                  {filteredPatients.map((patient) => (
                    <Button
                      key={patient.id}
                      variant="ghost"
                      className="w-full justify-start h-12 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:border-teal-200 border-2 border-transparent rounded-xl font-medium transition-all"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <User className="mr-2 h-4 w-4 text-teal-600" />
                      {patient.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 font-medium py-6">
                  Nenhum paciente encontrado
                </p>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}