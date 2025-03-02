"use client";

import { formBasicInfoProfile } from "@/lib/schema";
import { z } from "zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
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

type Inputs = z.infer<typeof formBasicInfoProfile>;

interface ModalProps {
  children: React.ReactNode;
  route?: string;
  title: string;
}

export function Modal({ children, route, title }: ModalProps) {
  const router = useRouter();
  const handleOpenChange = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };

  const methods = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(formBasicInfoProfile),
  });

  // console.log(methods.formState.errors);

  const formSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
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
