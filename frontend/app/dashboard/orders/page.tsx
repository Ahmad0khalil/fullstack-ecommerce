// app/dashboard/orders/page.tsx
import { OrdersTable } from "@/components/dashboard/orders/orders-table";
import { OrdersStats } from "@/components/dashboard/orders/orders-stats";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrders } from "@/services/ordersService";
import type { Order } from "@/app/types/orders";

export default async function OrdersPage() {
  const orders: Order[] = (await getOrders()).data;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage customer orders
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <OrdersStats orders={orders} />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <OrdersTable orders={orders} />
      </Suspense>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return <Skeleton className="h-96 w-full rounded-lg" />;
}