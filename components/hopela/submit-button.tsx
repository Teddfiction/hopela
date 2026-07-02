"use client";

import { useFormStatus } from "react-dom";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * Submit button with a pending spinner, driven by the surrounding
 * <form> status (Server Actions).
 */
export function SubmitButton({ children, disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && (
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      )}
      {children}
    </Button>
  );
}
