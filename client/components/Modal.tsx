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
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ModalProps<T extends FieldValues> {
  children: React.ReactNode;
  route?: string;
  title: string;
  onSubmit: (data: T) => Promise<void>;
  formSchema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
}

export function Modal<T extends FieldValues>({
  children,
  route,
  title,
  onSubmit,
  formSchema,
  defaultValues,
}: ModalProps<T>) {
  const router = useRouter();
  const handleOpenChange = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };

  const methods = useForm<T>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  console.log(methods.formState.errors);

  const formSubmit: SubmitHandler<T> = async (data) => {
    console.log(data);
    await onSubmit(data);
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0">
          <DialogHeader>
            <DialogTitle>
              <DialogDescription className="text-xl text-foreground">
                {title}
              </DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 pt-6 pb-9 space-y-6">
            <FormProvider {...methods}>
              <form id="modalForm" onSubmit={methods.handleSubmit(formSubmit)}>
                {children}
              </form>
            </FormProvider>
          </div>
          <DialogFooter>
            <Button type="submit" variant="primary" form="modalForm">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
