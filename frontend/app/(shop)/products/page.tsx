import { ProductGrid } from "@/components/product/products-grid";
import { HeroSection } from "@/components/product/hero-section";
import { SearchAndFilter } from "@/components/product/search-and-filters";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/lib/getCategories";
import type { Category } from "@/app/types/category";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string, categories?: string, page?: number, minprice?: string, maxprice?: string}>;
}) {
  const params = await searchParams;
  const categoriesList = await getCategories();
  console.log("Categories in ProductsPage:", categoriesList);
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<FilterSkeleton />}>
                <SearchAndFilter categories={categoriesList} />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                currentPage={params.page}
                sort={params.sort}
                categories={params.categories}
                minprice={params.minprice ? parseFloat(params.minprice) : undefined}
                maxprice={params.maxprice ? parseFloat(params.maxprice) : undefined}
                limit={5}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-96 w-full rounded-xl" />
      ))}
    </div>
  );
}