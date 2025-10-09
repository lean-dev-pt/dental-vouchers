"use client";

import { useEffect, useState, useMemo } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AddDoctorDialog } from "@/components/dashboard/add-doctor-dialog";
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
import { ArrowUpDown, Search, Stethoscope, TrendingUp, Award, CreditCard, Sparkles, Activity } from "lucide-react";
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

interface Doctor {
  id: string;
  name: string;
  created_at: string;
  valor_submetido: number;
  valor_pago_ars: number;
  valor_pago_medico: number;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions for the table
  const columns = useMemo<ColumnDef<Doctor>[]>(
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
        accessorKey: "valor_submetido",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Valor Submetido
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("valor_submetido"));
          return (
            <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              €{amount.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: "valor_pago_ars",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Valor Pago pela ARS
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("valor_pago_ars"));
          return (
            <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              €{amount.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: "valor_pago_medico",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Valor Pago ao Médico
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("valor_pago_medico"));
          return (
            <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
              €{amount.toFixed(2)}
            </div>
          );
        },
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
    await loadDoctors(profile.clinic_id);
  };

  const loadDoctors = async (clinicId: string) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Fetch doctors with voucher amounts
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("doctors")
        .select(`
          *,
          vouchers(status, amount)
        `)
        .eq("clinic_id", clinicId)
        .order("created_at", { ascending: false });

      if (doctorsError) throw doctorsError;

      // Process the data to calculate amounts by status
      const processedDoctors = (doctorsData || []).map(doctor => {
        const vouchers = doctor.vouchers || [];

        const valor_submetido = vouchers
          .filter((v: { status: string; amount: number }) => v.status === 'submetido')
          .reduce((sum: number, v: { status: string; amount: number }) => sum + (v.amount || 0), 0);

        const valor_pago_ars = vouchers
          .filter((v: { status: string; amount: number }) => v.status === 'pago_ars')
          .reduce((sum: number, v: { status: string; amount: number }) => sum + (v.amount || 0), 0);

        const valor_pago_medico = vouchers
          .filter((v: { status: string; amount: number }) => v.status === 'pago_medico')
          .reduce((sum: number, v: { status: string; amount: number }) => sum + (v.amount || 0), 0);

        return {
          id: doctor.id,
          name: doctor.name,
          created_at: doctor.created_at,
          valor_submetido,
          valor_pago_ars,
          valor_pago_medico
        };
      });

      setDoctors(processedDoctors);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorAdded = () => {
    if (clinicId) {
      loadDoctors(clinicId);
    }
  };

  // Create table instance
  const table = useReactTable({
    data: doctors,
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
          <p className="text-teal-600 font-semibold mt-4">A carregar médicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Healthcare Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-violet-400 p-10 text-white shadow-2xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-10 w-10" />
            <h1 className="text-4xl font-extrabold">Médicos</h1>
          </div>
        </div>
      </div>

      {/* Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-2xl p-6 shadow-lg border-2 border-violet-100">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-violet-500" />
          </div>
          <Input
            placeholder="Pesquisar médico..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 h-12 border-2 border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 rounded-xl font-medium"
          />
        </div>
        {clinicId && (
          <AddDoctorDialog
            clinicId={clinicId}
            onDoctorAdded={handleDoctorAdded}
          />
        )}
      </div>

      {/* Modern Table */}
      <div className="rounded-2xl border-2 border-violet-200 bg-white shadow-xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 border-b-2 border-violet-200">
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
                    className={`hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-purple-50/50 transition-all border-b border-gray-100 ${
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
                      <Sparkles className="h-16 w-16 mb-4 text-violet-300 animate-pulse" />
                      <p className="font-bold text-gray-600 text-lg">Nenhum médico encontrado</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Os médicos aparecerão aqui quando forem adicionados
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
              const doctor = row.original;
              return (
                <div
                  key={row.id}
                  className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50 p-5 space-y-4 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-extrabold text-xl text-gray-800">{doctor.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Stethoscope className="h-5 w-5 text-violet-500" />
                        <span className="text-violet-600 font-semibold">Médico Especialista</span>
                      </div>
                    </div>
                    <Award className="h-6 w-6 text-violet-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-violet-100">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-violet-500" />
                        <span className="text-gray-500 text-sm font-semibold">Valor Submetido</span>
                      </div>
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                        €{doctor.valor_submetido.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-500 text-sm font-semibold">Valor Pago pela ARS</span>
                      </div>
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        €{doctor.valor_pago_ars.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-pink-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-pink-500" />
                        <span className="text-gray-500 text-sm font-semibold">Valor Pago ao Médico</span>
                      </div>
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                        €{doctor.valor_pago_medico.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <Sparkles className="h-20 w-20 mb-4 text-violet-200 mx-auto animate-pulse" />
              <p className="text-gray-600 font-bold text-lg">Nenhum médico encontrado</p>
              <p className="text-sm mt-2 text-gray-400">
                Os médicos aparecerão aqui quando forem adicionados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}