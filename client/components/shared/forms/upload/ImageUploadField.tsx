"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";
import { CameraIcon, PlusIcon } from "@phosphor-icons/react";

interface ImageUploadFieldProps<T extends FieldValues> {
  fieldName: FieldPath<T>;
  previewSize?: {
    width: number;
    height: number;
  };
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

export function ImageUploadField<T extends FieldValues>({
  fieldName,
  previewSize = { width: 160, height: 160 },
  maxSizeMB = 5,
  accept = { "image/*": [] },
  className = "",
}: ImageUploadFieldProps<T>) {
  const {
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useFormContext<T>();

  const fieldValue = watch(fieldName);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fieldError = errors[fieldName];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (selectedFile.size > maxSizeBytes) {
          setError(fieldName, {
            message: `L'image ne doit pas dépasser ${maxSizeMB} Mo`,
          } as any);
          return;
        }

        if (!selectedFile.type.startsWith("image/")) {
          setError(fieldName, {
            message: "Le fichier doit être une image",
          } as any);
          return;
        }

        setFile(selectedFile);
        setValue(fieldName, selectedFile as any, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [setValue, setError, fieldName, maxSizeMB]
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
    accept,
    maxFiles: 1,
  });

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setValue(fieldName, undefined as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setError(fieldName, {
      message: "",
    } as any);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        {previewUrl ? (
          <div
            {...getRootProps()}
            className="relative rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer group transition-all hover:border-primary/50"
            style={{
              width: previewSize.width,
              height: previewSize.height,
            }}
          >
            <input {...getInputProps()} />
            <Image
              src={previewUrl}
              alt="Aperçu"
              className="object-cover transition-opacity group-hover:opacity-70"
              fill
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`relative rounded-full border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-colors border-gray-300`}
            style={{
              width: previewSize.width,
              height: previewSize.height,
            }}
          >
            <input {...getInputProps()} />
            <CameraIcon
              className="text-foreground/50"
              weight="fill"
              size={28}
            />
            <p className="text-xs text-center uppercase font-bold mt-1">
              upload
            </p>
            <div className="bg-primary absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center">
              <PlusIcon size={18} className="text-white" />
            </div>
          </div>
        )}
      </div>
      {fieldError && (
        <p className="text-red-500 text-sm">
          {(fieldError as any)?.message as string}
        </p>
      )}
    </div>
  );
}
