import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApiErrorProps {
  message?: string;
  title?: string;
}

export function ApiError({ 
  message = "Something went wrong. Please try again later.", 
  title = "Error" 
}: ApiErrorProps) {
  return (
    <Alert variant="destructive" className="my-4 max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}