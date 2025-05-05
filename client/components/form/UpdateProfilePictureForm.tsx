"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { formProfilePicture } from "@/lib/schema";
import { z } from "zod";
import { MdOutlineFileUpload } from "react-icons/md";

type FormValues = z.infer<typeof formProfilePicture>;

export const UpdateProfilePictureForm = () => {
  const {
    setValue,
    setError,
    formState: { errors },
  } = useFormContext<FormValues>();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setValue("profilePicture", selectedFile);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6 min-h-46">
      {file ? (
        <div className="flex flex-col items-center">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Aperçu"
              className="mx-auto w-40 h-40 object-cover rounded-full"
              width={150}
              height={150}
            />
          )}
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              setFile(null);
              setPreviewUrl(null);
              setValue("profilePicture", null as unknown as File);
              setError("profilePicture", {
                message: "",
              });
            }}
          >
            Remplacer
          </button>
        </div>
      ) : (
        <div>
          <div
            {...getRootProps()}
            className={`min-h-56 flex items-center justify-center border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
              isDragActive ? "!border-solid border-link bg-muted" : "border"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <MdOutlineFileUpload className="text-foreground/50" size={32} />
              <p className="text-foreground/90">
                Glissez-déposez une image, ou
                {` `}
                <span className="font-bold underline text-foreground">
                  cliquez ici
                </span>
                {` `}
                pour sélectionner un fichier
              </p>
            </div>
          </div>
          {errors.profilePicture && (
            <div className="text-sm text-foreground/70 flex justify-between mt-4">
              {errors.profilePicture && (
                <p className="text-red-500 text-sm">
                  {errors.profilePicture.message as string}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
