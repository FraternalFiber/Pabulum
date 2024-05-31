import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type ErrorAlertProps = {
  title?: string;
  message: string;
  variant?: "default" | "destructive";
  className?: string;
};

export function ErrorAlert({
  title = "Error",
  message,
  variant = "destructive",
  className,
}: ErrorAlertProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Alert variant={variant} className={"w-fit pr-8"}>
        <AlertCircle size={20} />
        <AlertTitle className={"ml-1.5"}>{title}</AlertTitle>
        <AlertDescription className={"ml-1.5"}>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
