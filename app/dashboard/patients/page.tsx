"use client";

import { useEffect, useState, useMemo } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AddPatientDialog } from "@/components/dashboard/add-patient-dialog";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, Users, Heart, Calendar, Activity, UserPlus, Award, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Patient {
  id: string;
  name: string;
  year_of_birth: number;
  created_at: string;
  recebido_count: number;
  utilizado_count: number;
  disponiveis_count: number;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for the table
  const columns = useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-bold text-gray-800">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "year_of_birth",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Data de Nascimento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const year = row.getValue("year_of_birth") as number;
          const age = new Date().getFullYear() - year;
          return (
            <div>
              <span className="font-medium text-gray-700">{year}</span>
              <span className="text-teal-600 text-sm ml-2 font-semibold">({age} anos)</span>
            </div>
          );
        },
      },
      {
        accessorKey: "recebido_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Cheques Recebidos
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
            {row.getValue("recebido_count")}
          </div>
        ),
      },
      {
        accessorKey: "utilizado_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Cheques Utilizados
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
            {row.getValue("utilizado_count")}
          </div>
        ),
      },
      {
        accessorKey: "disponiveis_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Cheques Disponíveis
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {row.getValue("disponiveis_count")}
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    checkAuthAndLoadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthAndLoadData = async () => {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      redirect("/auth/login");
    }

    console.log("Authenticated user:", user.email, user.id);

    // Get user's clinic
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      console.error("User ID:", user.id);
      console.error("Profile data:", profile);

      if (!profile && !profileError) {
        console.error("No profile found for user");
      }
      setIsLoading(false);
      return;
    }

    setClinicId(profile.clinic_id);
    await loadPatients(profile.clinic_id);
  };

  const loadPatients = async (clinicId: string) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Fetch patients with voucher counts
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select(`
          *,
          vouchers(status)
        `)
        .eq("clinic_id", clinicId)
        .order("created_at", { ascending: false });

      if (patientsError) throw patientsError;

      // Process the data to count vouchers by status
      const processedPatients = (patientsData || []).map(patient => {
        const vouchers = patient.vouchers || [];
        // Count all vouchers that have been received (cumulative)
        const recebido_count = vouchers.filter((v: { status: string }) =>
          ['recebido', 'utilizado', 'submetido', 'pago_ars', 'pago_medico'].includes(v.status)
        ).length;
        // Count all vouchers that have been utilized (cumulative)
        const utilizado_count = vouchers.filter((v: { status: string }) =>
          ['utilizado', 'submetido', 'pago_ars', 'pago_medico'].includes(v.status)
        ).length;
        // Calculate available vouchers
        const disponiveis_count = recebido_count - utilizado_count;

        return {
          id: patient.id,
          name: patient.name,
          year_of_birth: patient.year_of_birth,
          created_at: patient.created_at,
          recebido_count,
          utilizado_count,
          disponiveis_count
        };
      });

      setPatients(processedPatients);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientAdded = () => {
    if (clinicId) {
      loadPatients(clinicId);
    }
  };

  // Create table instance
  const table = useReactTable({
    data: patients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-t-teal-500 border-r-cyan-500 rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-teal-600 font-semibold mt-4">A carregar pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Healthcare Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 p-10 text-white shadow-2xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Users className="h-10 w-10" />
            <h1 className="text-4xl font-extrabold">Pacientes</h1>
          </div>
        </div>
      </div>

      {/* Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-emerald-500" />
          </div>
          <Input
            placeholder="Pesquisar paciente..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 h-12 border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 rounded-xl font-medium"
          />
        </div>
        {clinicId && (
          <AddPatientDialog
            clinicId={clinicId}
            onPatientAdded={handlePatientAdded}
          />
        )}
      </div>

      {/* Modern Table */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b-2 border-emerald-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Heart className="h-16 w-16 mb-4 text-emerald-300 animate-pulse" />
                      <p className="font-bold text-gray-600 text-lg">Nenhum paciente encontrado</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Os pacientes aparecerão aqui quando forem adicionados
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-5 space-y-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const patient = row.original;
              const age = new Date().getFullYear() - patient.year_of_birth;
              return (
                <div
                  key={row.id}
                  className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-5 space-y-4 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-extrabold text-xl text-gray-800">{patient.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span className="text-gray-600 font-medium">{patient.year_of_birth}</span>
                        <span className="text-emerald-600 text-sm font-bold">({age} anos)</span>
                      </div>
                    </div>
                    <UserPlus className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-white rounded-lg border border-teal-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Activity className="h-4 w-4 text-teal-500" />
                        <span className="text-gray-500 text-xs font-semibold">Recebidos</span>
                      </div>
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                        {patient.recebido_count}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Award className="h-4 w-4 text-emerald-500" />
                        <span className="text-gray-500 text-xs font-semibold">Utilizados</span>
                      </div>
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                        {patient.utilizado_count}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-500 text-xs font-semibold">Disponíveis</span>
                      </div>
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        {patient.disponiveis_count}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <Heart className="h-20 w-20 mb-4 text-emerald-200 mx-auto animate-pulse" />
              <p className="text-gray-600 font-bold text-lg">Nenhum paciente encontrado</p>
              <p className="text-sm mt-2 text-gray-400">
                Os pacientes aparecerão aqui quando forem adicionados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}