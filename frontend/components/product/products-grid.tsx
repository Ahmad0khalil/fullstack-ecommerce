import { ProductCard } from "./product-card";
import { Package } from "lucide-react";
import { SortDropdown } from "./sort-dropdown";
import type { Product } from "@/app/types/product";
import { getProducts } from "@/services/productService";
import { Pagination_v1 } from "@/components/common/Pagination-v1";
import { ApiError } from "@/components/common/api-error";

interface ProductGridProps {
  search?: string;
  sort?: string;
  categories?: string;
  currentPage?: number;
  limit?: number;
  maxprice?: number;
  minprice?: number;
}

export async function ProductGrid({ 
  search, 
  sort,
  categories,
  currentPage = 1,
  limit = 10,
  maxprice,
  minprice
}: ProductGridProps) {
  let products: Product[] = [];
  let total = 0;
  let page = currentPage;
  let errorMessage: string | null = null;

  try {
    const res = await getProducts(currentPage, limit, (currentPage - 1) * limit, sort, categories, maxprice);
    if (!res.success) {
      errorMessage = res.message;
    } else {
      products = res.data || [];
      total = res.meta?.totalCount || 0;
      page = res.meta?.page || currentPage;
    }
  } catch (e) {
    errorMessage = "Failed to communicate with the server.";
    console.error("Critical Network Error:", e);
  }

  if (errorMessage) {
    return <ApiError message={errorMessage} title="Failed to Load Products" />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  // 3. Render Normal Layout
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{products.length}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> products
        </p>
        <SortDropdown />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
      
      {total > limit && (
        <Pagination_v1 
          limit={limit} 
          total={total} 
          currentPage={page}
        />
      )}
    </div>
  );
}