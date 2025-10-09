"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  PieChart,
  Pie
} from "recharts";
import {
  Users,
  Download,
  Filter,
  Activity,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusMetric {
  status: string;
  count: number;
  percentage: number;
  avg_lead_time_days: number;
}

interface DoctorMetric {
  doctor_name: string;
  recebido_count: number;
  utilizado_count: number;
  submetido_count: number;
  pago_ars_count: number;
  pago_medico_count: number;
  total_submetido: number;
  total_pago_ars: number;
  total_pago_medico: number;
}

interface ExpiringVoucher {
  number: string;
  patient_name: string;
  expiry_date: string;
  days_until_expiry: number;
  status: string;
}


const statusConfig = {
  pendente_entrega: {
    label: "Pendente de Entrega",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500"
  },
  recebido: {
    label: "Recebido",
    color: "#17B897",
    gradient: "from-teal-400 to-cyan-500"
  },
  utilizado: {
    label: "Utilizado",
    color: "#10B981",
    gradient: "from-emerald-400 to-green-500"
  },
  submetido: {
    label: "Submetido",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500"
  },
  pago_ars: {
    label: "Pago pela ARS",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500"
  },
  pago_medico: {
    label: "Pago ao Médico",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500"
  }
};

export default function ReportsPage() {
  const [statusDistribution, setStatusDistribution] = useState<StatusMetric[]>([]);
  const [doctorMetrics, setDoctorMetrics] = useState<DoctorMetric[]>([]);
  const [totalsByStatus, setTotalsByStatus] = useState<{status: string, total: number, label: string, color: string}[]>([]);
  const [statusChartData, setStatusChartData] = useState<{status: string, count: number, fill: string}[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("current");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [doctors, setDoctors] = useState<{id: string, name: string}[]>([]);
  const [expiringVouchers, setExpiringVouchers] = useState<ExpiringVoucher[]>([]);
  const [expiryFilter, setExpiryFilter] = useState<string>("30");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    fetchDoctors();
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedDoctor]);

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      redirect("/login");
    }
  };

  const fetchDoctors = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("clinic_id")
      .single();

    if (profile) {
      const { data } = await supabase
        .from("doctors")
        .select("id, name")
        .eq("clinic_id", profile.clinic_id)
        .order("name");

      if (data) setDoctors(data);
    }
  };

  const fetchReports = async () => {
    setIsLoading(true);
    const { data: profile } = await supabase
      .from("profiles")
      .select("clinic_id")
      .single();

    if (!profile) return;

    // Build date range filter
    const now = new Date();
    let startDate = null;
    let endDate = null;

    switch(selectedMonth) {
      case "previous":
        // First day of previous month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        // First day of current month (exclusive end)
        endDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "previous_year":
        // First day of previous year
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        // First day of current year (exclusive end)
        endDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "current":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Build vouchers query with filters
    let vouchersQuery = supabase
      .from("vouchers")
      .select(`
        id,
        status,
        amount,
        created_at,
        doctor_id,
        doctors!inner(
          id,
          name,
          clinic_id
        )
      `)
      .eq("doctors.clinic_id", profile.clinic_id);

    // Apply date filter
    if (startDate) {
      vouchersQuery = vouchersQuery.gte("created_at", startDate.toISOString());
    }
    if (endDate) {
      vouchersQuery = vouchersQuery.lt("created_at", endDate.toISOString());
    }

    // Apply doctor filter
    if (selectedDoctor !== "all") {
      vouchersQuery = vouchersQuery.eq("doctor_id", selectedDoctor);
    }

    const { data: vouchersData } = await vouchersQuery;

    if (vouchersData) {
      // Calculate status distribution
      const statusCounts: { [key: string]: number } = {};
      let totalCount = 0;

      vouchersData.forEach(voucher => {
        if (voucher.status !== "pendente_entrega" && voucher.status !== "cancelado") {
          statusCounts[voucher.status] = (statusCounts[voucher.status] || 0) + 1;
          totalCount++;
        }
      });

      const statusDistributionData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0,
        avg_lead_time_days: 0
      }));

      setStatusDistribution(statusDistributionData);

      // Prepare data for the mixed bar chart
      const chartData = statusDistributionData.map(item => ({
        status: item.status,
        count: item.count,
        fill: statusConfig[item.status as keyof typeof statusConfig]?.color || "#17B897"
      }));
      setStatusChartData(chartData);

      // Calculate doctor metrics from filtered data
      const doctorMetricsMap: { [key: string]: DoctorMetric } = {};

      // Get unique doctors from the vouchers data itself
      const uniqueDoctors = new Map<string, string>();
      vouchersData.forEach((voucher) => {
        const voucherData = voucher as unknown as {
          doctor_id: string;
          doctors: { name: string }
        };
        if (voucherData.doctors && voucherData.doctors.name) {
          uniqueDoctors.set(voucherData.doctor_id, voucherData.doctors.name);
        }
      });

      // Initialize metrics for each doctor found in vouchers
      uniqueDoctors.forEach((doctorName, doctorId) => {
        doctorMetricsMap[doctorId] = {
          doctor_name: doctorName,
          recebido_count: 0,
          utilizado_count: 0,
          submetido_count: 0,
          pago_ars_count: 0,
          pago_medico_count: 0,
          total_submetido: 0,
          total_pago_ars: 0,
          total_pago_medico: 0
        };
      });

      // Calculate metrics from vouchers with cumulative counting
      vouchersData.forEach(voucher => {
        const doctorId = voucher.doctor_id;
        if (doctorMetricsMap[doctorId]) {
          const status = voucher.status;

          // Recebido count is cumulative (includes all vouchers that have been received)
          if (['recebido', 'utilizado', 'submetido', 'pago_ars', 'pago_medico'].includes(status)) {
            doctorMetricsMap[doctorId].recebido_count++;
          }

          // Utilizado count is cumulative (includes all vouchers that have been utilized)
          if (['utilizado', 'submetido', 'pago_ars', 'pago_medico'].includes(status)) {
            doctorMetricsMap[doctorId].utilizado_count++;
          }

          // Submetido count is cumulative (includes vouchers in submetido, pago_ars, and pago_medico states)
          if (['submetido', 'pago_ars', 'pago_medico'].includes(status)) {
            doctorMetricsMap[doctorId].submetido_count++;
            doctorMetricsMap[doctorId].total_submetido += voucher.amount;
          }

          // Pago ARS count is cumulative (includes vouchers in pago_ars and pago_medico states)
          if (['pago_ars', 'pago_medico'].includes(status)) {
            doctorMetricsMap[doctorId].pago_ars_count++;
            doctorMetricsMap[doctorId].total_pago_ars += voucher.amount;
          }

          // Pago Medico count only for final state
          if (status === 'pago_medico') {
            doctorMetricsMap[doctorId].pago_medico_count++;
            doctorMetricsMap[doctorId].total_pago_medico += voucher.amount;
          }
        }
      });

      const doctorMetricsData = Object.values(doctorMetricsMap);
      setDoctorMetrics(doctorMetricsData);

      // Calculate totals by status from filtered data - only monetary statuses
      const monetaryStatuses = ["submetido", "pago_ars", "pago_medico"];
      const statusTotals: { [key: string]: number } = {};

      vouchersData
        .filter(item => monetaryStatuses.includes(item.status))
        .forEach(voucher => {
          statusTotals[voucher.status] = (statusTotals[voucher.status] || 0) + voucher.amount;
        });

      const totals = Object.entries(statusTotals).map(([status, total]) => ({
        status,
        total,
        label: statusConfig[status as keyof typeof statusConfig]?.label || status,
        color: statusConfig[status as keyof typeof statusConfig]?.color || "#17B897"
      }));

      // Sort by the order defined in statusConfig
      const statusOrder = Object.keys(statusConfig);
      totals.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

      setTotalsByStatus(totals);
    }

    // Fetch expiring vouchers
    const daysFilter = parseInt(expiryFilter);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysFilter);

    const { data: expiringData } = await supabase
      .from("vouchers")
      .select(`
        number,
        expiry_date,
        status,
        patients!inner(
          name
        )
      `)
      .lte("expiry_date", expiryDate.toISOString())
      .not("status", "eq", "pago_medico")
      .not("status", "eq", "cancelado")
      .order("expiry_date", { ascending: true });

    if (expiringData) {
      const processedExpiring = expiringData.map(voucher => {
        const expiryDate = new Date(voucher.expiry_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patientData = (voucher as any).patients;
        const patientName = patientData?.name || "N/A";

        return {
          number: voucher.number,
          patient_name: patientName,
          expiry_date: voucher.expiry_date,
          days_until_expiry: daysUntilExpiry,
          status: voucher.status
        };
      });

      setExpiringVouchers(processedExpiring);
    }

    setIsLoading(false);
  };

  const exportToCSV = () => {
    // Prepare CSV data
    const csvData = [];

    // Status distribution
    csvData.push(["Distribuicao por Estado"]);
    csvData.push(["Estado", "Quantidade", "Percentagem"]);
    statusDistribution.forEach(item => {
      csvData.push([
        statusConfig[item.status as keyof typeof statusConfig]?.label || item.status,
        item.count.toString(),
        `${item.percentage}%`
      ]);
    });

    csvData.push([]);

    // Total por Estado (monetary values)
    csvData.push(["Total por Estado"]);
    csvData.push(["Estado", "Valor Total"]);
    totalsByStatus.forEach(item => {
      csvData.push([
        item.label,
        `EUR ${item.total.toFixed(2)}`
      ]);
    });

    csvData.push([]);

    // Expiring vouchers
    csvData.push(["Cheques a Expirar"]);
    csvData.push(["Numero do Cheque", "Paciente", "Data de Validade", "Dias ate Expirar"]);
    expiringVouchers.forEach(voucher => {
      csvData.push([
        voucher.number,
        voucher.patient_name,
        new Date(voucher.expiry_date).toLocaleDateString("pt-PT"),
        voucher.days_until_expiry.toString()
      ]);
    });

    csvData.push([]);

    // Doctor metrics
    csvData.push(["Metricas por Medico"]);
    csvData.push([
      "Medico",
      "Recebidos",
      "Utilizados",
      "Submetidos",
      "Pagos ARS",
      "Pagos Medico",
      "Total Submetido",
      "Total Pago ARS",
      "Total Pago Medico"
    ]);
    doctorMetrics.forEach(doctor => {
      csvData.push([
        doctor.doctor_name,
        doctor.recebido_count.toString(),
        doctor.utilizado_count.toString(),
        doctor.submetido_count.toString(),
        doctor.pago_ars_count.toString(),
        doctor.pago_medico_count.toString(),
        `EUR ${doctor.total_submetido.toFixed(2)}`,
        `EUR ${doctor.total_pago_ars.toFixed(2)}`,
        `EUR ${doctor.total_pago_medico.toFixed(2)}`
      ]);
    });

    // Convert to CSV string
    const csvString = csvData.map(row => row.join(",")).join("\n");

    // Add UTF-8 BOM for Excel compatibility
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvString;

    // Create download
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_cheques_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-blue-600">A carregar relatórios...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/70 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Activity className="h-8 w-8" />
              Relatórios e Análises
            </h1>
            <p className="mt-2 text-blue-50">Análise detalhada do ciclo de vida dos cheques</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportToCSV}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Mês Atual</SelectItem>
                <SelectItem value="previous">Mês Anterior</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="previous_year">Ano Anterior</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Todos os médicos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Médicos</SelectItem>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Performance Table */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Desempenho por Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-teal-50 to-cyan-50">
                  <th className="border border-blue-200 p-2 text-left">Médico</th>
                  <th className="border border-blue-200 p-2 text-center">Recebidos</th>
                  <th className="border border-blue-200 p-2 text-center">Utilizados</th>
                  <th className="border border-blue-200 p-2 text-center">Submetidos</th>
                  <th className="border border-blue-200 p-2 text-center">Pagos ARS</th>
                  <th className="border border-blue-200 p-2 text-center">Pagos Médico</th>
                  <th className="border border-blue-200 p-2 text-right">Total Submetido</th>
                  <th className="border border-blue-200 p-2 text-right">Total Pago ARS</th>
                  <th className="border border-blue-200 p-2 text-right">Total Pago Médico</th>
                </tr>
              </thead>
              <tbody>
                {doctorMetrics.map((doctor, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-teal-50/30"}>
                    <td className="border border-blue-200 p-2 font-medium">{doctor.doctor_name}</td>
                    <td className="border border-blue-200 p-2 text-center">{doctor.recebido_count}</td>
                    <td className="border border-blue-200 p-2 text-center">{doctor.utilizado_count}</td>
                    <td className="border border-blue-200 p-2 text-center">{doctor.submetido_count}</td>
                    <td className="border border-blue-200 p-2 text-center">{doctor.pago_ars_count}</td>
                    <td className="border border-blue-200 p-2 text-center">{doctor.pago_medico_count}</td>
                    <td className="border border-blue-200 p-2 text-right font-semibold">
                      €{doctor.total_submetido.toFixed(2)}
                    </td>
                    <td className="border border-blue-200 p-2 text-right font-semibold">
                      €{doctor.total_pago_ars.toFixed(2)}
                    </td>
                    <td className="border border-blue-200 p-2 text-right font-semibold">
                      €{doctor.total_pago_medico.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Bar Chart */}
        <Card className="border-2 border-blue-200 h-[450px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Distribuição por Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[calc(100%-120px)]">
            <ChartContainer
              config={{
                count: {
                  label: "Quantidade",
                },
                ...Object.fromEntries(
                  statusDistribution.map((item) => [
                    item.status,
                    {
                      label: statusConfig[item.status as keyof typeof statusConfig]?.label || item.status,
                      color: statusConfig[item.status as keyof typeof statusConfig]?.color || "#17B897"
                    }
                  ])
                )
              }}
              className="w-full h-[280px]"
            >
              <BarChart
                accessibilityLayer
                data={statusChartData}
                layout="vertical"
                margin={{
                  left: 60,
                }}
              >
                <YAxis
                  dataKey="status"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    statusConfig[value as keyof typeof statusConfig]?.label || value
                  }
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Quantidade de cheques por estado atual
            </div>
          </CardFooter>
        </Card>

        {/* Total Amount Donut Chart */}
        <Card className="border-2 border-blue-200 h-[450px]">
          <CardHeader className="items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Total por Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={{
                submetido: {
                  label: "Submetido",
                  color: "#8B5CF6"
                },
                pago_ars: {
                  label: "Pago pela ARS",
                  color: "#3B82F6"
                },
                pago_medico: {
                  label: "Pago ao Médico",
                  color: "#EC4899"
                }
              }}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent
                    hideLabel={false}
                  />}
                />
                <Pie
                  data={totalsByStatus}
                  dataKey="total"
                  nameKey="label"
                  innerRadius={60}
                  strokeWidth={2}
                >
                  {totalsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm pt-4">
            <div className="flex flex-wrap justify-center gap-4">
              {totalsByStatus.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs">
                    {item.label}: €{item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-muted-foreground leading-none text-center mt-2">
              Valores totais acumulados por estado
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Expiring Vouchers Table */}
      <Card className="border-2 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Cheques a Expirar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={expiryFilter} onValueChange={(value) => {
              setExpiryFilter(value);
              fetchReports();
            }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Próximos 30 dias</SelectItem>
                <SelectItem value="60">Próximos 60 dias</SelectItem>
                <SelectItem value="90">Próximos 90 dias</SelectItem>
                <SelectItem value="180">Próximos 6 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <th className="border border-amber-200 p-2 text-left">Número do Cheque</th>
                  <th className="border border-amber-200 p-2 text-left">Paciente</th>
                  <th className="border border-amber-200 p-2 text-center">Data de Validade</th>
                  <th className="border border-amber-200 p-2 text-center">Dias até Expirar</th>
                  <th className="border border-amber-200 p-2 text-center">Estado Atual</th>
                </tr>
              </thead>
              <tbody>
                {expiringVouchers.length > 0 ? (
                  expiringVouchers.map((voucher, index) => {
                    const isExpired = voucher.days_until_expiry < 0;
                    const isUrgent = voucher.days_until_expiry <= 7;
                    const rowClass = isExpired
                      ? "bg-red-50"
                      : isUrgent
                      ? "bg-amber-50"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50";

                    return (
                      <tr key={voucher.number} className={rowClass}>
                        <td className="border border-amber-200 p-2 font-medium">{voucher.number}</td>
                        <td className="border border-amber-200 p-2">{voucher.patient_name}</td>
                        <td className="border border-amber-200 p-2 text-center">
                          {new Date(voucher.expiry_date).toLocaleDateString("pt-PT")}
                        </td>
                        <td className="border border-amber-200 p-2 text-center">
                          <span className={`font-bold ${
                            isExpired ? "text-red-600" : isUrgent ? "text-amber-600" : "text-gray-700"
                          }`}>
                            {isExpired ? (
                              <>
                                <AlertTriangle className="inline h-4 w-4 mr-1" />
                                Expirado há {Math.abs(voucher.days_until_expiry)} dias
                              </>
                            ) : (
                              `${voucher.days_until_expiry} dias`
                            )}
                          </span>
                        </td>
                        <td className="border border-amber-200 p-2 text-center">
                          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white">
                            {statusConfig[voucher.status as keyof typeof statusConfig]?.label || voucher.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="border border-amber-200 p-4 text-center text-gray-500">
                      Nenhum cheque a expirar no período selecionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {expiringVouchers.filter(v => v.days_until_expiry < 0).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Existem {expiringVouchers.filter(v => v.days_until_expiry < 0).length} cheque(s) expirado(s) que necessitam de atenção imediata.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}