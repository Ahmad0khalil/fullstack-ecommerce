import { ProductsTable } from "@/components/dashboard/products/products-table";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/services/productService";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  const productsData = await getProducts();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and details
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsTable productsData={productsData} />
    </div>
  );
}