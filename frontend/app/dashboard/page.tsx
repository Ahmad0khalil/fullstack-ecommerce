import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview, type OverviewDataPoint } from "@/components/dashboard/overview";
import { RecentSales, type RecentSale } from "@/components/dashboard/recent-sales";
import { StatsCards } from "@/components/dashboard/stats-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopProducts, type TopProduct } from "@/components/dashboard/top-products";
import { getOrders } from "@/services/ordersService";
import { getProducts } from "@/services/productService";
import type { Order } from "@/app/types/orders";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export default async function DashboardPage() {
  const [ordersRes, productsRes] = await Promise.all([
    getOrders(1000),
    getProducts(1, 1000),
  ]);

  const orders: Order[] = ordersRes.data ?? [];
  // Backend already sorts by order_date DESC.
  const totalProducts: number = productsRes.meta?.totalCount ?? (productsRes.data?.length ?? 0);

  // --- Top-line stats ---
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.user_id)).size;

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}`;

  const revenueByMonth = new Map<string, number>();
  for (const o of orders) {
    const key = monthKey(o.order_date);
    revenueByMonth.set(key, (revenueByMonth.get(key) || 0) + (Number(o.total_amount) || 0));
  }
  const thisMonthRevenue = revenueByMonth.get(thisMonthKey) || 0;
  const lastMonthRevenue = revenueByMonth.get(lastMonthKey) || 0;
  const revenueChangePct =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : null;

  // --- Overview chart: last 6 months, oldest first ---
  const overviewData: OverviewDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    overviewData.push({
      name: d.toLocaleDateString("en-US", { month: "short" }),
      total: Math.round((revenueByMonth.get(key) || 0) * 100) / 100,
    });
  }

  // --- Recent sales & recent orders (already sorted newest-first) ---
  const recentSales: RecentSale[] = orders.slice(0, 5).map((o) => ({
    id: o.order_id,
    name: o.username,
    description: `Order #${o.order_id} • ${new Date(o.order_date).toLocaleDateString()}`,
    amount: `$${Number(o.total_amount).toFixed(2)}`,
    fallback: initials(o.username || "?"),
  }));

  const recentOrders = orders.slice(0, 5);

  // --- Top products by revenue, aggregated from order line items ---
  const productStats = new Map<string, { name: string; sales: number; revenue: number }>();
  for (const o of orders) {
    for (const item of o.items || []) {
      const existing = productStats.get(item.product_id) || { name: item.name, sales: 0, revenue: 0 };
      existing.sales += item.quantity;
      existing.revenue += item.quantity * Number(item.price);
      productStats.set(item.product_id, existing);
    }
  }
  const topProducts: TopProduct[] = Array.from(productStats.entries())
    .map(([product_id, stats]) => ({ product_id, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <StatsCards
        totalRevenue={totalRevenue}
        revenueChangePct={revenueChangePct}
        totalOrders={totalOrders}
        totalCustomers={totalCustomers}
        totalProducts={totalProducts}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={overviewData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales sales={recentSales} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={recentOrders} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts products={topProducts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
