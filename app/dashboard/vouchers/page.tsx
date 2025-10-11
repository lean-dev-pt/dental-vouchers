"use client";

import { useEffect, useState, useMemo } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AddVoucherDialog } from "@/components/dashboard/add-voucher-dialog";
import { VoucherStatusManager } from "@/components/dashboard/voucher-status-manager";
import { VoucherDetailDialog } from "@/components/dashboard/voucher-detail-dialog";
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
import { ArrowUpDown, Search, Clock, HandHeart, CheckCircle, Send, Banknote, UserCheck, Receipt, Calendar, AlertTriangle, Mail } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Voucher {
  id: string;
  number: string;
  patient_id: string;
  doctor_id: string;
  status: string;
  amount: number;
  created_at: string;
  expiry_date: string | null;
  patient?: {
    name: string;
  };
  doctor?: {
    name: string;
  };
}

interface StateStats {
  count: number;
  amount: number;
}

const statusConfig = {
  pendente_entrega: {
    label: "Pendente de Entrega",
    className: "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm",
    cardClass: "border-amber-200 hover:border-amber-400 hover:shadow-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50",
    icon: Clock,
    gradient: "from-amber-400 to-orange-500"
  },
  recebido: {
    label: "Recebido",
    className: "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-sm",
    cardClass: "border-teal-200 hover:border-teal-400 hover:shadow-teal-200/50 bg-gradient-to-br from-teal-50 to-cyan-50",
    icon: HandHeart,
    gradient: "from-teal-400 to-cyan-500"
  },
  utilizado: {
    label: "Utilizado",
    className: "bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-sm",
    cardClass: "border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50",
    icon: CheckCircle,
    gradient: "from-emerald-400 to-green-500"
  },
  submetido: {
    label: "Submetido",
    className: "bg-gradient-to-r from-violet-400 to-purple-400 text-white shadow-sm",
    cardClass: "border-violet-200 hover:border-violet-400 hover:shadow-violet-200/50 bg-gradient-to-br from-violet-50 to-purple-50",
    icon: Send,
    gradient: "from-violet-400 to-purple-500"
  },
  pago_ars: {
    label: "Pago pela ARS",
    className: "bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-sm",
    cardClass: "border-blue-200 hover:border-blue-400 hover:shadow-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50",
    icon: Banknote,
    gradient: "from-blue-400 to-indigo-500"
  },
  pago_medico: {
    label: "Pago ao Médico",
    className: "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm",
    cardClass: "border-pink-200 hover:border-pink-400 hover:shadow-pink-200/50 bg-gradient-to-br from-pink-50 to-rose-50",
    icon: UserCheck,
    gradient: "from-pink-400 to-rose-500"
  }
};

// Keep cancelado config for table display only
const canceladoConfig = {
  label: "Cancelado",
  className: "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-sm",
  cardClass: "border-red-200 hover:border-red-400 hover:shadow-red-200/50 bg-gradient-to-br from-red-50 to-red-50",
  icon: Receipt,
  gradient: "from-red-400 to-red-500"
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [stateStats, setStateStats] = useState<Record<string, StateStats>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState<string>("all");
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const columns = useMemo<ColumnDef<Voucher>[]>(
    () => [
      {
        accessorKey: "number",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Número
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-bold text-gray-800">{row.getValue("number")}</div>
        ),
      },
      {
        accessorKey: "patient.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Paciente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-gray-700 font-medium">{row.original.patient?.name || "N/A"}</span>,
      },
      {
        accessorKey: "doctor.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Médico
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-gray-700 font-medium">{row.original.doctor?.name || "N/A"}</span>,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500 text-right w-full justify-end"
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          return (
            <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              €{amount.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("created_at"));
          return <span className="text-gray-600 font-medium">{date.toLocaleDateString("pt-PT")}</span>;
        },
      },
      {
        accessorKey: "expiry_date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Validade
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const expiryDate = row.getValue("expiry_date") as string | null;
          if (!expiryDate) return <span className="text-gray-400">-</span>;

          const date = new Date(expiryDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          date.setHours(0, 0, 0, 0);

          const daysUntilExpiry = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          let className = "text-gray-600 font-medium";
          let icon = null;

          if (daysUntilExpiry < 0) {
            className = "text-red-600 font-bold";
            icon = <AlertTriangle className="inline h-4 w-4 mr-1 text-red-500" />;
          } else if (daysUntilExpiry <= 30) {
            className = "text-amber-600 font-bold";
            icon = <Clock className="inline h-4 w-4 mr-1 text-amber-500" />;
          }

          return (
            <span className={className}>
              {icon}
              {date.toLocaleDateString("pt-PT")}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-bold text-teal-700 hover:text-teal-500"
          >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const config = status === "cancelado"
            ? canceladoConfig
            : statusConfig[status as keyof typeof statusConfig] || {
                label: status,
                className: "bg-gray-100 text-gray-800"
              };
          return (
            <span className={`px-4 py-2 text-xs font-bold rounded-full ${config.className}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <VoucherDetailDialog
              voucher={row.original}
              onStatusChange={loadVouchers}
            />
            <VoucherStatusManager
              voucherId={row.original.id}
              currentStatus={row.original.status}
              onStatusChange={loadVouchers}
            />
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      redirect("/auth/login");
    }

    console.log("Authenticated user:", user.email, user.id);

    // Check if email is confirmed
    if (!user.email_confirmed_at) {
      setShowEmailVerification(true);
    }

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

    // Redirect support admins to admin dashboard
    if (profile.role === "support_admin") {
      redirect("/admin/support");
      return;
    }

    setClinicId(profile.clinic_id);
    await loadVouchers();
  };

  const loadVouchers = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: vouchersData, error: vouchersError } = await supabase
        .from("vouchers")
        .select(`
          *,
          patient:patients(name),
          doctor:doctors(name)
        `)
        .order("created_at", { ascending: false });

      if (vouchersError) throw vouchersError;

      setVouchers(vouchersData || []);

      const stats: Record<string, StateStats> = {};
      Object.keys(statusConfig).forEach(status => {
        stats[status] = { count: 0, amount: 0 };
      });

      (vouchersData || []).forEach(voucher => {
        if (stats[voucher.status]) {
          stats[voucher.status].count++;
          stats[voucher.status].amount += voucher.amount;
        }
      });

      setStateStats(stats);
    } catch (error) {
      console.error("Error loading vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoucherAdded = () => {
    if (clinicId) {
      loadVouchers();
    }
  };

  const filteredVouchers = useMemo(() => {
    let filtered = [...vouchers];

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(v => v.status === selectedStatus);
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      let startDate: Date;
      let endDate: Date | undefined;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "last_month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case "last_3_months":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          return filtered;
      }

      filtered = filtered.filter(v => {
        const vDate = new Date(v.created_at);
        if (endDate) {
          return vDate >= startDate && vDate <= endDate;
        }
        return vDate >= startDate;
      });
    }

    return filtered;
  }, [vouchers, selectedStatus, dateRange]);

  const table = useReactTable({
    data: filteredVouchers,
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

  const getStatusBadge = (status: string) => {
    const config = status === "cancelado"
      ? canceladoConfig
      : statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          className: "bg-gray-100 text-gray-800"
        };

    return (
      <span className={`px-4 py-2 text-xs font-bold rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const hasActiveFilters = selectedStatus || dateRange !== "all";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-t-teal-500 border-r-cyan-500 rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-teal-600 font-semibold mt-4">A carregar sorrisos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Email Verification Alert Dialog */}
      <AlertDialog open={showEmailVerification} onOpenChange={setShowEmailVerification}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-full">
                <Mail className="h-10 w-10 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Confirme o seu email
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Por favor, verifique o seu email para confirmar a sua conta.
              Enviámos-lhe um link de confirmação para o seu endereço de email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={() => setShowEmailVerification(false)}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        {/* Modern Healthcare Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400 p-10 text-white shadow-2xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Receipt className="h-10 w-10" />
            <h1 className="text-4xl font-extrabold">Cheques Dentista</h1>
          </div>
        </div>
      </div>

      {/* Colorful Estado Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`rounded-2xl border-2 p-4 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                selectedStatus === status
                  ? `ring-4 ring-offset-2 ring-teal-400 ${config.cardClass} shadow-xl scale-105`
                  : config.cardClass
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} text-white flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full ${config.className} truncate`}>
                    {config.label}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-800">
                    {stateStats[status]?.count || 0}
                  </p>
                  <p className={`text-sm font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                    €{(stateStats[status]?.amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Clear filter button */}
      {hasActiveFilters && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setSelectedStatus(null);
              setDateRange("all");
            }}
            className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Limpar Todos os Filtros ✨
          </button>
        </div>
      )}

      {/* Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-100">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-[400px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-teal-500" />
            </div>
            <Input
              placeholder="Pesquisar paciente ou médico..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-12 h-12 border-2 border-teal-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 rounded-xl font-medium"
            />
          </div>

          {/* Date Filter Dropdown */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[200px] min-h-[3rem] h-12 py-3 px-4 border-2 border-teal-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 rounded-xl font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-600" />
                <SelectValue placeholder="Período" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="last_month">Último Mês</SelectItem>
              <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {clinicId && (
          <AddVoucherDialog
            clinicId={clinicId}
            onVoucherAdded={handleVoucherAdded}
          />
        )}
      </div>

      {/* Modern Table */}
      <div className="rounded-2xl border-2 border-teal-200 bg-white shadow-xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 border-b-2 border-teal-200">
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
                    className={`hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 transition-all border-b border-gray-100 ${
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
                      <CheckCircle className="h-16 w-16 mb-4 text-teal-300 animate-pulse" />
                      <p className="font-bold text-gray-600 text-lg">Nenhum voucher encontrado</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Os vouchers aparecerão aqui quando forem criados
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
              const voucher = row.original;
              const config = voucher.status === "cancelado"
                ? canceladoConfig
                : statusConfig[voucher.status as keyof typeof statusConfig];
              return (
                <div
                  key={row.id}
                  className={`rounded-2xl border-2 p-5 space-y-4 shadow-md hover:shadow-xl transition-all ${config?.cardClass || 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="font-extrabold text-xl text-gray-800">{voucher.number}</p>
                      {getStatusBadge(voucher.status)}
                    </div>
                    <p className={`font-extrabold text-2xl bg-gradient-to-r ${config?.gradient || 'from-gray-600 to-gray-700'} bg-clip-text text-transparent`}>
                      €{voucher.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 font-semibold">Paciente:</span>
                      <span className="font-bold text-gray-800">{voucher.patient?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 font-semibold">Médico:</span>
                      <span className="font-bold text-gray-800">{voucher.doctor?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 font-semibold">Data:</span>
                      <span className="font-bold text-gray-800">
                        {new Date(voucher.created_at).toLocaleDateString("pt-PT")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 font-semibold">Validade:</span>
                      {voucher.expiry_date ? (
                        (() => {
                          const date = new Date(voucher.expiry_date);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          date.setHours(0, 0, 0, 0);
                          const daysUntilExpiry = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                          let className = "font-bold text-gray-800";
                          let icon = null;

                          if (daysUntilExpiry < 0) {
                            className = "font-bold text-red-600";
                            icon = <AlertTriangle className="inline h-4 w-4 mr-1 text-red-500" />;
                          } else if (daysUntilExpiry <= 30) {
                            className = "font-bold text-amber-600";
                            icon = <Clock className="inline h-4 w-4 mr-1 text-amber-500" />;
                          }

                          return (
                            <span className={className}>
                              {icon}
                              {date.toLocaleDateString("pt-PT")}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <CheckCircle className="h-20 w-20 mb-4 text-teal-200 mx-auto animate-pulse" />
              <p className="text-gray-600 font-bold text-lg">Nenhum voucher encontrado</p>
              <p className="text-sm mt-2 text-gray-400">
                Os vouchers aparecerão aqui quando forem criados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}