import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";
import { Breadcrumb } from "@/components/product/breadcrumb";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductById } from "@/services/productService";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: {
    variant?: string;
  };
}

// Assuming getProductById returns the full API response
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const response = await getProductById(id);
  const product = response?.data;
  
  if (!response?.success || !product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    };
  }

  return {
    title: `${product.name} | Your Store`,
    description: product.description || "Discover our amazing product.",
    openGraph: {
      title: product.name,
      description: product.description || "Discover our amazing product.",
      images: [product.image_url || "/og-image.jpg"],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const response = await getProductById(id);
  const product = response?.data;
  
  if (!response?.success || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            ...(product.category_name ? [{ 
              label: product.category_name, 
              href: `/products?category=${encodeURIComponent(product.category_name)}` 
            }] : []),
            { label: product.name, href: `/products/${product.product_id}` },
          ]}
        />

        {/* Main Product Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Product Gallery */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Suspense fallback={<GallerySkeleton />}>
              <ProductGallery 
                images={product.image_url ? [product.image_url] : []}
                name={product.name}
              />
            </Suspense>
          </div>

          {/* Product Info */}
          <div>
            <Suspense fallback={<InfoSkeleton />}>
              <ProductInfo 
                product={product}
                selectedVariant={searchParams.variant}
              />
            </Suspense>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Suspense fallback={<TabsSkeleton />}>
            <ProductTabs product={product} />
          </Suspense>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <Suspense fallback={<RelatedSkeleton />}>
            <RelatedProducts 
              category={product.category_name}
              currentProductId={product.product_id.toString()}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Loading Skeletons
function GallerySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function InfoSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

function TabsSkeleton() {
  return <Skeleton className="h-96 w-full rounded-lg" />;
}

function RelatedSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}