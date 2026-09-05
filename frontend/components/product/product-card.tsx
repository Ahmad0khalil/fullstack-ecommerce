// components/product-card.tsx (Enhanced version)
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/app/types/product";
import { useCartStore } from "@/store/cartStore";

export function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Move the hook call inside the component
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: product.stock_quantity || 1, 
    });
  };

  return (
    <Card 
      className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Like Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-3 right-3 z-10 rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-sm transition-all hover:scale-110"
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-colors",
            isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )} 
        />
      </button>

      <Link href={`/products/${product.product_id}`}>
        <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted">
          {!imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {/* Category Badge */}
          <Badge 
            className="absolute left-3 top-3 capitalize bg-background/80 backdrop-blur-sm shadow-sm"
            variant="secondary"
          >
            {product.category_name}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Title */}
          <Link href={`/products/${product.product_id}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-xs font-medium">
                0.0
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              0 reviews
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                ${product.price}
              </p>
              {product.price > 100 && (
                <p className="text-xs text-muted-foreground line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </p>
              )}
            </div>
            
            <Button 
              size="sm" 
              className="gap-1.5 rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}