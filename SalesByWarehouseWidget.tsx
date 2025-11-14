import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  ActivityIcon,
  CalendarDaysIcon,
  XCircleIcon,
} from "lucide-react";
import { SalesSummary } from "@/types/dashboard/dashboard.interface";
import { fetchSalesByWarehouse } from "@/services/dashboard/dashboard-service";
import { SalesSummaryByTime } from "@/types/dashboard/dashboard.interface";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
};

interface SalesCardProps {
  title: string;
  icon: React.ElementType;
  summary: SalesSummaryByTime[] | undefined;
  getTotal: (item: SalesSummaryByTime) => number;
}

const SalesCard: React.FC<SalesCardProps> = ({
  title,
  icon: Icon,
  summary,
  getTotal,
}) => {
  const totalSales =
    summary?.reduce((acc, curr) => acc + getTotal(curr), 0) || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-5 pt-3">
        <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {(summary || []).length > 0 ? (
            (summary || []).map((warehouse) => (
              <div
                key={warehouse.warehouseId}
                className="flex items-center justify-between"
              >
                <span className="font-medium">{warehouse.warehouseCode}</span>
                <span className="font-mono dark:bg-gray-800 px-2 py-0.5 rounded-md">
                  {formatCurrency(getTotal(warehouse))}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-medium">Almacén</span>
              <span className="font-mono dark:bg-gray-800 px-2 py-0.5 rounded-md">
                {formatCurrency(0)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const SalesByWarehouseWidget = () => {
  const {
    data: salesByWarehouse,
    isLoading: isLoading,
    error: error,
  } = useQuery<SalesSummary>({
    queryKey: ["sales-by-warehouse"],
    queryFn: fetchSalesByWarehouse,
  });

  return (
    <div className="w-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <SalesCard
          title="Ventas Diarias"
          icon={DollarSignIcon}
          summary={salesByWarehouse?.summaryByTime.Daily}
          getTotal={(item) => item.totalSales}
        />
        <SalesCard
          title="Ventas Semanales"
          icon={CalendarDaysIcon}
          summary={salesByWarehouse?.summaryByTime.Week}
          getTotal={(item) => item.totalSales}
        />
        <SalesCard
          title="Ventas Mensuales"
          icon={TrendingUpIcon}
          summary={salesByWarehouse?.summaryByTime.Month}
          getTotal={(item) => item.totalSales}
        />
        <SalesCard
          title="Ventas Anuladas por Mes"
          icon={XCircleIcon}
          summary={salesByWarehouse?.summaryByTime.CanceledPerMonth}
          getTotal={(item) => item.totalCanceled}
        />
      </div>
    </div>
  );
};
