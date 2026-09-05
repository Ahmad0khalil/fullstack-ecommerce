import { ProductCard } from "@/components/product/product-card";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

async function getRelatedProducts(category: string, currentId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${category}&limit=4`,
      { cache: "no-store" }
    );
    
    if (!res.ok) return [];
    
    const products = await res.json();
    return products.filter((p: any) => p.id !== currentId).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

export async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const products = await getRelatedProducts(category, currentProductId);

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}