"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";

interface ProductInfoProps {
  product: any;
  selectedVariant?: string;
}

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const isInStock = product.stock_quantity > 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart({
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
      
      toast.success("Added to cart", {
        description: `${quantity} × ${product.name} added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const discount = product.comparePrice 
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            {/* <span className="text-sm font-medium">{product.rating.toFixed(1)}</span> */}
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>
          
          <Badge variant={isInStock ? "default" : "destructive"}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </Badge>
          
          {isLowStock && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Only {product.stock_quantity} left
            </Badge>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">
          {/* ${product.price.toFixed(2)} */}
          ${product.price}
        </span>
        {product.comparePrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
            <Badge className="bg-green-100 text-green-800">
              Save {discount}%
            </Badge>
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-muted-foreground">{product.shortDescription}</p>

      <Separator />

      {/* Variants Selection */}
      {hasVariants && (
        <div className="space-y-4">
          {/* Size Variant */}
          {product.variants.some((v: any) => v.type === "size") && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Size</label>
                <Button variant="link" size="sm" className="h-auto p-0">
                  Size Guide
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants
                  .filter((v: any) => v.type === "size")
                  .map((variant: any) => (
                    <Button
                      key={variant.value}
                      variant={selectedSize === variant.value ? "default" : "outline"}
                      className="min-w-[60px]"
                      onClick={() => setSelectedSize(variant.value)}
                      disabled={!variant.available}
                    >
                      {variant.value}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Color Variant */}
          {product.variants.some((v: any) => v.type === "color") && (
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-3">
                {product.variants
                  .filter((v: any) => v.type === "color")
                  .map((variant: any) => (
                    <TooltipProvider key={variant.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "relative h-8 w-8 rounded-full border-2 transition-all",
                              selectedColor === variant.value
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-border hover:border-primary"
                            )}
                            style={{ backgroundColor: variant.colorCode }}
                            onClick={() => setSelectedColor(variant.value)}
                            disabled={!variant.available}
                          >
                            {selectedColor === variant.value && (
                              <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{variant.value}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      {isInStock && (
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
        
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!isInStock}
        >
          Buy Now
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={cn(
            "h-5 w-5",
            isWishlisted && "fill-red-500 text-red-500"
          )} />
        </Button>
        
        <Button size="lg" variant="outline">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Shipping & Returns Info */}
      <div className="space-y-2 rounded-lg border p-4">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>2 year warranty included</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <span>30-day easy returns</span>
        </div>
      </div>

      {/* Stock Alert */}
      {!isInStock && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This product is currently out of stock. 
            <Button variant="link" className="h-auto p-0 ml-1">
              Notify me when available
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* SKU and Categories */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>SKU: {product.sku}</p>
        <p>Category: {product.category_name}</p>
        {product.tags && product.tags.length > 0 && (
          <p>Tags: {product.tags.join(", ")}</p>
        )}
      </div>
    </div>
  );
}