"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  product: any;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews ({product.reviewCount})
        </TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="prose prose-sm max-w-none pt-6">
            <p className="whitespace-pre-wrap">{product.description}</p>
            
            {product.features && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="divide-y">
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 py-3">
                  <span className="font-medium text-muted-foreground">{key}</span>
                  <span className="col-span-2">{value as string}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Review Summary */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold">{product.rating}</div>
                <div className="flex items-center justify-center mt-1">
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
                <div className="text-sm text-muted-foreground mt-1">
                  {product.reviewCount} reviews
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating} star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400"
                        style={{ 
                          width: `${(product.ratingDistribution?.[rating] || 0) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {Math.round((product.ratingDistribution?.[rating] || 0) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Write a Review</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewRating(rating)}
                      >
                        <Star
                          className={cn(
                            "h-6 w-6 transition-colors",
                            rating <= reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea 
                    placeholder="Share your experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button>Submit Review</Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="border-t pt-6 space-y-6">
              {product.reviews?.map((review: any) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-muted text-muted"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {review.helpful}
                    </Badge>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Flag className="h-3 w-3" />
                      Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Shipping Information</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Free standard shipping on orders over $50</li>
                <li>• Standard shipping: 3-5 business days</li>
                <li>• Express shipping: 1-2 business days</li>
                <li>• International shipping available</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Return Policy</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 30-day return policy</li>
                <li>• Free returns for defective items</li>
                <li>• Items must be unused and in original packaging</li>
                <li>• Refund processed within 5-7 business days</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Warranty</h4>
              <p className="text-sm text-muted-foreground">
                This product comes with a 2-year manufacturer warranty covering 
                defects in materials and workmanship.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}