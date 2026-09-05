import NewProductForm from "@/components/dashboard/products/new-product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/lib/getCategories";

export default async function NewProductPage() {
  const categories = await getCategories();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product and add it to your inventory
          </p>
        </div>
      </div>

      <NewProductForm categories={categories} />
    </div>
  );
}