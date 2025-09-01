"use client";

import { z } from "zod";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAutocompleteState } from "@/contexts/AutocompleteContext";
import { useFocusManager } from "@/contexts/FocusManagerContext";

interface EditModalProps<T extends FieldValues> {
  children: React.ReactNode;
  title: string;
  onSubmit: (data: T) => Promise<void>;
  formSchema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  isSubmitting?: boolean;
  open?: boolean;
  footer?: React.ReactNode;
  showOverlay?: boolean;
  navigationRoute?: string;
}

export function EditModal<T extends FieldValues>({
  children,
  title,
  onSubmit,
  formSchema,
  defaultValues,
  isSubmitting = false,
  open = true,
  footer,
  showOverlay = true,
  navigationRoute,
}: EditModalProps<T>) {
  const router = useRouter();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const { isAnyAutocompleteOpen } = useAutocompleteState();
  const { restoreFocus } = useFocusManager();

  const methods = useForm<T>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Use isDirty from React Hook Form to detect changes
  const { isDirty } = methods.formState;

  const formSubmit = useCallback<SubmitHandler<T>>(
    async (data) => {
      await onSubmit(data);
      methods.reset(defaultValues);
    },
    [onSubmit, methods, defaultValues]
  );

  // Handle the open change
  const handleOpenChange = useCallback(() => {
    if (isDirty) {
      setShowExitConfirmation(true);
      return;
    }
    if (navigationRoute) {
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push(navigationRoute);
      }
      return;
    }
  }, [isDirty, navigationRoute, router]);

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowExitConfirmation(false);
    if (navigationRoute) {
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push(navigationRoute);
      }
      return;
    }
  };

  // Clean the state when the modal is closed
  useEffect(() => {
    if (!open) {
      setShowExitConfirmation(false);
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            restoreFocus();
          }}
          showOverlay={showOverlay}
          className="sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0"
          onEscapeKeyDown={(e) => {
            // Empêcher la fermeture de la modale si une autocomplétion est ouverte
            if (isAnyAutocompleteOpen) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <DialogDescription className="text-xl text-foreground font-newKansas font-medium">
                {title}
              </DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-6 space-y-6">
            <FormProvider {...methods}>
              <form id="modalForm" onSubmit={methods.handleSubmit(formSubmit)}>
                {children}
              </form>
            </FormProvider>
          </div>
          <DialogFooter>
            {footer || (
              <div className="flex w-full justify-end">
                <Button
                  className="self-end"
                  disabled={isSubmitting}
                  type="submit"
                  variant="default"
                  form="modalForm"
                >
                  Enregistrer
                  {isSubmitting ? <Loader2 className="animate-spin" /> : ""}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifications non sauvegardées</AlertDialogTitle>
            <AlertDialogDescription className="text-base opacity-80">
              Quitter sans enregistrer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitConfirmation(false)}>
              Revenir
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseModal}>
              Quitter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
