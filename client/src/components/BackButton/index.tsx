import { MoveLeft as MoveLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";

type BackButtonProps = {
  className?: string;
  text?: string;
  type?: string;
};

export function BackButton({ className, text = "Back", type }: BackButtonProps) {
  const navigate = useNavigate();

  // Navigate back one entry in history stack
  function handleBackButton() {
    navigate(-1);
  }

  if (type === "button") {
    return (
      <Button className={cn(className, "bg-secondary")} onClick={handleBackButton}>
        {text}
      </Button>
    );
  }

  // default type
  return (
    <div
      className={cn(
        className,
        "flex gap-x-2 hover:cursor-pointer select-none hover:underline underline-offset-2",
      )}
      onClick={handleBackButton}
    >
      <MoveLeftIcon />
      <div>{text}</div>
    </div>
  );
}
