// components/hero-section.tsx
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="container mx-auto px-4 py-16 relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>New Collection Available</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Discover Amazing
            <span className="text-primary block">Products for You</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Shop the latest trends with our curated collection of high-quality products at unbeatable prices.
          </p>
          
          <div className="flex gap-4">
            <Button size="lg" className="gap-2">
              Shop Now
              <span className="text-lg">→</span>
            </Button>
            <Button size="lg" variant="outline">
              View Deals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}