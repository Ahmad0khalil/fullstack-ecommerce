import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  viewAllLink?: string;
  columns?: 3 | 4;
}

export function ProductsSection({ 
  title, 
  subtitle, 
  products, 
  viewAllLink = "/products",
  columns = 4 
}: ProductsSectionProps) {
  if (products.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
        <Button variant="ghost" asChild>
          <Link href={viewAllLink}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className={columns === 3 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      }>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}