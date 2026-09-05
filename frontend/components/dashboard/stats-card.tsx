import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardsProps {
  totalRevenue: number;
  revenueChangePct: number | null;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

function formatChange(pct: number | null) {
  if (pct === null) return { label: "No data yet", trend: "neutral" as const };
  const trend = pct > 0 ? "up" : pct < 0 ? "down" : "neutral";
  const sign = pct > 0 ? "+" : "";
  return { label: `${sign}${pct.toFixed(1)}% vs last month`, trend };
}

export function StatsCards({
  totalRevenue,
  revenueChangePct,
  totalOrders,
  totalCustomers,
  totalProducts,
}: StatsCardsProps) {
  const revenueChange = formatChange(revenueChangePct);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: revenueChange.label,
      trend: revenueChange.trend,
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: totalOrders.toLocaleString(),
      change: "All time",
      trend: "neutral" as const,
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: totalCustomers.toLocaleString(),
      change: "Have placed an order",
      trend: "neutral" as const,
      icon: Users,
    },
    {
      title: "Products",
      value: totalProducts.toLocaleString(),
      change: "In catalog",
      trend: "neutral" as const,
      icon: Package,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;
        
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className={cn(
                  "flex items-center text-xs",
                  stat.trend === "up" && "text-green-600",
                  stat.trend === "down" && "text-red-600",
                  stat.trend === "neutral" && "text-muted-foreground"
                )}>
                  <TrendIcon className="h-3 w-3 mr-0.5" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}