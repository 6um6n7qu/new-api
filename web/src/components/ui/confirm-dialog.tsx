import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";

/**
 * ConfirmDialog — a reusable confirmation dialog built on top of shadcn/ui
 * AlertDialog. Wraps an arbitrary trigger element and calls onConfirm when
 * the user accepts.
 *
 * Usage:
 *   <ConfirmDialog
 *     title="Delete item?"
 *     description="This action cannot be undone."
 *     onConfirm={handleDelete}
 *   >
 *     <Button variant="destructive">Delete</Button>
 *   </ConfirmDialog>
 */

export interface ConfirmDialogProps {
  /** Dialog heading */
  title?: string;
  /** Optional body text shown below the heading */
  description?: string;
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Variant forwarded to the confirm button */
  confirmVariant?: ButtonProps["variant"];
  /** Called when the user clicks the confirm button */
  onConfirm: () => void | Promise<void>;
  /** Called when the user clicks the cancel button (optional) */
  onCancel?: () => void;
  /** The element that opens the dialog */
  children: React.ReactNode;
  /** Disable the trigger and confirm button while an async action is in-flight */
  loading?: boolean;
}

export function ConfirmDialog({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "default",
  onConfirm,
  onCancel,
  children,
  loading = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const isBusy = loading || pending;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={isBusy}>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isBusy}>
            {cancelLabel}
          </AlertDialogCancel>

          {/* Use AlertDialogAction as a slot so shadcn styles apply, but
              delegate click handling to our async wrapper. */}
          <AlertDialogAction asChild>
            <Button
              variant={confirmVariant}
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={isBusy}
              aria-busy={isBusy}
            >
              {isBusy ? "Please wait…" : confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
