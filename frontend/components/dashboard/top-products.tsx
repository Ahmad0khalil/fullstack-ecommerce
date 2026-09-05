export interface TopProduct {
  product_id: string;
  name: string;
  sales: number;
  revenue: number;
}

export function TopProducts({ products: topProducts }: { products: TopProduct[] }) {
  if (topProducts.length === 0) {
    return <p className="text-sm text-muted-foreground">No sales yet.</p>;
  }

  return (
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div key={product.product_id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-medium">
            #{index + 1}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {product.name}
            </p>
            <span className="text-xs text-muted-foreground">
              {product.sales} sold
            </span>
          </div>
          <div className="font-medium">${product.revenue.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}