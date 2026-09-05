"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert, Home, ArrowLeft, Mail } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base mt-2">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300 text-center">
              ⚠️ This area is restricted to authorized users only. Please contact your administrator if you believe this is a mistake.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground text-center">
            <p>Possible reasons:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Insufficient permissions</li>
              <li>Invalid or expired session</li>
              <li>Account role mismatch</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/contact")}
            className="text-muted-foreground"
          >
            <Mail className="mr-2 h-3 w-3" />
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}