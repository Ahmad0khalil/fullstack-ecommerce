"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product } from "@/app/types/product";

interface Category {
  category_id: string;
  name: string;
  description?: string;
}

interface ProductFormProps {
  categories: Category[];
  mode?: "create" | "edit";
  initialData?: Product;
}

export default function ProductForm({ categories, mode = "create", initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
    rate: "",
    count: "",
    sku: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        stock_quantity: initialData.stock_quantity?.toString() || "",
        image_url: initialData.image_url || "",
        rate: initialData.rating?.rate?.toString() || "",
        count: initialData.rating?.count?.toString() || "",
        sku: initialData.sku || "",
      });

      // Load selected categories if product has categories
      // if (initialData.category_id && initialData.category_id.length > 0) {
      //   // Match the product's categories with the available categories
      //   const categoriesArray = [initialData.category_id]
      //   const productCategories = categories.filter(category => 
      //     initialData.categoriesArray.some(pc => pc.category_id === category.category_id)
      //   );
      //   setSelectedCategories(productCategories);
      // } else 
        if (initialData.category_id) {
        // Fallback for single category_id
        const productCategory = categories.find(c => c.category_id === initialData.category_id);
        if (productCategory) {
          setSelectedCategories([productCategory]);
        }
      }
    }
  }, [mode, initialData, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.stock_quantity || Number(formData.stock_quantity) < 0) newErrors.stock_quantity = "Valid stock quantity is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategories((prev) => {
      // Check if category is already selected
      const exists = prev.some((c) => c.category_id === category.category_id);
      if (exists) {
        // Remove category
        return prev.filter((c) => c.category_id !== category.category_id);
      } else {
        // Add category
        return [...prev, category];
      }
    });
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c.category_id !== categoryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    setIsLoading(true);

    const product = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      // category_ids: selectedCategories.map(cat => cat.category_id), // Send array of category IDs
      category_id: selectedCategories[0].category_id, // For backward compatibility, send the first category ID
      image_url: formData.image_url || null,
      sku: formData.sku,
      // rating: {
      //   rate: Number(formData.rate) || 0,
      //   count: Number(formData.count) || 0,
      // },
    };

    console.log(`${mode === "edit" ? "Updating" : "Creating"} product:`, product);

    try {
      const url = mode === "edit" && initialData?.product_id 
        ? `/api/products/${initialData.product_id}` 
        : "/api/products";
      
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (res.ok) {
        const successMessage = mode === "edit" 
          ? "Product updated successfully!" 
          : "Product created successfully!";
        
        const description = mode === "edit"
          ? `${product.name} has been updated.`
          : `${product.name} has been added to your inventory with ${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'}.`;

        toast.success(successMessage, {
          description: description,
          action: {
            label: "View Product",
            onClick: () => router.push(`/dashboard/products/${data.id || initialData?.product_id}`),
          },
        });
        
        if (mode === "create") {
          // Reset form only for create mode
          setFormData({
            name: "",
            description: "",
            price: "",
            stock_quantity: "",
            image_url: "",
            rate: "",
            count: "",
            sku: "",
          });
          setSelectedCategories([]);
        }
        
        // Redirect after delay
        setTimeout(() => {
          router.push("/dashboard/products");
          router.refresh();
        }, 2000);
      } else {
        throw new Error(data.error || `Failed to ${mode === "edit" ? "update" : "create"} product`);
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} product:`, error);
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} product`, {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">
            {isEditMode ? "Edit Product" : "Create New Product"}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode 
              ? "Update the product details below" 
              : "Fill in the product details below to add it to your inventory"}
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3">
                Basic Information
              </h3>
              
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Wireless Headphones"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3">
                Pricing & Inventory
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={`pl-7 ${errors.price ? "border-destructive" : ""}`}
                      value={formData.price}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">
                    Stock Quantity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    placeholder="0"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className={errors.stock_quantity ? "border-destructive" : ""}
                    disabled={isLoading}
                  />
                  {errors.stock_quantity && (
                    <p className="text-sm text-destructive">{errors.stock_quantity}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="sku">
                    SKU <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="e.g., WH-1000XM4"
                    value={formData.sku}
                    onChange={handleChange}
                    className={errors.sku ? "border-destructive" : ""}
                    disabled={isLoading}
                  />
                  {errors.sku && (
                    <p className="text-sm text-destructive">{errors.sku}</p>
                  )}
                </div>

                {/* Categories - New Category Selector */}
                <div className="space-y-2">
                  <Label htmlFor="categories">
                    Categories <span className="text-destructive">*</span>
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={isLoading}
                      >
                        {selectedCategories.length > 0
                          ? `${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'} selected`
                          : "Select categories..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                          <CommandEmpty>No categories found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.category_id}
                                value={category.name}
                                onSelect={() => handleCategorySelect(category)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCategories.some((c) => c.category_id === category.category_id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{category.name}</span>
                                  {category.description && (
                                    <span className="text-xs text-muted-foreground">
                                      {category.description}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Selected Categories Display */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCategories.map((category) => (
                        <Badge
                          key={category.category_id}
                          variant="secondary"
                          className="gap-1"
                        >
                          {category.name}
                          <button
                            type="button"
                            onClick={() => removeCategory(category.category_id)}
                            className="ml-1 hover:text-destructive"
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-destructive">At least one category is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3">
                Media
              </h3>
              
              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <img
                      src={formData.image_url}
                      alt="Product preview"
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3">
                Rating (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rate */}
                <div className="space-y-2">
                  <Label htmlFor="rate">Rating Score</Label>
                  <Input
                    id="rate"
                    name="rate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="0.0 - 5.0"
                    value={formData.rate}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Count */}
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Reviews</Label>
                  <Input
                    id="count"
                    name="count"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.count}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating Product..." : "Creating Product..."}
                  </>
                ) : (
                  isEditMode ? "Update Product" : "Create Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}