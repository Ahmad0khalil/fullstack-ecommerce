"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Track conversion, send analytics, etc.
    console.log("Order completed successfully!");
  }, []);

  return (
    <div className="container max-w-2xl py-16">
      <Card className="text-center">
        <CardContent className="pt-12 pb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          </CardHeader>
          
          <p className="mb-2 text-muted-foreground">
            Thank you for your purchase
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            A confirmation email has been sent to your inbox
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/orders">
                <Package className="h-4 w-4" />
                View Order Status
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}