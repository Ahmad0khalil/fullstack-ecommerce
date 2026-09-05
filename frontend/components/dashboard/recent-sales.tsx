// components/dashboard/recent-sales.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface RecentSale {
  id: string;
  name: string;
  description: string;
  amount: string;
  fallback: string;
}

export function RecentSales({ sales }: { sales: RecentSale[] }) {
  if (sales.length === 0) {
    return <p className="text-sm text-muted-foreground">No sales yet.</p>;
  }

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={undefined} alt={sale.name} />
            <AvatarFallback>{sale.fallback}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.description}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
}