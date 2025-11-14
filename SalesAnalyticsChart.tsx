"use client";

import { useState, useEffect } from "react";
import axiosClient from '@/config/axios.config';
import { API_BASE_URL } from '@/config/api.config';
import DateRangePickerV2 from "@/components/date-picker-v2";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { formatDateToBackend } from "@/hooks/format-date-to-backend";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, TrendingUp, Users, Ticket, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/stock-adjustment";
import { fetchUsers } from "@/app/[lang]/(dashboard)/(crm)/chat/api/queries";
import { FetchGeneralPurchaseParams } from '@/services/salesJv/general-purchase.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse } from "@/types";
import { fetchWarehouse } from "@/services/service.warehouse";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface SalesAnalyticsApiResponse {
  statusCode: number;
  success: boolean;
  data: {
    requestedBy: number;
    hasGlobalAccess: boolean;
    effectiveUserId: number | null;
    groupingMode: string;
    dateRange: {
      fromDate: string;
      toDate: string;
      rangeDays: number;
    };
    totalUsers: number;
    salesData: Array<{
      userId: number;
      username: string;
      totalSales: number;
      totalTickets: number;
      groupedSales: Array<{
        label: string;
        sales: number;
        tickets: number;
      }>;
    }>;
  };
  ResponseMessages: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
};

const getGroupingModeTranslation = (mode: string) => {
  const translations: { [key: string]: string } = {
    DAILY: "Diario",
    WEEK: "Semanal",
    MONTH: "Mensual",
    YEAR: "Anual",
    MANY_YEARS: "Varios años",
  };
  return translations[mode] || mode;
};

export const SalesAnalyticsChart = () => {
  const [data, setData] = useState<SalesAnalyticsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });

  const [filters, setFilters] = useState<FetchGeneralPurchaseParams>({
    fromDate: formatDateToBackend(date.from, true),
    toDate: formatDateToBackend(date.to, false),
    userId: undefined,
    warehouseId: undefined,
  });

  const userColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
  ];

  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      sales: {
        label: "Ventas",
      },
    };

    if (data && data.data.salesData) {
      data.data.salesData.forEach((user, index) => {
        config[user.username] = {
          label: user.username,
          color: userColors[index % userColors.length],
        };
      });
    }
    return config;
  }, [data]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);
      if (filters.userId) params.append("userId", filters.userId.toString());
      if (filters.warehouseId) params.append("warehouseId", filters.warehouseId.toString());

      const queryString = params.toString();
      const url = `${API_BASE_URL}/dashboard/v1/sales-analytics${queryString ? `?${queryString}` : ""}`;

      const response = await axiosClient.get<SalesAnalyticsApiResponse>(url);

      setData(response.data);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleDateChange = (newDateRange: DateRange) => {
    setDate(newDateRange);
    setFilters(prevFilters => ({
      ...prevFilters,
      fromDate: formatDateToBackend(newDateRange.from, true),
      toDate: formatDateToBackend(newDateRange.to, false),
    }));
  };

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  const { data: warehouse } = useQuery<Warehouse[]>({
    queryKey: ["warehouse"],
    queryFn: () => fetchWarehouse(),
    staleTime: Infinity,
  });

  const chartData = data?.data.salesData.reduce((acc, user) => {
    user.groupedSales.forEach(sale => {
      const existing = acc.find(item => item.label === sale.label);
      if (existing) {
        existing[user.username] = sale.sales;
      } else {
        acc.push({ label: sale.label, [user.username]: sale.sales });
      }
    });
    return acc;
  }, [] as Array<{ label: string; [key: string]: number | string }>);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div
        className={
          "grid min-w-[12rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
        }
      >
        {label &&
          <div className="font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{label}</span>
          </div>}
        <div className="grid gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
            >
              <div
                className="shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] h-2.5 w-2.5"
                style={
                  {
                    "--color-bg": entry.stroke,
                    "--color-border": entry.stroke,
                  } as React.CSSProperties
                }
              />
              <div className="flex flex-1 justify-between leading-none items-center">
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">{entry.name}:</span>
                </div>
                {entry.value && (
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {formatCurrency(entry.value)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-3 ml-2 flex items-center gap-2 text-2xl font-bold">
          <span>Análisis Estadisticos de Ventas</span>
        </CardTitle>
        <CardDescription className="ml-2 text-base leading-relaxed">
          <div className="flex items-center">
            Grafico de ventas consolidadas por período:{" "}
            {loading
              ? <Skeleton className="ml-1 h-6 w-20" />
              : data?.data.groupingMode && (
                <span className="text-primary font-semibold ml-1 flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {getGroupingModeTranslation(data.data.groupingMode)}
                </span>
              )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            {/* Almacén */}
            <div className="space-y-1">
              <Label className="text-secondary-foreground">Almacén:</Label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  defaultValue="all"
                  value={filters.warehouseId === undefined ? "all" : filters.warehouseId.toString()}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      warehouseId: value === "all" ? undefined : parseInt(value),
                    }));
                  }}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un almacén" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {warehouse?.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id.toString()}>
                        {wh.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-1">
              <Label className="text-secondary-foreground">Período:</Label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <DateRangePickerV2
                  date={date}
                  setDate={setDate}
                  handleDateChange={handleDateChange}
                />
              )}
            </div>

            {/* Usuario */}
            <div className="space-y-1">
              <Label className="text-secondary-foreground">Usuario:</Label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  defaultValue="all"
                  value={filters.userId === undefined ? "all" : filters.userId.toString()}
                  onValueChange={(value) => {
                    const newFilters = { ...filters };
                    if (value === "all") {
                      delete newFilters.userId;
                    } else {
                      newFilters.userId = Number(value);
                    }
                    setFilters(newFilters);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <ChartContainer config={chartConfig} className="h-[550px] w-full">
          {chartData && chartData.length > 0 ? (
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 10, right: 0, left: 30, bottom: 5 }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="label"
                type="category"
                tickLine={false}
                tickMargin={12}
                axisLine={false}
              />
              <YAxis
                type="number"
                tickLine={false}
                tickMargin={15}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value as number)}
              />
              <Tooltip content={<CustomTooltip  />} />
              {data?.data.salesData.map((user, index) => (
                <Line
                  key={user.userId}
                  dataKey={user.username}
                  type="monotone"
                  stroke={userColors[index % userColors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent  />} />
            </LineChart>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4">
              <AlertCircle className="mb-4 h-9 w-9 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No se encontraron datos de ventas para el período y filtros seleccionados.</p>
            </div>
          )}
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {error ? (
          <div className="flex gap-2 leading-none font-medium">
            <p className="text-sm text-destructive">Error: {error.message}</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-5 w-full">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total de Ventas:</span>
              <span className="font-medium">
                {data && data.data.salesData.length > 0
                  ? formatCurrency(data.data.salesData.reduce((acc, item) => acc + item.totalSales, 0))
                  : formatCurrency(0)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total de Tickets:</span>
              <span className="font-medium">
                {data && data.data.salesData.length > 0
                  ? data.data.salesData.reduce((acc, item) => acc + item.totalTickets, 0)
                  : 0}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total de Usuarios:</span>
              <span className="font-medium">
                {data?.data.totalUsers ?? 0}
              </span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
