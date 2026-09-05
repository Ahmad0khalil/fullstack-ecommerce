import NewProductForm from "@/components/dashboard/products/new-product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/lib/getCategories";
import { getProductById } from "@/services/productService";

export default async function NewProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getCategories();
  const initialData = await getProductById(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            Update the product details and save the changes
          </p>
        </div>
      </div>

      <NewProductForm mode="edit" initialData={initialData.data} categories={categories} />
    </div>
  );
}