"use client";

import { useRouter } from "next/navigation";
import { BaseEditModal } from "./BaseEditModal";
import { FieldValues, DefaultValues } from "react-hook-form";
import { z } from "zod";
import { restoreFocus } from "@/utils/utils";

interface ModalProps<T extends FieldValues> {
  children: React.ReactNode;
  route?: string;
  title: string;
  onSubmit: (data: T) => Promise<void>;
  formSchema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  isSubmitting?: boolean;
  open?: boolean;
  closeTooltipText?: string;
}

export function EditModalWithNavigation<T extends FieldValues>({
  children,
  route,
  title,
  onSubmit,
  formSchema,
  defaultValues,
  isSubmitting = false,
  open = true,
}: ModalProps<T>) {
  const router = useRouter();

  const handleOpenChange = () => {
    if (window.history.length > 2) {
      router.back();
    } else if (route) {
      router.push(route);
    }
    setTimeout(() => {
      restoreFocus();
    }, 0);
  };

  return (
    <BaseEditModal
      open={open}
      title={title}
      onSubmit={onSubmit}
      formSchema={formSchema}
      defaultValues={defaultValues}
      isSubmitting={isSubmitting}
      onOpenChange={handleOpenChange}
    >
      {children}
    </BaseEditModal>
  );
}
