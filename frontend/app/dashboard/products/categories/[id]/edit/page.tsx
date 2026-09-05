import CategoryForm from "@/components/dashboard/categories/category-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/services/categoryService";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  // Await the params Promise
  const { id } = await params;
  
  // Direct call: No internal HTTP overhead, cookies work automatically!
  const { data, status } = await getCategoryById(id);

  if (status !== 200) return notFound();
  const category = data;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">
            Update category information
          </p>
        </div>
      </div>

      <CategoryForm initialData={category} />
    </div>
  );
}