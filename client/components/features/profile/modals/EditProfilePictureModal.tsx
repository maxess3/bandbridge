"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProfilePictureForm } from "@/components/features/profile/forms/ProfilePictureForm";
import { UpdateProfilePictureForm } from "@/components/features/profile/forms/UpdateProfilePictureForm";
import { formProfilePicture } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Button } from "../../../ui/button";
import { Loader2, Trash2, Upload, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";
import { z } from "zod";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";
import { useDynamicModalFocus } from "@/hooks/useDynamicModalFocus";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditProfilePictureModalProps {
  onClose: () => void;
  open: boolean;
}

type ModalView = "view" | "upload";

export function EditProfilePictureModal({
  onClose,
  open,
}: EditProfilePictureModalProps) {
  const { data: session, update } = useSession();
  const axiosAuth = useAxiosAuth();
  const { setIgnoreLoader } = useSessionLoader();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const [currentView, setCurrentView] = useState<ModalView>("view");
  const { isDelaying, withDelay } = useTransitionDelay(600);
  const { saveOriginalFocus, handleModalClose } = useDynamicModalFocus();

  const methods = useForm<z.infer<typeof formProfilePicture>>({
    mode: "onChange",
    resolver: zodResolver(formProfilePicture),
    defaultValues: {},
  });

  // Sauvegarder le focus quand la modale s'ouvre
  useEffect(() => {
    if (open && !loadingProfile) {
      saveOriginalFocus();
    }
  }, [open, loadingProfile, saveOriginalFocus]);

  const deleteProfilePictureMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosAuth.delete("/profile/me/picture");
      console.log(data);
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      setIgnoreLoader(true);
      await update({
        user: {
          ...session?.user,
          profilePictureKey: data?.user?.profilePictureKey,
        },
      });
      setTimeout(() => setIgnoreLoader(false), 1000);

      handleModalClose(onClose);
    },
  });

  const updateProfilePictureMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formProfilePicture>) => {
      console.log(values);
      const formData = new FormData();
      formData.append("file", values.profilePicture);

      const { data } = await axiosAuth.post("/profile/me/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    meta: { skipToast: true },
    onSuccess: async (data) => {
      console.log(data);

      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      if (data?.user?.profilePictureKey) {
        setIgnoreLoader(true);
        await update({
          user: {
            ...session?.user,
            profilePictureKey: data?.user?.profilePictureKey,
          },
        });
        setTimeout(() => setIgnoreLoader(false), 1000);
      }

      if (data?.message) {
        toast.success(data.message, {
          action: {
            label: (
              <div className="w-9 h-9 hover:bg-hover rounded-full flex items-center justify-center">
                <IoMdClose className="text-xl" />
              </div>
            ),
            onClick: () => {},
          },
        });
      }

      handleModalClose(onClose);
    },
  });

  const handleClose = () => {
    if (currentView === "upload") {
      setCurrentView("view");
      methods.reset();
    } else {
      handleModalClose(onClose);
    }
  };

  const handleOpenChange = () => {
    handleClose();
  };

  const handleSubmit: SubmitHandler<
    z.infer<typeof formProfilePicture>
  > = async (data) => {
    return withDelay(() => updateProfilePictureMutation.mutateAsync(data));
  };

  const customFooter = (
    <div
      className={`w-full flex gap-2 ${
        profile?.profilePictureKey ? "justify-between" : "justify-end"
      }`}
    >
      {profile?.profilePictureKey && (
        <Button
          variant="outline"
          onClick={() =>
            withDelay(() => deleteProfilePictureMutation.mutateAsync())
          }
          disabled={deleteProfilePictureMutation.isPending || isDelaying}
          icon={<Trash2 className="w-4 h-4" />}
        >
          Supprimer la photo
          {deleteProfilePictureMutation.isPending || isDelaying ? (
            <Loader2 className="animate-spin" />
          ) : null}
        </Button>
      )}
      <Button
        onClick={() => setCurrentView("upload")}
        icon={<Upload className="w-4 h-4" />}
      >
        Ajouter une photo
      </Button>
    </div>
  );

  const uploadFooter = (
    <div className="w-full flex gap-2 justify-between">
      <Button
        variant="outline"
        onClick={() => {
          setCurrentView("view");
          methods.reset();
        }}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Retour
      </Button>
      <Button
        onClick={methods.handleSubmit(handleSubmit)}
        disabled={updateProfilePictureMutation.isPending || isDelaying}
      >
        {updateProfilePictureMutation.isPending || isDelaying ? (
          <Loader2 className="animate-spin" />
        ) : null}
        Sauvegarder
      </Button>
    </div>
  );

  return (
    <>
      {profile && (
        <Dialog open={open && !loadingProfile} onOpenChange={handleOpenChange}>
          <DialogContent
            showOverlay={false}
            className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0"
          >
            <DialogHeader>
              <DialogTitle>
                <DialogDescription className="text-xl text-foreground">
                  {currentView === "view"
                    ? "Photo de profil"
                    : "Ajouter une photo de profil"}
                </DialogDescription>
              </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto p-6 space-y-6">
              {currentView === "view" ? (
                <ProfilePictureForm />
              ) : (
                <FormProvider {...methods}>
                  <UpdateProfilePictureForm />
                </FormProvider>
              )}
            </div>

            <DialogFooter>
              {currentView === "view" ? customFooter : uploadFooter}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
