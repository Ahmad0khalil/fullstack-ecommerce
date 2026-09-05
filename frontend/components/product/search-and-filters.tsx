"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import type { Category } from "@/app/types/category";

interface SearchAndFilterProps {
  categories: Category[];
}

export async function SearchAndFilter({ categories }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    updateUrl();
  }, [debouncedSearch, priceRange, selectedCategories]);

  const updateUrl = () => {
    const params = new URLSearchParams();
    
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (priceRange[0] > 0) params.set("minprice", priceRange[0].toString());
    if (priceRange[1] < 1000) params.set("maxprice", priceRange[1].toString());
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            Filters
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              Clear all
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-2"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                ${priceRange[0]}
              </span>
              <span className="text-muted-foreground">
                ${priceRange[1]}
              </span>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2">
              {categories.map((category : Category) => (
                <div key={category.category_id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.category_id}
                    checked={selectedCategories.includes(category.category_id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.category_id]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category.category_id));
                      }
                    }}
                  />
                  <label
                    htmlFor={category.category_id}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}