import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import { ProductsSection } from "@/components/product/products-section";
import { Product } from "../types/product";
import { getProducts } from "@/services/productService";

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  let error = null;

  try {
    const res = await getProducts(1, 4, 0, "featured", undefined, undefined);
    if (res.success) {
      featuredProducts = res.data;
    } else {
      error = res.message;
    }
  } catch (err) {
    console.error("Error fetching featured products:", err);
    error = "Failed to load featured products.";
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Discover Your Style
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Shop the latest trends with our curated collection of quality
            products at unbeatable prices.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products?sale=true">View Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            {
              icon: Shield,
              title: "Secure Payment",
              desc: "100% secure transactions",
            },
            {
              icon: ShoppingBag,
              title: "Easy Returns",
              desc: "30-day return policy",
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Electronics", emoji: "📱" },
              { name: "Clothing", emoji: "👕" },
              { name: "Accessories", emoji: "⌚" },
              { name: "Home & Living", emoji: "🏠" },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/products?categories=${category.name.toLowerCase()}`}
                className="group rounded-lg border bg-background p-6 text-center hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2 block">{category.emoji}</span>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Now using real data */}
      <ProductsSection
        title="Featured Products"
        subtitle="Hand-picked just for you"
        products={featuredProducts}
      />

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join thousands of happy customers and discover amazing products
            today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
