import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import CategoriesTable from "@/components/dashboard/categories/categories-table";
import { getCategories } from "@/lib/getCategories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Link href="/dashboard/products/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTable categories={categories} />
      </Suspense>
    </div>
  );
}